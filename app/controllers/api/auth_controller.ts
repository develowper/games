import type {HttpContext} from '@adonisjs/core/http'
import {loginValidator, registerValidator} from "#validators/auth";
import User from "#models/user";

export default class AuthController {

  async register({request}: HttpContext) {

    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data);

    return User.accessTokens.create(user, ['*'], {expiresIn: '1 years'});

  }

  async login({request, auth}: HttpContext) {

    const {email, password} = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    if (request.matchesRoute('admin.login'))
      await auth.use('admin_web').login(user)
    else await auth.use('web').login(user)

    return User.accessTokens.create(user)

  }

  async logout({request, auth, response}: HttpContext) {

    let user;
    if (request.url().indexOf('admin') >= 0)
      user = auth.use('admin_api').user!
    user = auth.use('api').user!
    const token = user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({message: 'Token not found'})
    }
    await User.accessTokens.delete(user, token)
    return {message: 'Success'}
  }

  async me({auth}: HttpContext) {

    await auth.check()
    return {user: auth.user}
  }

}
