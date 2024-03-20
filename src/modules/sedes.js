import Vue from 'vue';

const state = {
    lista: [],
    pagination: {
        total: 0,
        page: 1,
        perPage: 100,
        lastPage: 1,
    },
};
const actions = {
    fetchLista: ({ commit }, data) => {
        commit('startProcessing', null, {
            root: true
        });
        return new Promise((resolve, reject) => {
            Vue.http.get('sedes/lista', data).then(
                response => {
                    commit('setLista', response.data.datos);
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
    fetch: ({ commit }, data) => {
        commit('startProcessing', null, {
            root: true
        });
        return new Promise((resolve, reject) => {
            Vue.http.get('sedes', {params: data}).then(
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
    get: ({ commit }, id) => {
        commit('startProcessing', null, {
            root: true
        });
        return new Promise((resolve, reject) => {
            Vue.http.get(`sedes/${id}/primero`).then(
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
    fetchListado: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get('sedes', {params: data}).then(
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
    saveSede: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('sedes', data).then(
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
    updateSede: ({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post(`sedes/${data.id}`, data).then(
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
}


const getters = {

}


const mutations = {
    setLista: (state, datos) => {
        state.lista = datos;
    }

}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}