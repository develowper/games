import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import { errors as authErrors } from '@adonisjs/auth'
import { errors as limiterErrors } from '@adonisjs/limiter'
import { errors } from '@adonisjs/core'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (error, { inertia }) => inertia.render('errors/not_found', { error }),
    // '404': (_, { view }) => view.render('errors/not-found'),
    '500..599': (error, { inertia }) => inertia.render('errors/server_error', { error }),
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
      if (ctx.request.url().includes('api')) {
        ctx.response
          .status(401)
          .send({ errors: [{ message: ctx.i18n.t('messages.first_login_or_register') }] })
        return
      }
    } else if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
      if (ctx.request.url().includes('api')) {
        ctx.response.status(400).send({
          errors: [
            { message: ctx.i18n.t('messages.not_found_*', { item: ctx.i18n.t('messages.user') }) },
          ],
        })
        return
      }
    } else if (error instanceof limiterErrors.E_TOO_MANY_REQUESTS) {
      const err = ctx.i18n.t('messages.too_many_try_after_*', {
        // limit: error.response.limit,
        // remaining: error.response.remaining,
        seconds: error.response.availableIn,
      })
      if (ctx.request.url().includes('api')) {
        ctx.response.status(400).send({
          errors: [{ message: err }],
        })
        return
      } else {
        // const message = error.getResponseMessage(ctx)
        // const headers = error.getDefaultHeaders()
        ctx.session.flash('notification', { message: err, status: 'danger' })

        // Object.keys(headers).forEach((header) => {
        //   ctx.response.header(header, headers[header])
        // })
        // error.setMessage(err)
        // ctx.response.status(419)
        return ctx.response.redirect().back()
        // return ctx.response.abort({ status: 'danger', message: err })
        // return
      }
    }
    // else if (error instanceof errors.E_ROUTE_NOT_FOUND) {
    //   return ctx.inertia.render('errors/not_found', { error })
    // }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
