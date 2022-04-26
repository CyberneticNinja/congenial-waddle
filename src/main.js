
import { createApp } from 'vue'
import App from './App.vue'
import store from "./store";
// import Cookies from 'js-cookie'
import router from './router'
import 'bulma/css/bulma.css'

createApp(App)
.use(store)
.use(router)
.mount('#app')