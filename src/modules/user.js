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
    fetchListado: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('users', {params: data}).then(
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
    saveUser: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('users', data).then(
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
    updateUser: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post(`users/${data.id}`, data).then(
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
    updatePassword: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.patch(`users/${data.id}/password`, data).then(
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
    fetchListadoGrupos: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('users/grupos', data).then(
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
    fetchListadoGestion: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('users/gestiones', data).then(
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
    fetchListadoPerfiles: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('users/perfiles', data).then(
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
    fetchListadoTiposDocumentos: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('users/tipos_documentos', data).then(
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