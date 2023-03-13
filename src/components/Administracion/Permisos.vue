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
                <v-text-field
                    v-model="payload.search"
                    append-icon="search"
                    clearable
                    label="Search"
                    single-line
                    hide-details
                    class="pa-0 ma-0">
                </v-text-field> 

            </v-card-title>
            <v-data-table
                
                :headers="headers"
                :items="lista"
                :search="payload.search"
                :loading="loading"
                loading-text="Loading... Please wait"
                class="elevation-2"
                :disabled="loading">
                <!--<template v-slot:[`item.full_name`]="{ item }">
                    <span @click="$copyText(item.full_name);setInfo(item.full_name)">{{item.full_name}}</span>
                </template>-->
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Listado</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" persistent max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Perfil</v-btn>
                            </template>
                            <v-card>
                                <v-form ref="formEdit" @submit.prevent="submitHandler">
                                    <v-card-title>
                                        <span class="text-h5">{{ formTitle }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                                <v-row>

                                                    
                                                    <v-col>
                                                        <v-select v-model="registro.permiso_padre_id" :disabled="loading" :items="permisos_padres" label="Permiso Padre" item-text="nombre" item-value="id"></v-select>
                                                    </v-col>

                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="registro.codigo" :disabled="loading" label="Código" :rules="rules.codigo"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="registro.nombre" :disabled="loading" label="Nombre" :rules="rules.nombre"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="registro.descripcion" :disabled="loading" label="Descripción" :rules="rules.descripcion"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="registro.valor" :disabled="loading" label="Valor" :rules="rules.valor"></v-text-field>
                                                    </v-col>
                                                    
                                                    
                                                    <v-col v-if="registro.id" >
                                                        <v-select v-model="registro.activo" :disabled="loading" :items="estados" label="Estado" item-text="valor" item-value="clave"></v-select>
                                                    </v-col>
                                                    
                                                </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" :disabled="loading" text @click="close"> Cancelar</v-btn>
                                        <v-btn color="red darken-1" :disabled="loading" text type="submit">Guardar</v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5">¿Estás seguro de que quieres eliminar este perfil '{{registro.nombre}}'?</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeDelete">No</v-btn>
                                        <v-btn color="blue darken-1" text @click="deleteRecordConfirm">Si, estoy seguro</v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                            </v-card>
                        </v-dialog>
                        
                    </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small color="orange darken-1" @click="editRecord(item)">
                        edit
                    </v-icon>
                    <v-icon small color="red darken-1" @click="deleteRecord(item)">
                        close
                    </v-icon>
                    <!--<v-btn class="ma-0"  x-small link color="green darken-1" text :to="{ name: 'ADMAsignarPermisos', params: { id: item.id } }"><v-icon left small>list</v-icon> </v-btn>-->

                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
import Vue from 'vue'
// import { reactive } from 'vue'
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
            dialogPassword: false,
            dialogDelete: false,
            registro: {},
            estados:[{clave:1, valor:"Activo"}, {clave:0, valor:"No activo"}],
            permisos_padres:[],
            permisos_hijos:[]
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        if (!this.permiso('OP_ADM_ASIGNAR_PERMISOS')) {
            this.$router.push('/')
        } else {
            this.init();
        }
    },
    methods:{
        ...mapActions({
            fetchLista: 'permisos/fetchListado',
            saveRecord: 'permisos/saveRecord',
            updateRecord: 'permisos/updateRecord',
            delete: 'permisos/deleteRecord',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        init(){
            this.getPermisos();
        },
        getPermisos() {
            this.loading = true;
            this.fetchLista(this.payload)
            .finally(() => {
                this.loading = false;
            })
        },        
        close () {
            this.reiniciar();
            this.dialog = false
        },
        
        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
            this.registro = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            })
        },
        
        closePassword () {
            this.dialogPassword = false
            this.reiniciarPassword();
        },

        editRecord (item) {
            this.reiniciar();
            let registro = {... item}
            this.registro = registro;
            this.dialog = true
        },
        deleteRecord (item) {
            let registro = {... item};
            this.registro = registro;
            this.dialogDelete = true
        },
        deleteRecordConfirm () {
            this.loading = true;
            this.delete(this.registro).then(result =>  {
                if (result.code == 1) {
                    this.getPermisos();
                    this.setInfo(result.mensaje);
                    this.closeDelete();
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
        showPermisos() {

        },
        submitHandler(){
            if (this.$refs.formEdit.validate()){
                if (this.registro.id) {
                    this.actualizar();
                } else {
                    this.crear();
                }
            }
        },
        crear() {
            this.loading = true;
            this.saveRecord(this.registro).then(result =>  {
                if (result.code == 1) {
                    this.getPermisos();
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
        actualizar() {
            this.loading = true;
            this.updateRecord(this.registro).then(result =>  {
                if (result.code == 1) {
                    this.getPermisos();
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
        consola() {
            console.log(this.registro)
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
            return 'Permisos'
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