const bcrypt = require('bcryptjs')
async function validarPassword (password, passwordBD) {
  // retorna verdadero o falso
  var result = await bcrypt.compare(password, passwordBD)
  return result
}
module.exports = validarPassword
