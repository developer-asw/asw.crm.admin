<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-subheader>{{pagination.total}} registros</v-subheader>
                <v-btn small color="info" dark @click="actualizar" :disabled="loading">
                    <v-icon>autorenew</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            <v-card-title>
                <!--<v-select v-model="payload.prioridad" :items="prioridad" label="Prioridad" item-text="text" item-value="value" :disabled="loading" @change="actualizar"></v-select>

                <v-spacer></v-spacer>
                <v-text-field
                    v-model="payload.search"
                    append-icon="search"
                    clearable
                    label="Search"
                    single-line
                    hide-details
                    class="pa-0 ma-0">
                </v-text-field> -->
                <v-switch
                    v-model="switch1"
                    @change="actualizarEnvio()"
                    :disabled="loading"
                    :label="`Enviar Datos Automaticamente: ${switch1.toString()}`">
                </v-switch>
                <v-spacer></v-spacer>
                <v-btn
                    class="ma-2"
                    append-icon="send"
                    outlined
                    @click="enviar"
                    color="indigo"
                    :disabled="loading">
                    Enviar
                    <v-icon
                        right
                        dark
                    >
                        send
                    </v-icon>
                </v-btn>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="lista"
                :search="payload.search"
                :loading="loading"
                loading-text="Loading... Please wait"
                class="elevation-1"
                :disabled="loading">
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
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'IncomingData',
    components: {
      
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
            prioridad:[ 
                // { text: 'Predeterminado', value: null }, 
                { text: 'Tareas Pendientes', value:1 }, 
                { text: 'Datos entrantes', value:0 }, 
                { text: 'No contestan - Pendientes', value : 2 },
                { text: 'Marcado Manual', value : 3 },
            ],
            llamadas_estados:[],
            estados: {},
            limits:[
                { text: '100', value: 100 }, 
                { text: '1000', value: 1000 }, 
                { text: '10000', value : 10000 } 
            ],
            switch1: false,
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        this.obtenerEnvioEnvioDatos();
        this.actualizar();
    },
    methods:{
      ...mapActions({
            fetchLista: 'management/fetchIncomingData',
            sendIncommingData: 'management/fetchSendIncomingData',
            updateSendIncommingData:'management/updateSendIncommingData',
            getSendIncomingDataAuto: 'management/getSendIncomingDataAuto',
      }),
      ...mapMutations({
          setInfo: 'setInfo',
      }),
      actualizar(){
          this.loading = true;
          this.fetchLista(this.payload)
          .finally(() => {
              this.loading = false;
          })
      },
      actualizarEnvio() {
          let body = { enviarAutomaticamente: this.switch1 };
          this.loading = true;
          this.updateSendIncommingData(body)
          .then((result) => {
              if (result && result.mensaje) this.setInfo(result.mensaje)
              else this.setInfo('La información ha sido enviada')
          })
          .finally(() => {
              this.loading = false;
          })
      },
      obtenerEnvioEnvioDatos() {
          this.loading = true;
          this.getSendIncomingDataAuto(this.payload)
          .then((result) => {
                if (result && result.datos) {
                    this.switch1 = result.datos === "SI" ? true : false
                }else{
                    this.switch1 = false;
                }
          })
          .finally(() => {
              this.loading = false;
          })
      },
      enviar() {
          this.loading = true;
          this.sendIncommingData(this.payload)
          .then((result) => {
              console.log(result);
              this.setInfo('La información ha sido enviada')
          })
          .finally(() => {
              this.loading = false;
          })
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
        esUsuario(){
            if(this.user) {
                return ['callcenter', 'coordinador', 'superusuario', 'recepcion'].indexOf(this.user.rol) >= 0
            }else{
                return false;
            }
        },
        presentDate(value){
            return this.$moment(value).format('DD-MM-YYYY h:mm a')
        }
    },
    computed: {
        ...mapState({
            lista: state => state.management.incoming_data,
            pagination: state => state.callcenter.pagination,
            user: state => state.auth.user,   
        }),
        getTitle(){
            return 'Llamadas Entrantes'
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