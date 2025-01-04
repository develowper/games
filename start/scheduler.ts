import scheduler from 'adonisjs-scheduler/services/main'
import Helper, { asPrice, getSettings, sleep } from '#services/helper_service'
import { DateTime } from 'luxon'
// scheduler.command("inspire").everyFiveSeconds();
import app from '@adonisjs/core/services/app'
import emitter from '@adonisjs/core/services/emitter'
// import MySocket from '@ioc:MySocket'
import Log from '#models/log'
import UserFinancial from '#models/user_financial'
import User from '#models/user'
import Telegram from '#services/telegram_service'
import collect from 'collect.js'

scheduler
  .call(async () => {
    await Telegram.sendMessage(`${Helper.TELEGRAM_LOGS[0]}`, 'hi')
  })
  .everyMinute()

// app.ready(async () => {
//   const mySocket = await app.container.make('MySocket')
//   // console.log(mserver.getNodeServer())

scheduler
  .call(async () => {
    const clearPeriodDay = (await getSettings('clear_period_day')) ?? 0

    const now = DateTime.now()
    let ufsLen = 0
    let logsLen = 0
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
    try {
      await Telegram.sendMessage(`${Helper.TELEGRAM_LOGS[0]}`, msg)
      // await sleep(1000)
      // await Telegram.sendMessage(`${Helper.TELEGRAM_LOGS[1]}`, msg)
    } catch (e: any) {
      console.log(e)
    }
  })
  //
  .timezone('ASIA/TEHRAN')
  // .daily()
  .cron('59 12 * * *') // Runs daily at 8:25
// })
