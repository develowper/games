import {createInertiaApp} from '@inertiajs/vue3'
import {renderToString} from '@vue/server-renderer'
import {createSSRApp, h, type DefineComponent} from 'vue'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'
export default function render(page: any) {
  return createInertiaApp({
    page,
    title: (title) => `${title} - ${appName}`,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue', {eager: true})
      return pages[`../pages/${name}.vue`]
    },

    setup({App, props, plugin}) {

      const vueApp = createSSRApp({render: () => h(App, props)}).use(plugin)

      vueApp.config.globalProperties.hi = (e: any) => {
        console.log(e)
      }
      return vueApp
    },
  })
}
