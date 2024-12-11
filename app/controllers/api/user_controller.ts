import { HttpContext, Route } from '@adonisjs/core/http'
import { loginValidator, registerValidator, updateValidator } from '#validators/auth'
import User from '#models/user'
import Helper from '../../services/helper_service.js'
import UserFinancial from '../../models/user_financial.js'
import hash from '@adonisjs/core/services/hash'

export default class UserController {


  async update({ response, request, auth }) {

    const user: User = auth?.user

    const financial = await UserFinancial.firstOrCreate({ userId: user?.id })
    const type = request.input('type')
    const fullName = request.input('full_name')
    const username = request.input('username')
    const phone = request.input('phone')
    const card = request.input('card')
    const sheba = request.input('sheba')
    const password = request.input('password')
    const data = await request.validateUsing(updateValidator, { meta: { id: user?.id } })
    switch (type) {

      case 'user':
        if (fullName && user?.fullName && fullName != user?.fullName)
          return response.badRequest({ message: Helper.t('not_editable_*', { item: Helper.t('full_name') }) })
        user?.merge({
          fullName: fullName ?? user.fullName,
          username: username,
          phone: phone,
        }).save()
        financial.merge({
          card: card,
          sheba: sheba,
        }).save()
        return response.send({ status: 'success', message: Helper.t('edited_successfully'), user, financial })

        break
      case 'password':
        if (password) {
          //hash automatically before save if is dirty
          user.password = password
          await user.save()
          return response.send({ status: 'success', message: Helper.t('edited_successfully') })
        }
        break
    }


  }




  async forget({ response }: HttpContext) {
    return response.json({ url: `https://t.me/${Helper.BOT}?start=recover_password` })
  }


  async register({ request, response, i18n }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)
    const tokenData = await User.accessTokens.create(user)
    await UserFinancial.create({ user_id: user.id, balance: 0 })
    return response.json({
      token: tokenData.value!.release(),
      user: user,
      message: i18n.t('messages.welcome'),
    })
  }

  async login({ request, auth, response, i18n }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(username, password)
    // auth.authenticateUsing(['api'])
    const tokenData = await User.accessTokens.create(user)

    return response.json({
      status: 'success',
      token: tokenData.value!.release(),
      message: i18n.t('messages.welcome'),
    })
  }

  async logout({ request, auth, response }: HttpContext) {
    let user
    if (request.url().indexOf('admin') >= 0) user = auth.use('admin_api').user!
    user = auth.use('api').user!
    const token = user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    await User.accessTokens.delete(user, token)
    return { message: 'Success' }
  }

  async info({ auth, response }: HttpContext) {
    // await auth.check()
    const user: User = auth.use('api').user

    return response.json({
      status: 'success',
      user: user?.serialize(),
      financial: await user.getUserFinancial(),
    })
  }
}
