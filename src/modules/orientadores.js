import Vue from 'vue';

const state = {
  lista: [],
  detalles: {}
};

const actions = {
  fetchLista:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('orientador/lista',data).then(
        response =>{
          commit('setLista',response.data.resultSet);
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
      Vue.http.post('orientador/detalle',data).then(
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
  crear:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('orientador/crear',data).then(
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
  editar:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('orientador/editar',data).then(
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
  eliminar:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('orientador/eliminar',data).then(
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
  
};

const getters = {
  getDetalle: (state) => (id) =>{
    /*
    let examen = state.lista.find(element=>{
      return element.id == id
    }) 
    return examen
    */
    return state.detalles[id]
  }
};

const mutations = {
  setLista: (state, lista) => {
    state.lista = lista;
  },
  setDetalle: (state, detalle) => {
    state.detalles[detalle.id] = detalle
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
