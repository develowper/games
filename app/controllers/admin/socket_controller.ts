import { HttpContext } from '@adonisjs/core/http'

export default class SocketController {
  async connect({ auth }: HttpContext) {
    console.log('-------------------------')
  }
}
