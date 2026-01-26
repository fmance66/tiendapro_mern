const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  // Usamos el método de localización para que sea simple
  // 'es-AR' asegura el formato DD/MM/AAAA
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export { formatDate }