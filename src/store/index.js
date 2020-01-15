import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/modules/auth';
import leads from '@/modules/leads';
import plantillas from '@/modules/plantillas';

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    processing: false,
    warning: null,
    error: null,
    version: null
  },
  getters:{

  },
  mutations: {
    startProcessing (state) {
      state.processing = true;
    },
    stopProcessing (state) {
      state.processing = false;
    },
    setError (state, responseApi) {
      if(responseApi.data){
        let data = responseApi.data
        if(data.error){
          if(data.error.message){
            if(data.error.name && data.error.name=='InvalidJwtToken'){
              state.error = 'Acceso no autorizado';
              this.dispatch('auth/logout')
              this.$router.push('/login')
            }
            state.error = data.error.message;
          }else{
            state.error = data.error;
          }  
        }else{
          state.error = data;
        }
      }else{
        state.error = responseApi;
      }
      
      setTimeout(() => {
        state.error = null
      },3000)
    },
    setVersion:  (state, response) => {
      state.version = response.version
    },
  },
  actions: {
    setWarning ({state}, value) {
      state.warning = value
      return new Promise((resolve) => {
        setTimeout(function () {
          state.warning = null
          resolve()
        }, 2000)
      })
    },
    fetchVersion: ({commit}) => {
      return new Promise((resolve, reject) => {
        Vue.http.post('version')
          .then(response => {
              commit('setVersion',response.data);
              resolve(response.data);
          })
          .catch(response => {
            reject(response);
          })
          .finally(() => {})
      })
    },
  },
  modules: {
    auth,
    leads,
    plantillas
  }
})


export default store;