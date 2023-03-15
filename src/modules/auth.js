import Vue from 'vue';

const state = {
  user: undefined,
  user_info:undefined,
  url_no_permitida:'/',
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
              window.localStorage.setItem('_usr', JSON.stringify(response.data));
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
    if (state.user_info && state.user_info.perfil && state.user_info.perfil.nombre == "Superusuario") return true;
    else if(state.user_info && state.user_info.perfil && state.user_info.perfil.permisos) {
      return state.user_info.perfil.permisos.find((element)=>{
        return element.codigo == permiso
      })
    } else {
      let user = JSON.parse(window.localStorage.getItem('_usr'));
      if (user) {
        if (user.perfil_id == 1) {
          return true;
        } else if(user.perfil && user.perfil.permisos) {
          return user.perfil.permisos.find((element)=>{
            return element.codigo == permiso
          })
        }
      }
      let permisos = JSON.parse(window.localStorage.getItem('_permissions'));
      if (permisos && permisos) {
        return permisos.find((element)=>{
          return element == permiso
        })
      }
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
    if (user.perfil && user.perfil.permisos) {
      window.localStorage.setItem('_permissions', JSON.stringify(user.perfil.permisos.map(x => x.codigo)));
    }
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