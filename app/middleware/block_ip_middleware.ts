import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class BlockIpMiddleware {
  private blockedIps = ['94.24.99.175']
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (this.blockedIps.includes(ctx.request.ip())) {
      return ctx.response.unauthorized({ message: 'حساب شما مسدود شده است' })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
