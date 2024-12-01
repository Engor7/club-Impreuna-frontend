import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { VueTelegramPlugin } from 'vue-tg'
import router from './router'
import i18n from './i18n'

const app = createApp(App)

app.use(createPinia())
app.use(VueTelegramPlugin)
app.use(router)
app.use(i18n)

app.mount('#app')
