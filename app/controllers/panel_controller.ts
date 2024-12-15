// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import router from '@adonisjs/core/services/router'
import Transaction from '#models/transaction'
import db from '@adonisjs/lucid/services/db'
import { log } from '#services/helper_service'

export default class PanelController {
  //
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user
    if (user instanceof Admin) {
      const transactions = await db
        .from('transactions')
        .select('type')
        .count('* as count')
        .whereNull('payed_at')
        .whereIn('type', ['withdraw', 'cardtocard'])
        .groupBy('type')

      return inertia.render('Panel/Admin/Index', {
        requests: transactions,
      })
    }
    return inertia.render('Panel/Index', {})
  }

  public static inertiaRoute() {}
}
