import Vue from 'vue';

const state = {
  lista: [],
  detalles: {}
};

const actions = {
  fetchLista:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('lead/lista',data).then(
        response =>{
          commit('setLista',response.data.datos.data);
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
  setLista: (state, lista) => {
    state.lista = lista;
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
