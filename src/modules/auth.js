import Vue from 'vue';

const state = {
  user: null,
  user_info:null,
  logged: !!window.localStorage.getItem('_token')
};

const actions = {
  login: ({commit}, userInput) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
      Vue.http.post('login', {user: userInput})
        .then(user => {
            window.localStorage.setItem('_token', user.body.token);
            commit('setUser');
            resolve(user);
        })
        .catch(response => {
          commit('setError', response, { root: true });
          reject(response);
        })
        .finally(() => {
          commit('stopProcessing', null, { root: true });
        })
    })
  },
  getGrupo:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
        Vue.http.get('usuario/grupo',data).then(
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
  getUsuario:({commit},data) => {
    commit('startProcessing', null, { root: true });
    return new Promise((resolve, reject) => {
        Vue.http.get('usuario/informacion',data).then(
            response =>{
              commit('setUserInfo', response.data);
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
  logout: ({commit}) => {
    window.localStorage.removeItem('_token');
    commit('setUser');
    /*
    commit('docentes/restart',null,{ root: true });
    */
    
  },
  
};

const getters = {
  permiso: (state) => (permiso) => {
    if(state.user_info && state.user_info.permisos) {
      return state.user_info.permisos.find((element)=>{
        return element == permiso
      })
    }else if(state.user && state.user.data && state.user.data.permisos) {
      return state.user.data.permisos.find((element)=>{
        return element == permiso
      })
    }else{
      return false;
    }
    
  },
};

const mutations = {
  //establecemos el user a través del token jwt
  setUser: (state) => {
    if(window.localStorage.getItem('_token')) {
      const token = window.localStorage.getItem('_token');
      const jwtDecode = require('jwt-decode');
      state.user = jwtDecode(token);
      state.logged = true;
    } else {
      state.logged = false;
      state.user = null;

    }
  },
  setUserInfo: (state, user) => {
    state.user_info = user;
  },
  //establecemos el estado del usuario
  setLogged: (state, logged) => {
    state.logged = logged;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};