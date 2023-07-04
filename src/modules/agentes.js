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
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.get(`listado/agentes`, data).then(
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
    }
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