/**
 * Utilitário para construção de queries dinâmicas para o schema gold
 * Baseado nos padrões das APIs existentes de clientes, vendas e financeiro
 */

export interface GoldQueryFilter {
  field: string;
  operator:
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'like'
    | 'ilike'
    | 'in'
    | 'between';
  value: any;
  value2?: any; // Para operador BETWEEN
}

export interface GoldQueryOptions {
  table: string;
  filters?: GoldQueryFilter[];
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  groupBy?: string[];
  having?: GoldQueryFilter[];
}

export interface GoldQueryResult {
  query: string;
  params: any[];
  paramCount: number;
}

export class GoldQueryBuilder {
  private static instance: GoldQueryBuilder;

  public static getInstance(): GoldQueryBuilder {
    if (!GoldQueryBuilder.instance) {
      GoldQueryBuilder.instance = new GoldQueryBuilder();
    }
    return GoldQueryBuilder.instance;
  }

  /**
   * Constrói uma query SELECT dinâmica para o schema gold
   */
  public buildSelectQuery(options: GoldQueryOptions): GoldQueryResult {
    const {
      table,
      filters = [],
      orderBy,
      orderDirection = 'DESC',
      limit,
      offset,
      groupBy,
      having,
    } = options;

    let query = `SELECT * FROM gold.${table}`;
    const params: any[] = [];
    let paramCount = 0;

    // Construir WHERE clause
    const whereClause = this.buildWhereClause(filters, params, paramCount);
    if (whereClause.clause) {
      query += ` WHERE ${whereClause.clause}`;
      paramCount = whereClause.paramCount;
    }

    // GROUP BY
    if (groupBy && groupBy.length > 0) {
      query += ` GROUP BY ${groupBy.join(', ')}`;
    }

    // HAVING
    if (having && having.length > 0) {
      const havingClause = this.buildWhereClause(having, params, paramCount);
      if (havingClause.clause) {
        query += ` HAVING ${havingClause.clause}`;
        paramCount = havingClause.paramCount;
      }
    }

    // ORDER BY
    if (orderBy) {
      query += ` ORDER BY ${orderBy} ${orderDirection}`;
    }

    // LIMIT
    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    // OFFSET
    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    return { query, params, paramCount };
  }

  /**
   * Constrói uma query de contagem para o schema gold
   */
  public buildCountQuery(
    options: Omit<
      GoldQueryOptions,
      'orderBy' | 'orderDirection' | 'limit' | 'offset'
    >
  ): GoldQueryResult {
    const { table, filters = [], groupBy } = options;

    let query: string;
    const params: any[] = [];
    let paramCount = 0;

    if (groupBy && groupBy.length > 0) {
      // Para queries com GROUP BY, contar grupos
      query = `SELECT COUNT(*) as total FROM (SELECT 1 FROM gold.${table}`;
    } else {
      // Query simples de contagem
      query = `SELECT COUNT(*) as total FROM gold.${table}`;
    }

    // Construir WHERE clause
    const whereClause = this.buildWhereClause(filters, params, paramCount);
    if (whereClause.clause) {
      query += ` WHERE ${whereClause.clause}`;
      paramCount = whereClause.paramCount;
    }

    // Fechar subquery se necessário
    if (groupBy && groupBy.length > 0) {
      query += ` GROUP BY ${groupBy.join(', ')}) as grouped_data`;
    }

    return { query, params, paramCount };
  }

  /**
   * Constrói uma query de estatísticas agregadas
   */
  public buildStatsQuery(
    table: string,
    numericFields: string[],
    filters: GoldQueryFilter[] = []
  ): GoldQueryResult {
    const params: any[] = [];
    let paramCount = 0;

    // Construir SELECT com agregações
    const aggregations = numericFields
      .map(
        field =>
          `COUNT(${field}) as ${field}_count,
       SUM(${field}) as ${field}_sum,
       AVG(${field}) as ${field}_avg,
       MIN(${field}) as ${field}_min,
       MAX(${field}) as ${field}_max`
      )
      .join(',\n       ');

    let query = `SELECT 
       COUNT(*) as total_records,
       ${aggregations}
       FROM gold.${table}`;

    // Construir WHERE clause
    const whereClause = this.buildWhereClause(filters, params, paramCount);
    if (whereClause.clause) {
      query += ` WHERE ${whereClause.clause}`;
      paramCount = whereClause.paramCount;
    }

    return { query, params, paramCount };
  }

  /**
   * Constrói cláusula WHERE dinâmica
   */
  private buildWhereClause(
    filters: GoldQueryFilter[],
    params: any[],
    startParamCount: number
  ): { clause: string; paramCount: number } {
    if (!filters || filters.length === 0) {
      return { clause: '', paramCount: startParamCount };
    }

    const conditions: string[] = [];
    let paramCount = startParamCount;

    for (const filter of filters) {
      const condition = this.buildCondition(filter, params, paramCount);
      if (condition.condition) {
        conditions.push(condition.condition);
        paramCount = condition.paramCount;
      }
    }

    const clause = conditions.length > 0 ? conditions.join(' AND ') : '';
    return { clause, paramCount };
  }

