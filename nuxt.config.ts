// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/google-fonts"],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  googleFonts: {
    families: {
      Roboto: true,
      Raleway: {
        wght: [100, 400, 700],
        ital: [100],
      },
      Inter: "200..700",
      Quicksand: "200..700",
    },
  },
  runtimeConfig: {
    public: {
      API: process.env.API,
      baseURL: process.env.BASE_URL || "http://localhost:3000",
    },
  },
  // modules: ["@nuxtjs/proxy"],
  // modules: ["nuxt-scheduler"],
  // modules: ["@vueuse/head"],

  routeRules: {
    "/proxy/bancos": {
      proxy: "https://api.hipotecarios.info/creditos/",
      prerender: false,
      ssr: false,
    },
    "/proxy/uf": {
      proxy: "https://mindicador.cl/api",
      prerender: false,
      ssr: false,
    },
  },
});
