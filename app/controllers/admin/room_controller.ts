// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import Helper, { __ } from '#services/helper_service'
import Room from '#models/room'
import collect from 'collect.js'
import { createRoomValidator, updateRoomValidator } from '#validators/room'
import Telegram from '#services/telegram_service'
import hash from '@adonisjs/core/services/hash'

export default class RoomController {
  //
  async index({ request, inertia }: HttpContext) {
    return inertia.render('Panel/Admin/Room/Index', {
      statuses: collect(Helper.ROOM_STATUSES).pluck('name'),
    })
  }
  async edit({ request, inertia, params }: HttpContext) {
    return inertia.render('Panel/Admin/Room/Edit', {
      data: await Room.query()
        .where({ id: params.id ?? 0 })
        .first(),
      statuses: collect(Helper.ROOM_STATUSES).pluck('name'),
    })
  }
  async create({ request, inertia }: HttpContext) {
    return inertia.render('Panel/Admin/Room/Create', {
      user_roles: Helper.USER_ROLES,
      user_statuses: collect(Helper.USER_STATUSES).pluck('name'),
    })
  }
  async store({ request, response, inertia, auth, session }: HttpContext) {
    const admin = auth.user
    await request.validateUsing(createRoomValidator)

    const user = await Room.create({
      fullName: request.input('full_name'),
      username: request.input('username'),
      phone: request.input('phone'),
      role: request.input('role'),
      isActive: true,
      password: await hash.make(request.input('password')),
      agencyId: /*request.input('agency_id') ?? */ admin?.agencyId,
    })

    const userFinancial = await user.related('financial').create({
      card: request.input('card'),
      sheba: request.input('sheba'),
    })

    session.flash('notification', { message: __('created_successfully'), status: 'success' })

    Telegram.log(null, 'user_created', user)

    return response.redirect().toRoute('admin.panel.room.index')
  }
  async search({ request, response, auth }: HttpContext) {
    const user = auth.user
    const userId = user?.id
    const page = request.input('page') ?? 1
    const search = request.input('search')
    const type = request.input('type')
    const dir = request.input('dir') ?? 'DESC'
    const sort = request.input('order_by') ?? 'created_at'

    let query = Room.query()

    if (search) query.where('title', 'like', `%${search}%`)
    if (type) {
      query.where('type', type)
    }
    return response.json(await query.orderBy(sort, dir).paginate(page, Helper.PAGINATE))
  }

  async update({ request, response, auth, session, inertia }: HttpContext) {
    const admin = auth.user
    const id = request.input('id')
    const cmnd = request.input('cmnd')
    const isActive = request.input('status') == 'active'
    const data = await Room.query().where('id', '=', id).first()
    if (!data)
      return response.badRequest({
        status: 'danger',
        message: __('not_found_*', {
          item: `${__('room')}`,
        }),
      })
    switch (cmnd) {
      case 'status':
        data.isActive = isActive
        data.save()
        Telegram.log(null, 'room_edited', data)
        return response.send({
          status: 'success',
          message: __('updated_successfully'),
          is_active: data.isActive ? 1 : 0,
        })

        break

      case 'info':
        await request.validateUsing(updateRoomValidator, { meta: { id: data.id } })

        data.title = request.input('title')
        data.cardPrice = request.input('card_price')
        data.maxCardsCount = request.input('max_cards_count')
        data.maxUserCardsCount = request.input('max_user_cards_count')
        data.winScore = request.input('win_score')
        data.maxSeconds = request.input('max_seconds')
        data.commissionPercent = request.input('commission_percent')
        data.winPercent = request.input('win_percent')
        data.rowWinPercent = request.input('row_win_percent')
        data.rwp = request.input('rwp')

        data.isActive = request.input('status') == 'active'

        data.save()
        session.flash('notification', { message: __('updated_successfully'), status: 'success' })
        Telegram.log(null, 'room_edited', data)

        return response.redirect().back()
        break
    }
    return response.badRequest({
      status: 'danger',
      message: __('not_found_*', {
        item: `${__('operation')}`,
      }),
    })
  }
}
