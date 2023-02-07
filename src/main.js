import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import dotenv from "dotenv";

createApp(App).mount("#app");
const app = createApp(App);
dotenv.config();
