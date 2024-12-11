// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import { cardToCardValidator, chargeValidator, winWheelValidator, withdrawValidator } from '#validators/transaction'
import Transaction from '#models/transaction'
import Helper from '#services/helper_service'
import { DateTime } from 'luxon'
import User from '#models/user'
import Admin from '#models/admin'
import Telegram from '#services/telegram_service'
import Setting from '../../models/setting.js'
import UserFinancial from '../../models/user_financial.js'
import collect from 'collect.js'
import AgencyFinancial from '../../models/agency_financial.js'
export default class TransactionsController {
  //
  async create({ request, response, auth, i18n }: HttpContext) {



    const amount = request.input('amount')
    const type = request.input('type')
    const fromType = request.input('from_type')
    const user = auth.user
    const appVersion = request.input('app_version')
    const fromId = user?.id
    const orderId = Date.now()
    const fromCard = request.input('card')
    const toCard = request.input('to_card')
    const now = DateTime.now()
    let desc
    switch (type) {
      case 'charge':
        await request.validateUsing(chargeValidator)
        const gapChargeMinutes = Helper.CARDTOCARD_MINUTE_LIMIT
        const lastChargeTransaction = await Transaction.query().where('type', type).where('created_at', '>', DateTime.now().minus({ minutes: gapChargeMinutes }).toJSDate()).first()

        if (lastChargeTransaction) {
          return response.status(Helper.ERROR_STATUS).json({ status: 'danger', message: Helper.t('gap_requests_is_*', { item: `${gapChargeMinutes} ${Helper.t('minute')}` }) })
        }

        desc = Helper.t('wallet_charge_*_by_*', { item1: `${Helper.asPrice(`${amount}`)} ${Helper.t('currency')}`, item2: `${Helper.t(fromType)} (${fromId})` })
        const res = await Transaction.makePayUrl(
          orderId,
          amount,
          user?.username as string,
          desc,
          user?.phone,
          user?.id
        )
        if (res.status !== 'success') {
          return response.status(Helper.ERROR_STATUS).json({ status: 'danger', message: res.message })
        }
        await Transaction.create({
          agencyId: user?.agencyId,
          title: desc,
          type: type,
          gateway: Helper.BANK,
          fromType: 'user',
          fromId: user?.id,
          toType: 'user',
          toId: user?.id,
          amount: amount,
          payId: res.order_id,
          appVersion: appVersion,
        })

        // }
        return response.json({
          status: res.status,
          message: Helper.t('redirect_to_payment_page'),
          url: res.url,
        })
        break
      case 'cardtocard':
        await request.validateUsing(cardToCardValidator)
        const gapMinutes = Helper.CARDTOCARD_MINUTE_LIMIT

        desc = Helper.t('cardtocard_*_from_*_to_*', { item1: `${Helper.asPrice(amount)} ${Helper.t('currency')}`, item2: `${fromCard}`, item3: `${toCard}` })
        const lastTransaction = await Transaction.query().where('type', type).where('created_at', '>', DateTime.now().minus({ minutes: gapMinutes }).toJSDate()).first()

        if (lastTransaction) {
          return response.status(Helper.ERROR_STATUS).json({ status: 'danger', message: Helper.t('gap_requests_is_*', { item: `${gapMinutes} ${Helper.t('minute')}` }) })
        }

        await Transaction.create({
          agencyId: user?.agencyId,
          title: desc,
          type: type,
          gateway: 'wallet',
          fromType: 'user',
          fromId: user?.id,
          toType: 'user',
          toId: user?.id,
          amount: amount,
          payId: `${orderId}`,
          appVersion: appVersion,
          info: JSON.stringify({ from_card: fromCard, to_card: toCard })
        })
        return response.json({ status: 'success', message: Helper.t('request_registered_successfully') })

        break
      case 'winwheel':
        await request.validateUsing(winWheelValidator)
        const winWheelGapHours = Helper.WINWHEEL_HOUR_LIMIT
        const winWheel = JSON.parse((await Setting.query().where('key', 'winwheel').first())?.value)

        if (!winWheel || winWheel.active != 1) {
          return response.status(Helper.ERROR_STATUS).json({ status: 'danger', message: Helper.t('*_is_*', { item1: Helper.t('winwheel'), item2: Helper.t('inactive') }) })
        }
        const lastWinWheel = await Transaction.query().where('type', type).where('created_at', '>', now.minus({ hours: winWheelGapHours }).toJSDate()).first()

        if (lastWinWheel) {

          const diffInMinutes = Math.round(lastWinWheel.createdAt.plus({ hours: winWheelGapHours }).diff(now, 'minutes').minutes)
          const hour = Math.floor(diffInMinutes / 60)
          const min = Math.floor(diffInMinutes % 60)
          return response.status(Helper.ERROR_STATUS).json({ status: 'danger', message: Helper.t('try_*_*_later', { item1: `${hour}`, item2: `${min}` }) })
        }
        const randomIndex = Math.floor(Math.random() * winWheel.labels.length);
        const winLabel = parseInt(`${winWheel.labels[randomIndex]}`)

        desc = Helper.t('winwheel_prize_*', { item: Helper.asPrice(`${winLabel}`) })


        const transaction = await Transaction.create({
          agencyId: user?.agencyId,
          title: desc,
          type: type,
          gateway: 'wallet',
          fromType: 'agency',
          fromId: user?.agencyId,
          toType: 'user',
          toId: user?.id,
          amount: winLabel,
          payId: `${orderId}`,
          appVersion: appVersion,
          info: null,
          payedAt: now
        })
        let msg = Helper.t('no_prize_unfortunately')
        if (winLabel > 0) {
          const financial = await UserFinancial.firstOrNew({
            userId: transaction.toId,
          })
          financial.merge({
            balance: (financial.balance ?? 0) + transaction.amount,
          })
          await financial.save()

          const agencyFinancial = await AgencyFinancial.firstOrNew({
            agencyId: transaction.fromId,
          })
          agencyFinancial.merge({
            balance: (agencyFinancial.balance ?? 0) - transaction.amount,
          })
          await agencyFinancial.save()
          msg = Helper.t('wallet_added_*', { item: `${winLabel}` })
        }
        return response.json({ status: 'success', 'message': msg, prize: winLabel, index: randomIndex })
        break
      case 'withdraw':
        await request.validateUsing(withdrawValidator)

        const withdrawGapHours = Helper.WITHDRAW_HOUR_LIMIT
        const lastWthdraw = await Transaction.query().where('type', type).where('created_at', '>', now.minus({ hours: withdrawGapHours }).toJSDate()).first()

        if (lastWthdraw) {

          const diffInMinutes = Math.round(lastWthdraw.createdAt.plus({ hours: withdrawGapHours }).diff(now, 'minutes').minutes)
          const hour = Math.floor(diffInMinutes / 60)
          const min = Math.floor(diffInMinutes % 60)
          return response.status(Helper.ERROR_STATUS).json({ status: 'danger', message: Helper.t('try_*_*_later', { item1: `${hour}`, item2: `${min}` }) })
        }
        if (!user.fullName) {
          return response.status(Helper.ERROR_STATUS).json({ status: 'danger', message: Helper.t('add_from_profile_*', { item: Helper.t('name') }) })
        }
        const financial = await UserFinancial.firstOrCreate({
          userId: user?.id,
        })

        if (!financial.card) {
          return response.status(Helper.ERROR_STATUS).json({ status: 'danger', message: Helper.t('add_from_profile_*', { item: Helper.t('card') }) })
        }
        desc = Helper.t('withdraw_request_*_*_to_*', { item1: Helper.asPrice(`${amount}`), item2: `${Helper.t('user')} ${user?.fullName} (${user?.id})`, item3: financial.card })

        await Transaction.create({
          agencyId: user?.agencyId,
          title: desc,
          type: type,
          gateway: 'wallet',
          fromType: 'agency',
          fromId: user?.agencyId,
          toType: 'user',
          toId: user?.id,
          amount: amount,
          payId: `${orderId}`,
          appVersion: appVersion,
          info: JSON.stringify({ to_card: financial.card, to_name: user?.fullName }),
        })
        return response.json({ status: 'success', 'message': Helper.t('request_registered_successfully') })


    }


    // const transaction = await Transaction.query()
    //   .where('for_type', 'agency')
    //   .where('type', 'charge')
    //   .where('for_id', user?.agencyId as number)
    //   .where('from_type', 'user')
    //   .where('from_id', user?.id as number)
    //   .whereNull('payed_at')
    //   .first()
    //
    // if (transaction) {
    //   await transaction
    //     .merge({
    //       payId: res.order_id,
    //       amount: amount,
    //       title: desc,
    //       gateway: Helper.BANK,
    //     })
    //     .save()
    // } else {

  }

