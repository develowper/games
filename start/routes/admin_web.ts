// import router from "@adonisjs/core/services/router";

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'
const AdminController = () => import('#controllers/admin_controller')
const AuthController = () => import('#controllers/auth_controller')
const PanelController = () => import('#controllers/panel_controller')

export default () => {
  router
    .group(() => {
      router.post('login', [AuthController, 'login']).as('auth.login')
      router.on('login').renderInertia('Auth/Login', {}).as('login-form')
    })
    .use(
      middleware.guest_admin({
        guards: ['web' /*, 'api'*/],
      })
    )
    .as('admin')
    .prefix('admin')

  //auth
  router
    .group(() => {
      router
        .group(() => {
          router.get('', [PanelController, 'index']).as('index')
          router.on('setting/index').renderInertia('Panel/Admin/Setting/Index').as('setting.index')
          router.on('ticket/index').renderInertia('Panel/Admin/Ticket/Index').as('ticket.index')
          router.on('user/index').renderInertia('Panel/Admin/User/Index').as('user.index')
          router
            .on('notification/index')
            .renderInertia('Panel/Admin/Notification/Index')
            .as('notification.index')
          router
            .on('transaction/index')
            .renderInertia('Panel/Admin/Transaction/Index')
            .as('transaction.index')
        })
        .prefix('panel')
        .as('panel')

      router.post('logout', [AuthController, 'logout']).as('auth.logout')
    })
    .use(
      middleware.auth_admin({
        guards: ['admin_web' /*, 'api'*/],
      })
    )
    .as('admin')
    .prefix('admin')
}
