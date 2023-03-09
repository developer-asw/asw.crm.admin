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
                <v-spacer></v-spacer>
                <v-row>

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
                        <v-btn color="blue darken-1" text :disabled="loading" :loading="loading" @click="actualizar()">Filtrar</v-btn>
                        <!-- <v-btn color="blue darken-1" text :disabled="loading" :loading="loading" @click="descargarReporte()">Descargar</v-btn> -->
                    </v-col>
                </v-row>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="datos"
                :search="filtro.search"
                :loading="loading"
                loading-text="Loading... Please wait"
                class="elevation-1">
                <template v-slot:[`item.accion`]="{ item }">
                    <v-icon smallclass="mr-2" @click="detalles(item)">
                        open_in_new
                    </v-icon>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="records.show" max-width="720px">            
            <v-card>
                <v-card-title>
                    <span class="text-h5">DETALLES</span>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="records.search"
                        clearable
                        :append-outer-icon="records.search ? 'search' : ''"
                        label="Search"
                        single-line
                        hide-details>
                    </v-text-field>
                </v-card-title>
                    <v-card-text>
                    <v-data-table
                        :headers="records.headers"
                        :items="records.datos"
                        :search="records.search"
                        :loading="records.loading"
                        loading-text="Loading... Please wait"
                        class="elevation-1">

                    </v-data-table>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="blue darken-1" text @click="records.show = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="blue darken-1" text>
                        <download-excel
                            :data   = "records.datos"
                            :fields = "records.fields">
                            <!-- Download Data -->
                            Guardar
                            <v-icon smallclass="mr-2">
                                file_download
                            </v-icon>
                        </download-excel>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
    import Vue from 'vue'
    import VueClipboard from 'vue-clipboard2'

    Vue.use(VueClipboard)

    export default {
        name: 'MissedAppointments',
        components: {
        },
        data () {
            return {
                datos:[],
                records:{
                    headers:[
                        { text: 'ID', value: 'id' },
                        { text: 'Fecha', value: 'created_at' },
                        { text: 'Nombre', value: 'name' },
                        { text: 'Apellidos', value: 'lastname' },
                        { text: 'Teléfono', value: 'tel01' },
                        { text: 'Estado', value: 'estado' },
                    ],
                    datos:[],
                    search:"",
                    loading:false,
                    show:false,
                    fields:{
                        "Numero": "id",
                        "Fecha": "created_at",
                        "Nombre": "name",
                        "Apellidos": "lastname",
                        "Teléfono": "tel01",
                        "Estado": "estado",
                    }
                },
                headers: [
                    { text: 'Codigo', value: 'codigo' },
                    { text: 'Nombre', value: 'total' },
                    { text: '', value: 'accion' },
                ],
                viewDialog : false,
                loading: false,
                payload: {
                    prioridad: 1,
                },
                filtro: {
                    search:'',
                    
                    FechaInicial: this.formatDate(this.$moment(new Date()).format('YYYY-MM-DD')), 
                    FechaFinal: this.formatDate(this.$moment(new Date()).format('YYYY-MM-DD')),
                    CheckFecha: true,
                    CheckSolicitado: false,
                    Tipo: 'realizado',
                },
                dateFrom:null,
                dateTo:null, 
                menu1: false,
                menu2: false,
            }
        },
        props : {
            query: Object,
        },
        mounted() {
            if (!this.permiso('OP_CONF_WOLKVOX')) {
                this.$router.push(this.url_no_permitida)
            } else {
                this.actualizar();
            }
        },
        methods:{
            ...mapActions({
                fetch: 'management/fetchRegistroWolkvox',
                details: 'management/fetchWolkvoxDetalles'
            }),
            ...mapMutations({
                reemplazar: 'callcenter/replaceListaElement',
                setInfo: 'setInfo',
            }),
            actualizar(){
                let payload = {};
                payload = this.copy(this.filtro);
                payload.FechaInicial = this.parseDate(this.filtro.FechaInicial);
                payload.FechaFinal = this.parseDate(this.filtro.FechaFinal);
                this.filtrar(payload);
            },
            filtrar(filtro){
                this.loading = true;
                this.fetch(filtro).then((result) => {
                    this.datos = result.datos;
                })
                .finally(()=>{
                    this.loading = false;
                })
            },
            copiarDato(value) {
                this.$copyText(value).then(() => {
                    this.setInfo('Copiado en list:' + value)
                })
                .catch(error => {
                    console.log(error)
                    this.setInfo(error)
                })
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
            detalles(item) {
                console.log(item);
                this.loading = true;
                var data = {codigo:item._id};
                this.details(data).then((result) => {
                    this.records.datos = result.datos;
                    console.log(result.datos)
                    this.records.show = true;
                })
                .finally(()=>{
                    this.loading = false;
                })
            }
        },
        computed: {
            ...mapState({
                url_no_permitida: state => state.auth.url_no_permitida,
                lista: state => state.management.missed_appointments,
                pagination: state => state.callcenter.pagination,
                user: state => state.auth.user_info,   
            }),
            ...mapGetters({
                permiso: 'auth/permiso', 
            }),
            getTitle(){
                return 'Wolkvox'
            }
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