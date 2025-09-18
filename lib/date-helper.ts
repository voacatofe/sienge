/**
 * Helper para trabalhar com datas no timezone de São Paulo
 */

/**
 * Retorna a data/hora atual no timezone de São Paulo
 * O PostgreSQL está em UTC, então precisamos ajustar
 */
export function getSaoPauloNow(): Date {
  // Criar data com horário de São Paulo
  const now = new Date();
  // Como o banco está em UTC e nós salvamos sem timezone,
  // precisamos subtrair 3 horas para compensar
  now.setHours(now.getHours() - 3);
  return now;
}

/**
 * Converte uma data UTC para horário de São Paulo
 */
export function utcToSaoPaulo(date: Date): Date {
  const spDate = new Date(date);
  spDate.setHours(spDate.getHours() - 3);
  return spDate;
}

/**
 * Formata uma data para exibição no horário de São Paulo
 */
export function formatSaoPauloDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}
