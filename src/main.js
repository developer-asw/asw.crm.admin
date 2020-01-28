import Vue from 'vue'
import App from './App.vue'
import config from './modules/config'
//import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

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


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
