<template>
  
<v-card>
        <v-card-title>
          <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>
          <v-container v-if="orientador">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Codigo*" v-model="orientador.codigo" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="['whatsapp', 'sms', 'email']"
                  label="Canal"
                  required
                  v-model="orientador.canal"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="orientador.datos">
              
                <v-col cols="12" v-if="orientador.canal=='email'">
                  <v-text-field  label="Subject" v-model="orientador.datos.subject"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    outlined
                    label="Texto"
                    v-model="orientador.datos.texto"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" v-if="orientador.canal=='email'">
                  <v-textarea
                    outlined
                    label="Html"
                    v-model="orientador.datos.html"
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
    name: 'OrientadoresView',
    components: {
  
    },
    data () {
      return {
          procesando:false,
          candidato:{}
      }
    },
    props : {
      orientador_id: String,
    },
    
    mounted () {
        this.reiniciar();
    },
    methods:{
      ...mapActions({
        crear: 'orientadores/crear',
        editar: 'orientadores/editar',
        eliminar: 'orientadores/eliminar',
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
        if(this.orientador_id){
          this.editar(this.orientador)
          .finally(()=>{
            this.procesando = false;
            this.$emit('cerrar');
            this.$emit('actualizar');
          })
        }else{
          this.crear(this.orientador)
          .finally(()=>{
            this.procesando = false;
            this.$emit('cerrar');
            this.$emit('actualizar');
          })  
        }
        
      },
      iniciarEliminar(){
        this.procesando = true;
        if(this.orientador_id){
          this.eliminar(this.orientador)
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
        detalle: 'orientadores/getDetalle', 
      }),
      getTitle(){
        if(this.orientador_id){
          return 'Editar Orientador'
        }
        return 'Nuevo Orientador'
      },
      orientador(){
        if(this.orientador_id){
          return this.detalle(this.orientador_id)
        }else{
          return this.candidato
        }
      }    

    }
  }
</script>