import SocketIo from '#services/socketio_service'
import type { ApplicationService } from '@adonisjs/core/types'
import Helper from '#services/helper_service'

export default class SocketioProvider {
  socket: any

  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('MySocket', async () => {
      return new SocketIo()
    })

    // this.app.container.alias('MySocket', SocketIo)
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    const socket = await this.app.container.make('MySocket')
    socket.init()
    // const { SocketIo } = await import('#services/socketio_service')
    // this.socket = new SocketIo(this.app)
    // await this.socket.boot()
    // this.app.container.singleton('MySocket', () => { return this.socket })
    //
    // const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
    // const Event = this.app.container.resolveBinding('Adonis/Core/Event')
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    // const socket = await this.app.container.make('MySocket')
    // socket.clearTimer()
  }
}
