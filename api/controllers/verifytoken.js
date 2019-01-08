var jwt = require('jsonwebtoken')
const {api} = require('../../config')

function verifyToken (req,res, next) {
    let token = req.headers.authorization
    if(!token){
        return res.status(403).send({
            status: 403,
            message: 'Token not identify'
        })
    }
    jwt.verify(token, api.keyToken, function(err, decoded) {
        if(err) res.status(500).send({ message: 'Token is expired'})
        next()
      })
}

module.exports = verifyToken