  /**
   * Constrói uma condição individual
   */
  private buildCondition(
    filter: GoldQueryFilter,
    params: any[],
    paramCount: number
  ): { condition: string; paramCount: number } {
    const { field, operator, value, value2 } = filter;

    switch (operator) {
      case 'eq':
        params.push(value);
        return {
          condition: `${field} = $${paramCount + 1}`,
          paramCount: paramCount + 1,
        };

      case 'ne':
        params.push(value);
        return {
          condition: `${field} != $${paramCount + 1}`,
          paramCount: paramCount + 1,
        };

      case 'gt':
        params.push(value);
        return {
          condition: `${field} > $${paramCount + 1}`,
          paramCount: paramCount + 1,
        };

      case 'gte':
        params.push(value);
        return {
          condition: `${field} >= $${paramCount + 1}`,
          paramCount: paramCount + 1,
        };

      case 'lt':
        params.push(value);
        return {
          condition: `${field} < $${paramCount + 1}`,
          paramCount: paramCount + 1,
        };

      case 'lte':
        params.push(value);
        return {
          condition: `${field} <= $${paramCount + 1}`,
          paramCount: paramCount + 1,
        };

      case 'like':
        params.push(value);
        return {
          condition: `${field} LIKE $${paramCount + 1}`,
          paramCount: paramCount + 1,
        };

      case 'ilike':
        params.push(value);
        return {
          condition: `${field} ILIKE $${paramCount + 1}`,
          paramCount: paramCount + 1,
        };

      case 'in':
        if (Array.isArray(value) && value.length > 0) {
          const placeholders = value
            .map((_, index) => `$${paramCount + index + 1}`)
            .join(', ');
          params.push(...value);
          return {
            condition: `${field} IN (${placeholders})`,
            paramCount: paramCount + value.length,
          };
        }
        return { condition: '', paramCount };

      case 'between':
        if (value !== undefined && value2 !== undefined) {
          params.push(value, value2);
          return {
            condition: `${field} BETWEEN $${paramCount + 1} AND $${paramCount + 2}`,
            paramCount: paramCount + 2,
          };
        }
        return { condition: '', paramCount };

      default:
        return { condition: '', paramCount };
    }
  }

  /**
   * Converte parâmetros de URL em filtros
   */
  public parseUrlFilters(
    searchParams: URLSearchParams,
    fieldMappings: Record<string, string>
  ): GoldQueryFilter[] {
    const filters: GoldQueryFilter[] = [];

    for (const [paramName, fieldName] of Object.entries(fieldMappings)) {
      const value = searchParams.get(paramName);
      if (value) {
        // Detectar tipo de operador baseado no nome do parâmetro
        if (paramName.endsWith('_min')) {
          filters.push({
            field: fieldName,
            operator: 'gte',
            value: parseFloat(value),
          });
        } else if (paramName.endsWith('_max')) {
          filters.push({
            field: fieldName,
            operator: 'lte',
            value: parseFloat(value),
          });
        } else if (
          paramName.includes('nome') ||
          paramName.includes('descricao')
        ) {
          filters.push({
            field: fieldName,
            operator: 'ilike',
            value: `%${value}%`,
          });
        } else if (
          paramName.includes('data_inicio') &&
          searchParams.get(paramName.replace('inicio', 'fim'))
        ) {
          const dataFim = searchParams.get(paramName.replace('inicio', 'fim'));
          if (dataFim) {
            filters.push({
              field: fieldName,
              operator: 'between',
              value,
              value2: dataFim,
            });
          }
        } else if (!paramName.includes('data_fim')) {
          // Evitar duplicar filtros de data
          // Tentar converter para número se possível
          const numValue = parseFloat(value);
          const finalValue = !isNaN(numValue) ? numValue : value;
          filters.push({ field: fieldName, operator: 'eq', value: finalValue });
        }
      }
    }

    return filters;
  }

  /**
   * Valida se uma tabela existe no schema gold
   */
  public isValidGoldTable(tableName: string): boolean {
    const validTables = [
      'clientes_360',
      'vendas_360',
      'performance_financeira',
      'portfolio_imobiliario',
    ];
    return validTables.includes(tableName);
  }

  /**
   * Sanitiza nome de campo para evitar SQL injection
   */
  public sanitizeFieldName(fieldName: string): string {
    // Permitir apenas letras, números, underscore e ponto
    return fieldName.replace(/[^a-zA-Z0-9_.]/g, '');
  }

  /**
   * Constrói query de metadados da tabela
   */
  public buildMetadataQuery(tableName: string): GoldQueryResult {
    const query = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'gold' 
        AND table_name = $1
      ORDER BY ordinal_position
    `;

    return { query, params: [tableName], paramCount: 1 };
  }
}

// Exportar instância singleton
export const goldQueryBuilder = GoldQueryBuilder.getInstance();

// Exportar tipos para uso externo
export type { GoldQueryFilter, GoldQueryOptions, GoldQueryResult };
