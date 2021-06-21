import Vue from 'vue';

const state = {
    lista: [],
    pagination:{
        total : 0,
        page : 1,
        perPage : 100,
        lastPage : 1,
    },
    item1: {
        lista: [],
        pagination:{
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    item2: {
        lista: [],
        pagination:{
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    item3: {
        lista: [],
        pagination:{
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    item4: {
        lista: [],
        pagination:{
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    item5: {
        lista: [],
        pagination:{
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    item6: {
        lista: [],
        pagination:{
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
    },
    item7: {
        lista: [],
        pagination:{
            total : 0,
            page : 1,
            perPage : 100,
            lastPage : 1,
        }
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
    consultarDatosPorDia:({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('lead/dashboard/datos_por_dia',data).then(
                response =>{
                    commit('setItem1',response.data.datos);
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
    consultarDatosGeneral:({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('lead/dashboard/datos_general',data).then(
                response =>{
                    commit('setItem2',response.data.datos);
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
    consultarDatosMasterclass:({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('lead/dashboard/datos_masterclass',data).then(
                response =>{
                    commit('setItem3',response.data.datos);
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
    consultarDatosPresencial:({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('lead/dashboard/datos_presencial',data).then(
                response =>{
                    commit('setItem5',response.data.datos);
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
    consultarDatosMatriculado:({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('lead/dashboard/datos_matriculado',data).then(
                response =>{
                    commit('setItem5',response.data.datos);
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
    consultarDatosPorSede:({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('lead/dashboard/datos_por_sede',data).then(
                response =>{
                    commit('setItem6',response.data.datos);
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
    consultarDatosGeneralPorFecha:({ commit }, data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('lead/dashboard/datos_general_fecha',data).then(
                response =>{
                    commit('setItem7',response.data.datos);
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
    usuarioLogueado:({ commit }) => {
        commit('getUser');
    }

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
    },
    setItem1: (state, datos) => {
        state.item1.lista = datos.data;
        state.item1.pagination.total = datos.total;
        state.item1.pagination.page = datos.page;
        state.item1.pagination.perPage = datos.perPage;
        state.item1.pagination.lastPage = datos.lastPage;
    },
    setItem2: (state, datos) => {
        state.item2.lista = datos.data;
        state.item2.pagination.total = datos.total;
        state.item2.pagination.page = datos.page;
        state.item2.pagination.perPage = datos.perPage;
        state.item2.pagination.lastPage = datos.lastPage;
    },
    setItem3: (state, datos) => {
        state.item3.lista = datos.data;
        state.item3.pagination.total = datos.total;
        state.item3.pagination.page = datos.page;
        state.item3.pagination.perPage = datos.perPage;
        state.item3.pagination.lastPage = datos.lastPage;
    },
    setItem4: (state, datos) => {
        state.item4.lista = datos.data;
        state.item4.pagination.total = datos.total;
        state.item4.pagination.page = datos.page;
        state.item4.pagination.perPage = datos.perPage;
        state.item4.pagination.lastPage = datos.lastPage;
    },
    setItem5: (state, datos) => {
        state.item5.lista = datos.data;
        state.item5.pagination.total = datos.total;
        state.item5.pagination.page = datos.page;
        state.item5.pagination.perPage = datos.perPage;
        state.item5.pagination.lastPage = datos.lastPage;
    },
    setItem6: (state, datos) => {
        state.item6.lista = datos.data;
        state.item6.pagination.total = datos.total;
        state.item6.pagination.page = datos.page;
        state.item6.pagination.perPage = datos.perPage;
        state.item6.pagination.lastPage = datos.lastPage;
    },
    setItem7: (state, datos) => {
        state.item7.lista = datos.data;
        state.item7.pagination.total = datos.total;
        state.item7.pagination.page = datos.page;
        state.item7.pagination.perPage = datos.perPage;
        state.item7.pagination.lastPage = datos.lastPage;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
};
