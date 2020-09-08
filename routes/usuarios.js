const { Router } = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const connection = require('../database')
// =========================================================
// MIDDLEWARES
// =========================================================
var encriptarPassword = require('../middlewares/encriptar')
var formatearTexto = require('../middlewares/formatear')
const verificarToken = require('../middlewares/verificarToken')
// =========================================================
// OBTENER TODOS LOS USUARIOS
// =========================================================
router.get('/', verificarToken, (req, res, next) => {
  // res.send('GET usuarios')
  // req.headers recibe las cabeceras
  // const token = req.headers['x-access-token']
  // si no existe la cabecera x-access-token con un token valido responde un error
  // if (!token) {
  //   return res.status(401).json({
  //     auth: false,
  //     message: 'No token provided'
  //   })
  // }
  // decodifica el token
  // jwt.verify(token, process.env.SECRET)
  // decodifica y muestra el token
  // const decoded = jwt.verify(token, process.env.SECRET)
  // console.log(decoded)
  // Query
  const sql = `SELECT * FROM ${process.env.NAME_DB}.usuario`
  // 'SELECT id_usuario as id, nombre, apellido, dni as DNI, nombreUsuario as nick FROM asistencia2.usuario'
  connection.query(sql, (error, results) => {
    if (error) {
      throw error
    }
    if (results.length > 0) {
      res.json(results)
    } else {
      res.send('No hay resultados')
    }
  })
})

// =========================================================
// OBTENER UN USUARIO
// =========================================================
// /:id => dni del usuario
router.get('/:id', verificarToken, (req, res) => {
  const { id } = req.params
  // req.headers recibe las cabeceras
  // const token = req.headers['x-access-token']
  // si no existe la cabecera x-access-token con un token valido responde un error
  // if (!token) {
  // return res.status(401).json({
  // auth: false,
  // message: 'No token provided'
  // })
  // }
  // decodifica el token
  // jwt.verify(token, process.env.SECRET)
  // const decoded = jwt.verify(token, process.env.SECRET)
  // console.log(decoded)
  // Query
  const sql = `SELECT * FROM ${process.env.NAME_DB}.usuario where dni = ${id}`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.json(result)
    } else {
    // res.send('Not result')
      return res.status(404).send('Usuario no encontrado')
    }
  })
})

// =========================================================
// CREAR UN USUARIO
// =========================================================
router.post('/', (req, res, next) => {
  // res.send('POST usuarios')
  const sql = `SELECT * FROM ${process.env.NAME_DB}.usuario where dni = ${req.body.dni}`
  connection.query(sql, async (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('El dni ya se encuentra registrado')
    } else {
      const sql = `SELECT * FROM ${process.env.NAME_DB}.usuario where nombreUsuario = '${req.body.nombreUsuario}'`
      connection.query(sql, async (error, result) => {
        if (error) {
          throw error
        }
        if (result.length > 0) {
          res.send('El nombre de usuario ya se encuentra registrado seleccione otro')
        } else {
          const sql = `INSERT INTO ${process.env.NAME_DB}.usuario SET ?`

          // utilizamos el modulo que tiene la funcion para formatear el nombre
          // console.log(req.body.nombre)
          const nombreMayus = await formatearTexto(req.body.nombre)
          // console.log(nombreMayus)

          // utilizamos el modulo que tiene la funcion para formatear el apellido
          // console.log(req.body.apellido)
          const apellidoMayus = await formatearTexto(req.body.apellido)
          // console.log(apellidoMayus)

          // utilizamos el modulo que tiene la funcion para encriptar una password
          const pass = await encriptarPassword(req.body.clave)

          const usuarioObj = {
            nombre: nombreMayus,
            apellido: apellidoMayus,
            dni: req.body.dni,
            nombreUsuario: req.body.nombreUsuario,
            clave: pass,
            imei: req.body.imei,
            id_rol: req.body.id_rol
          }

          connection.query(sql, usuarioObj, (error) => {
            if (error) {
              throw error
            }
            // mostramos en consola el json del cliente
            // console.log(usuarioObj);
            // res.send('Usuario creado!')
            const sql = `SELECT * FROM ${process.env.NAME_DB}.usuario where dni = ${req.body.dni}`
            connection.query(sql, (error, result) => {
              if (error) {
                throw error
              }
              if (result.length > 0) {
                // responde el json del usuario
                // res.json(result)
                // obtenemos el valor del dni del usuario creado
                // console.log(result[0].dni)

                // creamos un token con el dni del usuario y la clave secreta
                const token = jwt.sign({ dni: result[0].dni }, process.env.SECRET, {
                  expiresIn: 60 * 60 * 1 // => expira en 1 hora
                  // 60 * 60 * 24 expira en 24 horas
                })

                // despues de crear al usuario devolvemos los datos del usuario y el token
                res.json({ result: result, auth: true, token })
              } else {
                res.send('No hay resultados')
              }
            })
          })
        }
      })
    }
  })
})

// =========================================================
// ACTUALIZAR UN USUARIO
// =========================================================
// /:id => dni del usuario
router.put('/:id', verificarToken, async (req, res) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { nombre, apellido, dni, nombreUsuario, clave, imei, id_rol } = req.body

  // req.headers recibe las cabeceras
  // const token = req.headers['x-access-token']
  // si no existe la cabecera x-access-token con un token valido responde un error
  // if (!token) {
  //   return res.status(401).json({
  //     auth: false,
  //     message: 'No token provided'
  //   })
  // }
  // decodifica el token
  // jwt.verify(token, process.env.SECRET)
  // const decoded = jwt.verify(token, process.env.SECRET)
  // console.log(decoded)
  // utilizamos el modulo que tiene la funcion para encriptar una password
  const pass = await encriptarPassword(clave)

  const sql = `UPDATE ${process.env.NAME_DB}.usuario SET nombre = '${nombre}', apellido = '${apellido}', dni = '${dni}', nombreUsuario = '${nombreUsuario}', clave = '${pass}', imei = '${imei}', id_rol = '${id_rol}' WHERE dni = '${id}'`
  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Usuario actualizado!')
  })
  /*
    try {
    nonExistentFunction();
    } catch (error) {
    console.error(error);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
    }
  */
})

// =========================================================
// ELIMINAR UN USUARIO
// =========================================================
// /:id => dni del usuario a eliminar
router.delete('/:id', verificarToken, (req, res, next) => {
  // res.send('DELETE user')
  const { id } = req.params
  // req.headers recibe las cabeceras
  // const token = req.headers['x-access-token']
  // si no existe la cabecera x-access-token con un token valido responde un error
  // if (!token) {
  //   return res.status(401).json({
  //     auth: false,
  //     message: 'No token provided'
  //   })
  // }
  // verifica el token
  // jwt.verify(token, process.env.SECRET)
  // const decoded = jwt.verify(token, process.env.SECRET)
  // console.log(decoded)

  // Query
  const sql = `SELECT * FROM ${process.env.NAME_DB}.usuario WHERE dni = ${id}`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }

    if (result.length > 0) {
      const sql = `DELETE FROM ${process.env.NAME_DB}.usuario WHERE dni = ${id}`
      connection.query(sql, (error) => {
        if (error) {
          throw error
        }
        res.send('Usuario eliminado!')
      })
    } else {
      res.send('Usuario no encontrado')
    }
  })
})

// export router
module.exports = router
