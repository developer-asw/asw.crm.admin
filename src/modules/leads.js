import Vue from 'vue';

const state = {
  lista: [],
  pagination:{
    total : 0,
    page : 1,
    perPage : 100,
    lastPage : 1,
  },
  detalles: {}
};

const actions = {
  fetchLista:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('lead/lista',data).then(
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
  fetchDetalle:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('lead/detalle',data).then(
        response =>{
          commit('setDetalle',response.data.datos);
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
  getDetalle: (state) => (id) =>{
    return state.detalles[id]
  }
};

const mutations = {
  setLista: (state, datos) => {
    state.lista = datos.data;
    state.pagination.total = datos.total;
    state.pagination.page = datos.page;
    state.pagination.perPage = datos.perPage;
    state.pagination.lastPage = datos.lastPage;
  },
  setDetalle: (state, detalle) => {
    state.detalles[detalle._id] = detalle
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
