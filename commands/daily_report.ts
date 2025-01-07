import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Helper, { asPrice, getSettings, sleep } from '#services/helper_service'
import { DateTime } from 'luxon'
import Log from '#models/log'
import UserFinancial from '#models/user_financial'
import collect from 'collect.js'
import User from '#models/user'

import Setting from '#models/setting'
import Telegram from '#services/telegram_service'
import app from '@adonisjs/core/services/app'
import Transaction from '#models/transaction'
import db from '@adonisjs/lucid/services/db'

export default class DailyReport extends BaseCommand {
  static commandName = 'report:daily'
  static description = 'daily report telegram and clear database'
  static aliases = ['report']
  static options: CommandOptions = { staysAlive: false, startApp: true, allowUnknownFlags: false }

  static reportTime = DateTime.fromObject({ hour: 16, minute: 0 }, { zone: 'Asia/Tehran' })
  async run() {
    const now = DateTime.now().setZone('Asia/Tehran')
    if (now.hour !== DailyReport.reportTime.hour || now.minute !== DailyReport.reportTime.minute) {
      process.exit()
      return
    }

    const clearPeriodDay = (await getSettings('clear_period_day')) ?? 0

    let ufsLen = 0
    let logsLen = 0
    let transLen = 0
    let msg = ''
    const options: any = {
      calendar: 'persian',
      numberingSystem: 'arab',
      dateStyle: 'full',
      timeStyle: 'short',
    }

    const time = Intl.DateTimeFormat('fa-IR', options).format(DateTime.now().toJSDate())
    msg += `    💎${process.env.APP_NAME}💎    \n${time}\n`
    msg += '\u200F➖➖➖➖➖➖➖➖➖➖➖\n'

    //clear
    if (clearPeriodDay > 0) {
      const logs = await Log.query().where(
        'created_at',
        '<',
        now.minus({ days: clearPeriodDay }).toJSDate()
      )
      logsLen = logs.length
      logs?.forEach((item: Log) => item.delete())

      const trans = await Transaction.query()
        .where('type', 'charge')
        .whereNull('payed_at')
        .where('created_at', '<', now.minus({ hours: 1 }).toJSDate())
      transLen = trans.length
      trans?.forEach((item: Transaction) => item.delete())

      const ufs = await UserFinancial.query()
        .whereNotIn(
          'user_id',
          collect((await User.findBy('role', 'bo')) ?? [])
            .pluck('id')
            .toArray()
        )
        .where('balance', '<', 5000)
        .where('last_charge', '<', now.minus({ days: clearPeriodDay }).toJSDate())
      ufsLen = ufs.length
      ufs?.forEach((item: UserFinancial) => User.deleteAllInfo(item))
    }

    msg += '♻️ دوره پاکسازی: ' + clearPeriodDay + ' روز ' + '\n'
    msg += '🚹 کاربران پاک شده: ' + ufsLen + '\n'
    msg += '🛄 گزارشات پاک شده: ' + logsLen + '\n'
    msg += '🚮 تراکنش های پاک شده: ' + transLen + '\n'
    msg += '\u200F➖➖➖➖➖➖➖➖➖➖➖\n'

    const uc = await User.query()
      .where('created_at', '>', now.minus({ hours: 24 }).toJSDate())
      .count('* as total')
    const logsToday = await Log.query().where(
      'created_at',
      '>',
      now.minus({ hours: 24 }).toJSDate()
    )

    msg += '                📊 آمار امروز' + '\n'
    msg += '👤 کاربران جدید: ' + (uc[0]?.$extras.total ?? 0) + '\n'
    msg += '         〰️〰️کارت ها〰️〰️' + '\n'

    msg += logsToday
      .map((item: Log) => {
        let tmp = ''
        tmp += ' 🎴نوع: ' + item.type + '\n'
        tmp += ' 🔵بازی: ' + item.gameCount + '\n'
        tmp += ' 🟣کارت: ' + item.cardCount + '\n'
        tmp += ' 🟢سود: ' + asPrice(item.profit ?? 0) + '\n'
        tmp += '\u200F➖➖➖➖➖➖➖➖➖➖➖'
        return tmp
      })
      .join('\n')

    const emojis = ['💖', '💜', '💙']
    const types = Helper.ROOMS.map((item) => item.type.slice(1))
    for (let type of types) {
      let i = 0
      const users = await db
        .from('users')
        .limit(Helper.TOP_USERS_COUNT)
        .select('username', `today_card_${type}_count as cardCount`)
        .where(`today_card_${type}_count`, '>', 0)
        .orderBy(`today_card_${type}_count`, 'desc')
      msg += `➖➖🃏اتاق ${type}🃏➖➖` + '\n'
      for (const user of users) {
        const emoji = emojis[i]
        i++
        msg += `${emoji} کاربر ${user.username} با ${user.cardCount} کارت` + '\n'
      }
    }
    const zeroTodayData = types.reduce((acc: any, type) => {
      acc[`today_card_${type}_count`] = 0
      return acc
    }, {})
    await User.query().update(zeroTodayData)
    // try {
    await Telegram.sendMessage(`${Helper.TELEGRAM_LOGS[0]}`, msg)
    await sleep(1000)
    await Telegram.sendMessage(`${Helper.TELEGRAM_LOGS[1]}`, msg)
    // } catch (e: any) {
    //   console.log(e)
    // }
    process.exit()
  }
}
