// vite.config.ts
import { defineConfig } from "file:///D:/_adonis_projects/daberna/node_modules/vite/dist/node/index.js";
import { getDirname } from "file:///D:/_adonis_projects/daberna/node_modules/@adonisjs/core/build/src/helpers/main.js";
import inertia from "file:///D:/_adonis_projects/daberna/node_modules/@adonisjs/inertia/build/src/plugins/vite.js";
import vue from "file:///D:/_adonis_projects/daberna/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import adonisjs from "file:///D:/_adonis_projects/daberna/node_modules/@adonisjs/vite/build/src/client/main.js";
import tailwind from "file:///D:/_adonis_projects/daberna/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///D:/_adonis_projects/daberna/node_modules/autoprefixer/lib/autoprefixer.js";
import Components from "file:///D:/_adonis_projects/daberna/node_modules/unplugin-vue-components/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///D:/_adonis_projects/daberna/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    inertia({
      ssr: {
        enabled: true,
        entrypoint: "inertia/app/ssr.ts"
      }
    }),
    vue(),
    adonisjs({ entrypoints: ["inertia/app/app.ts"], reload: ["resources/views/**/*.edge"] }),
    Components({
      dirs: ["inertia/components"],
      dts: true
    })
  ],
  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
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
      "~/": `${getDirname(__vite_injected_original_import_meta_url)}/inertia/`
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxfYWRvbmlzX3Byb2plY3RzXFxcXGRhYmVybmFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXF9hZG9uaXNfcHJvamVjdHNcXFxcZGFiZXJuYVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovX2Fkb25pc19wcm9qZWN0cy9kYWJlcm5hL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnXG5pbXBvcnQge2dldERpcm5hbWV9IGZyb20gJ0BhZG9uaXNqcy9jb3JlL2hlbHBlcnMnXG5pbXBvcnQgaW5lcnRpYSBmcm9tICdAYWRvbmlzanMvaW5lcnRpYS9jbGllbnQnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBhZG9uaXNqcyBmcm9tICdAYWRvbmlzanMvdml0ZS9jbGllbnQnXG5pbXBvcnQgdGFpbHdpbmQgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gXCJhdXRvcHJlZml4ZXJcIlxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIGluZXJ0aWEoe1xuICAgICAgc3NyOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGVudHJ5cG9pbnQ6ICdpbmVydGlhL2FwcC9zc3IudHMnXG4gICAgICB9XG4gICAgfSksXG4gICAgdnVlKCksXG4gICAgYWRvbmlzanMoe2VudHJ5cG9pbnRzOiBbJ2luZXJ0aWEvYXBwL2FwcC50cyddLCByZWxvYWQ6IFsncmVzb3VyY2VzL3ZpZXdzLyoqLyouZWRnZSddfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkaXJzOiBbJ2luZXJ0aWEvY29tcG9uZW50cyddLFxuICAgICAgZHRzOiB0cnVlLFxuICAgIH0pLFxuICBdLFxuICAvKipcbiAgICogRGVmaW5lIGFsaWFzZXMgZm9yIGltcG9ydGluZyBtb2R1bGVzIGZyb21cbiAgICogeW91ciBmcm9udGVuZCBjb2RlXG4gICAqL1xuICBjc3M6IHtcbiAgICBwb3N0Y3NzOiB7XG4gICAgICBwbHVnaW5zOiBbdGFpbHdpbmQoKSwgYXV0b3ByZWZpeGVyKCldLFxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgLy8gaG1yOiB7XG4gICAgLy9cbiAgICAvLyAgIGNsaWVudFBvcnQ6IDkyMDQsXG4gICAgLy8gICBob3N0OiBcImxvY2FsaG9zdFwiLFxuICAgIC8vICAgcHJvdG9jb2w6IFwid3NzXCIsXG4gICAgLy8gfVxuICAgIC8vIGhtcjogZmFsc2UsXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ34vJzogYCR7Z2V0RGlybmFtZShpbXBvcnQubWV0YS51cmwpfS9pbmVydGlhL2AsXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlRLFNBQVEsb0JBQW1CO0FBQ3BTLFNBQVEsa0JBQWlCO0FBQ3pCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sY0FBYztBQUNyQixPQUFPLGtCQUFrQjtBQUN6QixPQUFPLGdCQUFnQjtBQVA0SSxJQUFNLDJDQUEyQztBQVNwTixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsTUFDTixLQUFLO0FBQUEsUUFDSCxTQUFTO0FBQUEsUUFDVCxZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLElBQ0osU0FBUyxFQUFDLGFBQWEsQ0FBQyxvQkFBb0IsR0FBRyxRQUFRLENBQUMsMkJBQTJCLEVBQUMsQ0FBQztBQUFBLElBQ3JGLFdBQVc7QUFBQSxNQUNULE1BQU0sQ0FBQyxvQkFBb0I7QUFBQSxNQUMzQixLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsRUFDSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFRUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsTUFBTSxHQUFHLFdBQVcsd0NBQWUsQ0FBQztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
