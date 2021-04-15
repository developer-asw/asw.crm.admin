import Vue from 'vue';

const state = {
  lista: [],
  pagination:{
    total : 0,
    page : 1,
    perPage : 100,
    lastPage : 1,
  },
  consultas:{
    lista:[],
    pagination: {
        total : 0,
        page : 1,
        perPage : 100,
        lastPage : 1,
    }
  },
  detalles: {}

};

const actions = {
  fetchLista:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('callcenter/lista?v1',data).then(
        response =>{
          commit('setLista',response.data.datos);
          resolve(response.data)
        }
      ).catch(error=>{
        commit('setError', error, { root: true });
        reject(error)
      }).finally(()=>{
        commit('stopProcessing', null, { root: true });
      })
    });
  },
  fetchListaConvenio:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('callcenter/convenio?v1',data).then(
        response =>{
          commit('setConsulta',response.data.datos);
          resolve(response.data)
        }
      ).catch(error=>{
        commit('setError', error, { root: true });
        reject(error)
      }).finally(()=>{
        commit('stopProcessing', null, { root: true });
      })
    });
  },
  fetchListaEnCola:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('callcenter/stack?v1',data).then(
        response =>{
          commit('setLista',response.data.datos);
          resolve(response.data)
        }
      ).catch(error=>{
        commit('setError', error, { root: true });
        reject(error)
      }).finally(()=>{
        commit('stopProcessing', null, { root: true });
      })
    });
  },
  fetchSeguimiento:({commit}, data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('callcenter/seguimiento',data).then(
        response =>{
          commit('setLista',response.data.datos);
          resolve(response.data)
        }
      ).catch(error=>{
        commit('setError', error, { root: true });
        reject(error)
      }).finally(()=>{
        commit('stopProcessing', null, { root: true });
      })
    });
  },
  solicitar:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('callcenter/solicitar',data).then(
        response =>{
          commit('replaceListaElement',response.data.lead);
          resolve(response.data)
        }
      ).catch(error=>{
        commit('setError', error, { root: true });
        reject(error)
      }).finally(()=>{
        commit('stopProcessing', null, { root: true });
      })
    });
  },
  cerrar:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('callcenter/cerrar',data).then(
        response =>{
          if(response.data.lead){
            commit('replaceListaElement',response.data.lead);  
          }
          resolve(response.data)
        }
      ).catch(error=>{
        commit('setError', error, { root: true });
        reject(error)
      }).finally(()=>{
        commit('stopProcessing', null, { root: true });
      })
    });
  },
  
};

const getters = {
  
};

const mutations = {
  setLista: (state, datos) => {
    state.lista = datos.data;
    state.pagination.total = datos.total;
    state.pagination.page = datos.page;
    state.pagination.perPage = datos.perPage;
    state.pagination.lastPage = datos.lastPage;
  },
  setConsulta: (state, datos) => {
    state.consultas.lista = datos.data;
    state.consultas.pagination.total = datos.total;
    state.consultas.pagination.page = datos.page;
    state.consultas.pagination.perPage = datos.perPage;
    state.consultas.pagination.lastPage = datos.lastPage;
  },
  replaceListaElement: (state, e) => {
    let index = state.lista.findIndex(element=>{
      return element._id==e._id
    })
    if(index>=0){
      console.log('encontrado en:'+index)
      state.lista.splice(index,1,e)
    }
  },
  restart: (state) => {
    state.lista = []
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
