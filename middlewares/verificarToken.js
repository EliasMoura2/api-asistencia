const jwt = require('jsonwebtoken')
function verificarToken (req, res, next) {
  // req.headers recibe las cabeceras
  const token = req.headers['x-access-token']
  // si no existe la cabecera x-access-token con un token valido responde un error
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'No token provided'
    })
  }
  // decodifica el token
  const decoded = jwt.verify(token, process.env.SECRET)
  // el decoded tiene un id, ese id lo guardamos en un req.user.id
  req.userId = decoded.id
  next()
}

module.exports = verificarToken
