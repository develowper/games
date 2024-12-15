import { inject } from '@adonisjs/core'
import TokensService from '#services/tokens_service'
import UserRegistered from '#events/user_registered'

// @inject()
// export default class SendVerificationEmail {
//   constructor(protected tokensService: TokensService) {
//   }
//
//   handle(user: User) {
//     const token = this.tokensService.generate(user.email);
//     console.log(token)
//   }
// }
export default class SendVerificationEmail {
  @inject()
  handle(event: UserRegistered, tokensService: TokensService) {
    tokensService.generate(event.user.email)
    console.log(event.user)
  }
}
