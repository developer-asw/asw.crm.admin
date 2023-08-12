<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-subheader>{{pagination.total}} registros</v-subheader>
                <v-btn v-if="puedeDescargar" small color="info" dark @click="descargar">
                  <v-icon>cloud_download</v-icon>
                </v-btn>
                <v-btn small color="info" dark @click="actualizar">
                    <v-icon>autorenew</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            <v-card-title>
                <v-select v-model="payload.prioridad" :items="prioridad" label="Prioridad" item-text="text" item-value="value" :disabled="loading" @change="actualizar"></v-select>
                <!-- 
                <v-select v-model="payload.estado" :items="llamadas_estados" label="Estados" item-text="text" item-value="value" :disabled="loading"></v-select> -->
                <!-- <v-select v-model="payload.limit" :items="limits" item-text="text" item-value="value" :disabled="loading"></v-select> -->
                <!-- <v-radio-group v-model="payload.tipo" row>
                    <v-radio label="Teléfono" value="telefono"></v-radio>
                    <v-radio label="E-mail" value="email"></v-radio>
                    <v-radio label="Nombre" value="nombre"></v-radio>
                </v-radio-group>-->
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
                class="elevation-1">
<<<<<<< HEAD
                <template v-slot:[`item.ultima_matricula.fecha_registro_matricula`]="{ item }">
                    <!-- <span title="Asignado" v-if="item.af_ultima_llamada && item.af_ultima_llamada.fecha_asignado">{{presentDate(item.af_ultima_llamada.fecha_asignado)}}</span> -->
                    <span title="Solicitado" v-if="item.af_ultima_llamada && item.ultima_matricula.fecha_registro_matricula">{{presentDate(item.ultima_matricula.fecha_registro_matricula)}}</span>
=======
                <template v-slot:[`item.af_ultima_llamada.fecha_solicitado`]="{ item }">
                    <span title="Solicitado" v-if="item.af_ultima_llamada && item.af_ultima_llamada.fecha_solicitado">{{presentDate(item.af_ultima_llamada.fecha_solicitado)}}</span>
                </template>
                <template v-slot:[`item.ultima_matricula.fecha_registro_matricula`]="{ item }">
                    <!-- <span title="Asignado" v-if="item.af_ultima_llamada && item.af_ultima_llamada.fecha_asignado">{{presentDate(item.af_ultima_llamada.fecha_asignado)}}</span> -->
                    <span title="Fecha Matricula" v-if="item.ultima_matricula && item.ultima_matricula.fecha_registro_matricula">{{presentDate(item.ultima_matricula.fecha_registro_matricula)}}</span>
