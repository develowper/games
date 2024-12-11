import { Scheduler } from 'adonisjs-scheduler'
import Ws from 'App/Services/Ws'
import { DateTime } from 'luxon'
export default class EmitRoomNotification extends BaseTask {
  public static get schedule() {
    return '*/1 * * * *'
    // Runs every minute
  }
  public static get useLock() {
    return false
  }
  public async handle() {
    const now = DateTime.now().toISO()
    Ws.emitToRoom('room1', 'notification', { message: 'Scheduled message', timestamp: now })
    console.log('Message sent to room1:', now)
  }
}
