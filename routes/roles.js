const { Router } = require('express')
const router = Router()
const connection = require('../database')
// =========================================================
// MIDDLEWARES
// =========================================================
var formatearTexto = require('../middlewares/formatear')
const verificarToken = require('../middlewares/verificarToken')
// =========================================================
// OBTENER TODOS LOS ROLES
// =========================================================
router.get('/', verificarToken, (req, res, next) => {
  // res.send('GET usuarios')
  const sql = `SELECT * FROM ${process.env.NAME_DB}.rol_usuario`
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
// OBTENER UN ROL
// =========================================================
// /:id => id del rol
router.get('/:id', verificarToken, (req, res, next) => {
  //  res.send('GET usuario')
  const { id } = req.params
  const sql = `SELECT * FROM ${process.env.NAME_DB}.rol_usuario where id_rol = ${id}`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.json(result)
    } else {
      return res.status(404).send('Rol no encontrado')
    }
  })
})

// =========================================================
// CREAR UN ROL
// =========================================================
router.post('/', verificarToken, async (req, res, next) => {
  // res.send('POST usuarios')
  // utilizamos el modulo que tiene la funcion para formatear el nombre
  // console.log(req.body.nombre)
  const descripcionMayus = await formatearTexto(req.body.descripcion)

  const sql = `SELECT * FROM ${process.env.NAME_DB}.rol_usuario where descripcion = '${descripcionMayus}'`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }
    if (result.length > 0) {
      res.send('El rol ya se encuentra registrado')
    } else {
      const sql = `INSERT INTO ${process.env.NAME_DB}.rol_usuario SET ?`

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

// =========================================================
// ACTUALIZAR UN ROL
// =========================================================
// /:id => id del rol
router.put('/:id', verificarToken, (req, res, next) => {
  // res.send('PUT usuario')
  const { id } = req.params
  const { descripcion } = req.body
  const sql = `UPDATE ${process.env.NAME_DB}.rol_usuario SET descripcion = '${descripcion}' WHERE id_rol = ${id}`

  connection.query(sql, (error) => {
    if (error) {
      throw error
    }
    res.send('rol actualizado!')
  })
})

// =========================================================
// ELIMINAR UNA INSTITUCIN
// =========================================================
// /:id => id del rol a eliminar
router.delete('/:id', verificarToken, (req, res, next) => {
  // res.send('DELETE user')
  const { id } = req.params
  const sql = `SELECT * FROM ${process.env.NAME_DB}.rol_usuario WHERE id_rol = '${id}'`
  connection.query(sql, (error, result) => {
    if (error) {
      throw error
    }

    if (result.length > 0) {
      const sql = `DELETE FROM ${process.env.NAME_DB}.rol_usuario WHERE id_rol = '${id}'`

      connection.query(sql, (error) => {
        if (error) {
          throw error
        }
        res.send('Rol eliminado!')
      })
    } else {
      res.send('Rol no encontrado')
    }
  })
})

// export router
module.exports = router
