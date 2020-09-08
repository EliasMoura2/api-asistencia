const { Router } = require('express')
const router = Router()
const connection = require('../database')

router.get('/', (req, res) => {
  // res.send('GET usuarios')
  const sql = 'SELECT * FROM asistencia2.estado_marcada'
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
  const sql = `SELECT * FROM asistencia2.estado_marcada where id_estado_marcada = ${id}`
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
  // obtenemos el valor del estado
  let estado = req.body.estado
  // eliminamos los espacios
  estado = estado.trim()
  // lo pasamos a mayusculas
  const estadoMayus = estado.toUpperCase()

  const sql = `SELECT * FROM asistencia2.estado_marcada where dni = ${estadoMayus}`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('El estado de la marcada con la descripcion proporcionada ya se encuentra registrado')
    } else {
      const sql = 'INSERT INTO asistencia2.estado_marcada SET ?'

      const estadoMarcadaObj = {
        estado: estadoMayus
      }

      connection.query(sql, estadoMarcadaObj, (error) => {
        if (error) {
          throw error
        }
        res.send('Estado Marcada creada!')
      })
    }
  })
})

router.put('/:id', (req, res) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { estado } = req.body
  const sql = `UPDATE asistencia2.estado_marcada SET estado = '${estado}' WHERE id_estado_marcada = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Estado Marcada actualizada!')
  })
})

router.delete('/:id', (req, res) => {
  // res.send('DELETE user')
  const { id } = req.params
  const sql = `DELETE FROM asistencia2.estado_marcada WHERE id_estado_marcada = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Estado Marcada eliminada!')
  })
})

// export router
module.exports = router
