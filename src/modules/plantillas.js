import Vue from 'vue';

const state = {
  lista: [],
  total:null,
  page: 1,
  perPage: 100,
  lastPage: 1,
  detalles: {

  }
};

const actions = {
  fetchLista:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('plantilla/lista',data).then(
        response =>{
          commit('setLista',response.data.resultSet);
          resolve(response)
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
      Vue.http.post('plantilla/detalle',data).then(
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
      Vue.http.post('plantilla/crear',data).then(
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
      Vue.http.post('plantilla/editar',data).then(
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
      Vue.http.post('plantilla/eliminar',data).then(
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
  setLista: (state, resultSet) => {
    state.lista = resultSet.data;
    state.total = resultSet.total;
    state.page = resultSet.page;
    state.perPage = resultSet.perPage;
    state.lastPage = resultSet.lastPage;
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
