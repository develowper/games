import scheduler from 'adonisjs-scheduler/services/main'
import Helper from '../app/services/helper_service.js'
import Room from '../app/models/room.js'
import { DateTime } from 'luxon'
import RoomController from '../app/controllers/api/room_controller.js'
// scheduler.command("inspire").everyFiveSeconds();
import app from '@adonisjs/core/services/app'
import emitter from '@adonisjs/core/services/emitter'
// import MySocket from '@ioc:MySocket'
import mserver from '@adonisjs/core/services/server'
scheduler
  .call(() => {
    console.log('Pruge DB!')
  })
  .weekly()

app.ready(async () => {
  const mySocket = await app.container.make('MySocket')
  console.log(mserver.getNodeServer())

  scheduler
    .call(async () => {
      const rooms = await Room.query().where('is_active', true)
      rooms.forEach((room) => {
        console.log(`players ${room.playerCount}`, `time ${room.secondsRemaining}`)
        if (room.playerCount > 1 && room.secondsRemaining == room.maxSeconds) {
          console.log(`+room ${room.type}  ready`)
          // mySocket.emitToRoom(`room-${room.type}`, `game-start`, { room_type: room.type })
          // MySocket.emitToRoom(`room-${room.type}`, `game-start`, { room_type: room.type })
          // RoomController.startGame({ room_type: room.type })
          // emitter.emit("game-start", { room_type: room.type })
          mySocket.emitToRoom('room-d5000', 'game-start', { room_type: 'd5000' })
          mySocket.emit('game-start', { room_type: 'd5000' })
        } else console.log(`room ${room.type} not ready`)
      })
    })
    .everyFiveSeconds()
})
