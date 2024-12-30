// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import Helper, { __ } from '#services/helper_service'
import collect from 'collect.js'
import Log from '#models/log'

export default class LogController {
  //
  async index({ request, inertia }: HttpContext) {
    return inertia.render('Panel/Admin/Log/Index', {
      statuses: collect(Helper.ROOM_STATUSES).pluck('name'),
    })
  }

  async search(ctx: HttpContext) {
    const user = ctx.auth.user
    const page = ctx.request.input('page') ?? 1
    const search = ctx.request.input('search')
    const type = ctx.request.input('type')
    const dir = ctx.request.input('dir') ?? 'DESC'
    const sort = ctx.request.input('order_by') ?? 'created_at'
    let query = Log.query()

    if (search) query.where('date', 'like', `%${search}%`)
    if (type) {
      query.where('type', type)
    }
    return ctx.response.json(await query.orderBy(sort, dir).paginate(page, Helper.PAGINATE))
  }
}