>>>>>>> master
                </template>
                <template v-slot:[`item.af_ultima_llamada.usuario`]="{ item }">
                    <span v-if="item.af_ultima_llamada && item.af_ultima_llamada.agente">{{item.af_ultima_llamada.agente.nombre}}</span>
                    <span v-else-if="item.af_ultima_llamada && item.af_ultima_llamada.solicitante">{{item.af_ultima_llamada.solicitante.nombre}}</span>
                </template>
                <template v-slot:[`item.full_name`]="{ item }">
                    <span @click="$copyText(item.full_name);setInfo(item.full_name)">{{item.full_name}}</span>
                </template>
                <!-- <template v-slot:item.movil="{ item }">
                    <span @click="copiarDato(item.movil)">{{item.movil}}</span>
                </template> -->
                <template v-slot:[`item.email`]="{ item }">
                    <span @click="$copyText(item.email);setInfo(item.email)">{{item.email}}</span>
                </template>
                <template v-slot:[`item.ultimo_origen`]="{ item }">
                    <div v-if="item.ultimo_origen">
                        <span v-if="item.ultimo_origen.utm_campaign">{{item.ultimo_origen.utm_campaign}} {{item.ultimo_origen.utm_medium}}</span>
                        <span v-else-if="item.ultimo_origen.origen">{{item.ultimo_origen.origen == 'no_especificado' ? item.ultimo_origen.canal : item.ultimo_origen.origen}}</span>
                        <span v-else-if="item.ultimo_origen.canal">{{item.ultimo_origen.canal}}</span>
                        <span v-else-if="item.ultimo_origen.referer">{{item.ultimo_origen.referer}}</span>
                    </div>
                </template>
                <template v-slot:[`item.prioridad`]="{ item }">
                    <v-icon v-if="item.prioridad == 0" smallclass="mr-2">
                        mark_email_unread
                    </v-icon>
                    <v-icon v-else-if="item.prioridad == 1" smallclass="mr-2">
                        mark_email_unread
                    </v-icon>
                    <v-icon v-else-if="item.prioridad == 2" smallclass="mr-2">
                        mark_email_read
                    </v-icon>
                    <v-icon v-else smallclass="mr-2">
                        pending
                    </v-icon>
                </template>
                <template v-if="payload.prioridad < 10"  v-slot:[`item.action`]="{ item }">
                    <!-- <v-icon smallclass="mr-2" @click="viewItem(item)">
                        remove_red_eye
                    </v-icon> -->
                    <!-- <v-icon smallclass="mr-2" @click="viewHistory(item)">
                        info
                    </v-icon> -->
                
                    <v-icon v-if="puedeSolicitar(item)" smallclass="mr-2" @click="iniciarSolicitar(item)">
                        phone
                    </v-icon>
                    <v-icon v-else-if="estaAsignado(item)" smallclass="mr-2" @click="iniciarCerrar(item)">
                        warning
                    </v-icon>
                    <v-icon v-else smallclass="mr-2" @click="setInfo('Ya lo llamaron')">
                        phone_locked
                    </v-icon>
                </template>
                <template v-slot:[`item.sede`]="{ item }">
                    <span v-if="item.ultima_matricula.sede_matricula">{{item.ultima_matricula.sede_matricula}}</span>
                    <span v-else-if="item.sede_full">{{item.sede_full.nombre}}</span>
                    <span v-else>{{item.sede}}</span>
                </template>
                <template v-slot:[`item.field_ciudad`]="{ item }">
                    <span v-if="item.sede_full">{{item.sede_full.ciudad}}</span>
                    <span v-else-if="item.ciudad">{{item.ciudad}}</span>
                    <span v-else-if="item.form_ciudad">{{item.form_ciudad}}</span>
                    <span v-else></span>
                </template>
                <template v-slot:[`item.ultima_llamada_estado`]="{ item }">
                    <span v-if="payload.prioridad == 0">{{item.reingreso == 2 ? "Reingreso" : ""}}</span>
                    <span v-else-if="payload.prioridad == 3 || payload.prioridad > 9">{{item.ultima_llamada_estado}}</span>
                    <span v-else-if="item.reingreso == 2">Reingreso</span>
                    <span v-else>{{item.ultima_llamada_estado}}</span>
                </template>
                
            </v-data-table>
            <div class="text-center pt-2 pb-5">
                <v-btn color="success" class="mr-2" @click="loadMore" :loading="loading" :disabled="loading">
                    Cargar más
                </v-btn>
            </div>
        </v-card>
        <v-dialog v-model="viewDialog" persistent max-width="800px">
            <RegistrarLlamada :key="leadIdDialog" :lead_id="leadIdDialog" :ocultar="false" @cerrar="cerrarDialog" @actualizar="actualizar" @copiarDatoParent="copiarDato"></RegistrarLlamada>
        </v-dialog>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
import RegistrarLlamada from '@/components/ApoyoFinanciero/RegistrarLlamada'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import config from '@/modules/config';
import util from "@/utility/util";

Vue.use(VueClipboard)

