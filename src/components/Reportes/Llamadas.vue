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
                
                <!--<v-btn small color="info" dark>
                    <download-excel
                        :data   = "lista">
                        <v-icon smallclass="mr-2">
                            file_download
                        </v-icon>
                    </download-excel>
                </v-btn>-->
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            <v-card-title>
                List
                <v-spacer></v-spacer>
                
                <v-select v-model="filtro.Tipo" :items="tipos" label="Estado" item-text="nombre" item-value="id" :disabled="loading" v-on:change="seleccionarTipo()">
                </v-select>
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
                        <v-btn color="blue darken-1" text :disabled="loading" :loading="loading" @click="descargarReporte()">Descargar</v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="lista"
                :loading="loading"
                :search="filtro.search"
                loading-text="Loading... Please wait"
                class="elevation-1"
                
                :single-expand="singleExpand"
                :expanded.sync="expanded"
                item-key="index"
                show-expand>

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
                </template>-->
                <template v-slot:[`item.sede`]="{ item }">
                    <span v-if="item.sede_full">{{item.sede_full.nombre}}</span>
                    <span v-else>{{item.sede}}</span>
                </template>
                <template v-slot:expanded-item="{ headers, item }" class="row-observacion">
                    <td class="observacion" :colspan="headers.length">
                        {{ item.observacion }}
                    </td>
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
    name: 'ReportesLlamadas',
    components: {
        
    },
    data () {
        return {
            headers: [
                { text: 'Realizado', value: 'fecha_realizado'},
                //{ text: 'Solicitado', value: 'fecha_solicitado'},
                //{ text: 'Asignado', value: 'fecha_asignado'},
                { text: 'Nombre', value: 'full_name' },
                { text: 'Móvil', value: 'movil' },
                { text: 'Email', value: 'email' },
                { text: 'Sede', value: 'sede' },
                { text: 'Estado', value: 'estado' },
                { text: 'Agente', value: 'agente' },
                { text: 'Solucion', value: 'resolucion' },
                { text: 'Motivo', value: 'motivo' },
                // { text: 'Observacion', value: 'observacion' },
                // { text: 'Actions', value: 'action', sortable: false }
            ],
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
                
                FechaInicial: this.formatDate(this.$moment(new Date()).format('YYYY-MM-DD')), 
                FechaFinal: this.formatDate(this.$moment(new Date()).format('YYYY-MM-DD')),
                CheckFecha: true,
                CheckSolicitado: false,
                Tipo: 'realizado',
            },
            tipos: [
                {id: 'realizado', nombre: 'Realizado'},
                {id: 'solicitado', nombre: 'Solicitado'},
            ],
            expanded: [],
            singleExpand: true,
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
            fetchLlamadas: 'reportes/fetchLlamadas',
            fetchDetalle: 'leads/fetchDetalle',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        filtrar(filtro){
            this.loading = true;
            this.fetchLlamadas(filtro)
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
        async descargarReporte(){
            this.loading = true
            let payload = this.copy(this.filtro);
            payload.FechaInicial = this.parseDate(this.filtro.FechaInicial);
            payload.FechaFinal = this.parseDate(this.filtro.FechaFinal);
            payload.download_tipo = 'csv'
            
            let response = await Vue.http.post("reportes/llamadas/descargar", payload).finally(()=>{
                this.loading = false
            });

            let blob = new Blob([response.data], {type:response.headers.get('content-type')});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'leads.'+payload.download_tipo;
            link.click();
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
            lista: state => state.reportes.llamadas.lista,
            pagination: state => state.reportes.llamadas.pagination,
        }),
        getTitle(){
            return 'Reportes - Llamadas'
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