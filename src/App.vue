<script>
import weatherinfo from "./components/weather.vue";
export default {
  components: { weatherinfo },
};
</script>
<template>
  <div class="weather-info"></div>
  <weatherinfo></weatherinfo>
  <div class="justify-center">
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-50 md:text-5xl lg:text-6xl dark:text-white"
    >
      gustavorteuber
      <span
        class="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600"
        >OpenWeatherMap</span
      >
    </h1>
    <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
      API OpenWeatherMap desenvolvida por gustavorteuber para o desafio
      develloplabs! Comece pesquisando qualquer cidade do mundo ou clique nas
      capitais presetadas.
    </p>
  </div>
</template>
