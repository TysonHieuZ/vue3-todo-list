import { createApp } from 'vue'
import { createPinia } from 'pinia' // Phải import cái này
import App from './App.vue'
import { router } from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia() // Tạo thực thể pinia

app.use(pinia) // Kích hoạt pinia TRƯỚC KHI mount
app.use(router)
app.mount('#app')