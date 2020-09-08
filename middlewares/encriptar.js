const bcrypt = require('bcryptjs')

async function encriptarPassword (password) {
  const salt = await bcrypt.genSalt(10)
  const pass = await bcrypt.hash(password, salt)
  // console.log(pass);
  return pass
}

module.exports = encriptarPassword
