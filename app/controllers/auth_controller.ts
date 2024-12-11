import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'
import Admin from '#models/admin'
import UserRegistered from '#events/user_registered'

export default class AuthController {
  async register({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)

    await auth.use('web').login(user)
    await UserRegistered.dispatch(user)

    return response.redirect().toRoute('user.panel')
  }

  async login({ request, auth, response }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)
    const isAdmin = request.matchesRoute('admin.login')
    const user = await (isAdmin ? Admin : User).verifyCredentials(username, password)

    if (isAdmin) await auth.use('admin_web').login(user as Admin)
    else await auth.use('web').login(user as User)

    return response.redirect().toRoute(`${isAdmin ? 'admin' : 'user'}.panel`)
  }

  async logout({ request, auth, response }: HttpContext) {
    let guard
    if (request.url().indexOf('admin/') >= 0) guard = auth.use('admin_web')
    else guard = auth.use('web')

    guard.logout()

    return response.json({ message: 'Success' })
  }

  async me({ auth }: HttpContext) {
    await auth.check()
    return { user: auth.user }
  }
}
