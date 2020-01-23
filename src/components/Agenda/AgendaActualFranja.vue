<template>
	<div>
		<v-expansion-panels>
      <v-expansion-panel v-for="(item,i) in franjas" :key="i">
        <v-expansion-panel-header>{{item.name}} / {{item.children.length}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table>
            <tbody>
              <tr v-for="lead in item.children" :key="lead.id">
                <td><span>{{ lead.fullname }}</span></td>
                <td><span v-if="lead.uid">{{ lead.uid }}</span></td>
                <td><span v-if="lead.email">{{ lead.email }}</span></td>
                <td><v-btn v-if="lead.estado=='pendiente'" color="blue"  @click="iniciarConfirmarAsistencia(lead.id,item.id)">Confirmar Asistencia</v-btn></td>
              </tr>
            </tbody>
          </v-simple-table>
<!--
          <AgendaActualOrientador :orientadores="item.children" :sede_id="sede_id" :fecha="fecha" :franja="item.id"></AgendaActualOrientador>
        -->
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
	</div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
	//import AgendaActualOrientador from '@/components/Agenda/AgendaActualOrientador'
  //import Vue from 'vue';

  export default {
    name: 'AgendaActualFranja',
    components: {
      //AgendaActualOrientador
    },
    data () {
      return {
        headers: [
          { text: 'Nombre', value: 'fullname' },
          { text: 'Movil', value: 'uid' },
          { text: 'Email', value: 'email' },
          { text: 'Actions', value: 'action' }
        ],
        loading: false,
      }
    },
    props : {
      franjas:Array,
      sede_id:Number,
      fecha:String
    },
    
    mounted () {
      
    },
    methods:{
      ...mapActions({
        confirmarAsistencia: 'agenda/confirmarAsistencia',
        fetchActualCompleta: 'agenda/fetchActualCompleta',
      }),
      ...mapMutations({
      }),
      
      iniciarConfirmarAsistencia(id,franja){

        this.loading = true;
          this.confirmarAsistencia({id:id,sede_id:this.sede_id,fecha:this.fecha,franja:franja})
          .finally(()=>{
            this.actualizar()
            this.loading = false;
          })
        
      },
      actualizar(){
        this.loading = true;
        this.fetchActualCompleta()
        .finally(()=>{
          this.loading = false;
        })
      },
      
    },
    computed: {
      ...mapState({
        
      }),
      

    }
  }
</script>
