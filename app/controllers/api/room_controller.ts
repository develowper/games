// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import Room from '#models/room'
import __, { asPrice, sendError } from '#services/helper_service'
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

@inject()
export default class RoomController {
  // constructor(protected helper: Helper) {}

  async get({ response, request }: HttpContext) {
    let query = Room.query()
    query = query.where('is_active', true)
    if (request.input('id')) query = query.where('id', request.input('id'))
    const data = await query
    return response.json({ data: data.map((item) => item.serialize()) })
  }

  async payAndJoin({ response, request, auth, i18n }: HttpContext) {
    const user = auth.user as User
    const roomType = request.input('room_type')
    const cardCount = Number.parseInt(request.input('card_count'))
    const room = await Room.query().where('type', roomType).first()

    if (!room || Number.isNaN(cardCount)) {
      return response
        .status(Helper.ERROR_STATUS)
        .json({ message: i18n.t('messages.not_found_*', { item: i18n.t('messages.game_room') }) })
    }
    // const settings = await  getSettings([
    //   'max_user_room_cards',
    //   'max_room_cards',
    //   'row_win_percent',
    //   'win_percent',
    // ])

    const userBeforeCardCounts = room.getUserCardCount()

    if (userBeforeCardCounts + cardCount > room.maxUserCardsCount) {
      return sendError(i18n.t('messages.validate.max_cards', { value: room.maxUserCardsCount }))
    }

    const userFinancials = await UserFinancial.firstOrCreate({ userId: user?.id }, { balance: 0 })
    const totalPrice = room.cardPrice * cardCount
    // vine.compile(vine.object({
    //   totalPrice: vine.number().max(userFinancials.balance)
    // },)).validate({ totalPrice })

    if (userFinancials.balance < totalPrice) {
      // userFinancials.balance = 100000
      // userFinancials.save()
      return sendError(
        i18n.t('messages.validate.min', {
          item: i18n.t('messages.wallet'),
          value: `${asPrice(totalPrice)} ${i18n.t('messages.currency')}`,
        })
      )
    }

    if (room.setUserCardsCount(userBeforeCardCounts + cardCount)) {
      if (userBeforeCardCounts == 0) {
        room.playerCount++
        user.playCount++
      }
      room.cardCount += cardCount

      if (
        (room.playerCount == 2 && userBeforeCardCounts == 0) ||
        (room.playerCount > 2 && room.secondsRemaining == room.maxSeconds)
      )
        room.startAt = DateTime.now().plus({ seconds: room.maxSeconds - 1 })

      room.save()
      userFinancials.balance -= totalPrice
      userFinancials.save()

      switch (room.cardPrice) {
        case 5000:
          user.card5000Count += cardCount
          user.todayCard5000Count += cardCount
          break
        case 10000:
          user.card10000Count += cardCount
          user.todayCard10000Count += cardCount
          break
        case 20000:
          user.card20000Count += cardCount
          user.todayCard20000Count += cardCount
          break
        case 50000:
          user.card50000Count += cardCount
          user.todayCard50000Count += cardCount
          break
      }

      user.save()

      emitter.emit('room-update', {
        type: roomType,
        cmnd: 'card-added',
        players: room.players,
        start_with_me: room.startWithMe,
        seconds_remaining: room.playerCount > 1 ? room.secondsRemaining : room.maxSeconds,
        player_count: room.playerCount,
        user_id: user?.id,
        username: user?.username,
        user_card_count: userBeforeCardCounts + cardCount,
        card_count: room.cardCount,
      })
      emitter.emit(`user-${user.id}-info`, { user_balance: userFinancials.balance })

      RoomController.startGame([room])
    }
  }

  public static async startGame(rooms: Room[]) {
    const mySocket = await app.container.make('MySocket')

    rooms.forEach(async (room) => {
      // console.log(`players ${room.playerCount}`, `time ${room.secondsRemaining}`)
      if (room.playerCount > 1 && room.secondsRemaining == room.maxSeconds) {
        //create game and empty room
        const game = await Daberna.makeGame(room)
        // const tmp = await Daberna.query().orderBy('id', 'DESC').first()

        mySocket.emitToRoom(`room-${room.type}`, 'game-start', game)
      }
    })
  }
}
