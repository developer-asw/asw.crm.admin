import Vue from 'vue';

const state = {
    lista: [],
    pagination: {
        total: 0,
        page: 1,
        perPage: 100,
        lastPage: 1,
    }
};

const actions = {
    fetchListadoHijos: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('users/permisos/hijos', data).then(
                response => {
                    commit('setLista', response.data);
                    resolve(response.data)
                }
            ).catch(error => {
                commit('setError', error, {
                    root: true
                });
                reject(error)
            }).finally(() => {
                commit('stopProcessing', null, {
                    root: true
                });
            })
        });
    },
    fetchListadoPadres: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('users/permisos/padres', data).then(
                response => {
                    commit('setLista', response.data);
                    resolve(response.data)
                }
            ).catch(error => {
                commit('setError', error, {
                    root: true
                });
                reject(error)
            }).finally(() => {
                commit('stopProcessing', null, {
                    root: true
                });
            })
        });
    },
    fetchListado: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('users/permisos', data).then(
                response => {
                    commit('setLista', response.data);
                    resolve(response.data)
                }
            ).catch(error => {
                commit('setError', error, {
                    root: true
                });
                reject(error)
            }).finally(() => {
                commit('stopProcessing', null, {
                    root: true
                });
            })
        });
    },
    saveRecord: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('users/permisos', data).then(
                response => {
                    resolve(response.data)
                }
            ).catch(error => {
                commit('setError', error, {
                    root: true
                });
                reject(error)
            }).finally(() => {
                commit('stopProcessing', null, {
                    root: true
                });
            })
        });
    },
    updateRecord: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post(`users/permisos/${data.id}`, data).then(
                response => {
                    resolve(response.data)
                }
            ).catch(error => {
                commit('setError', error, {
                    root: true
                });
                reject(error)
            }).finally(() => {
                commit('stopProcessing', null, {
                    root: true
                });
            })
        });
    },
    deleteRecord: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post(`users/permisos/${data.id}/eliminar`, data).then(
                response => {
                    resolve(response.data)
                }
            ).catch(error => {
                commit('setError', error, {
                    root: true
                });
                reject(error)
            }).finally(() => {
                commit('stopProcessing', null, {
                    root: true
                });
            })
        });
    },
};

const getters = {

};

const mutations = {
    setLista: (state, datos) => {
        state.lista = datos;
        state.pagination.total = datos.length;
        state.pagination.page = datos.page;
        state.pagination.perPage = datos.perPage;
        state.pagination.lastPage = datos.lastPage;
    },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};