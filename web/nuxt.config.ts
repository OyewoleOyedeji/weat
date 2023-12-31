export default defineNuxtConfig({
  app: {
    rootTag: "main",
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
      meta: [
        {
          name: "description",
          content: "A simple weather app!",
        },
      ],
    },
  },
  build: { transpile: ["vue-sonner"] },
  css: ["tippy.js/dist/tippy.css"],
  devtools: { enabled: true },
  image: {
    domains: ["openweathermap.org"],
  },
  googleFonts: {
    display: "swap",
    families: {
      Roboto: [400, 500, 700],
    },
    preload: true,
  },
  modules: [
    "@formkit/auto-animate/nuxt",
    "@kevinmarrec/nuxt-pwa",
    "@nuxt/image",
    "@nuxtjs/device",
    "@nuxtjs/google-fonts",
    "@nuxtjs/html-validator",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-phosphor-icons",
    "nuxt-svgo",
    "nuxt-swiper",
  ],
  nitro: {
    prerender: {
      crawlLinks: true,
    },
    routeRules: {
      "/api/**": {
        cors: true,
      },
    },
  },
  pwa: {
    manifest: {
      description: "A simple weather app!",
      display: "minimal-ui",
      display_override: ["standalone"],
      name: "Weat",
      short_name: "Weat",
      theme_color: "#5c87e4",
    },
  },
  runtimeConfig: {
    openweathermap: {
      key: process.env.OPENWEATHERMAP_API_KEY,
      base: "https://api.openweathermap.org",
    },
    ipinfo: {
      token: process.env.IPINFO_TOKEN,
      base: "https://ipinfo.io",
    },
  },
  svgo: {
    defaultImport: "component",
  },
  swiper: {
    modules: ["scrollbar"],
  },
  typescript: {
    shim: false,
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("md-"),
    },
  },
});
