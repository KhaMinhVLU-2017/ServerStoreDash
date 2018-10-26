const express = require('express')
const router = express.Router()
// var NonControl = require('./api/controllers/nonController')
var NonControl = require('./api/controllers/nonController')

router.get('/', (req, res) =>{
    res.send('Welcome to Server')
})
router.get('/user:id', (req, res) => {
    let param = req.params.id
    let message = NonControl.account(454)
    res.send(message)
})


module.exports = router
