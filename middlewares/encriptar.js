const bcrypt = require('bcryptjs')

module.exports.encriptar = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(password, salt)
  // console.log(pass);
  return pass
}
