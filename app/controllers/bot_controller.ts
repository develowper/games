import { HttpContext } from '@adonisjs/core/http'

export default class BotController {
  async getUpdates({ request }: HttpContext) {
    console.log('*********')
    console.log(request.body())
    return request.body()
  }
}
