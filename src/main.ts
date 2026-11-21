import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vSpatialTilt } from './composables/useSpatialTilt'
import './style.css'

const app = createApp(App)
app.use(router)
app.directive('spatial-tilt', vSpatialTilt)
app.mount('#app')
