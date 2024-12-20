import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/user_registered'
import TelegramEvent from '#events/telegram_event'

const SendVerificationEmail = () => import('#listeners/send_verification_email')
const TelegramEventListener = () => import('#listeners/telegram_event_listener')

emitter.on('user:registered', function (user) {
  console.log(user)
})

// emitter.on('user:registered', [SendVerificationEmail, 'handle'])

emitter.on(UserRegistered, SendVerificationEmail)
emitter.onError((event, error, eventData) => {
  if (event instanceof UserRegistered) console.log(error, eventData)
})
emitter.on(TelegramEvent, [TelegramEventListener])
// emitter.onAny((name, event) => {
//   console.log(name)
//   console.log(event)
// })

// Remove listener
// emitter.off(UserRegistered, SendVerificationEmail)
