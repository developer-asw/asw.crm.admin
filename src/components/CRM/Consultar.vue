<template>
  <div>
    

    <v-toolbar flat light dense color="blue lighten-5">
    
      <v-toolbar-title>
        {{getTitle}}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items >
        <v-subheader>{{pagination.total}} registros</v-subheader>
      <v-btn small color="info" dark @click="filtroDescargaAbrir()">
        <v-icon>cloud_download</v-icon>
      </v-btn>
      <v-btn small color="info" dark @click="actualizar()">
        <v-icon>autorenew</v-icon>
      </v-btn>
      
      </v-toolbar-items>
  </v-toolbar>

  <v-data-table
      :headers="headers"
      :items="lista"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
  >
      
      <template v-slot:item.fecha_proximo_contacto="{ item }">
        <span v-if="item.fecha_proximo_contacto">{{presentDate(item.fecha_proximo_contacto)}}</span>
      </template>

      <template v-slot:item.full_name="{ item }">
        <span @click="$copyText(item.full_name);setInfo(item.full_name)">{{item.full_name}}</span>
      </template>

      <template v-slot:item.movil="{ item }">
        <span @click="$copyText(item.movil);setInfo(item.movil)">{{item.movil}}</span>
      </template>

      <template v-slot:item.email="{ item }">
        <span @click="$copyText(item.email);setInfo(item.email)">{{item.email}}</span>
      </template>

      <!-- <template v-slot:item.action="{ item }">
        
        <v-icon smallclass="mr-2" @click="viewItem(item)">
          remove_red_eye
        </v-icon>
       
        
      </template> -->

      <template v-slot:item.sede="{ item }">
        <span v-if="item.sede_full">{{item.sede_full.nombre}}</span>
        <span v-else>{{item.sede}}</span>
      </template>

    </v-data-table>
    <v-dialog v-model="viewDialog" persistent max-width="800px">
      <LeadsView :lead_id="leadIdDialog" @cerrar="cerrarDialog" @actualizar="actualizar"></LeadsView>
    </v-dialog>
    <v-row justify="center">
      <v-dialog v-model="dialogFilter" persistent max-width="480px">
        <!-- <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
        </template> -->
        <v-card>
          <v-card-title>
            <span class="headline">Descargas de Lead</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" lg="6">
                  <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="filtro.FechaInicial"
                        label="Desde"
                        prepend-icon="event"
                        @blur="dateFrom = parseDate(filtro.FechaInicial)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="dateFrom" no-title @input="menu1 = false"></v-date-picker>
                  </v-menu>
                  <!-- <p>Date in ISO format: <strong>{{ dateFrom }}</strong></p> -->
                </v-col>

                <v-col cols="12" lg="6">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="filtro.FechaFinal"
                        label="Hasta"
                        prepend-icon="event"
                        @blur="dateTo = parseDate(filtro.FechaFinal)"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="dateTo" no-title @input="menu2 = false"></v-date-picker>
                  </v-menu>
                  <!-- <p>Date in ISO format: <strong>{{ dateTo }}</strong></p> -->
                </v-col>
              </v-row>
              <v-row>


                <!-- <v-col cols="12" sm="6">
                  <v-select
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Age*"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                    label="Interests"
                    multiple
                  ></v-autocomplete>
                </v-col> -->
              </v-row>
            </v-container>
            <!-- <small>*indicates required field</small> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="filtroDescargaCerrar()">Cerrar</v-btn>
            <v-btn color="blue darken-1" text @click="descargarReporte()">Descargar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
  
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import LeadsView from '@/components/Leads/LeadsView'
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
 
Vue.use(VueClipboard)

  export default {
    name: 'CRMConsultar',
    components: {
      LeadsView
    },
    data () {
      return {
        headers: [
          { text: 'Próximo contacto', value: 'fecha_proximo_contacto' },
          //{ text: 'Primer contacto', value: 'inicia_callcenter' },
          { text: 'Nombre', value: 'full_name' },
          { text: 'Móvil', value: 'movil' },
          { text: 'Email', value: 'email' },
          { text: 'Sede', value: 'sede' },
          { text: 'Agente', value: 'ultima_llamada.agente.nombre' },
          { text: 'Actions', value: 'action', sortable: false }
        ],
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
        fetchLista: 'callcenter_coordinator/fetchLista',
        
      }),
      ...mapMutations({
        setInfo: 'setInfo',
      }),
      actualizar(){
        this.loading = true;
        this.fetchLista()
        .finally(()=>{
          this.loading = false;
        })
      },

      prepararPayload(){

      },
      async descargarReporte(){
        this.loading = true
        this.prepararPayload()
        this.payload.filters = {
          created_at: {
            $gt:this.parseDate(this.filtro.FechaInicial),
            $lt:this.parseDate(this.filtro.FechaFinal)
          }
        };

        this.payload.download_tipo = 'csv'
        
        let response = await Vue.http.post("callcenter/descargar_cordinador", this.payload).finally(()=>{
          this.loading = false
        });

        let blob = new Blob([response.data], {type:response.headers.get('content-type')});
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'leads.'+this.payload.download_tipo;
        link.click();
        this.filtroDescargaCerrar();
      },

      
      viewItem(item){
        this.loading = true;
        this.fetchDetalle({id:item._id})
        .then(()=>{
          this.leadSeleccionado = item
          this.viewDialog = true  
        })
        .finally(()=>{
          this.loading = false;
        })
        
      },
      cerrarDialog(){
        this.viewDialog = false;
        this.leadSeleccionado = null
      },
      presentDate(value){
        return this.$moment(value).format('DD-MM-YYYY h:mm a')
      },
      filtroDescargaAbrir(){
        console.log("Aqui")
        this.dialogFilter = true;
      },
      filtroDescargaCerrar(){
        this.dialogFilter = false;
      },
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate (date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    },
    computed: {
      ...mapState({
        lista: state => state.callcenter_coordinator.lista,
        pagination: state => state.callcenter_coordinator.pagination,
      }),
      getTitle(){
        return 'Callcenter Coordinator'
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