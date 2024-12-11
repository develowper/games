import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const PanelController = () => import('#controllers/panel_controller')

import { middleware } from '#start/kernel'
import Daberna from '#models/daberna'
import Room from '#models/room'
import Helper from '#services/helper_service'
import Transaction from '#models/transaction'
import Setting from '../../app/models/setting.js'
import User from '../../app/models/user.js'
import hash from '@adonisjs/core/services/hash'
import SettingController from '../../app/controllers/api/setting_controller.js'
import { HttpContext } from '@adonisjs/core/http'

export default function () {
  router.get('test', async () => {


    return await Setting.findBy({ key: 'policy' })

    return await Setting.query().where('key', 'withdraw_title').update({ value: Helper.t('withdraw_title', { item1: Helper.asPrice(`${Helper.MIN_WITHDRAW}`), item2: `${Helper.WITHDRAW_HOUR_LIMIT} ${Helper.t('hour')}` }) })
    return await Setting.createMany([
      { key: 'policy', value: Helper.t('policy_content') }

    ])

    return Transaction.makePayUrl(Date.now(), 2000, 'ali', 'description', '09011111111', 2)
    return Daberna.makeGame(await Room.first())
  })

  router.get('policy', async ({ request, response }: HttpContext) => {
    if (request.header('Accept')?.includes('application/json'))
      return response.send({ data: (await Setting.findBy('key', 'policy'))?.value })

  }).as('policy')
  router.on('/').renderInertia('home', { prop1: 'test' }).as('home')

  router
    .group(() => {
      router.post('register', [AuthController, 'register']).as('auth.register')
      router.post('login', [AuthController, 'login']).as('auth.login')
    })
    .use(
      middleware.guest({
        guards: ['web' /*, 'api'*/],
      })
    )
    .as('user')

  router
    .group(() => {
      router.delete('logout', [AuthController, 'logout']).as('auth.logout')
      router.get('me', [AuthController, 'me']).as('auth.me')

      router
        .group(() => {
          router.get('', [PanelController, 'index']).as('index')
        })
        .prefix('panel')
        .as('panel')
    })
    .use(
      middleware.auth({
        guards: ['web' /*, 'api'*/],
      })
    )
    .as('user')
}
