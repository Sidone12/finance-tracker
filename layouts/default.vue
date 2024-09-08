<template>
  <div class="container mx-auto max-w-4xl">
     <AppHeader />
    <main class="my-10">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Link to Google Fonts
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
      crossorigin: ''
    }
  ]
})
</script>

<style>
/* Set the font family */
body {
  font-family: 'Inter';
}
/* Set the background color for */
body {
  @apply dark:bg-gray-900 bg-white
}
</style>