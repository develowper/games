import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import UserFinancial from '#models/user_financial'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import AgencyFinancial from '#models/agency_financial'

export default class Agency extends BaseModel {
  @hasOne(() => AgencyFinancial)
  declare financial: HasOne<typeof AgencyFinancial>
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  @column()
  declare parentId: number | null
  @column()
  declare level: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
