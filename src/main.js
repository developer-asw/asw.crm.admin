import Vue from 'vue'
import App from './App.vue'
import config from './modules/config'
//import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import JsonExcel from 'vue-json-excel';
import PrimeVue from 'primevue/config';
 
Vue.component('downloadExcel', JsonExcel)

Vue.config.productionTip = false

//vue resource
import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.http.options.root = config.ROOT_API;
Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', `Bearer ${window.localStorage.getItem('_token')}`);
  next();
});
//.vue resource

//moment
import VueMoment from 'vue-moment'
// import es from '/moment/locale/es'
require('moment/locale/es')
//import { ref, reactive } from 'vue'
//Vue.use(ref);
//Vue.use(reactive);
 
Vue.use(VueMoment)
// Vue.moment().locale(es)
// console.log(Vue.moment().locale())
// this.$moment.locale('es')
Vue.use(PrimeVue);
// import Dialog from 'primevue/dialog';
// Vue.component('Dialog', Dialog);
import "primevue/resources/themes/nova-vue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
