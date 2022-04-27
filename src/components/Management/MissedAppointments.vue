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

            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="lista"
                :search="payload.search"
                :loading="loading"
                loading-text="Loading... Please wait"
                class="elevation-1">
                <template v-slot:[`item.ultima_cita.fecha_cita`]="{ item }">
                    <!-- <span title="Asignado" v-if="item.ultima_llamada && item.ultima_llamada.fecha_asignado">{{presentDate(item.ultima_llamada.fecha_asignado)}}</span> -->
                    <span v-if="item.ultima_cita && item.ultima_cita.fecha_cita">{{presentDate(item.ultima_cita.fecha_cita)}}</span>
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
import {mapState, mapActions, mapMutations} from 'vuex';
import CallcenterRegistrarLlamada from '@/components/Callcenter/CallcenterRegistrarLlamada'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'MissedAppointments',
    components: {
      CallcenterRegistrarLlamada
    },
    data () {
        return {
            headers: [
                { text: '', value: 'prioridad' },
                { text: 'Fecha Cita', value: 'ultima_cita.fecha_cita' },
                { text: 'Nombre', value: 'full_name' },
                { text: 'Email', value: 'email' },
                { text: 'Movil', value: 'movil' },
                { text: 'Sede Cita', value: 'ultima_cita.sede.nombre' },
                { text: 'Callcenter', value: 'ultima_cita.agente.nombre' },
                { text: 'Gestión', value: 'gestion' },
                { text: 'Estado', value: 'ultima_llamada_estado' }
            ],
            viewDialog : false,
            loading: false,
            rowsPerPage : [100],
            search: '',
            payload: {
                prioridad: 1,
            },
            leadSeleccionado:null,
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
        this.actualizar();
    },
    methods:{
      ...mapActions({
            fetchLista: 'management/fetchMissedAppointments',
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
          if(item.ultima_llamada && item.ultima_llamada.estado == 'llamando' && item.ultima_llamada.agente && item.ultima_llamada.agente.email == this.user.data.email){
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
        }
    },
    computed: {
        ...mapState({
            lista: state => state.management.missed_appointments,
            pagination: state => state.callcenter.pagination,
            user: state => state.auth.user,   
        }),
        getTitle(){
            return 'Citas No Asistidas'
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