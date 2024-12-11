import User from '#models/user'
import Post from '#models/post'
import {BasePolicy} from '@adonisjs/bouncer'
import {AuthorizerResponse} from '@adonisjs/bouncer/types'
import Admin from "#models/admin";

export default class PostPolicy extends BasePolicy {

  async before(user: User | Admin | null, action: string, ...params: any[]) {
    /**
     * Always allow an admin user without performing any check
     */
    if (user && (user instanceof Admin)) {
      return true
    }
  }

  /**
   * Every logged-in user can create a post
   */
  create(user: User): AuthorizerResponse {
    return true
  }

  /**
   * Only the post creator can edit the post
   */
  edit(user: User, post: Post): AuthorizerResponse {
    return user.id === post.userId
  }

  /**
   * Only the post creator can delete the post
   */
  delete(user: User, post: Post): AuthorizerResponse {
    return user.id === post.userId
  }
}
