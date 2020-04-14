import Vue from 'vue';

const state = {
    lista: [],
    headers: [
        { text: 'Próximo contacto', value: 'fecha_proximo_contacto' },
        //{ text: 'Primer contacto', value: 'inicia_callcenter' },
        { text: 'Nombre', value: 'full_name' },
        { text: 'Móvil', value: 'movil' },
        { text: 'Email', value: 'email' },
        { text: 'Sede', value: 'sede' },
        { text: 'Agente', value: 'ultima_llamada.agente.nombre' },
        { text: 'Actions', value: 'action', sortable: false }
    ],
    pagination:{
      total : 0,
      page : 1,
      perPage : 100,
      lastPage : 1,
    },
    detalles: {}
  
};

const actions = {
    fetchLista:({commit},data) => {
        commit('startProcessing', null, { root: true });
        return new Promise((resolve, reject) => {
        Vue.http.post('callcenter/lista',data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
         }).then(
            response => {
                commit('setLista',response.data.datos);
                resolve(response.data)
            }
        ).catch(error => {
            commit('setError', error, { root: true });
            reject(error)
        }).finally(()=>{
            commit('stopProcessing', null, { root: true });
        })
        });
    },
    fileUpload: ({ commit }, files) => {
        if (files) {
            console.log("Preparando datos para enviar archivos");
            commit('startProcessing', null, { root: true });
            let formData = armarFormData(files);
            return new Promise((resolve, reject) => {
                Vue.http
                    .post("crm/archivo/importar", formData)
                    .then(response => {
                        commit('setInfo', response.body.mensaje, { root: true });
                        // console.log({ response });
                        commit('setEncabezado',response.body.encabezados);
                        commit('setLista',response.body.datos);
                        resolve(response.data)
                    })
                    .catch(error => {
                        commit('setError', error, { root: true });
                        reject(error)
                    });
            });
        } else {
            commit('setError', 'No ha cargado archivos', { root: true });
        }
    },
};

const getters = {
  
};

const mutations = {
    setLista: (state, datos) => {
        state.lista = datos.data;
        state.pagination.total = datos.total;
        state.pagination.page = datos.page;
        state.pagination.perPage = datos.perPage;
        state.pagination.lastPage = datos.lastPage;
    },
    setEncabezado: (state, datos) => {
        state.headers = datos;
    },
    replaceListaElement: (state, e) => {
        let index = state.lista.findIndex(element=>{
        return element._id==e._id
        })
        if(index>=0){
        console.log('encontrado en:' + index)
        state.lista.splice(index, 1, e)
        }
    },
    restart: (state) => {
        state.lista = []
    }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
function armarFormData(file) {
    let formData = new FormData();
    // files
    // for (let file of files) {
    //     formData.append("files", file, file.name);
    // }
    formData.append("upload", file, file.name);
    // additional data
    //formData.append("test", "foo bar");
    return formData;
}

