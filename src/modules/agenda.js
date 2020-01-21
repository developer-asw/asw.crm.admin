import Vue from 'vue';

const state = {
  agenda_actual: [],
  agenda_historico: [],
  franjas:[]
};

const actions = {
  fetchActualCompleta:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('agenda_actual/completa',data).then(
        response =>{
          commit('setAgendaActual',response.data.resultSet);
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
  confirmarAsistencia:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('agenda_actual/confirmar_asistencia',data).then(
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
  fetchFranjas:({commit}) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('franjas').then(
        response =>{
          commit('setFranjas',response.data.resultSet);
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
  setAgendaActual: (state, lista) => {
    state.agenda_actual = lista;
  },
  setAgendaHistorico: (state, lista) => {
    state.agenda_historico = lista;
  },
  setFranjas: (state, lista) => {
    state.franjas = lista;
  },
  restart: (state) => {
    state.agenda_actual = []
    state.agenda_historico = []
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
