var mongoose = require('mongoose')
const authRouter = require('./authRouter')
const router = require('./router')
const config = require('./config')
const port = 4444

config.app.use(config.express.static('public')) // follow path default was Public's folder

// Connect DB
mongoose.connect(config.urlMongoDb, { useNewUrlParser: true })
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connect Mongodb Complete')
})

config.app.use('/', router) // Not authen allow visit anyone 

config.app.use('/api', authRouter) // Authen middleware allow user handler

config.app.listen(process.env.PORT || port, () => console.log(`Server Listening to port ${port}`))