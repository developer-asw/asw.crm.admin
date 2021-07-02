<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items >
                <v-subheader>{{lista && lista.length ? lista.length : 0}} registros</v-subheader>
                <!-- <v-btn v-if="lista.length>0" flat small color="info" dark @click="descargarReporte">
                    <v-icon>cloud_download</v-icon>
                </v-btn> -->
                
                <v-btn small color="info" dark>
                    <download-excel
                        :data   = "lista"
                        :fields = "json_fields">
                        <!-- Download Data -->
                        <v-icon smallclass="mr-2">
                            file_download
                        </v-icon>
                    </download-excel>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            <v-card-title>
                
                 <v-text-field
                    v-model="filtro.search"
                    clearable
                    :append-outer-icon="filtro.search ? 'search' : ''"
                    label="Search"
                    :disabled="!lista || lista.length <= 0"
                    single-line
                    hide-details>
                </v-text-field> 
                
                <v-spacer></v-spacer>

                <v-row>
                    <v-col cols="2" style="display: none;">
                        <v-checkbox
                            v-model="filtro.CheckFecha"
                            :disabled="loading"
                            :title="'Fecha de registro'"
                            prepend-icon="event">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="12" lg="5">
                        <v-menu
                            ref="menu1"
                            v-model="menu1"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-model="filtro.FechaInicial"
                                    label="Fecha (>)"
                                    :disabled="loading"
                                    @blur="dateFrom = parseDate(filtro.FechaInicial)"
                                    v-on="on">
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="dateFrom" no-title @input="menu1 = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" lg="5">
                    <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                v-model="filtro.FechaFinal"
                                label="Fecha (<)"
                                :disabled="loading"
                                @blur="dateTo = parseDate(filtro.FechaFinal)"
                                v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="dateTo" no-title @input="menu2 = false"></v-date-picker>
                    </v-menu>
                    </v-col>
                    <v-col cols="2">
                        <v-btn color="blue darken-1" text :disabled="loading" :loading="loading" @click="preFiltro()">Filtrar</v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="lista"
                :loading="loading"
                :search="filtro.search"
                loading-text="Loading... Please wait"
                class="elevation-1">
                <template v-slot:[`item.fecha_proximo_contacto`]="{ item }">
                    <span v-if="item.fecha_proximo_contacto">{{presentDate(item.fecha_proximo_contacto)}}</span>
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
                <!--<template v-slot:[`item.action`]="{ item }">
                    <v-icon smallclass="mr-2" @click="viewItem(item)">
                      remove_red_eye
                    </v-icon> 
                    <v-icon smallclass="mr-2" @click="viewHistory(item)">
                      info
                  </v-icon>
                </template> -->
                <template v-slot:[`item.sede`]="{ item }">
                    <span v-if="item.sede">{{item.sede.nombre}}</span>
                </template>
                <template v-slot:[`item.sede_asistencia`]="{ item }">
                    <span v-if="item.sede_asistencia">{{item.sede_asistencia.nombre}}</span>
                </template>
                <template v-slot:[`item.recepcion`]="{ item }">
                    <span v-if="item.recepcionista">{{item.recepcionista.nombre}}</span>
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
    name: 'ReportesCitas',
    components: {
        
    },
    data () {
        return {
            headers: [
                { text: 'Fecha Asistencia', value: 'fecha_asistencia'},
                { text: 'Fecha Agendamiento', value: 'fecha_cita'},
                { text: 'Nombre', value: 'full_name' },
                { text: 'Móvil', value: 'movil' },
                { text: 'Email', value: 'email' },
                
                { text: 'Agente', value: 'agente.nombre' },
                { text: 'Sede Cita', value: 'sede' },

                { text: 'Sede Asiste', value: 'sede_asistencia' }, 

                { text: 'Estado', value: 'estado' }
            ],
            json_fields:{
                "Estado": "estado",
                "Fecha Cumplimiento Cita": "fecha_asistencia",
                "Sede Asistencia": "sede_asistencia.nombre",

                "Fecha Agendamiento Cita": "fecha_cita",
                "Nombre": "full_name",
                "Email": "email",
                "Móvil": "movil",
                "Agente": "agente.nombre",
                "Sede Cita": "sede.nombre",
                //"Orientador": "orientador.nombre",
                //"Recepcion": "recepcion.nombre",
                /*"Telephone 2": {
                    field: "phone.landline",
                    callback: (value) => {
                    return `Landline Phone - ${value}`;
                    },
                }*/
      },
            dialogFilter: false,
            viewDialogHistorico: false,
            viewDialog : false,
            loading: false,
            rowsPerPage : [100],
            leadSeleccionado:null,
            dateFrom:null,
            dateTo:null, 
            menu1: false,
            menu2: false,
            filtro: {
                search:'',
                FechaInicial: this.formatDate(new Date().toISOString().substr(0, 10)), 
                FechaFinal: this.formatDate(new Date().toISOString().substr(0, 10)),
                CheckFecha: true,
                CheckSolicitado: false,
                Tipo: 'realizado',
            },
            tipos: [
                {id: 'realizado', nombre: 'Realizado'},
                {id: 'solicitado', nombre: 'Solicitado'},
            ]
        }
    },
    props : {
        query: Object,
    },
    
    mounted () {
        this.preFiltro()
    },
    methods:{
        ...mapActions({
            fetchCitas: 'reportes/fetchCitas',
            fetchDetalle: 'leads/fetchDetalle',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        filtrar(filtro){
            this.loading = true;
            this.fetchCitas(filtro)
            .finally(()=>{
                this.loading = false;
            })
        },
        copy(o) {
            if (o === null) return null;
            var output, v, key;
            output = Array.isArray(o) ? [] : {};
            for (key in o) {
                v = o[key];
                output[key] = (typeof v === "object") ? this.copy(v) : v;
            }
            return output;
        },
        preFiltro(){
            let payload = {};
            payload = this.copy(this.filtro);
            payload.FechaInicial = this.parseDate(this.filtro.FechaInicial);
            payload.FechaFinal = this.parseDate(this.filtro.FechaFinal);
            this.filtrar(payload);
        },
        cerrarDialog(){
            this.viewDialog = false;
            this.leadSeleccionado = null
        },
        presentDate(value){
            return this.$moment(value).format('DD-MM-YYYY h:mm a')
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
        seleccionarTipo() {
            switch (this.filtro.Tipo) {
                case 'realizado':
                    this.filtro.CheckFecha = true;
                    break;
                case 'solicitado':
                    this.filtro.CheckSolicitado = true;
                    break;

            }
        }
    },
    computed: {
        ...mapState({
            lista: state => state.reportes.citas.lista,
            pagination: state => state.reportes.citas.pagination,
        }),
        getTitle(){
            return 'Reportes - Citas'
        },
        leadIdDialog(){
            if(this.leadSeleccionado){
                return this.leadSeleccionado._id
            }else{
                return null
            }
        },
      
    },
    watch: {
        dateFrom (val) {
            this.filtro.FechaInicial = this.formatDate(val)
        },
        dateTo (val) {
            this.filtro.FechaFinal = this.formatDate(val)
        },
    },
  }
  
</script>