import {Server} from 'socket.io'
import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'


app.ready(() => {

  const io = new Server(server.getNodeServer())

  io.on('connection', (socket) => {
    socket.emit('news', {hello: socket.id})

    socket.on('my other event', (data) => {
      console.log(data)
    })
    console.log('User Connected', socket.id)
  })
})

