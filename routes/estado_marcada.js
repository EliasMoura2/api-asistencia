const { Router } = require('express')
const router = Router()
const connection = require('../database')
// =========================================================
// MIDDLEWARES
// =========================================================
var formatearTexto = require('../middlewares/formatear')
const verificarToken = require('../middlewares/verificarToken')
// =========================================================
// OBTENER TODOS LAS MARCADAS
// =========================================================
router.get('/', verificarToken, (req, res, next) => {
  // res.send('GET usuarios')
  const sql = `SELECT * FROM ${process.env.NAME_DB}.estado_marcada`
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

// =========================================================
// OBTENER UNA MARCADA
// =========================================================
// /:id => id de la marcada
router.get('/:id', verificarToken, (req, res, next) => {
  //  res.send('GET usuario')
  const { id } = req.params
  const sql = `SELECT * FROM ${process.env.NAME_DB}.estado_marcada where id_estado_marcada = ${id}`
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

// =========================================================
// CREAR UNA MARCADA
// =========================================================
router.post('/', verificarToken, async (req, res, next) => {
  // res.send('POST usuarios')
  // obtenemos el valor del estado
  // utilizamos el modulo que tiene la funcion para formatear el estado
  // console.log(req.body.nombre)
  const estadoMayus = await formatearTexto(req.body.estado)
  const sql = `SELECT * FROM ${process.env.NAME_DB}.estado_marcada where dni = ${estadoMayus}`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('El estado de la marcada con la descripcion proporcionada ya se encuentra registrado')
    } else {
      const sql = `INSERT INTO ${process.env.NAME_DB}.estado_marcada SET ?`

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

// =========================================================
// ACTUALIZAR UNA MARCADA
// =========================================================
// /:id => id de la marcada
router.put('/:id', verificarToken, (req, res, next) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { estado } = req.body
  const sql = `UPDATE ${process.env.NAME_DB}.estado_marcada SET estado = '${estado}' WHERE id_estado_marcada = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Estado Marcada actualizada!')
  })
})

// =========================================================
// ELIMINAR UNA MARCADA
// =========================================================
// /:id => id de la marcada
router.delete('/:id', verificarToken, (req, res, next) => {
  // res.send('DELETE user')
  const { id } = req.params
  const sql = `DELETE FROM ${process.env.NAME_DB}.estado_marcada WHERE id_estado_marcada = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('Estado Marcada eliminada!')
  })
})

// export router
module.exports = router
