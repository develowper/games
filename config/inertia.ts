import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'
import Helper from "#services/helper_service";


const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    // user: (ctx) => ctx.auth?.user,
    // notification: (ctx) => ctx.session.flashMessages.get('notification'),
    errors: (ctx) => ctx.session?.flashMessages.get('errors') ?? {},
    'langFile': Helper.getLangFile(),
    __: (ctx) => {
      return {
        ...ctx.i18n,
        locale: ctx.i18n.locale,
      }
    },
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.ts'
  }
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {
  }
}
