import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AgencyFinancial extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare agencyId: number

  @column()
  declare balance: number

  @column()
  declare card: number

  @column()
  declare sheba: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare lastCharge: DateTime | null
}
