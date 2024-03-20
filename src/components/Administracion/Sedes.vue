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
                <v-select v-model="payload.activo" :items="estados" label="Activos" item-text="valor" item-value="clave" :disabled="loading" @change="getSedes"></v-select>

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
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">{{!sede.id ? 'Nueva Sede' : 'Editar Sede'}}</v-btn>
                            </template>
                            <v-card>
                                <v-form ref="formEdit" @submit.prevent="submitHandler">
                                    <v-card-title>
                                        <span class="text-h5">{{ formTitle }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                                <v-row>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="sede.nombre" :disabled="loading" label="Nombre" :rules="rules.nombre"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="sede.direccion" :disabled="loading" label="Dirección" :rules="rules.direccion"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="sede.ciudad" :disabled="loading" label="Ciudad"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="sede.telefono" :disabled="loading" label="Teléfono"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="sede.maps" :disabled="loading" label="Enlace Google Maps" :rules="rules.maps"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="sede.codigo_alyssa" :disabled="loading" label="Codigo Alyssa"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="sede.codigo_skills" :disabled="loading" label="Codigo Skills"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="sede.es_virtual" :disabled="loading" :items="virtual" label="Es Virtual" item-text="valor" item-value="clave"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" v-if="sede.id" >
                                                        <v-select v-model="sede.activo" :disabled="loading" :items="estados" label="Estado" item-text="valor" item-value="clave"></v-select>
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
                        
                    </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon @click="editSede(item)">
                        edit
                    </v-icon>
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
    name: 'Sedes',
    components: {
      
    },
    data () {
        return {
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Sede', value: 'nombre' },
                { text: 'Dirección', value: 'direccion' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            loading: false,
            search: '',
            payload: {
                prioridad: 1,
                activo:1,
                search:null,
            },
            //// Edits elementes
            editedIndex: -1,
            dialog: false,
            dialogPassword: false,
            dialogDelete: false,
            sede: {},
            virtual:[{clave:1, valor:"Virtual"}, {clave:0, valor:"Presencial"}],
            estados:[{clave:1, valor:"Activo"}, {clave:0, valor:"No activo"}]
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        if (!this.permiso('OP_ADM_SEDES')) {
            this.$router.push('/')
        } else {
            this.init();
        }
    },
    methods:{
        ...mapActions({
            fetchLista: 'sedes/fetch',
            get: 'sedes/get',
            saveRecord: 'sedes/saveUser',
            updateRecord: 'sedes/updateUser',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        init(){
            this.getSedes();
        },
        getSedes() {
            this.loading = true;
            let payload = {activo:this.payload.activo};
            this.fetchLista(payload)
            .finally(() => {
                this.loading = false;
            })
        },
        getSede(id) {
            this.loading = true;
            this.get(id).then((result) => {
                console.log(result);
                
                let sede = {... result};
                this.sede = sede;
                this.dialog = true
            })
            .finally(() => {
                this.loading = false;
            })
        },
        

        close () {
            this.reiniciar();
            this.dialog = false
        },

        editSede (item) {
            this.reiniciar();
            this.getSede(item.id)
        },
        submitHandler(){
            if (this.$refs.formEdit.validate()){
                if (this.sede.id) {
                    this.actualizar();
                } else {
                    this.crear();
                }
            }
        },
        crear() {
            this.loading = true;
            this.saveRecord(this.sede).then(result =>  {
                if (result.code == 1) {
                    this.getSedes();
                    this.setInfo(result.mensaje);
                    this.reiniciar();
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
            this.updateRecord(this.sede).then(result =>  {
                if (result.code == 1) {
                    this.getSedes();
                    this.setInfo(result.mensaje);
                    this.reiniciar();
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

        reiniciar() {
            this.sede = {};
            if (this.$refs.formEdit) {
                this.$refs.formEdit.resetValidation()
            }
        },

        consola() {
            console.log(this.sede)
        },
    },
    computed: {
        ...mapState({
            lista: state => state.sedes.lista,
            pagination: state => state.user.pagination,
            user: state => state.auth.user_info,
        }),
        ...mapGetters({
            permiso: 'auth/permiso', 
        }),
        getTitle(){
            return 'Sedes'
        },
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo' : 'Editar'
        },
        rules(){
            const _rules = {}
            // _rules.email= [
            //     v => !!v || 'El campo E-mail es necesario',
            //     v => /.+@.+\..+/.test(v) || 'El E-mail debe ser válido',
            // ];
            
            return _rules;
        }
    },
    watch: {
        
    }
}
</script>