import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import emitterPlugin from './emitter.js';

createApp(App)
  .use(emitterPlugin)
  .use(router)
  .mount('#app');