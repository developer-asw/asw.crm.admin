<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <!--<v-subheader>{{pagination.total}} registros</v-subheader>-->
                <v-subheader> - </v-subheader>
                <v-btn small color="info" dark @click="init" :disabled="loading">
                    <v-icon>autorenew</v-icon>
                </v-btn>
                <v-btn small color="info" dark @click="consola" :disabled="loading">
                    <v-icon>info</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            <v-card-title>
                <!--<v-select v-model="payload.prioridad" :items="prioridad" label="Prioridad" item-text="text" item-value="value" :disabled="loading" @change="init"></v-select>-->


                <v-spacer></v-spacer>
                <v-btn color="red darken-1" :disabled="loading" text @click="actualizar">Actualizar</v-btn>
                <!--<v-text-field
                    v-model="payload.search"
                    append-icon="search"
                    clearable
                    label="Search"
                    single-line
                    hide-details
                    class="pa-0 ma-0">
                </v-text-field> -->

            </v-card-title>
            <v-list permanent :close-on-content-click="false">
                <v-subheader>Permisos</v-subheader> 
                <v-list-group v-for="item in permisos_padres" :key="item.id" :value="true" permanent :prepend-icon="item.action" no-action sub-group>
                    <template v-slot:activator>                       
                        <v-list-item-content>
                            <v-list-item-title v-text="item.nombre"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-checkbox  v-model="item.seleccionado" :value="item.seleccionado" @click.prevent="" @change="check(item)"></v-checkbox>
                        </v-list-item-action>
                    </template>
                    <v-list-item-group class="pl-10">
                        <v-list-item v-for="child in item.hijos" :key="child.id">
                            <v-list-item-content>
                                <v-list-item-title v-text="child.nombre"></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-checkbox  v-model="child.seleccionado" :value="child.seleccionado" @click.prevent="" @change="check(child)"></v-checkbox>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list-item-group>
                </v-list-group>
            </v-list>
        </v-card>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
import Vue from 'vue'
import { ref } from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'Permisos',
    components: {
      
    },
    data () {
        return {
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Código', value: 'codigo' },
                { text: 'Nombre', value: 'nombre' },
                { text: 'Descripción', value: 'descripcion' },
                { text: 'Valor', value: 'valor' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            loading: false,
            search: '',
            payload: {
                prioridad: 1,
            },
            //// Edits elementes
            editedIndex: -1,
            dialog: false,
            perfil:{},
            registro: {},
            estados:[{clave:1, valor:"Activo"}, {clave:0, valor:"No activo"}],
            permisos_padres:[],
            permisos:[],
            mainSidebarDrawer:null
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        // if (!this.permiso('OP_ADM_PERMISOS')) {
        //    this.$router.push('/')
        //} else {
            this.init();
        //}
    },
    methods:{
        ...mapActions({
            fetchLista: 'perfiles/fetchPermisos',
            fetchPerfil: 'perfiles/fetchPerfil',
            fetchListaPadres: 'permisos/fetchListadoPadres',
            update: 'perfiles/updatePermisos',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        init(){
            this.getPerfil();
            this.getPermisos();
        },
        getPermisos() {
            this.loading = true;
            this.fetchLista({id:this.$route.params.id}).then(result => {
                this.permisos = result;
                this.getPermisosPadres();
            })
            .finally(() => {
                this.loading = false;
            })
        },
        getPerfil() {
            this.loading = true;
            this.fetchPerfil({id:this.$route.params.id}).then(result => {
                this.perfil = result;
            })
            .finally(() => {
                this.loading = false;
            })
        },
        getPermisosPadres() {
            this.loading = true;
            this.fetchListaPadres(this.payload).then(result => {
                this.permisos_padres = result;
                for(var i in this.permisos_padres) {
                    let esta = this.permisos.find(x => x.id == this.permisos_padres[i].id)
                    if (esta) {
                        this.permisos_padres[i].seleccionado = true;
                    }
                    for(var j in this.permisos_padres[i].hijos) {
                        esta = this.permisos.find(x => x.id == this.permisos_padres[i].hijos[j].id)
                        if (esta) {
                            this.permisos_padres[i].hijos[j].seleccionado = true;
                            this.permisos_padres[i].seleccionado = true;
                        }
                    }
                }
            })
            .finally(() => {
                this.loading = false;
            })
        },
        
        close () {
            this.reiniciar();
            this.dialog = false
        },
        
        actualizar() {
            this.loading = true;
            let ids_guardar = [];
            for(var i in this.permisos_padres) {
                let ids = this.permisos_padres[i].hijos.filter(x => x.seleccionado).map(x => x.id)
                if (ids.length > 0) {
                    this.permisos_padres[i].seleccionado = true;
                }
                if (this.permisos_padres[i].seleccionado) {
                    ids_guardar.push(this.permisos_padres[i].id);
                }
                if (ids.length > 0) {
                    ids_guardar.push(...ids);
                }
            }
            let record = {perfil_id:this.$route.params.id, permisos:ids_guardar};
            this.loading = false;
            this.update(record).then(result =>  {
                if (result.code == 1) {
                    this.init();
                    this.setInfo(result.mensaje);
                    this.dialog = false;
                }
                else {
                    if (result.mensaje) {
                        this.setInfo(result.mensaje);
                    } else {
                        this.setInfo("Ocurrio un error al procesar la solicitud, por favor intentelo más tarde");
                    }
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        submitHandlerPassword(){
            if (this.$refs.formPass.validate()){
                this.loading = true;
                this.updatePassword(this.registro).then(result =>  {
                    if (result.code == 1) {
                        this.setInfo(result.mensaje);
                        this.dialogPassword = false;
                    }
                    else {
                        if (result.mensaje) {
                            this.setInfo(result.mensaje);
                        } else {
                            this.setInfo("Ocurrio un error al procesar la solicitud, por favor intentelo más tarde");
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                })
            }
        },
        reiniciar() {
            this.registro = {};
            if (this.$refs.formEdit) {
                this.$refs.formEdit.resetValidation()
            }
        },
        check(item) {
            let encontrado = -1;
            if (item.seleccionado) {
                encontrado = this.permisos_padres.map(x => x.id).indexOf(item.permiso_padre_id);
                if (encontrado > -1) {
                    this.permisos_padres[encontrado].seleccionado = item.seleccionado;
                }
            }
            encontrado = this.permisos_padres.map(x => x.id).indexOf(item.id);
            if (encontrado > -1 && this.permisos_padres[encontrado].hijos && this.permisos_padres[encontrado].hijos.length > 0) {
                this.permisos_padres[encontrado].hijos.forEach(x => x.seleccionado = item.seleccionado);
            }
            this.permisos_padres = ref(this.permisos_padres);
        },
        consola() {
            console.log(this.permisos_padres)
        },
    },
    computed: {
        ...mapState({
            lista: state => state.permisos.lista,
            pagination: state => state.permisos.pagination,
            user: state => state.auth.user_info,   
        }),
        ...mapGetters({
            permiso: 'auth/permiso', 
        }),
        getTitle(){
            return `Asignar Permisos a '${this.perfil.nombre}'`
        },
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo' : 'Editar'
        },
        rules(){
            const _rules = {}
            _rules.nombre = [
                v => !!v || 'El campo Nombre es necesario',
                v => (v && v.length > 2) || 'El nombre debe ser mayor de 2 caracteres',
            ];
            return _rules;
        },
    },
    watch: {
        
    }
}
</script>