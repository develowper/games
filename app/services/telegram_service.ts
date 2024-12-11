import { DateTime } from 'luxon'
import jalaali from 'jalaali-js'
import Helper from '#services/helper_service'
import env from '#start/env'
import axios from 'axios'
import User from '../models/user.js'
import Admin from '../models/admin.js'

export default class Telegram {
  public static async log(to: string, type: string, data: any) {
    try {
      let us: User | null = null

      if (data instanceof User) {
        us = data
      } else if (data.owner_id) {
        us = await User.find(data.owner_id)
      } else if (data.user_id) {
        us = await User.find(data.user_id)
      } else if (data.user) {
        us = data.user
      } else {
        us = await User.firstOrNew({})
      }

      const user = await User.firstOrNew({})
      const admin = user instanceof Admin
      const now = DateTime.now().setZone('Asia/Tehran')
      const time = now.toFormat('EEEE, dd MMMM yyyy ⏰ HH:mm')
      let msg = `\uD89C${process.env.APP_NAME}\n${time}\n`
      msg += '\uD89C➖➖➖➖➖➖➖➖➖➖➖\n'

      const isCreate = type.includes('created')
      const isEdit = type.includes('edited')
      let topic = 'TOPIC_LOGS'

      switch (type) {
        case 'user_created':
          msg += 'یک کاربر ساخته شد\n'
          msg += `مارکت: ${data.market}\n`
          msg += `شناسه: ${data.id}\n`
          msg += `👤 ${data.fullname}\n`
          msg += `👤 ${data.username}\n`
          msg += `📱 ${data.phone}\n`
          msg += `📧 ${data.email}\n`
          break

        case 'transaction_created':
          topic = 'TOPIC_TRANSACTION'

          if (data.amount > 0) msg += '🟢🟢🟢🛒 یک تراکنش انجام شد\n'
          else msg += '🟠🟠🟠🛒 یک پلن خریداری شد\n'
          msg += `🆔 شناسه کاربر: ${us?.id}\n`
          msg += `👤 نام\n${us?.fullname}\n`
          msg += `📱 شماره تماس\n${us?.phone}\n`
          msg += `⭐ نوع\n${data.title}\n`
          msg += `📊 مقدار\n${data.amount.toLocaleString()}\n`
          break

        case 'setting_created':
        case 'setting_updated':
        case 'setting_deleted':
          if (type === 'setting_created') msg += '🟢 یک تنظیمات ساخته شد\n'
          if (type === 'setting_updated') msg += '🟠 یک تنظیمات ویرایش شد\n'
          if (type === 'setting_deleted') msg += '🔴 یک تنظیمات حذف شد\n'
          msg += `*️⃣ ${data.key}\n`
          msg += `#️⃣ ${data.value}\n`
          break

        case 'user_edited':
          msg += `🟧 ${admin ? `ادمین *${admin}* یک کاربر را ویرایش کرد` : 'یک کاربر ویرایش شد'}\n`
          msg += `👤 نام: \n${data.fullname}\n`
          msg += `📧 ایمیل: \n${data.email}\n`
          msg += `📱 شماره تماس\n${data.phone}\n`
          msg += `💰 کیف پول\n${data.wallet}\n`
          msg += `💳 شماره کارت\n${data.card}\n`
          msg += `🚧 دسترسی\n${data.access?.join(',')}\n`
          break

        case 'message_created':
          if (data.type === 'order') msg += '🟩🟩🟩 یک سفارش ثبت شد\n'
          else if (data.type === 'referral') msg += '🟦🟦🟦 یک درخواست بازاریابی ثبت شد\n'
          else msg += '🟪🟪🟪 یک پیام ثبت شد\n'
          msg += `🆔 شناسه پیام: ${data.id || '_'}\n`
          msg += `👤 نام\n${data.fullname}\n`
          msg += `📱 شماره تماس\n${data.phone}\n`
          msg += `📃 پیام\n${data.description}\n`
          break

        case 'error':
          topic = 'TOPIC_BUGS'
          msg = `📛 خطای سیستم\n${data}`
          break

        default:
          msg += `${type}\n`
          if (typeof data !== 'object' || data instanceof User) {
            msg += JSON.stringify(data, null, 2)
          } else {
            msg += JSON.stringify(data.toJSON(), null, 2)
          }
          break
      }

      msg += '\n🅿🅰🆁🅸🆂'
      if (to) {
        // Use your message sending logic
        await this.sendMessage(to, msg)
      } else {
        // Log to admins or fallback logic
        await this.logAdmins(msg, topic)
        return msg
      }
    } catch (e) {
      try {
        await this.logAdmins(
          JSON.stringify([e.message, e.lineNumber, e.fileName], null, 2),
          'TOPIC_BUGS'
        )
        return e.message
      } catch (innerError) {
        console.error(innerError)
      }
    }
  }

  public static async sendMessage(
    chat_id: string,
    text: string,
    mode: string | null = null,
    reply: string | null = null,
    keyboard: any | null = null,
    disable_notification: boolean = false,
    topic: string | null = null
  ) {
    return this.creator('sendMessage', {
      chat_id: chat_id,
      text: text,
      parse_mode: mode,
      reply_to_message_id: reply,
      reply_markup: keyboard,
      disable_notification: disable_notification,
      message_thread_id: topic,
    })
  }

  public static async creator(method: string, datas: any = {}) {
    return
    if (!['.com', '.ir'].some((domain) => env.get('APP_URL')?.includes(domain))) return

    const url = 'https://2sport.ir/api/dabelchin_telegram'
    datas['cmnd'] = method

    try {
      const res = await axios.post(url, datas, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      if (res.status !== 200) {
        await this.sendMessage(
          Helper.TELEGRAM_LOGS[0],
          `${res.data}\n${JSON.stringify(datas, null, 2)}`
        )
      }
      return res.data
    } catch (error) {
      await this.sendMessage(
        Helper.TELEGRAM_LOGS[0],
        `${error.message}\n${JSON.stringify(datas, null, 2)}`
      )
      return null
    }
  }

  public static async logAdmins(msg: string, mode: any = null, topic: string = 'TOPIC_LOGS') {
    let res: any = null
    for (const log of [Helper.TELEGRAM_LOGS]) {
      res = await this.sendMessage(log, msg, mode, null, null, false, topic)
    }
    return res
  }
}
