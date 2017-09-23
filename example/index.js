'use strict'

const http = require('http')
const Socket = require('socket.io')
const { createServerCallbacks } = require('../lib')
const middleware = require('./middleware')

const {
  httpServerCallback,
  wsServerCallback,
} = createServerCallbacks(middleware)

const hostname = '127.0.0.1'
const port = 1337

const server = http.createServer(httpServerCallback)
const io = new Socket(server)
io.on('connection', wsServerCallback)

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
