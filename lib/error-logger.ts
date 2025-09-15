/**
 * Sistema de log e análise de erros para sincronização
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ErrorDetail {
  timestamp: Date;
  entity: string;
  itemId?: string | number;
  errorType: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface ErrorSummary {
  totalErrors: number;
  errorsByEntity: Map<string, number>;
  errorsByType: Map<string, number>;
  commonErrors: Array<{
    pattern: string;
    count: number;
    examples: string[];
  }>;
  criticalErrors: ErrorDetail[];
}

export class ErrorLogger {
  private errors: ErrorDetail[] = [];
  private logFilePath: string;

  constructor(logDir: string = 'logs/sync-errors') {
    // Criar diretório de logs se não existir
    const fullPath = path.resolve(logDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    // Nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFilePath = path.join(fullPath, `sync-errors-${timestamp}.json`);
  }

  /**
   * Adiciona um erro ao log
   */
  logError(error: ErrorDetail): void {
    this.errors.push({
      ...error,
      timestamp: error.timestamp || new Date(),
    });
  }

  /**
   * Adiciona um erro a partir de uma exceção
   */
  logException(
    entity: string,
    itemId: string | number | undefined,
    error: any
  ): void {
    let errorType = 'UnknownError';
    let message = 'Erro desconhecido';
    let details = undefined;

    if (error instanceof Error) {
      message = error.message;

      // Identificar tipo de erro específico
      if (message.includes('foreign key constraint')) {
        errorType = 'ForeignKeyConstraint';
      } else if (message.includes('unique constraint')) {
        errorType = 'UniqueConstraint';
      } else if (message.includes('not null constraint')) {
        errorType = 'NotNullConstraint';
      } else if (message.includes('PrismaClientValidationError')) {
        errorType = 'ValidationError';
      } else if (message.includes('connect ECONNREFUSED')) {
        errorType = 'ConnectionError';
      } else if (message.includes('timeout')) {
        errorType = 'TimeoutError';
      } else {
        errorType = error.constructor.name;
      }
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      message = JSON.stringify(error);
      details = error;
    }

    this.logError({
      timestamp: new Date(),
      entity,
      itemId,
      errorType,
      message,
      details,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  /**
   * Analisa padrões de erros comuns
   */
  private analyzeErrorPatterns(): Array<{ pattern: string; count: number; examples: string[] }> {
    const patterns = new Map<string, { count: number; examples: Set<string> }>();

    // Padrões conhecidos de erros
    const knownPatterns = [
      {
        regex: /foreign key constraint "([^"]+)"/g,
        label: 'Foreign Key Constraint',
      },
      {
        regex: /duplicate key value violates unique constraint "([^"]+)"/g,
        label: 'Unique Constraint Violation',
      },
      {
        regex: /null value in column "([^"]+)"/g,
        label: 'Null Value Constraint',
      },
      {
        regex: /Invalid value .+ for field ([^ ]+)/g,
        label: 'Invalid Field Value',
      },
      {
        regex: /enterpriseId (\d+) não encontrado/g,
        label: 'Enterprise Not Found',
      },
      {
        regex: /customerId (\d+) não encontrado/g,
        label: 'Customer Not Found',
      },
      {
        regex: /Argument .+ is missing/g,
        label: 'Missing Required Field',
      },
    ];

    // Analisar cada erro
    for (const error of this.errors) {
      let matched = false;

      for (const { regex, label } of knownPatterns) {
        const matches = error.message.match(regex);
        if (matches) {
          if (!patterns.has(label)) {
            patterns.set(label, { count: 0, examples: new Set() });
          }

          const pattern = patterns.get(label)!;
          pattern.count++;

          // Adicionar exemplo (máximo 3)
          if (pattern.examples.size < 3) {
            pattern.examples.add(`${error.entity}: ${matches[0]}`);
          }

          matched = true;
          break;
        }
      }

      // Se não corresponde a nenhum padrão conhecido, categorizar como "Outros"
      if (!matched) {
        const label = error.errorType || 'Outros';
        if (!patterns.has(label)) {
          patterns.set(label, { count: 0, examples: new Set() });
        }

        const pattern = patterns.get(label)!;
        pattern.count++;

        if (pattern.examples.size < 3) {
          const example = error.message.length > 100
            ? `${error.entity}: ${error.message.substring(0, 100)}...`
            : `${error.entity}: ${error.message}`;
          pattern.examples.add(example);
        }
      }
    }

    // Converter para array e ordenar por frequência
    return Array.from(patterns.entries())
      .map(([pattern, data]) => ({
        pattern,
        count: data.count,
        examples: Array.from(data.examples),
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Identifica erros críticos
   */
  private identifyCriticalErrors(): ErrorDetail[] {
    const criticalTypes = [
      'ConnectionError',
      'TimeoutError',
      'ForeignKeyConstraint',
    ];

    return this.errors.filter(error =>
      criticalTypes.includes(error.errorType) ||
      error.message.includes('FATAL') ||
      error.message.includes('CRITICAL')
    ).slice(0, 10); // Limitar a 10 erros críticos
  }

  /**
   * Gera resumo dos erros
   */
  generateSummary(): ErrorSummary {
    const errorsByEntity = new Map<string, number>();
    const errorsByType = new Map<string, number>();

    for (const error of this.errors) {
      // Contar por entidade
      const entityCount = errorsByEntity.get(error.entity) || 0;
      errorsByEntity.set(error.entity, entityCount + 1);

      // Contar por tipo
      const typeCount = errorsByType.get(error.errorType) || 0;
      errorsByType.set(error.errorType, typeCount + 1);
    }

    return {
      totalErrors: this.errors.length,
      errorsByEntity,
      errorsByType,
      commonErrors: this.analyzeErrorPatterns(),
      criticalErrors: this.identifyCriticalErrors(),
    };
  }

  /**
   * Formata o resumo para exibição no console
   */
  formatSummaryForConsole(): string {
    const summary = this.generateSummary();
    const lines: string[] = [];

    lines.push('\n' + '='.repeat(80));
    lines.push('                        RESUMO DE ERROS DA SINCRONIZAÇÃO');
    lines.push('='.repeat(80));

    lines.push(`\n📊 ESTATÍSTICAS GERAIS`);
    lines.push(`   Total de erros: ${summary.totalErrors}`);

    if (summary.errorsByEntity.size > 0) {
      lines.push(`\n📋 ERROS POR ENTIDADE:`);
      const sortedEntities = Array.from(summary.errorsByEntity.entries())
        .sort((a, b) => b[1] - a[1]);

      for (const [entity, count] of sortedEntities) {
        const percentage = ((count / summary.totalErrors) * 100).toFixed(1);
        const bar = '█'.repeat(Math.floor(count / summary.totalErrors * 30));
        lines.push(`   ${entity.padEnd(20)} ${count.toString().padStart(5)} erros (${percentage}%) ${bar}`);
      }
    }

    if (summary.errorsByType.size > 0) {
      lines.push(`\n🔍 TIPOS DE ERRO:`);
      const sortedTypes = Array.from(summary.errorsByType.entries())
        .sort((a, b) => b[1] - a[1]);

      for (const [type, count] of sortedTypes) {
        const percentage = ((count / summary.totalErrors) * 100).toFixed(1);
        lines.push(`   ${type.padEnd(25)} ${count.toString().padStart(5)} (${percentage}%)`);
      }
    }

    if (summary.commonErrors.length > 0) {
      lines.push(`\n🔥 PADRÕES DE ERRO MAIS COMUNS:`);
      for (let i = 0; i < Math.min(5, summary.commonErrors.length); i++) {
        const error = summary.commonErrors[i];
        lines.push(`\n   ${i + 1}. ${error.pattern} (${error.count} ocorrências)`);
        for (const example of error.examples) {
          lines.push(`      • ${example}`);
        }
      }
    }

    if (summary.criticalErrors.length > 0) {
      lines.push(`\n⚠️  ERROS CRÍTICOS:`);
      for (let i = 0; i < Math.min(3, summary.criticalErrors.length); i++) {
        const error = summary.criticalErrors[i];
        lines.push(`\n   ${i + 1}. [${error.errorType}] ${error.entity}`);
        lines.push(`      ${error.message.substring(0, 150)}`);
        if (error.itemId) {
          lines.push(`      ID do item: ${error.itemId}`);
        }
      }
    }

    lines.push(`\n💡 RECOMENDAÇÕES:`);

    // Recomendações baseadas nos erros
    const hasFK = Array.from(summary.errorsByType.keys()).some(t =>
      t.includes('ForeignKey') || t.includes('constraint')
    );
    if (hasFK) {
      lines.push(`   • Verificar ordem de sincronização das entidades`);
      lines.push(`   • Garantir que entidades dependentes sejam sincronizadas primeiro`);
    }

    const hasValidation = Array.from(summary.errorsByType.keys()).some(t =>
      t.includes('Validation') || t.includes('Invalid')
    );
    if (hasValidation) {
      lines.push(`   • Revisar mapeamento de campos entre API e banco de dados`);
      lines.push(`   • Verificar tipos de dados e formatos esperados`);
    }

    const hasConnection = Array.from(summary.errorsByType.keys()).some(t =>
      t.includes('Connection') || t.includes('Timeout')
    );
    if (hasConnection) {
      lines.push(`   • Verificar conectividade com a API Sienge`);
      lines.push(`   • Implementar retry logic para falhas temporárias`);
    }

    lines.push(`\n📁 Log completo salvo em: ${this.logFilePath}`);
    lines.push('=' .repeat(80));

    return lines.join('\n');
  }

  /**
   * Salva os erros em arquivo
   */
  saveToFile(): void {
    const data = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      errors: this.errors,
    };

    fs.writeFileSync(this.logFilePath, JSON.stringify(data, null, 2));
  }

  /**
   * Limpa os erros armazenados
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * Obtém todos os erros
   */
  getErrors(): ErrorDetail[] {
    return [...this.errors];
  }

  /**
   * Verifica se há erros
   */
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}