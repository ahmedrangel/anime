import { SITE } from "./utils/info.ts";

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "",
      bodyAttrs: {
        "data-bs-theme": "dark"
      },
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { name: "robots", content: "index, follow" }
      ]
    }
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/main.css",
    "~/assets/css/transitions.css",
    "~/assets/css/theme.css",
    "~/assets/css/categories.css",
    "primevue/resources/themes/aura-dark-green/theme.css"
  ],
  modules: [
    "nuxt-icon",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "@nuxtjs/google-fonts",
    "nuxt-primevue",
  ],
  runtimeConfig: {},
  features: {
    inlineStyles: false
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    dataValue: "bs-theme",
    storageKey: "nuxt-color-mode"
  },
  site: {
    url: SITE.url
  },
  nitro: {
    prerender: {
      routes: ["/sitemap.xml"]
    }
  },
  sitemap: {
    dynamicUrlsApiEndpoint: "/__sitemap",
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ]
  },
  routeRules: {
    "/": { sitemap: { priority: 1 } },
    "/*/**": { sitemap: { priority: 0.8, lastmod: new Date().toISOString() } }
  },
  primevue: {
    usePrimeVue: true,
    options: {
      ripple: true
    },
    components: {
      prefix: "Prime",
      include: ["Button"] /* Used as <PrimeButton /> */
    },
    directives: {
      include: ["Ripple"]
    }
  },
  googleFonts: {
    display: "swap",
    download: true,
    families: {
      "Rubik": [300, 400, 500, 600, 700],
    },
  },
  experimental: {
    viewTransition: true
  }
});
