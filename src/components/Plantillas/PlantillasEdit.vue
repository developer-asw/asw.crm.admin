<template>
  
<v-card>
        <v-card-title>
          <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>
          <v-container v-if="plantilla">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Codigo*" v-model="plantilla.codigo" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="['whatsapp', 'sms', 'email']"
                  label="Canal"
                  required
                  v-model="plantilla.canal"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="plantilla.datos">
              
                <v-col cols="12" v-if="plantilla.canal=='email'">
                  <v-text-field  label="Subject" v-model="plantilla.datos.subject"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    outlined
                    label="Texto"
                    v-model="plantilla.datos.texto"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" v-if="plantilla.canal=='email'">
                  <v-textarea
                    outlined
                    label="Html"
                    v-model="plantilla.datos.html"
                  ></v-textarea>
                </v-col>
              
              
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelar">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="iniciarGuardar">Guardar</v-btn>
          <v-btn color="blue darken-1" text @click="iniciarEliminar">Eliminar</v-btn>
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
    name: 'PlantillasEdit',
    components: {
  
    },
    data () {
      return {
          procesando:false,
          candidato:{}
      }
    },
    props : {
      plantilla_id: String,
    },
    
    mounted () {
        this.reiniciar();
    },
    methods:{
      ...mapActions({
        crear: 'plantillas/crear',
        editar: 'plantillas/editar',
        eliminar: 'plantillas/eliminar',
      }),
      ...mapMutations({
      }),
      reiniciar(){
        this.candidato = {
            codigo:null,
            canal:null,
            datos:{
              subject:null,
              texto:null,
              html:null,
            }
          }
      },
      cancelar(){
        this.reiniciar();
        this.$emit('cerrar');
      },
      dirigir(value){
        this.$router.push(value)
      },
      iniciarGuardar(){
        this.procesando = true;
        if(this.plantilla_id){
          this.editar(this.plantilla)
          .finally(()=>{
            this.procesando = false;
            this.$emit('cerrar');
            this.$emit('actualizar');
          })
        }else{
          this.crear(this.plantilla)
          .finally(()=>{
            this.procesando = false;
            this.$emit('cerrar');
            this.$emit('actualizar');
          })  
        }
        
      },
      iniciarEliminar(){
        this.procesando = true;
        if(this.plantilla_id){
          this.eliminar(this.plantilla)
          .finally(()=>{
            this.procesando = false;
            this.$emit('cerrar');
            this.$emit('actualizar');
          })
        }
        
      }

    },
    computed: {
      ...mapState({
        
      }),
      ...mapGetters({
        detalle: 'plantillas/getDetalle', 
      }),
      getTitle(){
        if(this.plantilla_id){
          return 'Editar Plantilla'
        }
        return 'Nueva Plantilla'
      },
      plantilla(){
        if(this.plantilla_id){
          return this.detalle(this.plantilla_id)
        }else{
          return this.candidato
        }
      }    

    }
  }
</script>