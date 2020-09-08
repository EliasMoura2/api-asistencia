const { Router } = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const connection = require('../database')
// =========================================================
// FUNCIONES
// =========================================================
var moduloEncriptar = require('../middlewares/encriptar')
var moduloFormatear = require('../middlewares/formatear')
var moduloValidar = require('../middlewares/validarPassword')

router.post('/signup', (req, res, next) => {
  // res.send('POST usuarios')
  const sql = `SELECT * FROM asistencia2.usuario where dni = ${req.body.dni}`
  connection.query(sql, async (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('El usuario con el dni proporcionado ya se encuentra registrado')
    } else {
      const sql = 'INSERT INTO asistencia2.usuario SET ?'

      // utilizamos el modulo que tiene la funcion para formatear el nombre
      // console.log(req.body.nombre)
      const nombreMayus = await moduloFormatear.formatear(req.body.nombre)
      // console.log(nombreMayus)

      // utilizamos el modulo que tiene la funcion para formatear el apellido
      // console.log(req.body.apellido)
      const apellidoMayus = await moduloFormatear.formatear(req.body.apellido)
      // console.log(apellidoMayus)

      // utilizamos el modulo que tiene la funcion para encriptar una password
      const pass = await moduloEncriptar.encriptar(req.body.clave)

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
        const sql = `SELECT * FROM asistencia2.usuario where dni = ${req.body.dni}`
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
              expiresIn: 60 * 60 * 24
              //expira en 24 horas
            })

            // despues de crear al usuario devolvemos los datos del usuario y el token
            res.json({ result: result, auth: true, token })
          } else {
            res.send('Not result')
          }
        })
      })
    }
  })
})

router.post('/signin', (req, res, next) => {
  // res.json('signin')
  const { nombreUsuario, clave } = req.body
  const sql = `SELECT * FROM asistencia2.usuario where nombreUsuario = '${nombreUsuario}'`
  // podriamos agregar el email
  connection.query(sql, async (error, result) => {
    if (error) {
      throw error
    }

    if (result.length > 0) {
      // Existe el nombre usuario
      // debemos comparar la clave provista con la clave de la BD, retorna True or False
      var passIsValid = await moduloValidar.validar(clave, result[0].clave)
      if (!passIsValid) {
        // console.log('No es la misma pass')
        res.status(401).json({ auth: false, token: null })
      } else {
        // console.log('Es la misma pass')
        const token = jwt.sign({ dni: result[0].dni }, process.env.SECRET, {
          expiresIn: 60 * 60 * 24
          // expira en 24 horas
        })

        // una vez validado la password devolvemos los datos del usuario y el token
        res.json({ result: result, auth: true, token })
      }
      // res.json(result)
    } else {
      // res.send('Not result')
      res.status(404).send('No existe un usuario con el nombre de usuario provisto')
    }
  })
})

module.exports = router