  async done({ request, response, inertia }: HttpContext) {
    let status = 'danger'
    const userId = request.input('user_id')
    const market = request.input('market')
    const token = request.input('token')
    const sku = request.input('sku')
    const amount = request.input('amount')
    const appVersion = request.input('app_version')
    const info = request.input('info')
    const orderId = request.input('order_id') ?? `${userId}\$${sku}\$${DateTime.now().toMillis()}`



    if (market && ['bazaar', 'myket'].includes(market)) {
      if (!(await this.checkPayment(sku, token, market))) {
        return response.json({ status: 'danger', message: Helper.t('problem_confirm_pay') })
      }

      // const transaction = await Transaction.create({
      //   /* Add necessary fields here */
      // })
      //
      // if (transaction) {
      //   status = 'success'
      //   const user = await User.find(userId)
      // }

      return response.json({ status })
    } else {
      const paymentResponse = await Transaction.confirmPay(request)



      const transaction: Transaction =
        paymentResponse && paymentResponse.order_id
          ? await Transaction.query().where('pay_id', paymentResponse.order_id).first()
          : new Transaction()

      const now = transaction.payedAt ?? DateTime.now()
      const jalaliDate = Helper.toShamsi(now, true)

      status = paymentResponse.status
      const orderToken = paymentResponse.order_id
      const user = await Helper.TRANSACTION_MODELS[transaction?.fromType]?.find(transaction?.fromId)
      const userType = user instanceof Admin ? 'admin' : 'user'

      const column = `${transaction.toType}Id`

      if (status === 'success') {
        if (transaction.type === 'charge') {
          const financial = await Helper.FINANCIAL_MODELS[transaction.toType].firstOrNew(
            { column: transaction.toId, }
            , { column: transaction.toId })
          financial.merge({
            balance: (financial.balance ?? 0) + transaction.amount,
          })
          await financial.save()
        }
        transaction?.merge({
          payedAt: now,
        })
        await transaction.save()
      }

      transaction.user = user
      Telegram.log(null, 'transaction_created', transaction)

      return inertia.render('Invoice', {
        lang: {
          title: paymentResponse.status === 'success' ? Helper.t('payment_success') : Helper.t('payment_fail'),
          pay_id: Helper.t('pay_id'),
          pay_time: Helper.t('time'),
          pay_type: Helper.t('pay_type'),
          amount: Helper.t('amount'),
          return: transaction.appVersion ? Helper.t('return_to_application') : Helper.t('return_to_site'),
          currency: Helper.t('currency'),
        },
        now: jalaliDate,
        status: paymentResponse.status ?? 'danger',
        pay_id: orderToken ?? '_',
        amount: transaction.amount ?? '_',
        type: transaction.title,
        link:
          transaction?.type === 'charge' ? (transaction.appVersion ? '' :
            transaction.fromType === 'admin'
              ? 'admin.panel.index'
              : 'panel.index')
            : '',
        message: paymentResponse.message ?? '',
      })
    }
  }

  // Assuming you have a method to check payments
  async checkPayment(sku: string, token: string, market: string): Promise<boolean> {
    // Implement the logic to check payment
    return true
  }
  async search({ request, response, auth }: HttpContext) {

    const user = auth.user
    const userId = user?.id
    const page = request.input('page') ?? 1
    const search = request.input('search')
    const type = request.input('type')
    const dir = request.input('dir') ?? 'DESC'
    const sort = request.input('sort') ?? 'created_at'

    let query = Transaction.query()
      // .whereNotNull('payed_at')
      .where((query) => {
        query.where({ fromId: userId, fromType: 'user' }).orWhere({ toId: userId, toType: 'user' })
      });

    if (search)
      query.where('title', 'like', `%${search}%`)
    if (type) {
      if (type == 'win')
        query.whereIn('type', ['win', 'winwheel'])
      else if (type == 'charge')
        query.whereIn('type', ['charge', 'cardtocard'])
      else
        query.where('type', type)
    }

    return response.json(await query.orderBy(sort, dir).paginate(page, Helper.PAGINATE))
  }
}
