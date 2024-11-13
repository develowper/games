import {DateTime} from 'luxon'
import hash from '@adonisjs/core/services/hash'
import {compose} from '@adonisjs/core/helpers'
import {BaseModel, column, hasMany} from '@adonisjs/lucid/orm'
import {withAuthFinder} from '@adonisjs/auth/mixins/lucid'
import Post from '#models/post'
import type {HasMany} from '@adonisjs/lucid/types/relations'
import {DbAccessTokensProvider} from "@adonisjs/auth/access_tokens";

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['phone'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @column({isPrimary: true})
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({serializeAs: null})
  declare password: string

  @column.dateTime({autoCreate: true})
  declare createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  declare updatedAt: DateTime | null


  static accessTokens = DbAccessTokensProvider.forModel(User)
}
