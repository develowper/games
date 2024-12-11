import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
import collect from 'collect.js'
import { HttpContext } from '@adonisjs/core/http'
import { json } from 'stream/consumers'
import Helper from '../services/helper_service.js'
import { parse } from 'path'

// import { HttpContext } from '@adonisjs/http-server/build/standalone'
// @inject()
export default class Room extends BaseModel {
  private auth: any
  constructor() {
    super()
    this.auth = HttpContext.get()?.auth
  }
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: string

  @column()
  declare title: string

  @column()
  declare image: string

  @column({
    serialize: (value: string) => JSON.parse(value) ?? [],
    // consume: (value: any) => JSON.stringify(value)
  })
  declare players: any

  @column()
  declare starterId: number

  @column()
  declare cardPrice: number
  @column()
  declare clearCount: number
  @column()
  declare playerCount: number
  @column()
  declare maxCardsCount: number
  @column()
  declare maxUserCardsCount: number
  @column()
  declare cardCount: number
  @column()
  declare winScore: number
  @column()
  declare rwp: number
  @column()
  @column()
  declare commissionPercent: number
  @column()
  declare winPercent: number
  @column({ serializeAs: 'row_win_percent' })
  declare rowWinPercent: number
  @column({
    serialize: (value: any) => value == 1,
  })
  declare isActive: boolean

  @column()
  declare maxSeconds: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare startAt: DateTime | null

  @computed()
  public get startWithMe() {
    const user = this.auth?.user
    return this.starterId == user?.id
  }
  @computed()
  public get secondsRemaining() {
    if (!this.startAt) {
      return this.maxSeconds
    }

    const now = DateTime.now()
    const diffInSeconds = Math.round(this.startAt.diff(now, 'seconds').seconds)
    return diffInSeconds >= 0 ? diffInSeconds : this.maxSeconds
  }

  @computed()
  public get userCardCount() {
    return this.getUserCardCount()
  }

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public getUserCardCount() {
    const user = this.auth?.user
    const result: any = collect(JSON.parse(this.players) ?? []).first(
      (item: any) => item.user_id == user?.id
    )

    return result?.card_count ?? 0
  }
  public setUserCardsCount(count: number) {
    const user = this.auth?.user
    let res: any[] = []
    const parsed: any = JSON.parse(this.players) ?? []
    const beforeExists = collect(parsed).first((item: any) => item.user_id == user.id)

    if (!beforeExists) {
      parsed.push({
        user_id: user.id,
        username: user.username,
        user_role: user.role,
        card_count: count,
      })
      res = parsed
      if (parsed.length > 0) this.starterId = user.id
    } else {
      res = collect(parsed)
        .map((item: any) => {
          if (item.user_id == user.id) item.card_count = count
          return item
        })
        .toArray()
    }
    this.players = JSON.stringify(res)

    return true
  }
}
