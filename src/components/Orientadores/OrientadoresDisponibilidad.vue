<template>
	<v-card>
    <v-card-title>
      <span class="headline">{{getTitle}}</span>
    </v-card-title>
    <v-card-text>
      <!--
      {{orientador}}
      -->
      <div class="mb-3 row" v-if="franjas">
          <div class="col-2" v-for="(dia) in dias" :key="dia.id">
            <div><strong>{{ dia.name }}</strong></div>
            <div>
              <div v-for="(franja,index) in franjas[dia.id]" :key="index">
                <v-btn class="pt-0 pb-0 mt-1" color="green darken-1"
                v-if="disponibilidad.includes(index)"
                @click="disponibilidad.splice(disponibilidad.indexOf(index),1)"
                title="Click para quitar">
                  {{ franja.texto_corto }}  
                </v-btn>
                <v-btn class="pt-0 pb-0 mt-1" color="gray darken-1" v-else
                @click="disponibilidad.push(index)"
                title="Click para agregar">
                  {{ franja.texto_corto }}  
                </v-btn>
              </div>
            </div>
          </div>
        </div>
        <v-btn class="btn btn-secondary btn-sm mr-1 mb-1 pt-0 pb-0" @click="todos">Todos</v-btn>  
        <v-btn class="btn btn-secondary btn-sm mr-1 mb-1 pt-0 pb-0 " @click="ninguno">Ninguno</v-btn> 

        <v-btn  class="btn btn-block btn-danger" @click="iniciarGuardar">
          Guardar
        </v-btn> 





    </v-card-text>
    <!--
    <v-card-actions>
      <v-btn color="blue darken-1" text @click="cancelar">Cancelar</v-btn>
    </v-card-actions>
    -->
    <v-card-actions>
      <v-btn color="blue darken-1" text @click="actualizar">Actualizar</v-btn>
    </v-card-actions>
		<v-overlay :value="procesando">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
  </v-card>
</template>

<script>
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
  //import Vue from 'vue';

  export default {
    name: 'OrientadoresDisponibilidad',
    components: {
  
    },
    data () {
      return {
          procesando:false,
          orientador:{},
          dias:[
          {id:1,name:'Lunes'},
          {id:2,name:'Martes'},
          {id:3,name:'Miercoles'},
          {id:4,name:'Jueves'},
          {id:5,name:'Viernes'},
          {id:6,name:'Sabado'},
          ],
          disponibilidad:[]
      }
    },
    props : {
      item: Object,
    },
    
    mounted () {
      this.actualizar()
      if(this.franjas.length==0){
        this.fetchFranjas()
      }
    },
    methods:{
      ...mapActions({
        fetchDetalle: 'orientadores/fetchDetalle',
        editar: 'orientadores/editar',
        fetchFranjas: 'agenda/fetchFranjas',
      }),
      ...mapMutations({
      }),
      actualizar(){
        this.procesando = true;
        if(this.item){
          this.fetchDetalle({id:this.item.id})
          .finally(()=>{
            this.orientador = this.detalle(this.item.id)
            if(this.orientador.disponibilidad){
                this.disponibilidad = JSON.parse(this.orientador.disponibilidad)
                /*
                this.disponibilidad = this.disponibilidad.filter(element=>{
                  return this.disponibilidadGeneralLista.includes(element)
                })
                */
                
            }
            this.procesando = false;
          })
        }
      },
      iniciarGuardar(){
        this.procesando = true;
        if(this.item){
          this.editar({id:this.item.id,disponibilidad:this.disponibilidad})
          .finally(()=>{
            this.procesando = false;
          })
        }
      },
      todos(){
        for(let _dia of this.dias){
          let dia = this.franjas[_dia.id]
          for(let index in dia){
            this.disponibilidad.push(index)
          }
        }
      },
      ninguno(){
        this.disponibilidad.splice(0,this.disponibilidad.length)
      },
      
      
    },
    computed: {
      ...mapState({
        franjas: state => state.agenda.franjas,
      }),
      ...mapGetters({
        detalle: 'orientadores/getDetalle', 
      }),
      getTitle(){
        return 'Disponibilidad'
      },
      
      /*
      disponibilidad(){
        if(this.orientador.disponibilidad){
          return this.orientador.disponibilidad  
        }else{
          return []
        } 
      }
      */
         

    }
  }
</script>