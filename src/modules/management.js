import Vue from 'vue';

const state = {
    lista: [],
    incoming_data: [],
    missed_appointments: [],
    parameters:[],
    pagination:{
        total : 0,
        page : 1,
        perPage : 100,
        lastPage : 1,
    },
    detalles: {}
};

const actions = {
    fetchIncomingData:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('management/incoming_data',data).then(
                response =>{
                    commit('setIncomingData',response.data.datos);
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
    fetchSendIncomingData:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('management/send_incoming_data',data).then(
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
    fetchMissedAppointments:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('management/missed_appointments',data).then(
                response =>{
                    commit('setMissedAppointments',response.data.datos);
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
    updateSendIncommingData:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('management/update_incoming_data_auto',data).then(
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
    getSendIncomingDataAuto:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('management/get_incoming_data_auto',data).then(
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
    fetchParameters:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('management/parameters',data).then(
                response =>{
                    commit('setParameters',response.data.datos);
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
    saveRecordParameter:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
            Vue.http.post('management/save_parameter',data).then(
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
    }
};

const getters = {
    getDetalle: (state) => (id) =>{
        return state.detalles[id]
    },
    getHistorial: (state) => () =>{
        return state.historial
    }
};

const mutations = {
    setLista: (state, datos) => {
        state.lista = datos.data;
        state.pagination.total = datos.total;
        state.pagination.page = datos.page;
        state.pagination.perPage = datos.perPage;
        state.pagination.lastPage = datos.lastPage;
    },
    setIncomingData: (state, datos) => {
        state.incoming_data = datos
    },
    setMissedAppointments: (state, datos) => {
        state.missed_appointments = datos
    },
    setParameters: (state, datos) => {
        state.parameters = datos
    },
    replaceListaElement: (state, e) => {
        let index = state.lista.findIndex(element=>{
            return element._id==e._id
        })
        if(index>=0){
            state.lista.splice(index,1,e)
        }
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
