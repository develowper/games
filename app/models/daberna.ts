import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import Helper from '#services/helper_service'
import Room from '#models/room'
import AgencyFinancial from '#models/agency_financial'
import Transaction from '#models/transaction'
import User from '#models/user'

export default class Daberna extends BaseModel {
  static table = 'daberna'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: string
  @column({
    serialize: (value: string) => JSON.parse(value) ?? [],
    // consume: (value: any) => JSON.stringify(value)
  })
  declare boards: any[]

  @column({
    serialize: (value: string) => JSON.parse(value) ?? [],
    // consume: (value: any) => JSON.stringify(value)
  })
  declare numbers: number[]

  @column({
    serialize: (value: string) => JSON.parse(value) ?? [],
    // consume: (value: any) => JSON.stringify(value)
  })
  declare winners: number
  @column({
    // serializeAs: 'row_winners',
    serialize: (value: string) => JSON.parse(value) ?? [],
  })
  declare rowWinners: number

  @column()
  declare cardCount: number
  @column()
  declare playerCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public static makeCard() {
    const info = Helper.DABERNA
    const numbers: number[] = Helper.shuffle(Helper.range(info.min, info.max))

    const card: number[][] = new Array(info.row).fill(0).map(() => new Array(info.col).fill(0))

    for (let i = 0; i < card.length; i++) {
      const shuffledFillIndex = Helper.shuffle(Helper.range(0, info.col - 1))

      let picked: number
      for (let j = 0; j < info.fillInRow; j++) {
        // console.log(`******info.fillInRow ${j}************`)
        const index = shuffledFillIndex.pop()
        // console.log(`**********shuffledFillIndex ${k}**${index}********`)
        // console.log(index)
        for (let z = 0; z < numbers.length; z++) {
          if (
            (numbers[z] >= 10 * index && numbers[z] < 10 * (index + 1)) ||
            (index == info.col - 1 && numbers[z] == info.col * 10)
          ) {
            // console.log(`${numbers[z]} >= ${(10 * (index + 1))} & ${numbers[z]} < ${(10 * (index + 2))}`)
            picked = numbers.splice(z, 1)[0]
            card[i][index as number] = picked as number

            // console.log(picked)
            break
          }
        }
      }
    }
    return card
  }

