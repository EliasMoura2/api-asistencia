const { Router } = require('express')
const router = Router()
const connection = require('../database')
// =========================================================
// MIDDLEWARES
// =========================================================
var formatearTexto = require('../middlewares/formatear')
const verificarToken = require('../middlewares/verificarToken')
// =========================================================
// OBTENER TODOS LAS INSTITUCIONES
// =========================================================
router.get('/', verificarToken, (req, res, next) => {
  // res.send('GET usuarios')
  const sql = `SELECT * FROM ${process.env.NAME_DB}.institucion`
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
// OBTENER UNA INSTITUCION
// =========================================================
// /:id => cue de la institucion
router.get('/:id', verificarToken, (req, res, next) => {
  const { id } = req.params
  const sql = `SELECT * FROM ${process.env.NAME_DB}.institucion where cue = ${id}`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.json(result)
    } else {
      return res.status(404).send('Institucion no encontrada')
    }
  })
})

// =========================================================
// CREAR UNA INSTITUCION
// =========================================================
router.post('/', verificarToken, (req, res, next) => {
  // res.send('POST usuarios')
  const sql = `SELECT * FROM ${process.env.NAME_DB}.institucion where cue = ${req.body.cue}`
  connection.query(sql, async (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('La institucion con el cue proporcionado ya se encuentra registrada')
    } else {
      const sql = `INSERT INTO ${process.env.NAME_DB}.institucion SET ?`

      // utilizamos el modulo que tiene la funcion para formatear el nombre
      // console.log(req.body.nombre)
      const nombreMayus = await formatearTexto(req.body.nombre)

      const institucionObj = {
        nombre: nombreMayus,
        sigla: req.body.sigla,
        cue: req.body.cue,
        geolocalizacion: req.body.geolocalizacion,
        direccionCalle: req.body.direccionCalle,
        direccionAltura: req.body.direccionAltura
      }
      connection.query(sql, institucionObj, (error) => {
        if (error) {
          throw error
        }
        res.send('institucion creada!')
      })
    }
  })
})

// =========================================================
// ACTUALIZAR UNA INSTITUCION
// =========================================================
// /:id => cue de la institucion
router.put('/:id', verificarToken, (req, res) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { nombre, sigla, cue, geolocalizacion, direccionCalle, direccionAltura } = req.body
  const sql = `UPDATE ${process.env.NAME_DB}.institucion SET nombre = '${nombre}', sigla = '${sigla}', cue = '${cue}', geolocalizacion = '${geolocalizacion}', direccionCalle = '${direccionCalle}', direccionAltura = '${direccionAltura}' WHERE cue = '${id}'`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Institucion actualizada!')
  })
})

// =========================================================
// ELIMINAR UNA INSTITUCION
// =========================================================
// /:id => cue de la institucion a eliminar
router.delete('/:id', verificarToken, (req, res, next) => {
  // res.send('DELETE user')
  const { id } = req.params
  // Query
  const sql = `SELECT * FROM ${process.env.NAME_DB}.institucion WHERE cue = '${id}'`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }

    if (result.length > 0) {
      const sql = `DELETE FROM ${process.env.NAME_DB}.institucion WHERE cue = '${id}'`

      connection.query(sql, (error) => {
        if (error) {
          throw error
        }
        res.send('Institucion eliminada!')
      })
    } else {
      res.send('Institucion no encontrada')
    }
  })
})

// export router
module.exports = router
