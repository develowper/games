import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { __, inertiaError, log } from '#services/helper_service'
import { HttpContext } from '@adonisjs/core/http'
import session from '#config/session'
import { Exception, RuntimeException } from '@adonisjs/core/exceptions'
import { E_UNAUTHORIZED_ACCESS } from '@adonisjs/auth/build/src/errors.js'

import vine, { SimpleErrorReporter } from '@vinejs/vine'
import { throws } from 'node:assert'
const af = {
  options: {
    uids: ['username'],
    passwordColumnName: 'password',
  },
  hash: () => hash.use('scrypt'),
}

const AuthFinder = withAuthFinder(af.hash, af.options)

export default class Admin extends compose(BaseModel, AuthFinder) {
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(Admin)

  public static async findForAuth(identifier: any, value: any) {
    // Define dynamic fields to search for the identifier

    const field = /^\d+$/.test(value) ? 'phone' : 'username'
    const admin = await Admin.query().where(field, value).first()

    let err
    if (!admin) {
      err = [
        {
          field: 'username',
          message: __('not_found_*', { item: __('user') }),
        },
      ]
      inertiaError(err)
    }
    if (!admin.isActive) {
      err = [
        {
          field: 'username',
          message: __('is_inactive_*', { item: __('user') }),
        },
      ]
      inertiaError(err)
    }

    return admin as Admin
  }
  static async verifyCredentials(uid, password) {
    const field = /^\d+$/.test(uid) ? 'phone' : 'username'
    let errNotFound = [{ field: 'username', message: __('not_found_*', { item: __('user') }) }]
    let errIncorrect = [
      {
        field: 'username',
        message: __('is_incorrect_*', { item: `${__('username')}/${__('password')}` }),
      },
    ]

    if (!uid || !password) {
      inertiaError(errNotFound)
    }
    const user = await this.findForAuth(af.options.uids, uid)

    if (!user) {
      await af.hash().make(password)
      inertiaError(errNotFound)
    }
    const passwordHash = user[af.options.passwordColumnName]

    if (!passwordHash) {
      throw new RuntimeException(
        `Cannot verify password during login. The value of column "${af.options.passwordColumnName}" is undefined or null`
      )
    }

    if (await af.hash().verify(passwordHash, password)) {
      return user
    }
    inertiaError(errIncorrect)
  }
  public score

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare isActive: boolean
  @column()
  declare agencyId: number
  @column()
  declare telegramId: string
  @column()
  declare agencyLevel: number
  @column()
  declare fullName: string
  @column()
  declare username: string
  @column()
  declare phone: string
  @column()
  declare role: string
  @column()
  declare access: object
  @column()
  declare storage: any
  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(Admin, {
    table: 'auth_admin_access_tokens',
  })

  public getAccesses() {
    if (this.role === 'go' || (this.agencyId === 1 && ['owner'].includes(this.role))) {
      return 'all'
    }

    if (['ow', 'ad'].includes(this.role)) {
      return [
        'view_agency',
        'view_admin',
        'view_repository',
        'view_shipping',
        'view_shipping-method',
        'view_finantial',
        'edit_role',
        'view_variation',
        this.agencyLevel < 3 ? 'create_repository_order' : '',
        this.agencyLevel <= 3 ? 'create_variation' : '',
        this.agencyLevel <= 3 ? 'create_sample' : '',
        this.agencyLevel < 3 ? 'view_agency_order' : '',
        'view_user_order',
        'create_shipping',
        'create_order',
      ].filter((permission) => permission !== '') // Remove empty strings
    }

    return this.access
  }
}
