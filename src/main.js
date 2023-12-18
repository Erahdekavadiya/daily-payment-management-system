import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initDB } from './indexDB';

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App);

const vuetify = createVuetify({
  ssr: true,
  components,
  directives,
  icons: {
    iconfont: 'mdi', // Use MDI icons
  },
})

app.use(vuetify);
app.use(router);

initDB(app);