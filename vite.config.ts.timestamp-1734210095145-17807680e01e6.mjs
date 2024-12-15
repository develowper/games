// vite.config.ts
import { defineConfig } from "file:///D:/_adonis_projects/daberna/node_modules/vite/dist/node/index.js";
import { getDirname } from "file:///D:/_adonis_projects/daberna/node_modules/@adonisjs/core/build/src/helpers/main.js";
import inertia from "file:///D:/_adonis_projects/daberna/node_modules/@adonisjs/inertia/build/src/plugins/vite.js";
import vue from "file:///D:/_adonis_projects/daberna/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import adonisjs from "file:///D:/_adonis_projects/daberna/node_modules/@adonisjs/vite/build/src/client/main.js";
import tailwindcss from "file:///D:/_adonis_projects/daberna/node_modules/tailwindcss/lib/index.js";
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
    adonisjs({
      entrypoints: ["inertia/app/app.ts"],
      reload: ["resources/views/**/*.edge", "resources/lang/**"]
    }),
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
      plugins: [tailwindcss, autoprefixer]
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxfYWRvbmlzX3Byb2plY3RzXFxcXGRhYmVybmFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXF9hZG9uaXNfcHJvamVjdHNcXFxcZGFiZXJuYVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovX2Fkb25pc19wcm9qZWN0cy9kYWJlcm5hL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGdldERpcm5hbWUgfSBmcm9tICdAYWRvbmlzanMvY29yZS9oZWxwZXJzJ1xuaW1wb3J0IGluZXJ0aWEgZnJvbSAnQGFkb25pc2pzL2luZXJ0aWEvY2xpZW50J1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgYWRvbmlzanMgZnJvbSAnQGFkb25pc2pzL3ZpdGUvY2xpZW50J1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgaW5lcnRpYSh7XG4gICAgICBzc3I6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZW50cnlwb2ludDogJ2luZXJ0aWEvYXBwL3Nzci50cycsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHZ1ZSgpLFxuICAgIGFkb25pc2pzKHtcbiAgICAgIGVudHJ5cG9pbnRzOiBbJ2luZXJ0aWEvYXBwL2FwcC50cyddLFxuICAgICAgcmVsb2FkOiBbJ3Jlc291cmNlcy92aWV3cy8qKi8qLmVkZ2UnLCAncmVzb3VyY2VzL2xhbmcvKionXSxcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGRpcnM6IFsnaW5lcnRpYS9jb21wb25lbnRzJ10sXG4gICAgICBkdHM6IHRydWUsXG4gICAgfSksXG4gIF0sXG4gIC8qKlxuICAgKiBEZWZpbmUgYWxpYXNlcyBmb3IgaW1wb3J0aW5nIG1vZHVsZXMgZnJvbVxuICAgKiB5b3VyIGZyb250ZW5kIGNvZGVcbiAgICovXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICAvLyBobXI6IHtcbiAgICAvL1xuICAgIC8vICAgY2xpZW50UG9ydDogOTIwNCxcbiAgICAvLyAgIGhvc3Q6IFwibG9jYWxob3N0XCIsXG4gICAgLy8gICBwcm90b2NvbDogXCJ3c3NcIixcbiAgICAvLyB9XG4gICAgLy8gaG1yOiBmYWxzZSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnfi8nOiBgJHtnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCl9L2luZXJ0aWEvYCxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVEsU0FBUyxvQkFBb0I7QUFDdFMsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sU0FBUztBQUNoQixPQUFPLGNBQWM7QUFDckIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyxnQkFBZ0I7QUFQNEksSUFBTSwyQ0FBMkM7QUFTcE4sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsUUFBUTtBQUFBLE1BQ04sS0FBSztBQUFBLFFBQ0gsU0FBUztBQUFBLFFBQ1QsWUFBWTtBQUFBLE1BQ2Q7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxJQUNKLFNBQVM7QUFBQSxNQUNQLGFBQWEsQ0FBQyxvQkFBb0I7QUFBQSxNQUNsQyxRQUFRLENBQUMsNkJBQTZCLG1CQUFtQjtBQUFBLElBQzNELENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULE1BQU0sQ0FBQyxvQkFBb0I7QUFBQSxNQUMzQixLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsRUFDSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTLENBQUMsYUFBYSxZQUFZO0FBQUEsSUFDckM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVFSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxNQUFNLEdBQUcsV0FBVyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
