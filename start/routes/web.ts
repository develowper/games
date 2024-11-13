import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const PanelController = () => import('#controllers/panel_controller')
import {middleware} from '#start/kernel'

export default function () {
  router.on('/').renderInertia('home')

  router.group(() => {

    router.post('register', [AuthController, 'register']).as('auth.register')
    router.post('login', [AuthController, 'login']).as('auth.login')


  }).use(middleware.guest({
    guards: ['web'/*, 'api'*/]
  })).as('user')


  router.group(() => {

    router.delete('logout', [AuthController, 'logout']).as('auth.logout')
    router.get('me', [AuthController, 'me']).as('auth.me')

    router.group(() => {
      router.get('', [PanelController, 'view']).as('')
    }).prefix('panel').as('panel')


  }).use(middleware.auth({
    guards: ['web'/*, 'api'*/]
  })).as('user')
}
