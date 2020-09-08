const { Router } = require('express')
const router = Router()
const connection = require('../database')
// =========================================================
// MIDDLEWARES
// =========================================================
const verificarToken = require('../middlewares/verificarToken')

// =========================================================
// OBTENER TODAS LAS MARCADAS
// =========================================================
router.get('/', verificarToken, (req, res, next) => {
  // res.send('GET usuarios')
  const sql = 'SELECT * FROM asistencia2.marcada'
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
// /:id => id de la marcada
router.get('/:id', verificarToken, (req, res, next) => {
  //  res.send('GET usuario')
  const { id } = req.params
  const sql = `SELECT * FROM asistencia2.marcada where id_marcada = ${id}`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.json(result)
    } else {
      return res.status(404).send('Marcada no encontrada')
    }
  })
})

// =========================================================
// CREAR UNA MARCADA
// =========================================================
router.post('/', verificarToken, (req, res, next) => {
  // res.send('POST usuarios')
  var date = new Date()
  var hora = `${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`

  const sql = 'INSERT INTO asistencia2.marcada SET ?'

  const marcadaObj = {
    hora: hora,
    geolocalizacion: req.body.geolocalizacion,
    observacion: req.body.observacion,
    id_asistencia: req.body.id_asistencia,
    id_institucion: req.body.id_institucion,
    id_estado_marcada: req.body.id_estado_marcada
  }
  connection.query(sql, marcadaObj, (error) => {
    if (error) {
      throw error
    }
    res.send('Marcada creada!')
  })
})

// =========================================================
// ACTUALIZAR UNA INSTITUCION
// =========================================================
// /:id => id de la marcada
router.put('/:id', verificarToken, (req, res, next) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { hora, geolocalizacion, observacion, id_asistencia, id_institucion, id_estado_marcada } = req.body
  const sql = `UPDATE asistencia2.marcada SET hora = '${hora}', geolocalizacion = '${geolocalizacion}', observacion = '${observacion}', id_asistencia = '${id_asistencia}', id_institucion = '${id_institucion}', id_estado_marcada = '${id_estado_marcada}' WHERE id_marcada = '${id}'`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Marcada actualizada!')
  })
})

// =========================================================
// ELIMINAR UNA INSTITUCION
// =========================================================
// /:id => id de la marcada
router.delete('/:id', verificarToken, (req, res, next) => {
  // res.send('DELETE user')
  const { id } = req.params
  const sql = `DELETE FROM asistencia2.marcada WHERE id_marcada = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Marcada eliminada!')
  })
})

// export router
module.exports = router
