async function formatearTexto (dato) {
  // eliminar espacios vacios
  let result = await dato.trim()
  // pasar a mayusculas el dato
  result = await result.toUpperCase()
  return result
}

module.exports = formatearTexto
