// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import Room from '#models/room'
import { asPrice, sendError, __, getRandomBetween } from '#services/helper_service'
import UserFinancial from '#models/user_financial'
import { inject } from '@adonisjs/core'
import Helper from '#services/helper_service'
import Setting from '#models/setting'
import collect from 'collect.js'
import vine from '@vinejs/vine'
import emitter from '@adonisjs/core/services/emitter'
// import { emitter } from '#start/globals'
import User from '../../models/user.js'
import { DateTime } from 'luxon'
// import MySocket from '@ioc:MySocket'
import app from '@adonisjs/core/services/app'
import mserver from '@adonisjs/core/services/server'
import Daberna from '#models/daberna'
import i18nManager from '@adonisjs/i18n/services/main'
import env from '#start/env'
import { storage } from '../../../resources/js/storage.js'
import db from '@adonisjs/lucid/services/db'
import Dooz from '#models/dooz'

@inject()
export default class GameController {
  // constructor(protected helper: Helper) {}

  async find({ response, request, auth, i18n }: HttpContext) {
    const user = auth.user as User
    const roomType = request.input('room_type')
    // const trx = await db.transaction()
    const room = await Room.query(/*{ client: trx }*/)
      .where('is_active', true)
      .where('type', roomType)
      .first()
    if (!user.isActive) {
      // await trx.commit()
      return response
        .status(Helper.ERROR_STATUS)
        .json({ message: i18n.t('messages.is_inactive_*', { item: i18n.t('messages.user') }) })
    }
    if (!room) {
      // await trx.commit()
      return response
        .status(Helper.ERROR_STATUS)
        .json({ message: i18n.t('messages.not_found_*', { item: i18n.t('messages.game_room') }) })
    }

    //start find before game
    const game = await Dooz.query()
      .where('type', room.type)
      .whereNull('winner_id')
      .where((query) => {
        query.orWhere('p1_id', user.id).orWhere('p2_id', user.id)
      })
      // .where('created_at', '>', DateTime.now().minus({ minutes: 10 }).toJSDate())
      .orderBy('updated_at', 'desc')
      .first()

    if (game) {
      return response.json({ status: 'before_game', game: game })
    }
    const userFinancials = await UserFinancial.firstOrCreate(
      { userId: user?.id },
      { balance: 0 } /*,
      { client: trx }*/
    )
    if (userFinancials.balance < room.cardPrice) {
      // await trx.commit()
      // userFinancials.balance = 100000
      // userFinancials.save()
      return response /*.status(Helper.ERROR_STATUS)*/
        .json({
          status: 'low_balance',
          message: i18n.t('messages.validate.wallet_min', {
            item: i18n.t('messages.wallet'),
            value: `${asPrice(room.cardPrice)} ${i18n.t('messages.currency')}`,
          }),
        })
    }

    //add to room and wait for game
    room.setUser(user, 'add')

    await room.save()
    return response.json({ status: 'waiting' })
  }
  async play({ response, request, auth, i18n }: HttpContext) {
    const user = auth.user as User
    const gameId = request.input('game_id')
    // const cmnd = request.input('cmnd')
    const move = request.input('move')
    const game = await Dooz.find(gameId)
    if (!game || game.winnerId != null) {
      // await trx.commit()
      return response.status(Helper.ERROR_STATUS).json({
        status: 'danger',
        message: i18n.t('messages.not_found_*', { item: i18n.t('messages.game') }),
      })
    }
    response.json({ status: 'success', game: await Dooz.play(game, move, user) })
  }
}
