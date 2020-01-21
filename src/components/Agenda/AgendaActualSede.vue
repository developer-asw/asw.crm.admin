<template>
	<div>
		<v-expansion-panels>
			<v-expansion-panel v-for="(item,i) in dias" :key="i">
				<v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
				<v-expansion-panel-content>
					<AgendaActualFranja :franjas="item.children" :sede_id="sede_id" :fecha="item.fecha"></AgendaActualFranja>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import AgendaActualFranja from '@/components/Agenda/AgendaActualFranja'

  //import Vue from 'vue';

  export default {
    name: 'AgendaActualSede',
    components: {
      AgendaActualFranja
    },
    data () {
      return {

      }
    },
    props : {
		dias:Array,
		sede_id:Number
    },
    
    mounted () {
      
    },
    methods:{
      ...mapActions({
        
      }),
      ...mapMutations({
      }),
      
    },
    computed: {
      ...mapState({
        
      }),
      

    }
  }
</script>
