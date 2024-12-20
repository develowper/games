import Telegram from '#services/telegram_service'
import TelegramEvent from '#events/telegram_event'

export default class TelegramEventListener {
  handle(e: TelegramEvent) {
    Telegram.logEvent(e.to, e.type, e.data)
  }
}
