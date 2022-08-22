<template>
  <div>
    

    <v-toolbar flat light dense color="blue lighten-5">
    
      <v-toolbar-title>
        {{getTitle}}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-subheader>{{pagination.totalItems}} registros</v-subheader>
        <!--
      <v-btn v-if="lista.length>0" flat small color="info" dark @click="descargarReporte">
        <v-icon>cloud_download</v-icon>
      </v-btn>
    -->
    <v-btn  small color="info" dark @click="actualizar">
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

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        details
      </v-icon>
      
    </template>
    <template v-slot:expanded-item="{ item, headers }">
      <td :colspan="headers.length">
<OrientadoresDisponibilidad v-if="detallesOpened.includes(item.id)" :item="item"></OrientadoresDisponibilidad>
      </td>
    </template>

    </v-data-table>
    <!--
    <v-dialog v-model="newDialog" persistent max-width="600px">
      <OrientadoresEdit :orientador_id="orientadorIdDialog" @cerrar="cerrarDialog" @actualizar="actualizar"></OrientadoresEdit>
    </v-dialog>
    <v-dialog v-model="newDialog" persistent max-width="600px">
      <OrientadoresView :orientador_id="orientadorIdDialog" @cerrar="cerrarDialog" @actualizar="actualizar"></OrientadoresView>
    </v-dialog>
    -->
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
  //import OrientadoresEdit from '@/components/Orientadores/OrientadoresEdit'
  //import OrientadoresView from '@/components/Orientadores/OrientadoresView'
  import OrientadoresDisponibilidad from '@/components/Orientadores/OrientadoresDisponibilidad'

  //import Vue from 'vue';

  export default {
    name: 'OrientadoresList',
    components: {
      //OrientadoresEdit,
      //OrientadoresView,
      OrientadoresDisponibilidad
    },
    data () {
      return {
        headers: [
          
          { text: 'Nombre', value: 'primer_nombre' },
          { text: 'Apellido', value: 'primer_apellido' },
          { text: 'email', value: 'email' },
          { text: 'Móvil', value: 'movil' },
          { text: 'Sede', value: 'sede.nombre' },
          { text: '', value:'actions'}

        ],
        pagination:{
          descending: false,
          page: 1,
          rowsPerPage: 100,
          sortBy: "fecha",
          totalItems: 0
        },
        newDialog : false,
        loading: false,
        rowsPerPage : [100],
        search: '',
        payload: {},
        orientadorSeleccionado:null,
        detallesOpened:[]
      }
    },
    props : {
      
    },
    
    mounted () {
      this.actualizar()
      if(this.franjas.length==0){
        this.fetchFranjas()
      }
    },
    methods:{
        ...mapActions({
            fetchLista: 'orientadores/getOrientadores',
            fetchDetalle: 'orientadores/fetchDetalle',
            fetchFranjas: 'agenda/fetchFranjas',
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
        dirigir(value){
            this.$router.push(value)
        },
        iniciarNuevo(){
            
        },
        cerrarDialog(){
            this.newDialog = false;
            this.orientadorSeleccionado = null
        },
        editItem(item){
            console.log(item)
            this.$router.push(`/coordinador/orientadores/${item.id}/datos`);
            /*this.fetchDetalle({id:item._id})
            .then(()=>{
            this.orientadorSeleccionado = item
            this.newDialog = true  
            })*/
            
        },
        expand({ item, value}){
            console.log(value)
            this.detallesOpened.push(item.id)
            this.orientadorSeleccionado = item
            this.loading = true;
            this.fetchDetalle({id:this.orientadorSeleccionado.id})
            .finally(()=>{
                this.loading = false;
            })

        }
      
    },
    computed: {
      ...mapState({
        lista: state => state.orientadores.lista,
        franjas: state => state.agenda.franjas,
      }),
      ...mapGetters({
        detalle: 'plantillas/getDetalle', 
      }),
      getTitle(){
        return 'Orientadores'
      },
      
      orientadorIdDialog(){
        if(this.orientadorSeleccionado){
          return this.orientadorSeleccionado._id
        }else{
          return null
        }
        
      }   

    }
  }
</script>
