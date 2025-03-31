// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import Room from '#models/room'
import { asPrice, sendError, __, getRandomBetween, shuffle } from '#services/helper_service'
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
import Blackjack from '#models/blackjack'

@inject()
export default class BlackJackController {
  // constructor(protected helper: Helper) {}

  async find({ response, request, auth, i18n }: HttpContext) {
    const user = auth.user as User
    const roomType = request.input('room_type')
    const cmnd = request.input('cmnd')
    if (!user.isActive) {
      // await trx.commit()
      return response
        .status(Helper.ERROR_STATUS)
        .json({ message: i18n.t('messages.is_inactive_*', { item: i18n.t('messages.user') }) })
    }
    // const trx = await db.transaction()
    const room = await Room.query(/*{ client: trx }*/)
      .where('game', 'blackjack')
      .where('is_active', true)
      .where('type', roomType)
      .first()
    const game: Blackjack | null = room
      ? await Blackjack.query(/*{ client: trx }*/).where('type', roomType).first()
      : null
    if (!game) {
      // await trx.commit()
      return response
        .status(Helper.ERROR_STATUS)
        .json({ message: i18n.t('messages.not_found_*', { item: i18n.t('messages.game_room') }) })
    }
    if (cmnd == 'join') {
      const userFinancials = await UserFinancial.firstOrCreate({ userId: user?.id }, { balance: 0 })
      if (userFinancials.balance < 5000) {
        // await trx.commit()
        // userFinancials.balance = 100000
        // userFinancials.save()
        return response /*.status(Helper.ERROR_STATUS)*/
          .json({
            status: 'low_balance',
            message: i18n.t('messages.validate.wallet_min', {
              item: `${asPrice('5000')} ${i18n.t('messages.currency')}`,
            }),
          })
      }
      if (!game.p1Id != null && game.p2Id != null && game.p3Id != null && game.p4Id != null) {
        // await trx.commit()
        return response
          .status(Helper.ERROR_STATUS)
          .json({ message: i18n.t('messages.is_full_*', { item: i18n.t('messages.game_room') }) })
      }
      //add user to game
      user.balance = userFinancials.balance
      const res = await game.setUser(user, 'add')
      await room.setUser(user, 'add')
    }

    // let state = JSON.parse(game.state ?? '{}')
    if (game.action == null) game.action = 'bet'
    if (game.action == 'bet_done') game.action = 'set_cards'
    await game.save()
    await Blackjack.botPlay(game)
    //add to room and wait for game

    return response.json({ status: 'success', game: game })
  }
  async play({ response, request, auth, i18n }: HttpContext) {
    const user = auth.user as User
    const gameId = request.input('game_id')
    const amount = request.input('amount')
    const cmnd = request.input('cmnd')
    const game = await Blackjack.find(gameId)
    const now = DateTime.now()
    let userFinancials
    if (!game) {
      // await trx.commit()
      return response.status(Helper.ERROR_STATUS).json({
        status: 'danger',
        message: i18n.t('messages.not_found_*', { item: i18n.t('messages.game') }),
      })
    }
    const meIndex =
      game.p1Id == user.id
        ? 1
        : game.p2Id == user.id
          ? 2
          : game.p3Id == user.id
            ? 3
            : game.p4Id == user.id
              ? 4
              : null
    if (!meIndex) {
      // await trx.commit()
      return response.status(Helper.ERROR_STATUS).json({
        status: 'danger',
        message: i18n.t('messages.you_not_in_game'),
      })
    }
    if (['split', 'double1', 'double2', 'hit1', 'hit2', 'stand1', 'stand2'].includes(cmnd))
      if (game[`p${meIndex}Action1`] != 'decision' && game[`p${meIndex}Action2`] != 'decision') {
        return response.json({
          status: 'danger',
          message: i18n.t('messages.select_time_ended'),
        })
      }
    const state = JSON.parse(game.state ?? '{}') ?? {}
    let meInfo = state[user.id]
    let remindedCards
    let myBet
    let popped

    switch (cmnd) {
      case 'bet':
        if (game.action != 'bet') {
          return response.json({
            status: 'danger',
            message: i18n.t('messages.bet_time_ended'),
          })
        }
        if (game[`p${meIndex}Action1`] != 'bet') {
          return response.json({
            status: 'danger',
            message: i18n.t('messages.you_already_bet'),
          })
        }
        if (Number.parseInt(`${amount}`) < Helper.BLACKJACK.coins[0]) {
          return response.json({
            status: 'danger',
            message: i18n.t('messages.validate.min', {
              item: i18n.t('messages.bet'),
              value: `${asPrice(Helper.BLACKJACK.coins[0])} ${i18n.t('messages.currency')}`,
            }),
          })
        }

        userFinancials = await UserFinancial.firstOrCreate({ userId: user?.id }, { balance: 0 })
        if (userFinancials.balance < amount) {
          return response.json({
            status: 'danger',
            message: i18n.t('messages.validate.wallet_min', {
              item: `${asPrice(amount)} ${i18n.t('messages.currency')}`,
            }),
          })
        }
        userFinancials.balance -= amount
        await userFinancials.save()
        user.balance = userFinancials.balance
        await game.setUser(
          {
            id: user.id,
            username: user.username,
            role: user.role,
            balance: userFinancials.balance,
            bet_amount: amount,
          },
          'bet1'
        )
        return response.json({ status: 'success', game: game })
      case 'split1':
      case 'split2':
        userFinancials = await UserFinancial.firstOrCreate({ userId: user?.id }, { balance: 0 })

        myBet = meInfo?.bet1 ?? 0

        if (userFinancials.balance < myBet) {
          return response.json({
            status: 'danger',
            message: i18n.t('messages.validate.wallet_min', {
              item: `${asPrice(amount)} ${i18n.t('messages.currency')}`,
            }),
          })
        }
        userFinancials.balance -= myBet

        if (
          meInfo?.cards1?.length == 2 &&
          meInfo?.cards1[0].length > 1 &&
          meInfo?.cards1[0].substring(1) == meInfo?.cards1[1].substring(1)
        ) {
          meInfo.cards2 = [meInfo?.cards1.pop()]
          meInfo.bet2 = meInfo?.bet1

          meInfo.sum1 = Blackjack.getCardsSums(meInfo?.cards1)
          meInfo.sum2 = Blackjack.getCardsSums(meInfo?.cards2)
          meInfo.allowed1 = ['hit']
          meInfo.allowed2 = ['hit']
          if (meInfo?.sum1.filter((i) => [9, 10, 11].includes(i)).length > 0) {
            meInfo?.allowed1.push('double')
          }
          if (meInfo?.sum2.filter((i) => [9, 10, 11].includes(i)).length > 0) {
            meInfo?.allowed2.push('double')
          }
          meInfo.balance = userFinancials.balance
          state[user.id] = meInfo
          game.state = JSON.stringify(state)
          game[`p${meIndex}Action1`] = 'decision'
          game[`p${meIndex}Action2`] = 'decision'
          game[`p${meIndex}Checkout1`] = now
          game[`p${meIndex}Checkout2`] = now

          await game.save()
          await userFinancials.save()
          return response.json({ status: 'success', game: game })
        }
        break
      case 'stand1':
        game[`p${meIndex}Checkout1`] = now
        game[`p${meIndex}Action1`] = 'decision_done'
        meInfo.allowed1 = []
        state[user.id] = meInfo
        game.state = JSON.stringify(state)
        await game.save()
        return response.json({ status: 'success', game: game })
      case 'stand2':
        meInfo = state[user.id]
        game[`p${meIndex}Checkout2`] = now
        game[`p${meIndex}Action2`] = 'decision_done'
        meInfo.allowed2 = []
        state[user.id] = meInfo
        game.state = JSON.stringify(state)
        await game.save()
        return response.json({ status: 'success', game: game })
      case 'hit1':
        state.used_cards = state.used_cards || []
        remindedCards = shuffle(
          Helper.BLACKJACK.cards.filter((i: any) => !state.used_cards.includes(i)) ?? []
        )
        popped = remindedCards.pop()
        meInfo.cards1 = meInfo.cards1 || []
        state.used_cards.push(popped)
        meInfo.cards1.push(popped)
        meInfo.sum1 = Blackjack.getCardsSums(meInfo?.cards1)
        meInfo.allowed1 = meInfo.sum1[0] >= 21 ? [] : ['hit', 'stand']
        state[user.id] = meInfo
        game.state = JSON.stringify(state)
        game[`p${meIndex}Checkout1`] = now
        game[`p${meIndex}Action1`] = meInfo.sum1[0] >= 21 ? 'decision_done' : 'decision'
        await game.save()
        return response.json({ status: 'success', game: game })
      case 'hit2':
        state.used_cards = state.used_cards || []
        remindedCards = shuffle(
          Helper.BLACKJACK.cards.filter((i: any) => !state.used_cards.includes(i)) ?? []
        )
        popped = remindedCards.pop()
        meInfo.cards2 = meInfo.cards2 || []
        state.used_cards.push(popped)
        meInfo.cards2.push(popped)
        meInfo.sum2 = Blackjack.getCardsSums(meInfo?.cards2)
        meInfo.allowed2 = meInfo.sum2[0] >= 21 ? [] : ['hit', 'stand']
        state[user.id] = meInfo
        game.state = JSON.stringify(state)
        game[`p${meIndex}Checkout2`] = now
        game[`p${meIndex}Action2`] = meInfo.sum2[0] >= 21 ? 'decision_done' : 'decision'
        await game.save()
        return response.json({ status: 'success', game: game })
      case 'double1':
        userFinancials = await UserFinancial.firstOrCreate({ userId: user?.id }, { balance: 0 })
        myBet = meInfo?.bet1 ?? 0
        if (userFinancials.balance < myBet) {
          return response.json({
            status: 'danger',
            message: i18n.t('messages.validate.wallet_min', {
              item: `${asPrice(amount)} ${i18n.t('messages.currency')}`,
            }),
          })
        }
        userFinancials.balance -= myBet
        state.used_cards = state.used_cards || []
        remindedCards = shuffle(
          Helper.BLACKJACK.cards.filter((i: any) => !state.used_cards.includes(i)) ?? []
        )
        popped = remindedCards.pop()
        meInfo.cards1 = meInfo.cards1 || []
        state.used_cards.push(popped)
        meInfo.cards1.push(popped)
        meInfo.allowed1 = []
        meInfo.sum1 = Blackjack.getCardsSums(meInfo?.cards1)
        meInfo.bet1 = myBet * 2
        meInfo.balance = userFinancials.balance
        state[user.id] = meInfo
        game.state = JSON.stringify(state)
        game[`p${meIndex}Checkout1`] = now
        game[`p${meIndex}Action1`] = 'decision_done'

        await game.save()
        await userFinancials.save()
        return response.json({ status: 'success', game: game })
      case 'double2':
        userFinancials = await UserFinancial.firstOrCreate({ userId: user?.id }, { balance: 0 })
        myBet = meInfo?.bet2 ?? 0
        if (userFinancials.balance < myBet) {
          return response.json({
            status: 'danger',
            message: i18n.t('messages.validate.wallet_min', {
              item: `${asPrice(amount)} ${i18n.t('messages.currency')}`,
            }),
          })
        }
        userFinancials.balance -= myBet
        state.used_cards = state.used_cards || []
        remindedCards = shuffle(
          Helper.BLACKJACK.cards.filter((i: any) => !state.used_cards.includes(i)) ?? []
        )
        popped = remindedCards.pop()
        meInfo.cards2 = meInfo.cards2 || []
        state.used_cards.push(popped)
        meInfo.cards2.push(popped)
        meInfo.allowed2 = []
        meInfo.sum2 = Blackjack.getCardsSums(meInfo?.cards2)
        meInfo.bet2 = myBet * 2
        meInfo.balance = userFinancials.balance
        state[user.id] = meInfo
        game.state = JSON.stringify(state)
        game[`p${meIndex}Checkout2`] = now
        game[`p${meIndex}Action2`] = 'decision_done'

        await game.save()
        await userFinancials.save()
        return response.json({ status: 'success', game: game })
    }

    return response.json({ status: 'danger', game: await Blackjack.play(game, user) })
  }

  async update({}: HttpContext) {}
}
