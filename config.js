const express = require('express')
const app = express()
// const server = require('http').Server(app)
// var io = require('socket.io')(server)
const urlMongoDb = 'mongodb://judasfate:storedash2018@ds029575.mlab.com:29575/storedash'

module.exports = {express, app, urlMongoDb}