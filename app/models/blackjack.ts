import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { HttpContext } from '@adonisjs/core/http'
import Helper, { shuffle } from '#services/helper_service'

export default class Blackjack extends BaseModel {
  static table = 'blackjack'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'p1_id' })
  declare p1Id: number | null
  @column({ columnName: 'p2_id' })
  declare p2Id: number | null
  @column({ columnName: 'p3_id' })
  declare p3Id: number | null
  @column({ columnName: 'p4_id' })
  declare p4Id: number | null

  @column({ columnName: 'p1_role' })
  declare p1Role: string | null
  @column({ columnName: 'p2_role' })
  declare p2Role: string | null
  @column({ columnName: 'p3_role' })
  declare p3Role: string | null
  @column({ columnName: 'p4_role' })
  declare p4Role: string | null

  @column({ columnName: 'p1_action1' })
  declare p1Action1: string | null
  @column({ columnName: 'p1_action2' })
  declare p1Action2: string | null
  @column({ columnName: 'p2_action1' })
  declare p2Action1: string | null
  @column({ columnName: 'p2_action2' })
  declare p2Action2: string | null
  @column({ columnName: 'p3_action1' })
  declare p3Action1: string | null
  @column({ columnName: 'p3_action2' })
  declare p3Action2: string | null
  @column({ columnName: 'p4_action1' })
  declare p4Action1: string | null
  @column({ columnName: 'p4_action2' })
  declare p4Action2: string | null
  @column.dateTime({ columnName: 'p1_checkout1' })
  declare p1Checkout1: any
  @column.dateTime({ columnName: 'p1_checkout2' })
  declare p1Checkout2: any
  @column.dateTime({ columnName: 'p2_checkout1' })
  declare p2Checkout1: any
  @column.dateTime({ columnName: 'p2_checkout2' })
  declare p2Checkout2: any
  @column.dateTime({ columnName: 'p3_checkout1' })
  declare p3Checkout1: any
  @column.dateTime({ columnName: 'p3_checkout2' })
  declare p3Checkout2: any
  @column.dateTime({ columnName: 'p4_checkout1' })
  declare p4Checkout1: any
  @column.dateTime({ columnName: 'p4_checkout2' })
  declare p4Checkout2: any

  @column()
  declare action: string
  @column()
  declare title: string
  @column({
    serialize: (value: string) => JSON.parse(value) ?? {},
    // consume: (value: any) => JSON.stringify(value),
  })
  declare state: any
  @column()
  declare type: string
  @column()
  declare step: number
  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  async findGame({ request, response, i18n }: HttpContext) {}

  public async setUser(user, cmnd = 'add') {
    const now = DateTime.now()
    let res = false
    if (!user) return false
    if (cmnd == 'add' && [this.p1Id, this.p2Id, this.p3Id, this.p4Id].includes(user.id)) {
      return true
    }
    if (cmnd == 'bet1' && ![this.p1Id, this.p2Id, this.p3Id, this.p4Id].includes(user.id)) {
      return false
    }
    if (cmnd == 'add' && ![this.p1Id, this.p2Id, this.p3Id, this.p4Id].includes(null)) {
      return false
    }
    const state = JSON.parse(this.state ?? '{}') ?? {}
    if (cmnd == 'add')
      if (this.p1Id == null) {
        this.p1Id = user.id
        this.p1Role = user.role
        this.p1Checkout1 = now
        this.p1Action1 = 'bet'
        this.p1Checkout2 = null
        this.p1Action2 = null
        res = true
      } else if (this.p2Id == null) {
        this.p2Id = user.id
        this.p2Role = user.role
        this.p2Checkout1 = now
        this.p2Action1 = 'bet'
        this.p2Checkout2 = null
        this.p2Action2 = null
        res = true
      } else if (this.p3Id == null) {
        this.p3Id = user.id
        this.p3Role = user.role
        this.p3Checkout1 = now
        this.p3Action1 = 'bet'
        this.p3Checkout2 = null
        this.p3Action2 = null
        res = true
      } else if (this.p4Id == null) {
        this.p4Id = user.id
        this.p4Role = user.role
        this.p4Checkout1 = now
        this.p4Action1 = 'bet'
        this.p4Checkout2 = null
        this.p4Action2 = null
        res = true
      }
    if (cmnd == 'remove')
      if (this.p1Id == user.id) {
        this.p1Id = null
        this.p1Role = null
        this.p1Checkout1 = null
        this.p1Action1 = null
        this.p1Checkout2 = null
        this.p1Action2 = null
        res = true
      } else if (this.p2Id == user.id) {
        this.p2Id = null
        this.p2Id = null
        this.p2Role = null
        this.p2Checkout1 = null
        this.p2Action1 = null
        this.p2Checkout2 = null
        this.p2Action2 = null
        res = true
      } else if (this.p3Id == user.id) {
        this.p3Id = null
        this.p3Role = null
        this.p3Checkout1 = null
        this.p3Action1 = null
        this.p3Checkout2 = null
        this.p3Action2 = null
        res = true
      } else if (this.p4Id == user.id) {
        this.p4Id = null
        this.p4Role = null
        this.p4Checkout1 = null
        this.p4Action1 = null
        this.p4Checkout2 = null
        this.p4Action2 = null
        res = true
      }
    if (cmnd == 'bet1')
      if (this.p1Id == user.id) {
        this.p1Checkout1 = now
        this.p1Action1 = 'bet_done'

        res = true
      } else if (this.p2Id == user.id) {
        this.p2Checkout1 = now
        this.p2Action1 = 'bet_done'

        res = true
      } else if (this.p3Id == user.id) {
        this.p3Checkout1 = now
        this.p3Action1 = 'bet_done'
        res = true
      } else if (this.p4Id == user.id) {
        this.p4Checkout1 = now
        this.p4Action1 = 'bet_done'
        res = true
      }

    if (res) {
      if (cmnd == 'add')
        state[user.id] = {
          cards1: [''],
          cards2: [],
          username: user.username,
          balance: user.balance ?? 0,
          bet1: user.bet_amount ?? 0,
        }
      if (cmnd == 'bet1') {
        state[user.id].balance = user.balance
        state[user.id].bet1 = user.bet_amount
      }
      if (cmnd == 'remove') delete state[user.id]
      this.state = JSON.stringify(state)
      await this.save()
    }
    return res
  }

  static async play(game: Blackjack, cmnd: any) {}
  static async botPlay(game: Blackjack) {
    if ([game.p1Id, game.p2Id, game.p3Id, game.p4Id].filter((item) => item != null).length == 0)
      return
    let state
    const now = DateTime.now()
    if (game.action == 'bet') {
      let readyForSpareCards = false
      //check all players bet_done or kick if action1 reminded bet and checkout bigger than 30 seconds
      const p1HasTime =
        (game.p1Checkout1?.plus({ seconds: Helper.BLACKJACK.maxResponseTime })?.diff(now, 'seconds')
          .seconds ?? 0) > 0
      const p2HasTime =
        (game.p2Checkout1?.plus({ seconds: Helper.BLACKJACK.maxResponseTime })?.diff(now, 'seconds')
          .seconds ?? 0) > 0
      const p3HasTime =
        (game.p3Checkout1?.plus({ seconds: Helper.BLACKJACK.maxResponseTime })?.diff(now, 'seconds')
          .seconds ?? 0) > 0
      const p4HasTime =
        (game.p4Checkout1?.plus({ seconds: Helper.BLACKJACK.maxResponseTime })?.diff(now, 'seconds')
          .seconds ?? 0) > 0

      if (game.p1Action1 == 'bet' && !p1HasTime) {
        await game.setUser({ id: game.p1Id }, 'remove')
      }
      if (game.p2Action1 == 'bet' && !p2HasTime) {
        await game.setUser({ id: game.p2Id }, 'remove')
      }
      if (game.p3Action1 == 'bet' && !p3HasTime) {
        await game.setUser({ id: game.p3Id }, 'remove')
      }
      if (game.p4Action1 == 'bet' && !p4HasTime) {
        await game.setUser({ id: game.p4Id }, 'remove')
      }
      if (
        [game.p1Action1, game.p2Action1, game.p3Action1, game.p4Action1].filter((item) =>
          ['bet_done', null].includes(item)
        ).length == 4
      ) {
        readyForSpareCards = true
      }

      if (readyForSpareCards) {
        game.action = 'set_cards'
        await game.save()
      }
    }
    if (game.action == 'set_cards') {
      const cards = shuffle(Helper.BLACKJACK.cards)
      const usedCards = []
      state = JSON.parse(game.state ?? '{}') ?? {}
      let popped1 = cards.pop()
      usedCards.push(popped1)
      let popped2 = null
      state['dealer'] = { cards: [popped1, 'back'], sum: Blackjack.getCardsSums([popped1]) }
      if (game.p1Id) {
        game.p1Action1 = 'decision'
        game.p1Checkout1 = now
        popped1 = 'd1' ?? cards.pop()
        usedCards.push(popped1)
        popped2 = 'g1' ?? cards.pop()
        usedCards.push(popped2)
        state[game.p1Id]['cards1'] = [popped1, popped2]

        state[game.p1Id]['sum1'] = Blackjack.getCardsSums([popped1, popped2])
        const num1 = Blackjack.getCardValue(popped1)
        const num2 = Blackjack.getCardValue(popped2)
        state[game.p1Id]['allowed1'] = ['hit', 'stand']
        if (num1 == num2) {
          state[game.p1Id]['allowed1'].push('split')
        }
        //double:9,10,11
        if ([9, 10, 11].includes(num1 + num2)) {
          state[game.p1Id]['allowed1'].push('double')
        }
        //blackjack: pay u 1.5 bet unless dealer also blackjack
        if (num1 + num2 == 21) {
          game.p1Action1 = 'decision_done'
          state[game.p1Id]['allowed1'] = []
        }
        state[game.p1Id]['sum1'] = [num1 + num2]
        if (num1 == 1 || num2 == 1) {
          state[game.p1Id]['sum1'].push(num1 + num2 + 10)
        }
      }
      if (game.p2Id) {
        game.p2Action1 = 'decision'
        game.p2Checkout1 = now
        popped1 = cards.pop()
        usedCards.push(popped1)
        popped2 = cards.pop()
        usedCards.push(popped2)
        state[game.p2Id]['cards1'] = [popped1, popped2]
        state[game.p2Id]['sum1'] = Blackjack.getCardsSums([popped1, popped2])
        const num1 = Blackjack.getCardValue(popped1)
        const num2 = Blackjack.getCardValue(popped2)
        //double:9,10,11
        state[game.p2Id]['allowed1'] = ['hit', 'stand']
        if (num1 == num2) {
          state[game.p2Id]['allowed1'].push('split')
        }
        if ([9, 10, 11].includes(num1 + num2)) {
          state[game.p2Id]['allowed1'].push('double')
        }
        //blackjack: pay u 1.5 bet unless dealer also blackjack
        if (num1 + num2 == 21) {
          game.p2Action1 = 'decision_done'
          state[game.p2Id]['allowed1'] = []
        }
        state[game.p2Id]['sum1'] = [num1 + num2]
        if (num1 == 1 || num2 == 1) {
          state[game.p2Id]['sum1'].push(num1 + num2 + 10)
        }
      }
      if (game.p3Id) {
        game.p3Action1 = 'decision'
        game.p3Checkout1 = now
        popped1 = cards.pop()
        usedCards.push(popped1)
        popped2 = cards.pop()
        usedCards.push(popped2)
        state[game.p3Id]['cards1'] = [popped1, popped2]
        state[game.p3Id]['sum1'] = Blackjack.getCardsSums([popped1, popped2])
        const num1 = Blackjack.getCardValue(popped1)
        const num2 = Blackjack.getCardValue(popped2)
        //double:9,10,11
        state[game.p3Id]['allowed1'] = ['hit', 'stand']
        if (num1 == num2) {
          state[game.p3Id]['allowed1'].push('split')
        }
        if ([9, 10, 11].includes(num1 + num2)) {
          state[game.p3Id]['allowed1'].push('double')
        }
        //blackjack: pay u 1.5 bet unless dealer also blackjack
        if (num1 + num2 == 21) {
          game.p3Action1 = 'decision_done'
          state[game.p3Id]['allowed1'] = []
        }
        state[game.p3Id]['sum1'] = [num1 + num2]
        if (num1 == 1 || num2 == 1) {
          state[game.p3Id]['sum1'].push(num1 + num2 + 10)
        }
      }
      if (game.p4Id) {
        game.p4Action1 = 'decision'
        game.p4Checkout1 = now
        popped1 = cards.pop()
        usedCards.push(popped1)
        popped2 = cards.pop()
        usedCards.push(popped2)
        state[game.p4Id]['cards1'] = [popped1, popped2]
        state[game.p4Id]['sum1'] = Blackjack.getCardsSums([popped1, popped2])
        const num1 = Blackjack.getCardValue(popped1)
        const num2 = Blackjack.getCardValue(popped2)
        //double:9,10,11
        state[game.p4Id]['allowed1'] = ['hit', 'stand']
        if (num1 == num2) {
          state[game.p4Id]['allowed1'].push('split')
        }
        if ([9, 10, 11].includes(num1 + num2)) {
          state[game.p4Id]['allowed1'].push('double')
        }
        //blackjack: pay u 1.5 bet unless dealer also blackjack
        if (num1 + num2 == 21) {
          game.p4Action1 = 'decision_done'
          state[game.p4Id]['allowed1'] = []
        }
        state[game.p4Id]['sum1'] = [num1 + num2]
        if (num1 == 1 || num2 == 1) {
          state[game.p4Id]['sum1'].push(num1 + num2 + 10)
        }
      }
      state['used_cards'] = usedCards
      game.action = 'user_decision'
      game.state = JSON.stringify(state)
      await game.save()
    }
    if (game.action == 'user_decision') {
      state = JSON.parse(game.state ?? '{}') ?? {}
      //  set decision done if user not decided yet
      if (
        game.p1Id &&
        game.p1Action1 == 'decision' &&
        (game.p1Checkout1?.plus({ seconds: Helper.BLACKJACK.maxResponseTime })?.diff(now, 'seconds')
          .seconds ?? 0) < 0
      ) {
        game.p1Action1 = 'decision_done'
        state[game.p1Id].allowed1 = []
      }

      if (
        [
          game.p1Action1,
          game.p2Action1,
          game.p3Action1,
          game.p4Action1,
          game.p1Action2,
          game.p2Action2,
          game.p3Action2,
          game.p4Action2,
        ].filter((item) => ['decision_done', null].includes(item)).length == 4
      ) {
      }
      game.state = JSON.stringify(state)
      game.action = 'dealer_decision'
      await game.save()
    }
    if (game.action == 'set_cards') {
    }
  }

  static getCardsSums(cards: any = []) {
    let res = []
    let sum1 = 0
    let sum2 = 0
    for (const card of cards) {
      if (card == 'back') continue
      if (['j', 'q', 'k'].includes(card.substring(1))) {
        sum1 += 10
        continue
      }
      const v = Number.parseInt(card.substring(1))
      sum1 += v
      if (v == 1) sum2 = 10
    }
    if (sum2 == 10) sum2 += sum1
    res = [sum1]
    if (sum2 > 0 && sum2 <= 21) res.push(sum2)
    return res
  }
  static getCardValue(card: any) {
    if (!card) return 0
    if (['j', 'q', 'k'].includes(card.substring(1))) return 10
    return Number.parseInt(card.substring(1))
  }
}
