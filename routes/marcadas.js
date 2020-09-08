const { Router } = require('express')
const router = Router()
const connection = require('../database')

router.get('/', (req, res) => {
  // res.send('GET usuarios')
  const sql = 'SELECT * FROM asistencia2.marcada'
  connection.query(sql, (error, results) => {
    if (error) {
      throw error
    }
    if (results.length > 0) {
      res.json(results)
    } else {
      res.send('Not result')
    }
  })
})

router.get('/:id', (req, res) => {
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
      res.send('Not result')
    }
  })
})

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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
