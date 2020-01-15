<template>
  <div>
    

    <v-toolbar flat light dense color="blue lighten-5">
    
      <v-toolbar-title>
        {{getTitle}}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items >
        <v-subheader>{{pagination.totalItems}} registros</v-subheader>
        <!--
      <v-btn v-if="lista.length>0" flat small color="info" dark @click="descargarReporte">
        <v-icon>cloud_download</v-icon>
      </v-btn>
    -->
    <v-btn  small color="info" dark @click="actualizar">
        <v-icon>autorenew</v-icon>
    </v-btn>
    <v-btn  small color="info" dark @click="newDialog=true">
        <v-icon>add</v-icon>
    </v-btn>
    </v-toolbar-items>
    <v-dialog v-model="newDialog" persistent max-width="600px">
      <PlantillasEdit :plantilla_id="plantillaIdDialog" @cerrar="cerrarDialog" @actualizar="actualizar"></PlantillasEdit>
    </v-dialog>
  </v-toolbar>

  <v-data-table
      :headers="headers"
      :items="lista"
      :loading="loading"
      
      
      class="elevation-1"
  >
    <!--
      <template v-slot:items="props">
        <td>{{ props.item.sede_id }}</td>
        <td class="text-xs-right" >{{ props.codigo.fecha }}</td>
        <td class="text-xs-right">{{ props.item.hora }}</td>
        <td class="text-xs-right">{{ props.item.salon_nombre }}</td>
        <td class="text-xs-right">{{ props.item.docente.nombre }}</td>
        <td class="text-xs-right">{{ props.item.tipos.join(',') }}</td>
      </template>
    -->
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        edit
      </v-icon>
      
    </template>

    </v-data-table>

  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import PlantillasEdit from '@/components/Plantillas/PlantillasEdit'

  //import Vue from 'vue';

  export default {
    name: 'PlantillasList',
    components: {
      PlantillasEdit
    },
    data () {
      return {
        headers: [
          
          { text: 'Codigo', value: 'codigo' },
          { text: 'Canal', value: 'canal' },
          { text: 'Actions', value: 'action', sortable: false }
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
        plantillaSeleccionada:null
      }
    },
    props : {
      
    },
    
    mounted () {
      this.actualizar()
    },
    methods:{
      ...mapActions({
        fetchLista: 'plantillas/fetchLista',
        fetchDetalle: 'plantillas/fetchDetalle',
      }),
      ...mapMutations({
      }),
      actualizar(){
        this.fetchLista()
      },
      dirigir(value){
        this.$router.push(value)
      },
      iniciarNuevo(){
        
      },
      cerrarDialog(){
        this.newDialog=false;
        this.plantillaSeleccionada = null
      },
      editItem(item){
        this.fetchDetalle({id:item._id})
        .then(()=>{
          this.plantillaSeleccionada = item
          this.newDialog = true  
        })
        
      },
      
    },
    computed: {
      ...mapState({
        lista: state => state.plantillas.lista,
      }),
      getTitle(){
        return 'Plantillas'
      },
      plantillaIdDialog(){
        if(this.plantillaSeleccionada){
          return this.plantillaSeleccionada._id
        }else{
          return null
        }
        
      }   

    }
  }
</script>
