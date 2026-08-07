import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0,0%';
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatDate(dateString: string | Date | undefined | null, pattern = 'dd/MM/yyyy'): string {
  if (!dateString) return '-';
  const dateObj = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  if (!isValid(dateObj)) return '-';
  return format(dateObj, pattern, { locale: ptBR });
}

export function formatDateTime(dateString: string | Date | undefined | null): string {
  return formatDate(dateString, 'dd/MM/yyyy HH:mm');
}

export function parseCurrencyInput(valueString: string): number {
  const cleaned = valueString.replace(/[^\d]/g, '');
  if (!cleaned) return 0;
  return parseFloat(cleaned) / 100;
}

export function generateRandomBarcode(): string {
  let result = '789';
  for (let i = 0; i < 10; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}
