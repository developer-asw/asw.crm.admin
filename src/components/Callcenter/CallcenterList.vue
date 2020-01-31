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
    
      <template v-slot:item.action="{ item }">
        <!--
        <v-icon smallclass="mr-2" @click="viewItem(item)">
          remove_red_eye
        </v-icon>
        -->
        <v-icon v-if="!item.estado_callcenter || item.estado_callcenter=='llamar'" smallclass="mr-2" @click="iniciarSolicitar(item)">
          local_phone
        </v-icon>
        <v-icon v-else smallclass="mr-2" @click="setInfo('Ya lo llamaron')">
          phone_locked
        </v-icon>
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
    name: 'CallcenterList',
    components: {
      LeadsView
    },
    data () {
      return {
        headers: [
          { text: 'Ingreso', value: 'created_at' },
          { text: 'Nombre', value: 'primer_nombre' },
          { text: 'Apellido', value: 'primer_apellido' },
          { text: 'Móvil', value: 'movil' },
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
        fetchLista: 'callcenter/fetchLista',
        solicitar: 'callcenter/solicitar',
      }),
      ...mapMutations({
        reemplazar: 'callcenter/replaceListaElement',
        setInfo: 'setInfo',
      }),
      actualizar(){
        this.loading = true;
        this.fetchLista()
        .finally(()=>{
          this.loading = false;
        })
      },
      iniciarSolicitar(item){
        this.loading = true;
        this.solicitar({id_lead:item._id})
        .then((result)=>{
          if(result.result=='ok'){
            let phoneCopy = result.lead.uid
            if(phoneCopy.startsWith('57')){
              phoneCopy = phoneCopy.substring(2)
            }

            this.$copyText(phoneCopy)
            .then(()=>{
              this.setInfo('Autorizado y Copiado')
            })
            .catch(error=>{
              console.log(error)
              this.setInfo('Autorizado')
            })

          }
          if(result.result=='llamando'){
            this.setInfo('Ya fue asignado')
          }
          
        })
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
        lista: state => state.callcenter.lista,
        pagination: state => state.callcenter.pagination,
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