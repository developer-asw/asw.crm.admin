<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items >
                <v-subheader>{{pagination.total}} registros</v-subheader>
                <!-- <v-btn v-if="lista.length>0" flat small color="info" dark @click="descargarReporte">
                    <v-icon>cloud_download</v-icon>
                </v-btn> -->
                <v-btn small color="info" dark @click="filtroDescargaAbrir()">
                    <v-icon>cloud_download</v-icon>
                </v-btn>
                <v-btn small color="info" dark @click="actualizar()">
                    <v-icon>autorenew</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            <!-- <v-card-title>
                List
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details>
                </v-text-field>
            </v-card-title> -->

                <!-- :search="search" -->
            <v-data-table
                :headers="headers"
                :items="lista"
                :loading="loading"
                loading-text="Loading... Please wait"
                class="elevation-1">
                <template v-slot:item.fecha_proximo_contacto="{ item }">
                    <span v-if="item.fecha_proximo_contacto">{{presentDate(item.fecha_proximo_contacto)}}</span>
                </template>
                <template v-slot:item.full_name="{ item }">
                    <span @click="$copyText(item.full_name);setInfo(item.full_name)">{{item.full_name}}</span>
                </template>
                <template v-slot:item.movil="{ item }">
                    <span @click="$copyText(item.movil);setInfo(item.movil)">{{item.movil}}</span>
                </template>
                <template v-slot:item.email="{ item }">
                    <span @click="$copyText(item.email);setInfo(item.email)">{{item.email}}</span>
                </template>
                <template v-slot:item.action="{ item }">
                    <!-- <v-icon smallclass="mr-2" @click="viewItem(item)">
                      remove_red_eye
                    </v-icon> -->
                    <v-icon smallclass="mr-2" @click="viewHistory(item)">
                      info
                  </v-icon>
                </template>
                <template v-slot:item.sede="{ item }">
                    <span v-if="item.sede_full">{{item.sede_full.nombre}}</span>
                    <span v-else>{{item.sede}}</span>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="viewDialog" persistent max-width="800px">
            <LeadsView :lead_id="leadIdDialog" @cerrar="cerrarDialog" @actualizar="actualizar"></LeadsView>
        </v-dialog>
        <v-dialog v-model="dialogFilter" persistent max-width="560px">
            <LeadsDownloads @cerrar="filtroDescargaCerrar"></LeadsDownloads>
        </v-dialog>
        <v-dialog v-model="viewDialogHistorico" persistent max-width="800px">
            <CallcenterHistorico :btnCerrar="true" :lead_id="leadIdDialog" @cerrar="cerrarHistory"></CallcenterHistorico>
        </v-dialog>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import LeadsView from '@/components/Leads/LeadsView'
import LeadsDownloads from '@/components/Leads/LeadsDownloads'
import CallcenterHistorico from '@/components/Callcenter/CallcenterHistorico'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
 
Vue.use(VueClipboard)
  export default {
    name: 'CallcenterCoordinatorList',
    components: {
        LeadsView,
        LeadsDownloads,
        CallcenterHistorico
    },
    data () {
      return {
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
        dialogFilter: false,
        viewDialogHistorico: false,
        viewDialog : false,
        loading: false,
        rowsPerPage : [100],
        search: '',
        payload: {},
        leadSeleccionado:null
      }
    },
    props : {
      query: Object,
    },
    
    mounted () {
      this.actualizar()
    },
    methods:{
      ...mapActions({
        fetchLista: 'callcenter_coordinator/fetchLista',
        fetchDetalle: 'leads/fetchDetalle',
      }),
      ...mapMutations({
        setInfo: 'setInfo',
      }),
      actualizar(){
        this.loading = true;
        this.fetchLista()
        .finally(()=>{
          this.loading = false;
        })
      },
      viewItem(item){
        this.loading = true;
        this.fetchDetalle({id:item._id})
        .then(()=>{
          this.leadSeleccionado = item
          this.viewDialog = true  
        })
        .finally(()=>{
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
      filtroDescargaAbrir(){
        this.dialogFilter = true;
      },
      filtroDescargaCerrar(){
        this.dialogFilter = false;
      },
      viewHistory(item) {
          this.loading = true;
          this.fetchDetalle({id:item._id}).finally(()=>{
              this.loading = false;
              this.viewDialogHistorico = true;
              this.leadSeleccionado = item
          });
      },
      cerrarHistory(){
          this.viewDialogHistorico = false;
          this.leadSeleccionado = null
      },
    },
    computed: {
      ...mapState({
        lista: state => state.callcenter_coordinator.lista,
        pagination: state => state.callcenter_coordinator.pagination,
      }),
      getTitle(){
        return 'Callcenter Coordinator'
      },
      leadIdDialog(){
        if(this.leadSeleccionado){
          return this.leadSeleccionado._id
        }else{
          return null
        }
      }     
    },
    watch: {
    },
  }
  
</script>