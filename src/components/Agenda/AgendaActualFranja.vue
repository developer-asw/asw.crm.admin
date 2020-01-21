<template>
	<div>
		<v-expansion-panels>
      <v-expansion-panel v-for="(item,i) in franjas" :key="i">
        <v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <AgendaActualOrientador :orientadores="item.children" :sede_id="sede_id" :fecha="fecha" :franja="item.id"></AgendaActualOrientador>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
	</div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
	import AgendaActualOrientador from '@/components/Agenda/AgendaActualOrientador'
  //import Vue from 'vue';

  export default {
    name: 'AgendaActualFranja',
    components: {
      AgendaActualOrientador
    },
    data () {
      return {

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
        
      }),
      ...mapMutations({
      }),
      
      marcarSiAsistio(item){
        this.fetchDetalle({id:item._id})
        .then(()=>{
          
        })
        
      },
      
    },
    computed: {
      ...mapState({
        
      }),
      

    }
  }
</script>
