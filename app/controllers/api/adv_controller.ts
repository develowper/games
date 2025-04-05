import db from '@adonisjs/lucid/services/db'

export default class UserController {
  async get({ response, request }) {
    const cmnd = request.input('cmnd')
    const ad = await db.from('advs').where('is_active', true).orderByRaw('RAND()').limit(1)
    return response.json(ad?.[0])
  }
  async click({ request }) {
    const id = request.input('id')
    await db.from('advs').where('id', id).increment('clicks', 1)
  }
}
