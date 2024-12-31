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
// scheduler
//   .call(() => {
//     console.log('Pruge DB!')
//   })
//   .weekly()

// app.ready(async () => {
//   const mySocket = await app.container.make('MySocket')
//   // console.log(mserver.getNodeServer())
// })

scheduler
  .call(async () => {

  })
   .dailyAt('13:00')
