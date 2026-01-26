/**
 * Formatea un número a moneda (Peso Argentino / Euro)
 * @param {number} amount - El monto a formatear
 * @returns {string} - Monto formateado ej: $ 1.250,50
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    // currency: 'ARS', 
    currency: 'USD', 
    minimumFractionDigits: 2,
  }).format(amount)
}

export { formatCurrency }