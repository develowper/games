import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import collect from 'collect.js'

export default class Referral extends BaseModel {
  @column()
  declare inviterId: number
  @column()
  declare invitedId: number
  @column()
  declare type: string

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async add(invitedId: any, inviterId: any) {
    if (invitedId && inviterId && inviterId != invitedId) {
      const users = collect(await User.query().whereIn('telegram_id', [invitedId, inviterId]))
      //inviter exists and invited not registered
      if (users.firstWhere('telegramId', inviterId) && !users.firstWhere('telegramId', invitedId))
        await Referral.firstOrCreate({ invitedId }, { invitedId, inviterId, type: 'tg' })
    }
  }
}
