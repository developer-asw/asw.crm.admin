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
    
    </v-toolbar-items>
    
  </v-toolbar>

  <v-expansion-panels>
    <v-expansion-panel v-for="(item,i) in agendaActual" :key="i">
      <v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
      <v-expansion-panel-content>
		<AgendaActualSede :dias="item.children" :sede_id="item.sede_id"></AgendaActualSede>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>

  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
	import AgendaActualSede from '@/components/Agenda/AgendaActualSede'
  //import Vue from 'vue';

  export default {
    name: 'AgendaActual',
    components: {
      AgendaActualSede
    },
    data () {
      return {
       pagination:{
          descending: false,
          page: 1,
          rowsPerPage: 100,
          sortBy: "fecha",
          totalItems: 0
        },

      }
    },
    props : {
      
    },
    
    mounted () {
      this.actualizar()
    },
    methods:{
      ...mapActions({
        fetchActualCompleta: 'agenda/fetchActualCompleta',
      }),
      ...mapMutations({
      }),
      actualizar(){
        this.loading = true;
        this.fetchActualCompleta()
        .finally(()=>{
          this.loading = false;
        })
      },
      dirigir(value){
        this.$router.push(value)
      },
     
      
    },
    computed: {
      ...mapState({
        agendaActual: state => state.agenda.agenda_actual,
      }),
      getTitle(){
        return 'Agenda'
      },
        

    }
  }
</script>
