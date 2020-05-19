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
    fetchHits:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('reportes/hits',data).then(
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
    fetchLlamadas:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('reportes/llamadas',data).then(
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
    fetchLeads:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('reportes/leads',data).then(
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
};

const getters = {
  
};

const mutations = {
  setLista: (state, datos) => {
    state.lista = datos;
    state.pagination.total = datos.total;
    state.pagination.page = datos.page;
    state.pagination.perPage = datos.perPage;
    state.pagination.lastPage = datos.lastPage;
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
