/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

export const throttleWebGuest = limiter.define('web-limit', ({ request }) => {
  return limiter
    .allowRequests(10)
    .every('1 minute')

    .usingKey(`${request.ip()}_web`)
})
export const apiThrottle = limiter.define('api', (ctx) => {
  /**
   * Allow logged-in users to make 100 requests by
   * their user ID
   */
  if (ctx.auth.user) {
    return limiter.allowRequests(100).every('1 minute').usingKey(`user_${ctx.auth.user.id}`)
  }

  /**
   * Allow guest users to make 10 requests by ip address
   */
  return limiter.allowRequests(10).every('1 minute').usingKey(`ip_${ctx.request.ip()}`)
})

export const blocker = limiter
  .allowRequests(10)
  .every('1 minute')
  /**
   * Will be blocked for 30mins, if they send more than
   * 10 requests under one minute
   */
  .blockFor('30 mins')
  .limitExceeded((error) => {
    error.setStatus(400).setMessage('Cannot process request. Try again later')
  })
  .limitExceeded((error) => {
    error.t('messages.too_many_try_after_*', {
      // limit: error.response.limit,
      // remaining: error.response.remaining,
      seconds: error.response.availableIn,
    })
  })
