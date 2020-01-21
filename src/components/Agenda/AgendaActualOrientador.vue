<template>
	<div>
		<v-expansion-panels>
      <v-expansion-panel v-for="(item,i) in orientadores" :key="i">
        <v-expansion-panel-header>{{item.fullname}} / {{item.estado}}</v-expansion-panel-header>
        <v-expansion-panel-content>
			<div v-if="item.lead">
				{{item.lead.fullname}}
				<v-btn v-if="item.estado=='ocupado'" color="blue"  @click="iniciarConfirmarAsistencia(item.id)">Confirmar Asistencia</v-btn>		
			</div>
			<div v-else>
				No tiene cita
			</div>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
	</div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
	
  //import Vue from 'vue';

  export default {
    name: 'AgendaActualOrientador',
    components: {
      
    },
    data () {
      return {

      }
    },
    props : {
      orientadores:Array,
      sede_id:Number,
      fecha:String,
      franja:String
    },
    
    mounted () {
      
    },
    methods:{
      ...mapActions({
        confirmarAsistencia: 'agenda/confirmarAsistencia',
      }),
      ...mapMutations({
      }),
		iniciarConfirmarAsistencia(id){

			this.loading = true;
			this.confirmarAsistencia({id:id,sede_id:this.sede_id,fecha:this.fecha,franja:this.franja})
			.finally(()=>{
				this.loading = false;
			})
		}
    },
    computed: {
      ...mapState({
        
      }),
      

    }
  }
</script>
