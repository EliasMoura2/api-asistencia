const mysql = require('mysql')
// const app = require('./app')

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.NAME_DB
})

connection.connect(error => {
  if (error) {
    throw error
  } else {
    console.log('DB is connected!')
  }
})

module.exports = connection
