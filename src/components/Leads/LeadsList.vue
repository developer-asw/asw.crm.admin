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
    <v-btn flat small color="info" dark @click="actualizar">
        <v-icon>autorenew</v-icon>
      </v-btn>
      </v-toolbar-items>
  </v-toolbar>

  <v-data-table
      :headers="headers"
      :items="lista"
      :loading="loading"
      
      
      class="elevation-1"
  >
    
      <template v-slot:items="props">
        <td>{{ props.item.sede_id }}</td>
        <td class="text-xs-right" >{{ props.item.fecha }}</td>
        <td class="text-xs-right">{{ props.item.hora }}</td>
        <td class="text-xs-right">{{ props.item.salon_nombre }}</td>
        <td class="text-xs-right">{{ props.item.docente.nombre }}</td>
        <td class="text-xs-right">{{ props.item.tipos.join(',') }}</td>
      </template>
  
    </v-data-table>

  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  //import Vue from 'vue';

  export default {
    name: 'LeadList',
    components: {
  
    },
    data () {
      return {
        headers: [
          
          { text: 'Nombre', value: 'primer_nombre' },
          { text: 'Apellido', value: 'primer_apellido' },
          { text: 'email', value: 'email' },
          { text: 'Móvil', value: 'movil' },
          { text: 'Ciudad', value: 'ciudad' },
          { text: 'Fecha', value: 'updated_at' },
        ],
        pagination:{
          descending: false,
          page: 1,
          rowsPerPage: 100,
          sortBy: "fecha",
          totalItems: 0
        },
        
        loading: false,
        rowsPerPage : [100],
        search: '',
        payload: {}
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
        fetchListaBanners: 'leads/fetchLista',
      }),
      ...mapMutations({
      }),
      actualizar(){
        this.fetchListaBanners()
      }
      
    },
    computed: {
      ...mapState({
        lista: state => state.leads.lista,
      }),
      getTitle(){
        return 'Leads'
      }      

    }
  }
</script>