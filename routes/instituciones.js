const { Router } = require('express')
const router = Router()
const connection = require('../database')

router.get('/', (req, res) => {
  // res.send('GET usuarios')
  const sql = 'SELECT * FROM asistencia2.institucion'
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
  const sql = `SELECT * FROM asistencia2.institucion where id_institucion = ${id}`
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
  const sql = `SELECT * FROM asistencia2.institucion where cue = ${req.body.cue}`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('La institucion con el cue proporcionado ya se encuentra registrada')
    } else {
      const sql = 'INSERT INTO asistencia2.institucion SET ?'

      // obtenemos el valor del nombre
      let nombre = req.body.nombre
      // eliminamos los espacios
      nombre = nombre.trim()
      // lo pasamos a mayusculas
      const nombreMayus = nombre.toUpperCase()

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

router.put('/:id', (req, res) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { nombre, sigla, cue, geolocalizacion, direccionCalle, direccionAltura } = req.body
  const sql = `UPDATE asistencia2.institucion SET nombre = '${nombre}', sigla = '${sigla}', cue = '${cue}', geolocalizacion = '${geolocalizacion}', direccionCalle = '${direccionCalle}', direccionAltura = '${direccionAltura}' WHERE id_institucion = '${id}'`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Institucion actualizada!')
  })
})

router.delete('/:id', (req, res) => {
  // res.send('DELETE user')
  const { id } = req.params
  const sql = `DELETE FROM asistencia2.institucion WHERE id_institucion = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Institucion eliminada!')
  })
})

// export router
module.exports = router
