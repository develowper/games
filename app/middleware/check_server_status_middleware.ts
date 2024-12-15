import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import HelperService from '#services/helper_service'
import { Exception } from '@adonisjs/core/exceptions'

export default class CheckServerStatusMiddleware {
  async handle({ i18n }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const res = await HelperService.serverStatus()
    if (res !== 'active')
      throw new Exception(
        i18n.t('messages.*_is_*', { item: i18n.t('messages.server'), value: __(res) })
      )
    /**
     * Call next method in the pipeline and return its output
     */
    await next()
  }
}
