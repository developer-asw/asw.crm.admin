<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <!--<v-toolbar-title>{{getTitle}}</v-toolbar-title>-->
            <v-toolbar-title></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items >
                <v-subheader>{{lista && lista.length ? lista.length : 0}} registros</v-subheader>
                
                <v-btn small color="info" dark title="Descargar resumen de tareas">
                    <download-excel
                        :data   = "lista"
                        :fields = "json_fields">
                        <!-- Download Data -->
                        <v-icon smallclass="mr-2">
                            file_download
                        </v-icon>
                    </download-excel>
                </v-btn>
                <v-btn small color="info" dark @click="descargar()" :disabled="deshabilitar" title="Descargar detalle de tareas">
                    <v-icon smallclass="mr-2">
                        file_download
                    </v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            <v-card-title>
                <v-checkbox v-model="todos" @change="aplicarTodos()"></v-checkbox>
                Agentes
                <v-spacer></v-spacer>

                <v-text-field
                    v-model="filtro.search"
                    clearable
                    :append-outer-icon="filtro.search ? 'search' : ''"
                    label="Search"
                    :disabled="!lista || lista.length <= 0"
                    single-line>
                </v-text-field>
                
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
                <template v-slot:[`item.sede`]="{ item }">
                    <span v-if="item.sede_full">{{item.sede_full.nombre}}</span>
                    <span v-else>{{item.sede}}</span>
                </template>
                <template v-slot:[`item.vencidos_restantes`]="{ item }">
                    <span>{{item.vencidos - item.vencidos_seguimiento_whatsapp}}</span>
                </template>
                <template v-slot:[`item.checkbox`]="{ item }">
                    <v-checkbox v-model="item.checkbox"></v-checkbox>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import util from "../../utility/util";
import config from '@/modules/config'
 
Vue.use(VueClipboard)
  export default {
    name: 'ReportesAgentes',
    components: {
        
    },
    data () {
        return {
            headers: [
                { text: '', value: 'checkbox' },
                { text: 'Agente - Nombre', value: '_id.agente.nombre'},
                { text: 'Agente - Email', value: '_id.agente.email'},
                { text: 'Tareas Vencidas', value: 'tareas_vencidas' },
                { text: 'Tareas Pendientes', value: 'tareas_pendientes' },
                // { text: 'Total Tareas', value: 'datos_pendientes' },
                { text: 'En LLamada', value: 'datos_llamada' },
                { text: 'Total', value: 'total'},
                // { text: 'Actions', value: 'action', sortable: false }
            ],
            json_fields:{
                "Agente - Nombre": "_id.agente.nombre",
                "Agente - Email": "_id.agente.email",
                "Tareas Vencidas": "tareas_vencidas",
                "Tareas Pendientes": "tareas_pendientes",
                // "Total Tareas": "datos_pendientes",
                "En LLamada": "datos_llamada",
                "Total": "total",
            },
            dialogFilter: false,
            viewDialogHistorico: false,
            viewDialog : false,
            loading: false,
            rowsPerPage : [100],
            leadSeleccionado:null,
            dateFrom:null,
            dateTo:null, 
            deshabilitar: true,
            menu1: false,
            menu2: false,
            todos: false,
            filtro: {
                search:'',
                FechaInicial: this.formatDate(new Date().toISOString().substring(0, 10)), 
                FechaFinal: this.formatDate(new Date().toISOString().substring(0, 10)),
                CheckFecha: true,
                CheckSolicitado: false,
                Tipo: 'realizado',
            },
            tipos: [
                {id: 'realizado', nombre: 'Realizado'},
                {id: 'solicitado', nombre: 'Solicitado'},
            ],
            util:util
        }
    },
    props : {
        query: Object,
    },
    
    mounted () {
        this.setTituloVentana(this.getTitle);
        this.preFiltro();
    },
    methods:{
        ...mapActions({
            fetchAgentes: 'reportes/fetchAgentes',
            fetchDetalle: 'leads/fetchDetalle',
            setTituloVentana: 'setTituloVentana',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        filtrar(filtro){
            this.loading = true;
            this.fetchAgentes(filtro)
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
        },
        async descargar(){
            this.loading = true
            let payload = {...this.payload};
            payload.usuario_email = this.userEmail;
            payload.emails = this.lista.filter(x => x.checkbox).map(x => x._id.agente.email);
            if (payload.emails.length == 0) {
                payload.emails = this.lista.map(x => x._id.agente.email);
            }
            payload.download_tipo = 'csv'
            let ruta = config.ROOT_API + "callcenter/descargar_datos_agentes?" + this.util.getUrlString(payload);

            let newWindow = window.open(ruta, '_blank');
            newWindow.focus();
            newWindow.onblur = function() { newWindow.close(); };
            this.loading = false;
        },
        aplicarTodos() {
            this.deshabilitar = !this.todos;
            this.lista.forEach(x => x.checkbox = this.todos);
        }
    },
    computed: {
        ...mapState({
            lista: state => state.reportes.agentes.lista,
            pagination: state => state.reportes.agentes.pagination,
            user: state => state.auth.user_info,
        }),
        getTitle(){
            return 'Reporte de tareas'
        },
        leadIdDialog(){
            if(this.leadSeleccionado){
                return this.leadSeleccionado._id
            }else{
                return null
            }
        },
        userEmail() {
            return this.user ? this.user.email : null
        },
      
    },
    watch: {
        dateFrom (val) {
            this.filtro.FechaInicial = this.formatDate(val)
        },
        dateTo (val) {
            this.filtro.FechaFinal = this.formatDate(val)
        },
        lista:{
            handler:function(after, before) {
                var vm = this;
                const total = before.filter(x => x.checkbox == true).length;
                if (total > 0) {
                    vm.deshabilitar = false;
                } else {
                    vm.deshabilitar = true;
                }
            },
            deep: true
        }
    },
  }
  
</script>