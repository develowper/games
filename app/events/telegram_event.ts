import { BaseEvent } from '@adonisjs/core/events'

export default class TelegramEvent extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  public to
  public type
  public data

  constructor(to: any, type: string, data: any) {
    super()
    this.to = to
    this.type = type
    this.data = data
  }
}
