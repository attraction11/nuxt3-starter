import { defineNuxtConfig } from "nuxt/config";
import ElementPlus from "unplugin-element-plus/vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import VueI18nVitePlugin from "@intlify/unplugin-vue-i18n/vite";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,

  // meta
  // header: {
  //   title: "HomingDay - Small changes make your dream life",
  //   // title: "Homingday – ใฝ่ฝันชีวิตอันสวยงาม",
  //   meta: [
  //     {
  //       hid: "description",
  //       name: "description",
  //       content: "Southeast Asian lifestyle brand HomingDay",
  //     },
  //     { name: "viewport", content: "width=device-width, initial-scale=1" },
  //   ],
  //   link: [{ rel: "icon", type: "image/x-icon", href: "./favicon.ico" }],
  // },

  // css
  css: ["~/assets/scss/index.scss"],

  // build
  build: {
    transpile: ["element-plus/es"],
  },

  typescript: {
    strict: true,
    shim: false,
  },

  vite: {
    plugins: [
      ElementPlus(),
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), "./locales/*.json"),
        ],
      }),
    ],
    resolve: {
      alias: {
        "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js",
      },
    },
  },

  // build modules
  modules: ["@vueuse/nuxt", "@pinia/nuxt", "nuxt-windicss"],

  // auto import components
  components: true,

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },

  // serverMiddleware: ['~/middleware/setSameOriginHeader.ts'],

  windicss: {
    analyze: false,
  },

  render: {
    static: {
      //@ts-ignore
      setHeaders(res: any) {
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      },
    },
  },

  app: {
    baseURL: "/marketing",
  },

  router: {
    // mode: 'hash',
    base: "/marketing",
    routes: ["/", "/marketing"],
  },
});
