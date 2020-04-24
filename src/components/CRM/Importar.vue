<template>
<div>

    <v-toolbar flat light dense color="blue lighten-5">
        <v-toolbar-title>
            {{getTitle}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items >
            <v-subheader>{{pagination.total}} registros</v-subheader>
        <!-- <v-btn small color="info" dark @click="actualizar()">
            <v-icon>autorenew</v-icon>
        </v-btn> -->
        <v-btn small color="info"  :disabled="lista.length === 0"> 
            <download-excel
                :disabled="lista.length === 0"
                :data   = "lista">
                <!-- Download Data -->
                <v-icon smallclass="mr-2">
                    file_download
                </v-icon>
            </download-excel>
        </v-btn>
        </v-toolbar-items>
    </v-toolbar>


<v-container>
    <v-row>
        <v-col cols="8" md="9">
            <!-- multiple outlined-->
            <v-file-input
                v-model="files"
                :loading="loading"
                :disabled="loading"
                color="deep-purple accent-4"
                counter
                label="Archivo"
                placeholder="Selecciona el archivo"
                prepend-icon="attach_file"
                :show-size="1000">
                <template v-slot:selection="{ index, text }">
                <v-chip
                    v-if="index < 2"
                    color="deep-purple accent-4"
                    dark
                    label
                    small
                >
                    {{ text }}
                </v-chip>

                <span
                    v-else-if="index === 2"
                    class="overline grey--text text--darken-3 mx-2">
                    +{{ files.length - 2 }} File(s)
                </span>
                </template>
            </v-file-input>
        </v-col>
        <v-col cols="4" md="3">
            <v-btn
                :loading="loading"
                :disabled="loading"
                color="blue-grey"
                class="ma-2 white--text"
                @click="cargarArchivo()">
                Upload
                <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-data-table
                :headers="headers"
                :items="lista"
                :loading="loading"
                loading-text="Loading... Please wait"
                class="elevation-1">
            </v-data-table>
        </v-col>
    </v-row>
</v-container>

</div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
 
Vue.use(VueClipboard)

  export default {
    name: 'CRMImportar',
    components: {
        
    },
    data () {
      return {
        files: null,
        dateFrom:null,
        dateTo:null, 
        menu1: false,
        menu2: false,
        dialogFilter: false,
        viewDialog : false,
        loading: false,
        rowsPerPage : [100],
        search: '',
        payload: {},
        leadSeleccionado:null
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
        fileUpload: 'crm/fileUpload',
      }),
      ...mapMutations({
        setInfo: 'setInfo',
      }),
      actualizar() {
        this.loading = true;
        this.loading = false;
      },
      cargarArchivo() {
        this.loading = true;
        this.fileUpload(this.files)
        .finally(()=>{
          this.loading = false;
          console.log('finalizando proceso');
        })
      },
      prepararPayload(){

      }
    },
    computed: {
      ...mapState({
        lista: state => state.crm.lista,
        pagination: state => state.crm.pagination,
        headers: state => state.crm.headers,
      }),
      getTitle(){
        return 'CRM Importar'
      },
      leadIdDialog(){
        if(this.leadSeleccionado){
          return this.leadSeleccionado._id
        }else{
          return null
        }
      }     
    },
    watch: {
      
    },
  }
  
</script>