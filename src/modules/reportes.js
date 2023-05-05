import Vue from 'vue';

const state = {
    agentes:{
        lista:[],
        pagination: {
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    referidos:{
        lista:[],
        pagination: {
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    hits:{
        lista:[],
        pagination: {
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    citas:{
        lista:[],
        pagination: {
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    leads:{
        lista:[],
        pagination: {
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    llamadas:{
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
    fetchHits:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('reportes/hits',data).then(
                response =>{
                    commit('setHits',response.data.datos);
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
                    commit('setLlamadas',response.data.datos);
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
                    commit('setLeads',response.data.datos);
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
    fetchCitas:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('reportes/citas',data).then(
                response =>{
                    commit('setCitas',response.data.datos);
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
    fetchCitasParametros:({commit}, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('listado/citas',data).then(
                response =>{
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
    fetchAgentes:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('reportes/agentes',data).then(
                response =>{
                    commit('setAgentes',response.data.datos);
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
    fetchReferidos:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('reportes/referidos',data).then(
                response =>{
                    commit('setReferidos',response.data.datos);
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
  setAgentes: (state, datos) => {
    state.agentes.lista = datos;
    state.agentes.pagination.total = datos.total;
    state.agentes.pagination.page = datos.page;
    state.agentes.pagination.perPage = datos.perPage;
    state.agentes.pagination.lastPage = datos.lastPage;
  },
  setCitas: (state, datos) => {
    state.citas.lista = datos;
    state.citas.pagination.total = datos.total;
    state.citas.pagination.page = datos.page;
    state.citas.pagination.perPage = datos.perPage;
    state.citas.pagination.lastPage = datos.lastPage;
  },
  setHits: (state, datos) => {
    state.hits.lista = datos;
    state.hits.pagination.total = datos.total;
    state.hits.pagination.page = datos.page;
    state.hits.pagination.perPage = datos.perPage;
    state.hits.pagination.lastPage = datos.lastPage;
  },
  setLeads: (state, datos) => {
    state.leads.lista = datos;
    state.leads.pagination.total = datos.total;
    state.leads.pagination.page = datos.page;
    state.leads.pagination.perPage = datos.perPage;
    state.leads.pagination.lastPage = datos.lastPage;
  },
  setLlamadas: (state, datos) => {
    state.llamadas.lista = datos;
    state.llamadas.pagination.total = datos.total;
    state.llamadas.pagination.page = datos.page;
    state.llamadas.pagination.perPage = datos.perPage;
    state.llamadas.pagination.lastPage = datos.lastPage;
  },
  setReferidos: (state, datos) => {
    state.referidos.lista = datos;
    state.referidos.pagination.total = datos.total;
    state.referidos.pagination.page = datos.page;
    state.referidos.pagination.perPage = datos.perPage;
    state.referidos.pagination.lastPage = datos.lastPage;
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
