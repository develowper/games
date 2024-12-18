// import router from "@adonisjs/core/services/router";

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'
const UserFinancialController = () => import('#controllers/admin/user_financial_controller')
const UserController = () => import('#controllers/admin/user_controller')
const TransactionController = () => import('#controllers/admin/transaction_controller')
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
          router
            .on('notification/index')
            .renderInertia('Panel/Admin/Notification/Index')
            .as('notification.index')
          router
            .route('transaction/index', ['GET', 'POST'], [TransactionController, 'index'])
            .as('transaction.index')

          router
            .get('transaction/search', [TransactionController, 'search'])
            .as('transaction.search')
          router
            .patch('transaction/update', [TransactionController, 'update'])
            .as('transaction.update')

          router.get('user/index', [UserController, 'index']).as('user.index')

          router.get('user/search', [UserController, 'search']).as('user.search')
          router
            .get('user/financial-search', [UserFinancialController, 'search'])
            .as('user.financial.search')
          router.get('user/create', [UserController, 'create']).as('user.create')
          router.post('user/create', [UserController, 'store']).as('user.store')

          router.patch('user/update', [UserController, 'update']).as('user.update')
          router.get('user/:id', [UserController, 'edit']).as('user.edit')
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
