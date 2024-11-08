// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {enabled: true},
  modules: ['@nuxt/ui', '@nuxtjs/supabase'],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    },
  },
  supabase: {
    redirect: true,
  },
});