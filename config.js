const express = require('express')
const app = express()
const env = process.env.NODE_ENV
// const server = require('http').Server(app)
// var io = require('socket.io')(server)
const urlMongoDb = 'mongodb://judasfate:storedash2018@ds029575.mlab.com:29575/storedash'
const dev = {
  app: {
    port: 4444
  },
  db: {
    urlMongoDb: 'mongodb://judasfate:storedash2018@ds029575.mlab.com:29575/storedash'
  }
}

const config = {
  dev
}

const myEmail = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports 587
  auth: {
    user: 'nhicosmetics2019@gmail.com', // generated ethereal user
    pass: 'Cankhondichchuyen2018' // generated ethereal password
  }
}
const api = {
  local: 'http://localhost:4444',
  // local: 'https://www.judasfateblog.cf/slackserver',
  keyToken: 'NhanSinhNhuMong',
  //urlClient: 'https://myslacksubmit.netlify.com/'
  urlClient: 'http://localhost:3333'
}

module.exports = { express, app, urlMongoDb, myEmail, api }
