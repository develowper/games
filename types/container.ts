import { SocketIo } from '../app/services/socketio_service.js'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    MySocket: SocketIo
  }
}
