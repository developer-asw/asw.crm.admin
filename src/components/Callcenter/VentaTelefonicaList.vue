<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-subheader>{{pagination.total}} registros</v-subheader>
                <!-- <v-btn v-if="lista.length>0" flat small color="info" dark @click="descargarReporte">
                  <v-icon>cloud_download</v-icon>
                </v-btn> -->
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
                <template v-slot:[`item.ultima_llamada.fecha`]="{ item }">
                    <!-- <span title="Asignado" v-if="item.ultima_llamada && item.ultima_llamada.fecha_asignado">{{presentDate(item.ultima_llamada.fecha_asignado)}}</span> -->
                    <span title="Solicitado" v-if="item.ultima_llamada && item.ultima_llamada.fecha_solicitado">{{presentDate(item.ultima_llamada.fecha_solicitado)}}</span>
                </template>
                <template v-slot:[`item.ultima_llamada.usuario`]="{ item }">
                    <span v-if="item.ultima_llamada && item.ultima_llamada.agente">{{item.ultima_llamada.agente.nombre}}</span>
                    <span v-else-if="item.ultima_llamada && item.ultima_llamada.solicitante">{{item.ultima_llamada.solicitante.nombre}}</span>
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
                <template v-slot:[`item.action`]="{ item }">
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
                    <span v-if="item.sede_full">{{item.sede_full.nombre}}</span>
                    <span v-else>{{item.sede}}</span>
                </template>
                <template v-slot:[`item.ultima_llamada_estado`]="{ item }">
                    <span v-if="payload.prioridad == 0">{{item.reingreso == 2 ? "Reingreso" : ""}}</span>
                    <span v-else-if="payload.prioridad == 3">{{item.ultima_llamada_estado}}</span>
                    <span v-else-if="item.reingreso == 2">Reingreso</span>
                    <span v-else>{{item.ultima_llamada_estado}}</span>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="viewDialog" persistent max-width="800px">
            <CallcenterRegistrarLlamada :key="leadIdDialog" :lead_id="leadIdDialog" :ocultar="false" @cerrar="cerrarDialog" @actualizar="actualizar" @copiarDatoParent="copiarDato"></CallcenterRegistrarLlamada>
        </v-dialog>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
import CallcenterRegistrarLlamada from '@/components/Callcenter/CallcenterRegistrarLlamada'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'VentaTelefonicaList',
    components: {
      CallcenterRegistrarLlamada
    },
    data () {
        return {
            headers: [
                { text: '', value: 'prioridad' },
                { text: 'Contactar en', value: 'ultima_llamada.fecha' },
                { text: 'Nombre', value: 'full_name' },
                { text: 'Email', value: 'email' },
                { text: 'Movil', value: 'movil' },
                { text: 'Sede', value: 'sede' },
                { text: 'Ultimo Agente', value: 'ultima_llamada.usuario' },
                { text: 'Origen', value: 'ultimo_origen' },
                { text: 'Gestión', value: 'gestion' },
                { text: 'Estado', value: 'ultima_llamada_estado' },
                { text: 'Actions', value: 'action', sortable: false }
            ],
            viewDialog : false,
            loading: false,
            rowsPerPage : [100],
            search: '',
            payload: {
                prioridad: 3,
            },
            leadSeleccionado:null,
            prioridad:[ 
                // { text: 'Predeterminado', value: null }, 
                // { text: 'Mis pendientes', value:1 }, 
                // { text: 'Datos entrantes', value:0 }, 
                // { text: 'Pendientes - Contacto', value : 2 },
                { text: 'Marcado Manual', value : 3 },
            ],
            llamadas_estados:[],
            estados: {},
            limits:[
                { text: '100', value: 100 }, 
                { text: '1000', value: 1000 }, 
                { text: '10000', value : 10000 } 
            ]
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        if (!this.permiso('OP_VENTA_TELEFONICA')) {
            this.$router.push('/')
        } else {
            this.actualizar();
        }
    },
    methods:{
      ...mapActions({
            fetchLista: 'callcenter/fetchLista',
            solicitar: 'callcenter/solicitar',
            fetchDetalle: 'leads/fetchDetalle',
      }),
      ...mapMutations({
          reemplazar: 'callcenter/replaceListaElement',
          setInfo: 'setInfo',
      }),
      actualizar(){
          this.loading = true;
          this.fetchLista(this.payload)
          .finally(() => {
              this.loading = false;
          })
      },
      iniciarSolicitar(item){
          this.loading = true;
          this.solicitar({id_lead:item._id})
          .then((result) => {
              if(result.result == 'ok') {
                  this.leadSeleccionado = item
                  this.viewItem(item)
              }
              if(result.result == 'llamando'){
                  this.setInfo('Ya fue asignado')
              }            
          })
          .finally(()=>{
            this.loading = false;
          })
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
          if(item.ultima_llamada && item.ultima_llamada.estado == 'pendiente'){
              return true
          }
          return false
      },
      estaAsignado(item) {
          if(item.ultima_llamada && item.ultima_llamada.estado == 'llamando' && item.ultima_llamada.agente && item.ultima_llamada.agente.email == this.user.email){
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
                  console.error(error)
                  this.setInfo(error)
              })
        }
    },
    computed: {
        ...mapState({
            lista: state => state.callcenter.lista,
            pagination: state => state.callcenter.pagination,
            user: state => state.auth.user_info,
        }),
        ...mapGetters({
            permiso: 'auth/permiso', 
        }),
        getTitle(){
            return 'Callcenter Agent'
        },
        leadIdDialog(){
            if(this.leadSeleccionado){
                return this.leadSeleccionado._id
            }else{
                return null
            }
        }
    }
}
</script>