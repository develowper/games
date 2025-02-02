import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Helper from '#services/helper_service'

export default class BlockIpMiddleware {
  private blockedIps = Helper.BLOCK_IPS
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (this.blockedIps.includes(ctx.request.ip())) {
      return ctx.response.unauthorized({ message: 'You Are In BlackList' })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
