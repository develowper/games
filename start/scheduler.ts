import scheduler from 'adonisjs-scheduler/services/main'
import { getSettings } from '#services/helper_service'
import Room from '../app/models/room.js'
import { DateTime } from 'luxon'
import RoomController from '../app/controllers/api/room_controller.js'
// scheduler.command("inspire").everyFiveSeconds();
import app from '@adonisjs/core/services/app'
import emitter from '@adonisjs/core/services/emitter'
// import MySocket from '@ioc:MySocket'
import mserver from '@adonisjs/core/services/server'
import Log from '#models/log'
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
    const clearPeriodDay = (await getSettings('')) ?? 0

    const now = DateTime.now()
    //clear
    if (clearPeriodDay > 0) {
      Log.query()
        .where('created_at', '<', now.minus({ days: clearPeriodDay }).toJSDate())
        .delete()

    }
  })
  .everyFiveSeconds()
  .cron('0 4 * * *') // Runs daily at 4:00 AM
