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
      
      <template v-slot:item.ultima_llamada.fecha_solicitado="{ item }">
        <span v-if="item.ultima_llamada">{{presentDate(item.ultima_llamada.fecha_solicitado)}}</span>
      </template>

      <template v-slot:item.full_name="{ item }">
        <span @click="$copyText(item.full_name);setInfo(item.full_name)">{{item.full_name}}</span>
      </template>

      <template v-slot:item.movil="{ item }">
        <span @click="copiarDato(item.movil)">{{item.movil}}</span>
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
        <v-icon v-if="puedeSolicitar(item)" smallclass="mr-2" @click="iniciarSolicitar(item)">
          local_phone
        </v-icon>
        <v-icon v-else-if="estaAsignado(item)" smallclass="mr-2" @click="iniciarCerrar(item)">
          warning
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
      <CallcenterRegistrarLlamada :lead_id="leadIdDialog" @cerrar="cerrarDialog" @actualizar="actualizar" @copiarDatoParent="copiarDato"></CallcenterRegistrarLlamada>
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
    name: 'CallcenterList',
    components: {
      CallcenterRegistrarLlamada
    },
    data () {
      return {
        headers: [
          { text: 'Solicitud', value: 'ultima_llamada.fecha_solicitado' },
          { text: 'Nombre', value: 'full_name' },
          { text: 'Móvil', value: 'uid' },
          { text: 'Email', value: 'email' },
          { text: 'Sede', value: 'sede' },
          { text: 'Solicitado', value: 'ultima_llamada.solicitante.nombre' },
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
        fetchDetalle: 'leads/fetchDetalle',
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
            this.leadSeleccionado = item
            this.viewItem(item)
          }
          if(result.result=='llamando'){
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
      viewItem(item){
        this.loading = true;

        this.fetchDetalle({id:item._id})
        .then((result)=>{

          if(result.datos && result.datos.uid){
            let phoneCopy = result.datos.uid
            if(phoneCopy){
              if(phoneCopy.startsWith('57')){
                phoneCopy = phoneCopy.substring(2)
              }

              if(phoneCopy.length==10){
                phoneCopy = '9'+phoneCopy
              }

              this.$copyText(phoneCopy)
                .then(()=>{
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
      puedeSolicitar(item){
        if(item.ultima_llamada && item.ultima_llamada.estado == 'pendiente'){
          return true
        }
        return false
      },
      estaAsignado(item){
        if(item.ultima_llamada && item.ultima_llamada.estado == 'llamando'
          && item.ultima_llamada.agente && item.ultima_llamada.agente.email == this.user.data.email){
          return true
        }
        return false
      },
      copiarDato(value){
          console.log('copiando en list:')


          this.$copyText(value)
          .then(()=>{
                this.setInfo('Copiado en list:'+value)
          })
          .catch(error=>{
            console.log(error)
            this.setInfo(error)
          })
      }
      
    },
    computed: {
      ...mapState({
        lista: state => state.callcenter.lista,
        pagination: state => state.callcenter.pagination,
        user: state => state.auth.user,   
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