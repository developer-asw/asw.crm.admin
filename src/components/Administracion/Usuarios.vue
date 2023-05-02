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
                <v-select v-model="payload.activo" :items="estados" label="Activos" item-text="valor" item-value="clave" :disabled="loading" @change="getUsers"></v-select>

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
                                                        <v-text-field v-model="usuario.movil" :disabled="loading" label="Celular"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-text-field v-model="usuario.telefono" :disabled="loading" label="Teléfono"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.gestion_id" :disabled="loading" :items="gestiones" label="Gestión" item-text="nombre" item-value="id" :rules="rules.gestion" @change="cambiarGestion()"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.grupo_usuario_id" :disabled="loading" :items="gruposUsuarios" label="Grupo" item-text="codigo" item-value="id" @change="cambiarGrupo()"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.perfil_id" :disabled="loading" :items="perfiles" label="Perfiles" item-text="nombre" item-value="id" :rules="rules.pefil"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.grupo_call_id" :disabled="loading" :items="gruposCall" label="Grupo Call" item-text="codigo" item-value="id"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-checkbox v-model="usuario.todas_sedes" :disabled="loading" label="Todas las sedes"></v-checkbox>
                                                    </v-col>
                                                    <v-col cols="12" sm="6">
                                                        <v-select v-model="usuario.sede_id" :disabled="loading" :items="sedesSeleccionadas" label="Sede principal" item-text="nombre" item-value="id" :rules="rules.sede_principal"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="12">
                                                        <v-select v-model="usuario.sedes" :disabled="loading || (usuario.todas_sedes ? true : false)" :items="sedes" label="Sedes" item-text="nombre" item-value="id" multiple :rules="rules.sedes" @change="seleccionarSede()"></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" v-if="usuario.id" >
                                                        <v-select v-model="usuario.activo" :disabled="loading" :items="estados" label="Estado" item-text="valor" item-value="clave"></v-select>
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
                                <v-card-title class="text-h5">¿Estás seguro de que quieres eliminar este usuario '{{usuario.primer_nombre}} {{usuario.primer_apellido}}'?</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
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
                    <v-icon @click="editUser(item)">
                        edit
                    </v-icon>
                    <v-icon @click="editPassword(item)">
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
// import { reactive } from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'Usuarios',
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
                activo:1,
                search:null,
            },
            //// Edits elementes
            editedIndex: -1,
            dialog: false,
            dialogPassword: false,
            dialogDelete: false,
            usuario: {},
            gestiones:[],
            gruposCall:[],
            gruposUsuarios:[],
            perfiles:[],
            sedes:[],
            tipos_documentos:[],
            estados:[{clave:1, valor:"Activo"}, {clave:0, valor:"No activo"}]
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
            fetchListaGruposCall: 'user/fetchListadoGruposCall',
            fetchListaGestion: 'user/fetchListadoGestion',
            fetchListaPerfiles: 'perfiles/fetchListado',
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
            this.getGruposCall();
            this.getPerfiles();
            this.getSedes();
            this.getTiposDocumentos();
            this.getUsers();
        },
        getUsers() {
            this.loading = true;
            let payload = {activo:this.payload.activo};
            this.fetchLista(payload)
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
                this.gruposUsuarios = result;
                this.gruposUsuarios.unshift({id:null,codigo:""});
            })
            .finally(() => {
                this.loading = false;
            })
        },
        getGruposCall() {
            this.loading = true;
            this.fetchListaGruposCall(this.payload).then(result =>  {
                this.gruposCall = result;
                this.gruposCall.unshift({id:null,codigo:""});
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
            this.reiniciar();
            let usuario = {... item};
            usuario.sedes = item.sedes_permitidas && item.sedes_permitidas.length ? item.sedes_permitidas.map(x => x.id) : [];
            this.usuario = usuario;
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
            this.updateRecord(this.usuario).then(result =>  {
                if (result.code == 1) {
                    this.getUsers();
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
        },
        cambiarGestion() {
            if (this.usuario.gestion_id == 4) {
                this.usuario.grupo_usuario_id = 5;
            } else if (this.usuario.gestion_id == 2) {
                this.usuario.grupo_usuario_id = 3;
            } else {
                // this.usuario.grupo_usuario_id = null;
            }
        },
        cambiarGrupo() {
            let item = this.gruposUsuarios.find(x => x.id == this.usuario.grupo_usuario_id);
            if (item) {
                var call = this.gruposCall.find(x => x.codigo.toUpperCase() == item.codigo.toUpperCase());
                this.usuario.grupo_call_id = call && call.id ? call.id : null;
            } else {
                this.usuario.grupo_call_id = null;
            }
        },
        consola() {
            console.log(this.usuario)
        },
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