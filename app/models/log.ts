import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cardCount: number

  @column()
  declare gameCount: number

  @column()
  declare profit: number

  @column()
  declare type: string

  @column()
  declare date: Date

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async add(
    type: string,
    cardCount: number,
    gameCount: number,
    commissionPrice: number,
    date: any
  ) {
    console.log('add log game ', gameCount)
    if (!gameCount) return
    const log = await Log.firstOrNew({ date: date, type: type })
    log.cardCount = (log.cardCount ?? 0) + cardCount
    log.gameCount = (log.gameCount ?? 0) + gameCount
    log.profit = (log.profit ?? 0) + commissionPrice
    log.save()
  }
}
