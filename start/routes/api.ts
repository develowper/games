// import router from "@adonisjs/core/services/router";

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const UserController = () => import('../../app/controllers/api/user_controller.js')
const SettingController = () => import('../../app/controllers/api/setting_controller.js')
const RoomController = () => import('../../app/controllers/api/room_controller.js')
const TransactionController = () => import('../../app/controllers/api/transaction_controller.js')

export default () => {
  router.any('api/transaction/done', [TransactionController, 'done']).as('api.transaction.done')

  //auth
  router
    .group(() => {
      router.delete('logout', [UserController, 'logout']).as('logout')
      router.get('user/info', [UserController, 'info']).as('info')
      router.post('user/update', [UserController, 'update']).as('update')
      router.get('settings', [SettingController, 'get']).as('settings')
      router.get('room/get', [RoomController, 'get']).as('room.get')
      router.post('room/join', [RoomController, 'payAndJoin']).as('room.join')
      router.post('transaction/create', [TransactionController, 'create']).as('transaction.create')
      router.get('transaction/search', [TransactionController, 'search']).as('transaction.search')
    })
    // .use(middleware.checkServerStatus)
    .use(
      middleware.auth_user({
        guards: ['api'],
      })
    )
    .as('api.user')
    .prefix('api')

  //guest
  router
    .group(() => {
      router.post('user/register', [UserController, 'register']).as('register')
      router.post('user/login', [UserController, 'login']).as('login')
      router.post('user/forget', [UserController, 'forget']).as('forget')
    })
    .use(
      middleware.guest_user({
        guards: ['api'],
      })
    )
    .as('api.user')
    .prefix('api')
}
