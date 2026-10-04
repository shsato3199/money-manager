export default defineNuxtConfig({
  app: {
    head: {
      link: [
        // favicon設定
        {
          rel: "icon",
          type: "image/png",
          href: "/img/household-ledger.png",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
    },
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],
  modules: ["@pinia/nuxt"],
});