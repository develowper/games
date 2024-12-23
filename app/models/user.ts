import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne, computed } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Post from '#models/post'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import UserFinancial from './user_financial.js'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import Helper from '#services/helper_service'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  public serializeExtras = true

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasOne(() => UserFinancial)
  declare financial: HasOne<typeof UserFinancial>
  public financialInfo?: UserFinancial

  public async getUserFinancial() {
    return (await UserFinancial.findBy('user_id', this.id))?.serialize()
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare inviterId: number

  @column()
  declare agencyId: number

  @column()
  declare agencyLevel: number

  @column()
  declare access: object

  @column()
  declare fullName: string | null

  @column()
  declare telegramId: string

  @column()
  declare role: string

  @column()
  declare phone: string
  @column()
  declare username: string
  @column()
  declare rank: string
  @column()
  declare playCount: string
  @column()
  declare winCount: string
  @column()
  declare rowWinCount: string
  @column()
  declare prize: number
  @column()
  declare score: number
  @column()
  declare refId: number
  @column({ serialize: (value) => Boolean(value) })
  declare isActive: boolean
  @column()
  declare todayPrize: number
  @column({ columnName: 'card_5000_count' })
  declare card5000Count: number
  @column({ columnName: 'today_card_5000_count' })
  declare todayCard5000Count: number
  @column({ columnName: 'card_10000_count' })
  declare card10000Count: number
  @column({ columnName: 'today_card_10000_count' })
  declare todayCard10000Count: number
  @column({ columnName: 'card_20000_count' })
  declare card20000Count: number
  @column({ columnName: 'today_card_20000_count' })
  declare todayCard20000Count: number
  @column({ columnName: 'card_50000_count' })
  declare card50000Count: number
  @column({ columnName: 'today_card_50000_count' })
  declare todayCard50000Count: number
  @column()
  declare storage: any

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare lastCharge: DateTime | null
  @column.dateTime()
  declare lastWin: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  public getAccesses() {
    return []
  }

  static async makeRefCode(phone: any = null) {
    const original = [...Array(10).keys()].join('') // Generate a string "0123456789"

    let ref = Helper.randomString(5, original)

    for (let i = 6; i <= 15; i++) {
      const exists = await User.query().where('ref_id', ref).first()
      if (exists) {
        ref = Helper.randomString(i, original)
      } else {
        break
      }
    }

    return ref
  }
}
