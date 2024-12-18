/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import Post from '#models/post'
import { editPost } from '#abilities/main'
import router from '@adonisjs/core/services/router'

import webRoutes from './routes/web.js'
import apiRoutes from './routes/api.js'
import adminWebRoutes from './routes/admin_web.js'
import adminApiRoutes from './routes/admin_api.js'

router.get('storage/admins', () => {}).as('storage.admins')
router.get('storage/users', () => {}).as('storage.users')

webRoutes()
apiRoutes()
adminWebRoutes()
adminApiRoutes()

router.put('posts/:id', async ({ bouncer, params, response }) => {
  const post = await Post.findOrFail(params.id)

  if (await bouncer.allows(editPost, post)) {
    return 'You can edit the post'
  }
  return response.forbidden('You cannot edit the post')
})
// router.on('/').renderInertia('home')
