const bcrypt = require('bcryptjs')
module.exports.validar = async function (password, passwordBD) {
  // retorna verdadero o falso
  var result = await bcrypt.compare(password, passwordBD)
  return result
}
