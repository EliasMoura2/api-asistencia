module.exports.formatear = async function (dato) {
  // eliminar espacios vacios
  let result = await dato.trim()
  // pasar a mayusculas el dato
  result = await result.toUpperCase()
  return result
}
