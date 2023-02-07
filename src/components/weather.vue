<script>
import axios from "axios";
export default {
  data() {
    return {
      city: "",
      weatherData: null,
      map: null,
      markers: [],
    };
  },
  mounted() {
    this.map = L.map("map").setView([-15.7801, -47.9292], 4);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(this.map);

    const cities = [
      { name: "São Paulo", lat: -23.5489, lng: -46.6388 },
      { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
      { name: "Belo Horizonte", lat: -19.9245, lng: -43.9352 },
      { name: "Brasília", lat: -15.7942, lng: -47.8822 },
      { name: "Curitiba", lat: -25.4244, lng: -49.2654 },
      { name: "Aracaju", lat: -10.544, lng: -37.0418 },
      { name: "Palmas", lat: -10.25, lng: -48.2494 },
      { name: "Macapá", lat: 0.0338, lng: -51.0449 },
      { name: "Maceió", lat: -9.6658, lng: -35.7295 },
      { name: "São Luís", lat: -2.5389, lng: -44.2829 },
      { name: "Teresina", lat: -5.089, lng: -42.801 },
      { name: "João Pessoa", lat: -7.119, lng: -34.845 },
      { name: "Recife", lat: -8.05, lng: -34.88 },
      { name: "Natal", lat: -5.795, lng: -35.209 },
      { name: "Fortaleza", lat: -3.75, lng: -38.58 },
    ];

    cities.forEach((city) => {
      const marker = L.marker([city.lat, city.lng]).addTo(this.map);
      marker.bindPopup(city.name);
      marker.on("click", () => {
        this.city = city.name;
        this.searchWeather();
        window.scrollTo(0, 0);
      });
      this.markers.push(marker);
      this.map.invalidateSize();
    });
  },
  methods: {
    async searchWeather() {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=bf08db3c959fb86465990fb06def9447`
        );
        if (response.data.cod !== 200) {
          throw new Error("Cidade não encontrada");
        }
        this.weatherData = response.data;
      } catch (error) {
        alert("cidade não encontada");
        console.error(error);
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    },
  },
  computed: {
    celsius() {
      return (this.weatherData.main.temp - 273.15).toFixed(2);
    },
    celsiusMin() {
      return (this.weatherData.main.temp_min - 273.15).toFixed(2);
    },
    celsiusMax() {
      return (this.weatherData.main.temp_max - 273.15).toFixed(2);
    },
    backgroundClass() {
      if (this.celsius < 20) {
        return "bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600";
      } else {
        return "bg-gradient-to-t from-sky-400 to-blue-800";
      }
    },
    ColorFooter() {
      if (this.celsius < 20) {
        return "bg-gradient-to-a from-gray-900 via-purple-900 to-violet-600";
      } else {
        return "bg-gradient-to-a from-sky-400 to-blue-800";
      }
    },
  },
};
</script>
<template>
  <label
    for="search"
    class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
    >Procurar</label
  >
  <div class="relative">
    <div
      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    >
      <svg
        aria-hidden="true"
        class="w-5 h-5 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
    <input
      @keydown.enter="searchWeather"
      v-model="city"
      type="search"
      id="search"
      class="block w-full p-4 pl-10 text-sm text-white rounded-lg border border-sky-500 bg-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Pesquisar"
      required
    />
    <button
      @click="searchWeather"
      class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Pesquisar
    </button>
    <div class="flex justify-center"></div>
  </div>
  <div class="pt-6" v-if="weatherData">
    <div
      class="bg-gray-900 text-white relative min-w-0 break-words rounded-lg overflow-hidden shadow-sm mb-4 w-full bg-white dark:bg-gray-600"
    >
      <div :class="backgroundClass">
        <div class="flex flex-wrap">
          <div class="w-full px-2">
            <div class="px-6 py-6 relative">
              <div class="flex mb-4 justify-between items-center">
                <div>
                  <h5 class="mb-0 font-medium text-xl">
                    {{ weatherData.name }} , {{ weatherData.sys.country }}
                  </h5>
                  <h2 class="font-bold">
                    {{ weatherData.weather[0].description }}
                  </h2>
                  <h6 class="mb-0">{{ formatDate(weatherData.dt) }}</h6>
                </div>
                <div class="text-right">
                  <h3 class="font-bold text-4xl mb-0">
                    <span>{{ celsius }}°C</span>
                  </h3>
                </div>
              </div>
              <div class="block sm:flex justify-between items-center flex-wrap">
                <div class="w-full sm:w-1/2">
                  <div class="flex mb-2 justify-between items-center">
                    <span>Temperatura:</span
                    ><small class="px-2 inline-block">{{ celsius }}°C</small>
                  </div>
                </div>
                <div class="w-full sm:w-1/2">
                  <div class="flex mb-2 justify-between items-center">
                    <span>Umidade</span
                    ><small class="px-2 inline-block"
                      >{{ weatherData.main.humidity }}%</small
                    >
                  </div>
                </div>
                <div class="w-full sm:w-1/2">
                  <div class="flex mb-2 justify-between items-center">
                    <span>Mínima</span
                    ><small class="px-2 inline-block">{{ celsiusMin }}°C</small>
                  </div>
                </div>
                <div class="w-full sm:w-1/2">
                  <div class="flex mb-2 justify-between items-center">
                    <span>Máxima</span
                    ><small class="px-2 inline-block">{{ celsiusMax }}°C</small>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="divider table mx-2 text-center bg-transparent whitespace-nowrap"
            >
              <span class="inline-block px-3"
                ><small>Proximos dias:</small></span
              >
            </div>
            <div class="px-6 py-6 relative">
              <div
                class="text-center justify-between items-center flex"
                style="flex-flow: initial"
              >
                <div
                  class="text-center mb-0 flex items-center justify-center flex-col"
                >
                  <span class="block my-1">Dom</span
                  ><img
                    src="https://i.imgur.com/ffgW9JQ.png"
                    class="block w-8 h-8"
                  /><span class="block my-1">38.3&deg;</span>
                </div>
                <div
                  class="text-center mb-0 flex items-center justify-center flex-col"
                >
                  <span class="block my-1">Seg</span
                  ><img
                    src="https://i.imgur.com/BQbzoKt.png"
                    class="block w-8 h-8"
                  /><span class="block my-1">39.9&deg;</span>
                </div>
                <div
                  class="text-center mb-0 flex items-center justify-center flex-col"
                >
                  <span class="block my-1">Ter</span
                  ><img
                    src="https://i.imgur.com/BQbzoKt.png"
                    class="block w-8 h-8"
                  /><span class="block my-1">40.1&deg;</span>
                </div>
                <div
                  class="text-center mb-0 flex items-center justify-center flex-col"
                >
                  <span class="block my-1">Qua</span
                  ><img
                    src="https://i.imgur.com/ffgW9JQ.png"
                    class="block w-8 h-8"
                  /><span class="block my-1">41.5&deg;</span>
                </div>
                <div
                  class="text-center mb-0 flex items-center justify-center flex-col"
                >
                  <span class="block my-1">Qui</span
                  ><img
                    src="https://i.imgur.com/ffgW9JQ.png"
                    class="block w-8 h-8"
                  /><span class="block my-1">40.1&deg;</span>
                </div>
                <div
                  class="text-center mb-0 flex items-center justify-center flex-col"
                >
                  <span class="block my-1">Sex</span
                  ><img
                    src="https://i.imgur.com/BQbzoKt.png"
                    class="block w-8 h-8"
                  /><span class="block my-1">38&deg;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section :class="ColorFooter">
          <div
            class="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8"
          >
            <nav class="flex flex-wrap justify-center -mx-5 -my-2">
              <div class="px-5 py-2">
                <a
                  href="https://wa.me/5547992126662"
                  target="_blank"
                  class="text-base leading-6 text-gray-100"
                >
                  Contato
                </a>
              </div>
            </nav>
            <div class="flex justify-center mt-8 space-x-6">
              <a
                href="https://instagram.com/gustavorteuber"
                target="_blank"
                class="text-gray-100"
              >
                <span class="sr-only">Instagram</span>
                <svg
                  class="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="https://github.com/gustavorteuber"
                target="_blank"
                class="text-gray-100"
              >
                <span class="sr-only">GitHub</span>
                <svg
                  class="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
            <p class="mt-8 text-base leading-6 text-center text-gray-100">
              © gustavorteuber <br />
              OpenWeatherMap API.
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
