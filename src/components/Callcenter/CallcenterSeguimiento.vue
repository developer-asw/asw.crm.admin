<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-subheader>{{pagination.total}} registros</v-subheader>
                <!-- <v-btn v-if="lista.length>0" flat small color="info" dark @click="descargarReporte">
                  <v-icon>cloud_download</v-icon>
                </v-btn> -->
                <v-btn small color="info" dark @click="actualizar">
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
                    <span @click="copiarDato(item.movil)">{{item.movil}}</span>
                </template>
                <template v-slot:[`item.email`]="{ item }">
                    <span @click="$copyText(item.email);setInfo(item.email)">{{item.email}}</span>
                </template>
                <template v-slot:[`item.ultimo_origen`]="{ item }">
                    <div v-if="item.ultimo_origen">
                        <span v-if="item.ultimo_origen.utm_campaign">{{item.ultimo_origen.utm_campaign}} {{item.ultimo_origen.utm_medium}}</span>
                        <span v-else-if="item.ultimo_origen.origen">{{item.ultimo_origen.origen == 'no_especificado' ? item.ultimo_origen.canal : item.ultimo_origen.origen}}</span>
                        <span v-else-if="item.ultimo_origen.canal">{{item.ultimo_origen.canal}}</span>
                        <span v-else-if="item.ultimo_origen.referer">{{item.ultimo_origen.referer}}</span>
                    </div>
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
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'CallcenterSeguimiento',
    components: { },
    data () {
        return {
            headers: [
                { text: 'Solicitud', value: 'ultima_llamada.fecha_solicitado' },
                { text: 'Nombre', value: 'full_name' },
                { text: 'Móvil', value: 'uid' },
                { text: 'Email', value: 'email' },
                { text: 'Sede', value: 'sede' },
                { text: 'Solicitado', value: 'ultima_llamada.solicitante.nombre' },
                { text: 'Origen', value: 'ultimo_origen' },
                // { text: 'Estudiante', value: 'es_estudiante' },
                { text: 'Actions', value: 'action', sortable: false }
            ],
            loading: false,
            rowsPerPage : [100],
            search: '',
            leadSeleccionado:null,
            menu: [
                { title: 'Ver', url:'/lead/',path:'/detail' },
                { title: 'Editar', url:'/lead/', path:'/edit' },
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
    mounted() {
        this.actualizar()
    },
    methods:{
      ...mapActions({
          fetchLista: 'callcenter/fetchSeguimiento',
          solicitar: 'callcenter/solicitar',
          fetchDetalle: 'leads/fetchDetalle',
      }),
      ...mapMutations({
          reemplazar: 'callcenter/replaceListaElement',
          setInfo: 'setInfo',
      }),
      dirigir(value, ruta){
          console.log(`${ruta.url}${value._id}${ruta.path}`);
        this.$router.push(`${ruta.url}${value._id}${ruta.path}`)
      },
      actualizar(){
          this.loading = true;
          this.fetchLista()
          .finally(() => {
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
      filtrar(filtro){
        this.loading = true;
        this.fetchLista(filtro)
        .finally(()=>{
          this.loading = false;
        })
      },
      presentDate(value){
          return this.$moment(value).format('DD-MM-YYYY h:mm a')
      },
      copiarDato(value) {
          console.log('copiando en list:')
          this.$copyText(value).then(
              () => {
                  this.setInfo('Copiado en list:' + value)
              })
              .catch(error => {
                  console.log(error)
                  this.setInfo(error)
              })
        },
    },
    computed: {
        ...mapState({
            lista: state => state.callcenter.lista,
            pagination: state => state.callcenter.pagination,
            user: state => state.auth.user_info,   
        }),
        getTitle(){
            return 'Seguimiento'
        },
    }
}
</script>