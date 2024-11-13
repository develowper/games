import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
import {middleware} from '#start/kernel'

export default function () {
  router.on('/').renderInertia('home')

  router.group(() => {

    router.post('register', [AuthController, 'register']).as('user.auth.register')
    router.post('login', [AuthController, 'login']).as('user.auth.login')

  }).use(middleware.guest({
    guards: ['web'/*, 'api'*/]
  }))


  router.group(() => {

    router.delete('logout', [AuthController, 'logout']).as('user.auth.logout')
    router.get('me', [AuthController, 'me']).as('user.auth.me')

  }).use(middleware.auth({
    guards: ['web'/*, 'api'*/]
  }))
}
