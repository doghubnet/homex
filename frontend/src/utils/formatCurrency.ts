export function formatCurrency(value: number, currency = 'ETB') {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
