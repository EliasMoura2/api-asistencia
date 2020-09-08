const { Router } = require('express')
const router = Router()
const connection = require('../database')

router.get('/', (req, res) => {
  // res.send('GET usuarios')
  const sql = 'SELECT * FROM asistencia2.asistencia'
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
  const sql = `SELECT * FROM asistencia2.asistencia where id_asistencia = ${id}`
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
  const date = new Date()
  const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

  const sql = `SELECT * FROM asistencia2.asistencia where fecha = '${fecha}'`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('La asistencia para la fecha ya se encuentra registrada')
    } else {
      const sql = 'INSERT INTO asistencia2.asistencia SET ?'

      const asistenciaObj = {
        fecha: fecha,
        id_usuario: req.body.id_usuario
      }

      connection.query(sql, asistenciaObj, (error) => {
        if (error) {
          throw error
        }
        res.send('Asistencia creada!')
      })
    }
  })
})

router.put('/:id', (req, res) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { fecha } = req.body
  const sql = `UPDATE asistencia2.asistencia SET fecha = '${fecha}' WHERE id_asistencia = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Asistencia actualizada!')
  })
})

router.delete('/:id', (req, res) => {
  // res.send('DELETE user')
  const { id } = req.params
  const sql = `DELETE FROM asistencia2.asistencia WHERE id_asistencia = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Asistencia eliminada!')
  })
})

// export router
module.exports = router
