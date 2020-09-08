const { Router } = require('express')
const router = Router()
const connection = require('../database')
// =========================================================
// MIDDLEWARES
// =========================================================
const verificarToken = require('../middlewares/verificarToken')
// =========================================================
// OBTENER TODOS LAS ASISTENCIAS
// =========================================================
router.get('/', verificarToken, (req, res, next) => {
  // res.send('GET usuarios')
  const sql = `SELECT * FROM ${process.env.NAME_DB}.asistencia`
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
// OBTENER UNA ASISTENCIA
// =========================================================
// /:id => id de la asistencia

router.get('/:id', verificarToken, (req, res, next) => {
  //  res.send('GET usuario')
  const { id } = req.params
  const sql = `SELECT * FROM ${process.env.NAME_DB}.asistencia where id_asistencia = ${id}`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.json(result)
    } else {
      res.send('Asistencia no encontrada')
    }
  })
})

// =========================================================
// CREAR UNA ASISTENCIA
// =========================================================
router.post('/', verificarToken, (req, res, next) => {
  // res.send('POST usuarios')
  const date = new Date()
  const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

  const sql = `SELECT * FROM ${process.env.NAME_DB}.asistencia where fecha = '${fecha}'`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('La asistencia para la fecha ya se encuentra registrada')
    } else {
      const sql = `INSERT INTO ${process.env.NAME_DB}.asistencia SET ?`

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

// =========================================================
// ACTUALIZAR UNA ASISTENCIA
// =========================================================
// /:id => id de la asistencia
router.put('/:id', verificarToken, (req, res, next) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { fecha } = req.body
  const sql = `UPDATE ${process.env.NAME_DB}.asistencia SET fecha = '${fecha}' WHERE id_asistencia = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Asistencia actualizada!')
  })
})

// =========================================================
// ELIMINAR UNA ASISTENCIA
// =========================================================
// /:id => id de la asistencia a eliminar
router.delete('/:id', verificarToken, (req, res, next) => {
  // res.send('DELETE user')
  const { id } = req.params
  const sql = `DELETE FROM ${process.env.NAME_DB}.asistencia WHERE id_asistencia = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Asistencia eliminada!')
  })
})

// export router
module.exports = router
