import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    inertia({
      ssr: {
        enabled: false,
        entrypoint: 'inertia/app/ssr.ts',
      },
    }),
    vue(),
    adonisjs({
      entrypoints: ['inertia/app/app.ts', 'inertia/css/app.css'],
      reload: ['resources/views/**/*.edge', 'resources/lang/**'],
    }),
    Components({
      dirs: ['inertia/components'],
      dts: true,
    }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    // hmr: {
    //
    //   clientPort: 9204,
    //   host: "localhost",
    //   protocol: "wss",
    // }
    // hmr: false,
  },
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
})
