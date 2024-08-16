export function formatIDR(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPercentage(percentage: number) {
  return `${Math.abs(percentage).toFixed(2).replace('.', ',')}%`;
}
