// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
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
      ssr: true,
      cors: true,
    },
    "/proxy/uf": {
      proxy: "https://mindicador.cl/api",
      prerender: true,
      ssr: true,
      cors: true,
    },
  },
});