  public static async makeGame(room: Room) {
    const players = JSON.parse(room.players ?? '[]')
    if (players?.length < 2) {
      return null
    }
    const info = Helper.DABERNA
    const numbers: number[] = Helper.shuffle(Helper.range(info.min, info.max))

    const boards = []
    // for (let i = 0; i < 10000; i++) {
    //   players.push({
    //     user_id: 1,
    //     username: `test${i}`,
    //     user_role: 'us',
    //     card: Daberna.makeCard(),
    //   })
    // }
    let idx = 1
    //make cards

    players.forEach((player) => {
      Array(player.card_count)
        .fill(0)
        .forEach((i) => {
          boards.push({
            card_number: idx++,
            level: i,
            user_id: player.user_id,
            username: player.username,
            user_role: player.user_role,
            card: Daberna.makeCard(),
          })
        })
    })

    const rw =
      boards.some((item) => item.user_role === 'ro') && Math.floor(Math.random() * 101) <= room.rwp

    let winners: any[] = []
    let rowWinners: any[] = []
    const playedNumbers: number[] = []
    let playedBoards: number[] = JSON.parse(JSON.stringify(boards))
    let level = 0

    while (winners.length === 0) {
      level++
      const playNumber = numbers.pop()
      playedNumbers.push(playNumber)

      const {
        tmpWinners: tmpWinners,
        tmpRowWinners: tmpRowWinners,
        boards: tmpBoards,
      } = Daberna.play(playedBoards, playNumber)
      // return { playNumber, playedBoards, tmpBoards }
      //if rw and winners are us =>  undo played number

      const rowWinnerPolicy: boolean =
        rowWinners.length === 0 &&
        tmpRowWinners.length > 0 &&
        tmpRowWinners.every((item) => item.user_role === 'us')
      const winnerPolicy: boolean =
        tmpWinners.length > 0 && tmpWinners.every((item) => item.user_role === 'us')

      if (rw && (rowWinnerPolicy || winnerPolicy)) {
        //undo
        numbers.push(playedNumbers.pop())

        continue
      }
      if (rowWinners.length === 0 && tmpRowWinners.length > 0) {
        rowWinners = JSON.parse(JSON.stringify(tmpRowWinners))
        rowWinners.forEach((item) => (item.level = level))
      }
      if (tmpWinners.length > 0) {
        winners = JSON.parse(JSON.stringify(tmpWinners))
        winners.forEach((item) => (item.level = level))
      }
      playedBoards = tmpBoards
    }
    const totalMoney = room.cardCount * room.cardPrice
    const commissionPrice = Math.floor((totalMoney * room.commissionPercent) / 100)
    const rowWinnerPrize = Math.floor((totalMoney * room.rowWinPercent) / (100 * rowWinners.length))
    const winnerPrize = Math.floor((totalMoney - commissionPrice - rowWinnerPrize) / winners.length)

    const game = await Daberna.create({
      type: room.type,
      boards: JSON.stringify(boards),
      numbers: JSON.stringify(playedNumbers),
      winners: JSON.stringify(
        winners.map((i) => {
          i.prize = winnerPrize
          return i
        })
      ),
      rowWinners: JSON.stringify(
        rowWinners.map((i) => {
          i.prize = rowWinnerPrize
          return i
        })
      ),
      playerCount: room.playerCount,
      cardCount: room.cardCount,
    })

    const af = await AgencyFinancial.find(1)
    af.balance += commissionPrice
    af.save()
    Transaction.add(
      'commission',
      'daberna',
      game.id,
      'agency',
      af.agencyId,
      commissionPrice,
      af.agencyId
    )

    rowWinners.forEach(async (w) => {
      const user = await User.query().preload('financial').where('id', w.user_id).first()
      const financial = user.financial
      user.rowWinCount++
      user.prize += rowWinnerPrize
      user.todayPrize += rowWinnerPrize
      financial.balance += rowWinnerPrize
      user.save()
      financial.save()
      Transaction.add(
        'row_win',
        'daberna',
        game.id,
        'user',
        user.id,
        rowWinnerPrize,
        user?.agencyId
      )
    })
    winners.forEach(async (w) => {
      const user = await User.query().preload('financial').where('id', w.user_id).first()
      const financial = user.financial
      user.winCount++
      user.prize += winnerPrize
      user.score += room.winScore
      user.todayPrize += winnerPrize
      financial.balance += winnerPrize
      user.save()
      financial.save()
      Transaction.add('win', 'daberna', game.id, 'user', user.id, winnerPrize, user?.agencyId)
    })

    room.clearCount++
    room.playerCount = 0
    room.cardCount = 0
    room.players = null
    room.startAt = null
    room.save()
    return game
  }

  public static play(mainBoards: any[], number: number) {
    let boards = mainBoards

    for (const board of boards) {
      for (let j = 0; j < board.card.length; j++) {
        for (let k = 0; k < board.card[j].length; k++) {
          if (number === board.card[j][k]) {
            board.card[j][k] = 0
          }
        }
      }
    }

    const tmpWinners = boards.filter((board) => this.isEmpty(board.card))
    const tmpRowWinners = boards.filter((board) => this.isEmptyRow(board.card))

    return { tmpWinners, tmpRowWinners, boards }
  }
  static isEmptyRow(card: number[][]): boolean {
    return card.some((rows) => rows.every((col) => col === 0))
  }
  static isEmpty(card: number[][]): boolean {
    return card.every((rows) => rows.every((col) => col === 0))
  }
}
