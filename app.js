const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

// Inicializacion
const app = express()
require('./database')

// Midlewares
app.use(morgan('dev'))
// app.use(express.urlencoded({ extended: false }))
// app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// signin signup
app.use(require('./controllers/authController'))
// asistencias
app.use('/api/asistencias', require('./routes/asistencias'))
// instituciones
app.use('/api/instituciones', require('./routes/instituciones'))
// marcadas
app.use('/api/marcadas', require('./routes/marcadas'))
// roles
app.use('/api/roles', require('./routes/roles'))
// usuarios
app.use('/api/usuarios', require('./routes/usuarios'))

// Static files
// app.use(express.static(path.join(__dirname, 'public')))

// 404 Handler
// app.get((req, res) => {
//   res.status(404).send('404 not found')
// })

// server en index.js

// export app
module.exports = app
