import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customDark',
    themes: {
      customDark: {
        dark: true,
        colors: {
          background: '#08283F',      // Deep navy Softhouseish background
          surface: '#08283F',         // Match background for uniform surfaces
          primary: '#ffffff',         // highlight (buttons, links, etc.)
          secondary: '#FFBC57',       // Softhouseish Gold Text color on dark background
          'on-primary': '#000000',    // Text on primary color (e.g., black on gold)
          'on-background': '#ffffff', // Text on background
          'on-surface': '#ffffff',    // Text on surface
          error: '#ff5252',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ff9800',
        }
      }
    }
  }
})

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(vuetify)
  .mount('#app')