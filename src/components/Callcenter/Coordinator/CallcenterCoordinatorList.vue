<template>
  <div>
    

    <v-toolbar flat light dense color="blue lighten-5">
    
      <v-toolbar-title>
        {{getTitle}}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items >
        <v-subheader>{{pagination.total}} registros</v-subheader>
        <!--
      <v-btn v-if="lista.length>0" flat small color="info" dark @click="descargarReporte">
        <v-icon>cloud_download</v-icon>
      </v-btn>
    -->
      <v-btn small color="info" dark @click="descargarReporte">
        <v-icon>cloud_download</v-icon>
      </v-btn>
      <v-btn small color="info" dark @click="actualizar">
        <v-icon>autorenew</v-icon>
      </v-btn>
      
      </v-toolbar-items>
  </v-toolbar>

  <v-data-table
      :headers="headers"
      :items="lista"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
  >
      
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
        <!--
        <v-icon smallclass="mr-2" @click="viewItem(item)">
          remove_red_eye
        </v-icon>
        -->
        
      </template>

      <template v-slot:item.sede="{ item }">
        <span v-if="item.sede_full">{{item.sede_full.nombre}}</span>
        <span v-else>{{item.sede}}</span>
      </template>

    </v-data-table>
    <v-dialog v-model="viewDialog" persistent max-width="800px">
      <LeadsView :lead_id="leadIdDialog" @cerrar="cerrarDialog" @actualizar="actualizar"></LeadsView>
    </v-dialog>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import LeadsView from '@/components/Leads/LeadsView'
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
 
Vue.use(VueClipboard)

  export default {
    name: 'CallcenterCoordinatorList',
    components: {
      LeadsView
    },
    data () {
      return {
        headers: [
          { text: 'Ingreso', value: 'created_at' },
          { text: 'Primer contacto', value: 'inicia_callcenter' },
          { text: 'Nombre', value: 'full_name' },
          { text: 'Móvil', value: 'movil' },
          { text: 'Email', value: 'email' },
          { text: 'Sede', value: 'sede' },
          { text: 'Agente', value: 'agente_callcenter' },
          { text: 'Actions', value: 'action', sortable: false }
        ],
        
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

      prepararPayload(){

      },
      async descargarReporte(){
        this.loading = true
        this.prepararPayload()
        this.payload.download_tipo = 'csv'
        
        let response = await Vue.http.post("callcenter/descargar_cordinador", this.payload).finally(()=>{
          this.loading = false
        });

    let blob = new Blob([response.data], {type:response.headers.get('content-type')});
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'leads.'+this.payload.download_tipo;
    link.click();
        
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

    }
  }
</script>