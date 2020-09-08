if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const app = require('./app')

app.set('port', process.env.PORT || 3000)

const PORT = app.get('port')

app.listen(PORT, () => console.log(`Server listening on port = ${PORT}`))