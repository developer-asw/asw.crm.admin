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
                dense
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
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Usuario</v-btn>
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
                                                        <v-select v-model="usuario.tipo_documento" :disabled="loading" :items="tipos_documentos" label="Tipo Documento" item-text="nombre" item-value="id" :rules="rules.tipo_documento"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="usuario.numero_documento" :disabled="loading" label="Numero Documento" :rules="rules.numero_documento"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="usuario.primer_nombre" :disabled="loading" label="Primer Nombre" :rules="rules.primer_nombre"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="usuario.segundo_nombre" :disabled="loading" label="Segundo Nombre"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="usuario.primer_apellido" :disabled="loading" label="Primer Apellido" :rules="rules.primer_apellido"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="usuario.segundo_apellido" :disabled="loading" label="Segundo Apellido"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" v-if="!usuario.id">
                                                        <v-text-field type="password" v-model="usuario.password" :disabled="loading" label="Contraseña" :rules="rules.password"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" v-if="!usuario.id">
                                                        <v-text-field type="password" v-model="usuario.repetir_password" :disabled="loading" label="Repetir Contraseña" :rules="rules.repetir_password.concat(passwordConfirmationRule)"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="usuario.email" :disabled="loading" label="Correo Electronico" :rules="rules.email"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="usuario.movil" :disabled="loading" label="Celular" :rules="rules.movil"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="usuario.telefono" :disabled="loading" label="Teléfono"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.perfil_id" :disabled="loading" :items="perfiles" label="Perfiles" item-text="nombre" item-value="id" :rules="rules.pefil"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.gestion_id" :disabled="loading" :items="gestiones" label="Gestión" item-text="nombre" item-value="id" :rules="rules.gestion"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.grupo_id" :disabled="loading" :items="grupos" label="Grupo" item-text="codigo" item-value="id"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-checkbox v-model="usuario.todas_sedes" :disabled="loading" label="Todas las sedes"></v-checkbox>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.sedes" :disabled="loading || usuario.todas_sedes" :items="sedes" label="Sedes" item-text="nombre" item-value="id" multiple :rules="rules.sedes" @change="seleccionarSede()"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.sede_id" :disabled="loading" :items="sedesSeleccionadas" label="Sede principal" item-text="nombre" item-value="id" :rules="rules.sede_principal"></v-select>
                                                    </v-col>
                                                </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" :disabled="loading" text @click="close"> Cancel</v-btn>
                                        <v-btn color="red darken-1" :disabled="loading" text type="submit">Guardar</v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogPassword" max-width="500px">
                            <v-card>
                                <v-form ref="formPass" @submit.prevent="submitHandlerPassword">
                                    <v-card-title class="text-h5">Actualizar contraseña</v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-text-field type="password" v-model="usuario.password" :disabled="loading" label="Contraseña" :rules="rules.password"></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                    <v-text-field type="password" v-model="usuario.repetir_password" :disabled="loading" label="Repetir Contraseña" :rules="rules.repetir_password.concat(passwordConfirmationRule)"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closePassword">Cancelar</v-btn>
                                        <v-btn color="red darken-1" text type="submit">Aceptar</v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small @click="editUser(item)">
                        edit
                    </v-icon>
                    <v-icon small @click="editPassword(item)">
                        key
                    </v-icon>
                    <!--<v-icon small @click="deleteItem(item)">
                        delete
                    </v-icon>-->
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'User',
    components: {
      
    },
    data () {
        return {
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Documento', value: 'numero_documento' },
                { text: 'Primer Nombre', value: 'primer_nombre' },
                { text: 'Segundo Nombre', value: 'segundo_nombre' },
                { text: 'Primer Apellido', value: 'primer_apellido' },
                { text: 'Segundo Apellido', value: 'segundo_apellido' },
                { text: 'Email', value: 'email' },
                { text: 'Perfil', value: 'perfil.nombre' },
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
            usuario: {},
            gestiones:[],
            grupos:[],
            perfiles:[],
            sedes:[],
            tipos_documentos:[]
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        if (!this.permiso('OP_ADM_USUARIOS')) {
            this.$router.push('/')
        } else {
            this.init();
        }
    },
    methods:{
        ...mapActions({
            fetchLista: 'user/fetchListado',
            fetchListaGrupos: 'user/fetchListadoGrupos',
            fetchListaGestion: 'user/fetchListadoGestion',
            fetchListaPerfiles: 'user/fetchListadoPerfiles',
            fetchListaSedes: 'sedes/fetch',
            fetchListaTiposDocumentos: 'user/fetchListadoTiposDocumentos',
            saveRecord: 'user/saveUser',
            updateRecord: 'user/updateUser',
            updatePassword: 'user/updatePassword',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        init(){
            this.getGestiones();
            this.getGrupos();
            this.getPerfiles();
            this.getSedes();
            this.getTiposDocumentos();
            this.getUsers();
        },
        getUsers() {
            this.loading = true;
            this.fetchLista(this.payload)
            .finally(() => {
                this.loading = false;
            })
        },
        getGestiones() {
            this.loading = true;
            this.fetchListaGestion(this.payload).then(result =>  {
                this.gestiones = result;
            })
            .finally(() => {
                this.loading = false;
            })
        },
        getGrupos() {
            this.loading = true;
            this.fetchListaGrupos(this.payload).then(result =>  {
                this.grupos = result;
                this.grupos.unshift({id:null,codigo:""});
            })
            .finally(() => {
                this.loading = false;
            })
        },
        getPerfiles() {
            this.loading = true;
            this.fetchListaPerfiles(this.payload).then(result =>  {
                this.perfiles = result;
            })
            .finally(() => {
                this.loading = false;
            })
        },
        getSedes() {
            this.loading = true;
            this.fetchListaSedes(this.payload).then(result =>  {
                this.sedes = result;
            })
            .finally(() => {
                this.loading = false;
            })
        },
        getTiposDocumentos() {
            this.loading = true;
            this.fetchListaTiposDocumentos(this.payload).then(result =>  {
                this.tipos_documentos = result;
            })
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
            this.usuario = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            })
        },
        
        closePassword () {
            this.dialogPassword = false
            this.reiniciarPassword();
        },

        editUser (item) {
            console.log(item)
            this.reiniciar();
            
            this.usuario = {... item}
            // Object.assign(this.usuario, item)
            console.log(this.usuario)
            this.usuario.sedes = item.sedes_permitidas && item.sedes_permitidas.length ? item.sedes_permitidas.map(x => x.id) : [];
            this.dialog = true
        },
        editPassword(item) {
            this.reiniciarPassword();
            this.usuario = item;
            this.dialogPassword =  true;
        },

        deleteItemConfirm () {
            this.lista.splice(this.editedIndex, 1)
            this.closeDelete()
        },
        submitHandler(){
            if (this.$refs.formEdit.validate()){
                if (this.usuario.id) {
                    this.actualizar();
                } else {
                    this.crear();
                }
            }
        },
        crear() {
            this.loading = true;
            this.saveRecord(this.usuario).then(result =>  {
                if (result.code == 1) {
                    this.getUsers();
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
            this.updateRecord(this.usuario).then(result =>  {
                if (result.code == 1) {
                    this.getUsers();
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
                this.updatePassword(this.usuario).then(result =>  {
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
        seleccionarSede() {
            if (this.usuario) {
                if (this.usuario.sedes && this.usuario.sedes.length > 0) {
                    if (!this.usuario.sede_id) {
                        this.usuario.sede_id = this.usuario.sedes[0];
                    } else if (this.usuario.sede_id) {
                        if (!this.usuario.sedes.find(x => x.id == this.usuario.sede_id)) {
                            this.usuario.sede_id = this.usuario.sedes[0];
                        }
                    }
                } else {
                    this.usuario.sede_id = null;
                }
            }
        },
        reiniciar() {
            this.usuario = {};
            if (this.$refs.formEdit) {
                this.$refs.formEdit.resetValidation()
            }
        },
        reiniciarPassword() {
            this.usuario = {};
            if (this.$refs.formPass) {
                this.$refs.formPass.resetValidation()
            }
        }
    },
    computed: {
        ...mapState({
            lista: state => state.user.lista,
            pagination: state => state.user.pagination,
            user: state => state.auth.user_info,   
        }),
        ...mapGetters({
            permiso: 'auth/permiso', 
        }),
        getTitle(){
            return 'Usuarios'
        },
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo' : 'Editar'
        },
        sedesSeleccionadas() {
            if (this.usuario.todas_sedes) return this.sedes;
            if (this.usuario && this.usuario.sedes) return this.sedes.filter(x => this.usuario.sedes.includes(x.id) );
            return [];
        },
        rules(){
            const _rules = {}
            _rules.movil= [
                v => !!v || 'El campo Celular es necesario'
            ];
            _rules.email= [
                v => !!v || 'El campo E-mail es necesario',
                v => /.+@.+\..+/.test(v) || 'El E-mail debe ser válido',
            ];
            _rules.tipo_documento = [
                v => !!v || 'El campo Tipo de documento es necesario',
            ];
            _rules.numero_documento = [
                v => !!v || 'El campo Número de documento es necesario',
                v => (v && v.length > 3) || 'El nombre debe ser mayor de 3 caracteres',
            ];
            _rules.primer_nombre = [
                v => !!v || 'El campo Primer Nombre es necesario',
                v => (v && v.length > 2) || 'El nombre debe ser mayor de 2 caracteres',
            ];
            _rules.primer_apellido = [
                v => !!v || 'El campo Primer Apellido es necesario',
                v => (v && v.length > 2) || 'El nombre debe ser mayor de 2 caracteres',
            ];
            _rules.pefil = [
                v => !!v || 'El campo Perfil es necesario',
            ];
            _rules.gestion = [
                v => !!v || 'El campo Gestión es necesario',
            ];
            _rules.password = [
                v => !!v || 'El campo Contraseña es necesario',
            ];
            _rules.repetir_password = [
                v => !!v || 'El campo Repetir Contraseña es necesario',
            ];
            
            
            return _rules;
        },
        passwordConfirmationRule() {
            return () => (this.usuario && this.usuario.password === this.usuario.repetir_password) || 'Las contraseñas deben coincidir'
        }
    },
    watch: {
        
    }
}
</script>