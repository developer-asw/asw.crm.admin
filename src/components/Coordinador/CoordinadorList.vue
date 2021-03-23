<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items >
                <v-subheader>{{pagination.total}} registros</v-subheader>
                <!-- <v-btn v-if="lista.length>0" flat small color="info" dark @click="descargarReporte">
                    <v-icon>cloud_download</v-icon>
                </v-btn> -->
                <v-btn small color="info" dark @click="filtroDescargaAbrir()">
                    <v-icon>cloud_download</v-icon>
                </v-btn>
                <v-btn small color="info" dark @click="actualizar()">
                    <v-icon>autorenew</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            <v-card-title>
                <!-- List -->
                <v-radio-group v-model="payload.tipo" row>
                  <v-radio label="Teléfono" value="telefono"></v-radio>
                  <v-radio label="E-mail" value="email"></v-radio>
                  <v-radio label="Nombre" value="nombre"></v-radio>
                </v-radio-group>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="payload.search"
                    clearable
                    :append-outer-icon="payload.search ? 'search' : ''"
                    @click:append-outer="preFiltro"
                    label="Search"
                    single-line
                    hide-details>
                </v-text-field>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="lista"
                :loading="loading"
                :search="payload.search"
                loading-text="Loading... Please wait"
                class="elevation-1">
                <template v-slot:[`item.ultima_llamada.fecha_solicitado`]="{ item }">
                    <span v-if="item.ultima_llamada && item.ultima_llamada.fecha_solicitado">{{presentDate(item.ultima_llamada.fecha_solicitado)}}</span>
                </template>
                <template v-slot:[`item.full_name`]="{ item }">
                    <span @click="$copyText(item.full_name);setInfo(item.full_name)">{{item.full_name}}</span>
                </template>
                <template v-slot:[`item.movil`]="{ item }">
                    <span @click="$copyText(item.movil);setInfo(item.movil)">{{item.movil}}</span>
                </template>
                <template v-slot:[`item.email`]="{ item }">
                    <span @click="$copyText(item.email);setInfo(item.email)">{{item.email}}</span>
                </template>
                
                <template v-slot:[`item.action`]="{ item }">
                    <v-menu bottom left>
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on">
                            <v-icon smallclass="mr-2">menu</v-icon>
                        </v-btn>
                        </template>

                        <v-list>
                        <v-list-item
                            v-for="(m, i) in menu"
                            :key="i"
                            @click="dirigir(item, m)">
                            <v-list-item-title>{{ m.title }}</v-list-item-title>
                        </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
                <template v-slot:[`item.sede`]="{ item }">
                    <span v-if="item.sede_full">{{item.sede_full.nombre}}</span>
                    <span v-else>{{item.sede}}</span>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="download.show" persistent max-width="560px">
            <LeadsDownloads @cerrar="filtroDescargaCerrar"></LeadsDownloads>
        </v-dialog>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import LeadsDownloads from '@/components/Leads/LeadsDownloads'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
 
Vue.use(VueClipboard)
  export default {
    name: 'CallcenterCoordinatorList',
    components: {
        LeadsDownloads
    },
    data () {
      return {
        headers: [
          { text: 'Próximo contacto', value: 'ultima_llamada.fecha_solicitado' },
          //{ text: 'Primer contacto', value: 'inicia_callcenter' },
          { text: 'Nombre', value: 'full_name' },
          { text: 'Móvil', value: 'movil' },
          { text: 'Email', value: 'email' },
          { text: 'Sede', value: 'sede' },
          { text: 'Agente', value: 'ultima_llamada.agente.nombre' },
          { text: 'Actions', value: 'action', sortable: false }
        ],
        download: {
          show: false
        },
        loading: false,
        rowsPerPage : [100],
        menu: [
            { title: 'Ver', url:'/seguimiento/',path:'/detail' },
            { title: 'Editar', url:'/seguimiento/', path:'/edit' },
        ],
        payload: {
          search:'',
          tipo:'telefono',
          CheckTelefono: true,
          CheckEmail: false,
          CheckNombre: false,
        }
      }
    },
    props : {
      query: Object,
    },
    
    mounted () {
      this.actualizar();
    },
    methods:{
      ...mapActions({
        fetchLista: 'callcenter_coordinator/fetchLista',
        filtroCordinador: 'callcenter_coordinator/filtroCordinador',
        fetchDetalle: 'leads/fetchDetalle',
      }),
      ...mapMutations({
        setInfo: 'setInfo',
      }),
      dirigir(value, ruta){
        this.$router.push(`${ruta.url}${value._id}${ruta.path}`)
      },
      actualizar(){
        this.loading = true;
        this.fetchLista()
        .finally(()=>{
          this.loading = false;
        })
      },
      filtrar(filtro){
        this.loading = true;
        this.filtroCordinador(filtro)
        .finally(()=>{
          this.loading = false;
        })
      },
      preFiltro(){
        if(this.payload.search && this.payload.search.length > 4) {
          let filtro = this.payload;
          filtro.CheckTelefono = false;
          filtro.CheckEmail = false;
          filtro.CheckNombre = false;
          switch(filtro.tipo) {
            case 'telefono':
              filtro.CheckTelefono = true;
              break;
            case 'email':
              filtro.CheckEmail = true;
              break;
            case 'nombre':
              filtro.CheckNombre = true;
              break;
          }
          this.filtrar(filtro);
        }else{
          this.setInfo("Por favor, ingrese mas de 4 caracteres para realizar la busqueda")
        }
      },
      presentDate(value){
        return this.$moment(value).format('DD-MM-YYYY h:mm a')
      },
      filtroDescargaAbrir(){
        this.download.show = true;
      },
      filtroDescargaCerrar(){
        this.download.show = false;
      }
    },
    computed: {
      ...mapState({
        lista: state => state.coordinator.lista,
        pagination: state => state.coordinator.pagination,
      }),
      getTitle(){
        return 'Coordinador Consulta'
      },
    },
    watch: {
    },
  }
  
</script>