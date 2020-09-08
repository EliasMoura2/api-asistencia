const { Router } = require('express')
const router = Router()
const connection = require('../database')

router.get('/', (req, res) => {
  // res.send('GET usuarios')
  const sql = 'SELECT * FROM asistencia2.rol_usuario'
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
  const sql = `SELECT * FROM asistencia2.rol_usuario where id_rol = ${id}`
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
  // obtenemos el valor de la descripcion
  let descripcion = req.body.descripcion
  // eliminamos los espacios
  descripcion = descripcion.trim()
  // lo pasamos a mayusculas
  const descripcionMayus = descripcion.toUpperCase()
  // console.log(descripcionMayus)
  
  const sql = `SELECT * FROM asistencia2.rol_usuario where descripcion = '${descripcionMayus}'`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('El rol ya se encuentra registrado')
    } else {
      const sql = 'INSERT INTO asistencia2.rol_usuario SET ?'

      const rolObj = {
        descripcion: descripcionMayus
      }
      connection.query(sql, rolObj, (error) => {
        if (error) {
          throw error
        }
        res.send('rol creado!')
      })
    }
  })
})

router.put('/:id', (req, res) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { descripcion } = req.body
  const sql = `UPDATE asistencia2.rol_usuario SET descripcion = '${descripcion}' WHERE id_rol = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('rol actualizado!')
  })
})

router.delete('/:id', (req, res) => {
  // res.send('DELETE user')
  const { id } = req.params
  const sql = `DELETE FROM asistencia2.rol_usuario WHERE id_rol = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('rol eliminado!')
  })
})

// export router
module.exports = router