export default {
    name: 'CallcenterMatriculados',
    components: {
      RegistrarLlamada
    },
    data () {
        return {
            headers: [
                { text: '', value: 'prioridad' },
<<<<<<< HEAD
                { text: 'Matriculado', value: 'ultima_matricula.fecha_registro_matricula' },
                { text: 'Forma Pago', value: 'forma_pago' },
=======
                { text: 'Tarea', value: 'af_ultima_llamada.fecha_solicitado' },
                { text: 'Matriculado', value: 'fecha_registro_matricula' },
                // { text: 'Forma Pago', value: 'forma_pago' },
>>>>>>> master
                { text: 'Nombre', value: 'full_name' },
                { text: 'Ciudad', value: 'field_ciudad' },
                { text: 'Email', value: 'email' },
                { text: 'Movil', value: 'movil' },
                { text: 'Sede', value: 'sede' },
                // { text: 'titular', value: 'titular' },
                // { text: 'Movil', value: 'titular_movil' },
                // { text: 'Email', value: 'titular_email' },
                // { text: 'Ultimo Agente', value: 'af_ultima_llamada.usuario' },
                // { text: 'Origen', value: 'ultimo_origen' },
                // { text: 'Gestión', value: 'gestion' },
                // { text: 'Estado', value: 'af_ultima_llamada_estado' },
                { text: 'Actions', value: 'action', sortable: false }
            ],
            viewDialog : false,
            loading: false,
            rowsPerPage : [100],
            search: '',
            payload: { prioridad: null},
            prioridad:[],
            leadSeleccionado:null,
            llamadas_estados:[],
            estados: {},
            util:util
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        this.obtenerGrupo();
        this.actualizar();
    },
    methods:{
      ...mapActions({
            fetchLista: 'callcenter/fetchMatriculados',
            fetchListaPage: 'callcenter/fetchMatriculadosPage',
            fetchDetalle: 'leads/fetchDetalle',
            getGrupo: 'auth/getGrupo',
      }),
      ...mapMutations({
          reemplazar: 'callcenter/replaceListaElement',
          setInfo: 'setInfo',
      }),
      actualizar(){
          this.loading = true;
          this.payload.page = 1;
          this.fetchLista(this.payload)
          .finally(() => {
              this.loading = false;
          })
      },
      obtenerGrupo(){
          this.getGrupo().then((result) => {
              this.actualizarListado(result.grupo);
          })
          .finally(() => {
          })
      },
      iniciarSolicitar(item){
          this.loading = true;
          this.leadSeleccionado = item
          this.viewItem(item)
      },
      iniciarCerrar(item){
          this.leadSeleccionado = item;
          this.viewItem(item)
      },
      viewItem(item) {
        this.loading = true;
        this.fetchDetalle({id:item._id}).then((result) => {
            if(result.datos && result.datos.uid){
                let phoneCopy = result.datos.uid
                if(phoneCopy) {
                    if(phoneCopy.startsWith('57')){
                      phoneCopy = phoneCopy.substring(2)
                    }
                    if(phoneCopy.length==10){
                      phoneCopy = '9'+phoneCopy
                    }
                    this.$copyText(phoneCopy).then(() => {
                        this.setInfo('Autorizado y Copiado')
                    })
                    .catch(error=>{
                        console.log(error)
                    })
                }
            }
            this.leadSeleccionado = item
            this.viewDialog = true
        })
        .finally(() => {
            this.loading = false;
        })  
      },
      cerrarDialog(){
          this.viewDialog = false;
          this.leadSeleccionado = null
      },
      presentDate(value){
          return this.$moment(value).format('DD-MM-YYYY h:mm a')
      },
      puedeSolicitar(item){
          if((item.af_ultima_llamada && ['pendiente','terminado'].includes(item.af_ultima_llamada.estado)) || (!item.af_ultima_llamada)){
              return true
          }
          return false
      },
      estaAsignado(item) {
          if(item.af_ultima_llamada && item.af_ultima_llamada.estado == 'llamando' && item.af_ultima_llamada.agente && item.af_ultima_llamada.agente.email == this.user.email){
              return true
          }
          return false
      },
      copiarDato(value) {
          this.$copyText(value).then(
              () => {
                  this.setInfo('Copiado en list:' + value)
              })
              .catch(error => {
                  console.log(error)
                  this.setInfo(error)
              })
        },
        actualizarListado(grupo_usuario = '') {
            this.prioridad = [];
            if (this.permiso('OP_CALL_TAREAS_PENDIENTES')) {
                this.prioridad.push({ text: 'Tareas Pendientes', value:1 })
            }
            if (this.permiso('OP_CALL_RESOLVER_DATOS')) {
                this.payload.prioridad = 5;
                this.prioridad.push({ text: 'Datos por Resolver', value:5 })
            }
            if (this.permiso('OP_CALL_DATOS_ENTRANTES')) {
                this.payload.prioridad = 0;
                this.prioridad.push({ text: 'Datos Entrantes', value:0 })
            }
            if (this.permiso('OP_CALL_DATOS_NUEVOS')) {
                this.prioridad.push({ text: 'Datos Nuevos', value:4 })
            }
            if (this.permiso('OP_CALL_MARCADO_MANUAL')) {
                this.prioridad.push({ text: 'Marcado Manual', value : 3 })
            }
            /*if (this.permiso('OP_CALL_NO_CONTESTA')) {
                this.prioridad.push({ text: 'Pendientes - Contacto', value : 2 })
            }*/
            if (this.permiso('OP_CALL_GRUPO_1')) {
                this.prioridad.push({ text: 'Grupo 1', value : 7 })
            }
            if (this.permiso('OP_CALL_VENTA_TELEFONICA')) {
                this.prioridad.push({ text: 'Venta Teléfonica', value : 6 })
            }
            if (this.permiso('OP_CALL_TOTALES_AF')) {
                this.prioridad.push({ text: 'Totales Apoyo Financiero', value : 13 })
            }

            /**
             * { text: 'Tareas Pendientes', value:1 },
             * { text: 'Datos por Resolver', value:5 },
             * { text: 'Pendientes - Contacto', value : 2 },
             */
            console.log(this.payload)
            if (grupo_usuario == 'grupo_fredy' || this.permiso('OP_CALL_GRUPO_1')){
                if (!this.prioridad.find(x => x.text == 'Grupo 1')) {
                    this.prioridad.push({ text: 'Grupo 1', value : 7 })
                }
            }
        },
        loadMore() {
            if (this.pagination.page < this.pagination.lastPage) {
                this.loading = true;
                this.payload.page = this.pagination.page + 1;
                this.fetchListaPage(this.payload).then(result => {
                    this.pagination.lastPage = result.datos.lastPage;
                    this.pagination.page = result.datos.page;
                    this.pagination.perPage = result.datos.perPage;
                    this.pagination.total = result.datos.total;
                    for(var i in result.datos.data) {
                        this.lista.push(result.datos.data[i]);
                    }
                })
                .finally(() => {
                    this.loading = false;
                })
            }
        },
        async descargar(){
            this.loading = true
            let payload = {...this.payload};
            payload.usuario_email = this.userEmail;
            payload.download_tipo = 'csv'
            
            let ruta = config.ROOT_API + "apoyofinanciero/descargar_datos?" + this.util.getUrlString(payload);

            let newWindow = window.open(ruta, '_blank');
            newWindow.focus();
            newWindow.onblur = function() { newWindow.close(); };
            this.loading = false
            this.$emit('cerrar');
        }
    },
    computed: {
        ...mapState({
            lista: state => state.callcenter.matriculados.lista,
            pagination: state => state.callcenter.matriculados.pagination,
            user: state => state.auth.user_info,
        }),
        ...mapGetters({
            permiso: 'auth/permiso', 
        }),
        getTitle(){
            return 'Apoyo Financiero'
        },
        leadIdDialog(){
            if(this.leadSeleccionado){
                return this.leadSeleccionado._id
            }else{
                return null
            }
        },
        userEmail() {
            return this.user && this.user ? this.user.email : null
        },
        puedeDescargar() {
            return this.permiso('OP_CALL_DESCARGAR');
        }
    }
}
</script>