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
    
    <template v-slot:[`item.action`]="{ item }">
      <v-icon smallclass="mr-2" @click="viewItem(item)">
        remove_red_eye
      </v-icon>
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
  

  export default {
    name: 'LeadList',
    components: {
      LeadsView
    },
    data () {
      return {
        headers: [
          
          { text: 'Ingreso', value: 'created_at' },
          { text: 'Nombre', value: 'primer_nombre' },
          { text: 'Apellido', value: 'primer_apellido' },
          { text: 'email', value: 'email' },
          { text: 'Móvil', value: 'movil' },
          { text: 'Sede', value: 'ultima_cita.sede.nombre' },
          { text: 'Fecha', value: 'ultima_cita.fecha_texto' },
          { text: 'Hora', value: 'ultima_cita.hora_texto' },
          { text: 'Estado', value: 'estado' },
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
        fetchLista: 'leads/fetchLista',
        fetchDetalle: 'leads/fetchDetalle',
      }),
      ...mapMutations({
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
      
    },
    computed: {
      ...mapState({
        lista: state => state.leads.lista,
        pagination: state => state.leads.pagination,
      }),
      getTitle(){
        return 'Leads'
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