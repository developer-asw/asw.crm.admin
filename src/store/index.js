import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router';
import auth from '@/modules/auth';
import leads from '@/modules/leads';
import plantillas from '@/modules/plantillas';
import orientadores from '@/modules/orientadores';
import agenda from '@/modules/agenda';
import sedes from '@/modules/sedes';
import callcenter from '@/modules/callcenter';
import recepcionista from '@/modules/recepcion';
import callcenter_coordinator from '@/modules/callcenter_coordinator';
import contact from '@/modules/contact';
import callcenter_admisiones from '@/modules/callcenter_admisiones';
import crm from '@/modules/crm';
import listado from '@/modules/listado';
import reportes from '@/modules/reportes';
import dashboard from '@/modules/dashboard';
import consultar from '@/modules/consultar';
import coordinador from '@/modules/coordinador';
import admisiones from '@/modules/admisiones';
import management from '@/modules/management';
import user from '@/modules/user';

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    processing: false,
    warning: null,
    info: null,
    error: null,
    isInfoShowed: false,
    isErrorShowed: false,
    version: null,
    titulo:null
    
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
              router.push('/login')
            }
            state.error = data.error.message;
          }else{
            state.error = data.error;
            if(data.salir) {
              this.dispatch('auth/logout')
              router.push('/login')
            }
          }  
        }else{
          state.error = data;
        }
      }else{
        state.error = responseApi;
      }
      state.isErrorShowed = true
      //setTimeout(() => {
      //  state.error = null
      //},3000)
    },
    setVersion:  (state, response) => {
      state.version = response.version
    },
    setTitulo:  (state, titulo) => {
      state.titulo = titulo
    },
    showError:  (state) => {
      state.isErrorShowed = true
    },
    hideError:  (state) => {
      state.isErrorShowed = false
    },
    setInfo (state, value) {
      state.info = value
      state.isInfoShowed = true
      return new Promise((resolve) => {
        setTimeout(function () {
          state.isInfoShowed = false
          resolve()
        }, 2000)
      })
    },
    showInfo:  (state) => {
      state.isInfoShowed = true
    },
    hideInfo:  (state) => {
      state.isInfoShowed = false
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
    setTituloVentana ({state}, value) {
      state.titulo = value
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
    plantillas,
    orientadores,
    agenda,
    callcenter,
    callcenter_coordinator,
    contact,
    callcenter_admisiones,
    sedes,
    crm,
    listado,
    reportes,
    dashboard,
    consultar,
    recepcionista,
    coordinador,
    admisiones,
    management,
    user,
  }
})


export default store;