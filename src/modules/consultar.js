import Vue from 'vue';

const state = {
    lista: [],
    pagination:{
        total : 0,
        page : 1,
        perPage : 100,
        lastPage : 1,
    },
    detalles: {},
    user: null,
    logged: !!window.localStorage.getItem('_token')
};

const actions = {
    consultarDashboard:({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('lead/dashboard',data).then(
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
    filtro:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('callcenter/filtro_cordinador',data).then(
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
    getDetalle: (state) => (id) =>{
        return state.detalles[id]
    }
};

const mutations = {
    //establecemos el user a través del token jwt
    getUser: (state) => {
        if(window.localStorage.getItem('_token')) {
            const token = window.localStorage.getItem('_token');
            const jwtDecode = require('jwt-decode');
            state.user = jwtDecode(token);
            //state.user.permisos = JSON.parse(state.user.data.permisos)
            state.logged = true;
        } else {
            state.logged = false;
            state.user = null;
        }
    },
    setLista: (state, datos) => {
        state.lista = datos.data;
        state.pagination.total = datos.total;
        state.pagination.page = datos.page;
        state.pagination.perPage = datos.perPage;
        state.pagination.lastPage = datos.lastPage;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
};
