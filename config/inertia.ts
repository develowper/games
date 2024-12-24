import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'
import { getLangFile } from '#services/helper_service'
import Admin from '#models/admin'
import AgencyFinancial from '#models/agency_financial'
import Agency from '#models/agency'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    auth: async (ctx) => {
      // ;(await ctx.auth?.use('admin_web').check()) ?? ctx.auth?.use('web').check()
      const user = ctx.auth?.use('admin_web')?.user ?? ctx.auth?.use('web')?.user
      // console.log(user)
      return {
        user: user,
        isAdmin: user instanceof Admin,
        accesses: user?.getAccesses(),
        agencyFinancial:
          ctx?.auth?.user instanceof Admin
            ? await AgencyFinancial.findBy('agency_id', ctx?.auth?.user.agencyId)
            : {},
      }
    },
    agency: async (ctx) =>
      ctx?.auth?.user instanceof Admin
        ? ((await Agency.query()
            .preload('financial')
            .where('id', ctx?.auth?.user.agencyId)
            .first()) ?? { financial: {} })
        : { financial: {} },

    flash: (ctx) => {
      return ctx.session?.flashMessages.get('notification') ?? {}
    },
    // notification: (ctx) => ctx.session.flashMessages.get('notification'),
    errors: (ctx) => ctx.session?.flashMessages.get('errors') ?? {},
    language: (ctx) => getLangFile(ctx),
    pageItems: [24, 50, 100],
    // __: (ctx) => {
    //   return {
    //     ...ctx.i18n,
    //     locale: ctx.i18n.locale,
    //   }
    // },
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.ts',
    pages: (ctx, page) => {
      return page.indexOf('Auth') < 0 && page.indexOf('Panel') < 0
    },
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
