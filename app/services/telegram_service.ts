import { DateTime } from 'luxon'
import env from '#start/env'
import axios from 'axios'
import User from '../models/user.js'
import Admin from '../models/admin.js'
import Helper from '#services/helper_service'
import { HttpContext } from '@adonisjs/core/http'

export default class Telegram {
  ///
  public static TOPIC_LOGS: any = null /*'LOGS'*/
  public static TOPIC_TRANSACTIONS: any = null /*'TRANSACTIONS'*/
  public static TOPIC_BUGS: any = 'BUGS'
  public static topic: any = null

  public static async log(to: any, type: string, data: any) {
    const ctx = HttpContext.get()
    const op = ctx?.auth?.user
    const isAdmin = op instanceof Admin
    try {
      let us: User | null = null

      if (data instanceof User) {
        us = data
      } else if (data.user_id) {
        us = await User.find(data.user_id)
      } else if (data.user) {
        us = data.user
      } else {
        us = await User.firstOrNew({})
      }
      const options: any = {
        calendar: 'persian',
        numberingSystem: 'arab',
        dateStyle: 'full',
        timeStyle: 'short',
      }

      const time = Intl.DateTimeFormat('fa-IR', options).format(DateTime.now().toJSDate())
      // const now = DateTime.now().setZone('Asia/Tehran')
      // const time = now.toFormat('EEEE, dd MMMM yyyy ⏰ HH:mm')
      let msg = `\uD89C${process.env.APP_NAME}\n${time}\n`
      msg += '\uD89C➖➖➖➖➖➖➖➖➖➖➖\n'

      const isCreate = type.includes('created')
      const isEdit = type.includes('edited')
      const isRemove = type.includes('remove')
      this.topic = Telegram.TOPIC_LOGS

      switch (type) {
        case 'user_created':
        case 'user_edited':
        case 'user_removed':
          if (isCreate)
            msg += `🟧\n ${isAdmin ? `ادمین *${op.username}* یک کاربر ساخت ` : 'یک کاربر ساخته شد'}\n`
          if (isEdit)
            msg += `🟧\n ${isAdmin ? `ادمین *${op.username}* یک کاربر را ویرایش کرد ` : 'یک کاربر ویرایش شد'}\n`
          if (isRemove)
            msg += `🟥\n ${isAdmin ? `ادمین *${op.username}* یک کاربر را حذف کرد ` : 'یک کاربر حذف شد'}\n`

          msg += `شناسه: ${data.id}\n`
          msg += `👤 ${data.fullName ?? '-'}\n`
          msg += `👤 ${data.username ?? '-'}\n`
          msg += `📱 ${data.phone ?? '-'}\n`
          msg += `💳 ${data.financial?.card ?? '-'}\n`

          break

        case 'transaction_created':
          this.topic = Telegram.TOPIC_TRANSACTIONS

          if (data.amount > 0) msg += '🟢🟢🟢🛒 یک تراکنش انجام شد\n'
          else msg += '🟠🟠🟠🛒 یک پلن خریداری شد\n'
          msg += `🆔 شناسه کاربر: ${us?.id ?? '-'}\n`
          msg += `👤 نام\n${us?.fullName ?? '-'}\n`
          msg += `📱 شماره تماس\n${us?.phone ?? '-'}\n`
          msg += `⭐ نوع\n${data.title ?? '-'}\n`
          msg += `📊 مقدار\n${data.amount ?? '-'}\n`
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
          this.topic = Telegram.TOPIC_BUGS
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
        await this.logAdmins(msg, null, this.topic)
        return msg
      }
    } catch (e) {
      try {
        await this.logAdmins(
          JSON.stringify([e.message, e.lineNumber, e.fileName]),
          null,
          this.topic
        )
        return e.message
      } catch (innerError) {
        console.log('**********error***************')
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
    // return
    // if (!['.com', '.ir'].some((domain) => env.get('APP_URL')?.includes(domain))) return
    const url = 'https://qr-image-creator.com/wallpapers/api/daberna_telegram'
    datas['cmnd'] = method

    try {
      const res = await axios.post(url, datas, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      // console.log('**********res**********')
      // console.log(res)

      if (res.status !== 200) {
        await this.sendMessage(Helper.TELEGRAM_LOGS[0], `${res.data}\n${JSON.stringify(datas)}`)
      }
      return res.data
    } catch (error) {
      console.log(error)
      await this.sendMessage(Helper.TELEGRAM_LOGS[0], `${error.message}\n${JSON.stringify(datas)}`)
      return null
    }
  }

  public static async logAdmins(msg: string, mode: any = null, topic: any = this.TOPIC_LOGS) {
    let res: any = null
    for (let i = 0; i < Helper.TELEGRAM_LOGS.length; i++) {
      const log = Helper.TELEGRAM_LOGS[i]
      res = await this.sendMessage(log, msg, mode, null, null, false, topic)
    }
    return res
  }
}
