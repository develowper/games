import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { HttpContext } from '@adonisjs/core/http'

export default class Blackjack extends BaseModel {
  static table = 'blackjack'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'p1_id' })
  declare p1Id: number
  @column({ columnName: 'p2_id' })
  declare p2Id: number
  @column({ columnName: 'p3_id' })
  declare p3Id: number
  @column({ columnName: 'p4_id' })
  declare p4Id: number

  @column({ columnName: 'p1_role' })
  declare p1Role: string
  @column({ columnName: 'p2_role' })
  declare p2Role: string
  @column({ columnName: 'p3_role' })
  declare p3Role: string
  @column({ columnName: 'p4_role' })
  declare p4Role: string

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
  @column({ columnName: 'p1_checkout1' })
  declare p1Checkout1: DateTime | null
  @column({ columnName: 'p1_checkout2' })
  declare p1Checkout2: DateTime | null
  @column({ columnName: 'p2_checkout1' })
  declare p2Checkout1: DateTime | null
  @column({ columnName: 'p2_checkout2' })
  declare p2Checkout2: DateTime | null
  @column({ columnName: 'p3_checkout1' })
  declare p3Checkout1: DateTime | null
  @column({ columnName: 'p3_checkout2' })
  declare p3Checkout2: DateTime | null
  @column({ columnName: 'p4_checkout1' })
  declare p4Checkout1: DateTime | null
  @column({ columnName: 'p4_checkout2' })
  declare p4Checkout2: DateTime | null

  @column()
  declare action: string
  @column()
  declare state: string
  @column()
  declare type: string
  @column()
  declare step: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  async findGame({ request, response, i18n }: HttpContext) {}
  public async setUser(user, cmnd = 'add') {
    const now = DateTime.now()
    let res = false
    if (!user) return false
    if (this.p1Id == null) {
      this.p1Id = user.id
      this.p1Role = user.role
      this.p1Checkout1 = now
      this.p1Action1 = null
      this.p1Checkout2 = null
      this.p1Action2 = null
      res = true
    } else if (this.p2Id == null) {
      this.p2Id = user.id
      this.p2Role = user.role
      this.p2Checkout1 = now
      this.p2Action1 = null
      this.p2Checkout2 = null
      this.p2Action2 = null
      res = true
    } else if (this.p3Id == null) {
      this.p3Id = user.id
      this.p3Role = user.role
      this.p3Checkout1 = now
      this.p3Action1 = null
      this.p3Checkout2 = null
      this.p3Action2 = null
      res = true
    } else if (this.p4Id == null) {
      this.p4Id = user.id
      this.p4Role = user.role
      this.p4Checkout1 = now
      this.p4Action1 = null
      this.p4Checkout2 = null
      this.p4Action2 = null
      res = true
    }
    // if (res) await this.save()
    return res
  }
}
