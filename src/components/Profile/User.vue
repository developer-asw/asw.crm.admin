<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-spacer></v-spacer>
            <v-toolbar-title align="center" class="text-center">{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                
                <v-btn small color="info" dark @click="actualizar" :disabled="loading">
                    <v-icon>autorenew</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-breadcrumbs divider=">"></v-breadcrumbs>
        <v-card>
            <v-card-title>
                <!--<v-select v-model="payload.prioridad" :items="prioridad" label="Prioridad" item-text="text" item-value="value" :disabled="loading" @change="actualizar"></v-select>-->

                <v-spacer></v-spacer>

            </v-card-title>
            <v-row>
                <v-col>
                    <v-card class="mx-auto" max-width="480" tile>
                        <!--<v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Single-line item</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>-->

                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title>DOCUMENTO</v-list-item-title>
                                <v-list-item-subtitle class="texto">{{user.tipo_documento}} {{user.numero_documento}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title>NOMBRE</v-list-item-title>
                                <v-list-item-subtitle class="texto">{{user.primer_nombre}} {{user.segundo_nombre}} {{user.primer_apellido}} {{user.segundo_apellido}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title>CORREO ELECTRÓNICO</v-list-item-title>
                                <v-list-item-subtitle class="texto">{{user.email}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title>PERFIL</v-list-item-title>
                                <v-list-item-subtitle class="texto">{{user.grupo ? user.grupo.nombre : ''}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line v-if="user.grupo_callcenter">
                            <v-list-item-content>
                                <v-list-item-title>GRUPO</v-list-item-title>
                                <v-list-item-subtitle class="texto">{{user.grupo_callcenter.descripcion}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title>SEDES PERMITIDAS</v-list-item-title>
                                <v-list-item-subtitle class="texto">
                                    <v-row justify="center" align="center">                                        
                                        <v-chip v-for="(item) in user.sedes" :key="item.id">
                                            {{item.nombre}}
                                        </v-chip>
                                    </v-row>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        

                        <!--<v-list-item three-line>
                            <v-list-item-content>
                                <v-list-item-title>Three-line item</v-list-item-title>
                                <v-list-item-subtitle>
                                Secondary line text Lorem ipsum dolor sit amet,
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                consectetur adipiscing elit.
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>-->
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
import { mapActions, mapMutations} from 'vuex';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'User',
    components: {
      
    },
    data () {
        return {
            user: {},
            loading: false,
            search: '',
            //// Edits elementes
            editedIndex: -1,
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        this.consultarUsuario();
    },
    methods:{
      ...mapActions({
            getUsuario: 'auth/getUsuario'
      }),
      ...mapMutations({
          setInfo: 'setInfo',
      }),
      consultarUsuario(){
          this.loading = true;
          this.getUsuario(this.payload).then((result) => {
              this.user = result;
          })
          .finally(() => {
              this.loading = false;
          })
      },
      actualizar() {
          this.consultarUsuario();
      }
    },
    computed: {
        formTitle () {
            return 'Mi información'
        },
        getTitle(){
            return 'Mi información'
        }
    },
    watch: {

    }
}
</script>
<style>
.texto {
  text-transform: uppercase;
}
</style>