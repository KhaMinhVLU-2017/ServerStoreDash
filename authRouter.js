const express = require('express')
const authRouter = express.Router()

authRouter.use((req, res, next) => {
    console.log('Request to Middle API at ' + Date.now())
    next()
})

authRouter.get('/', (req, res) => {
    res.send('Welcome to API of JudasFate')
})

module.exports = authRouter