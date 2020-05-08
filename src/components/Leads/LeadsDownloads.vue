<template>
    <!-- <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
    </template> -->
    <v-card>
        <v-card-title>
            <span class="headline">Descargas de Lead</span>
        </v-card-title>
        <v-card-text>
            <v-container >
                <v-row>
                    <v-col cols="2">
                        
                        <v-checkbox
                            v-model="filtro.CheckFecha"
                            v-on:change="sesceleccionarUno('CheckFecha', 'CheckActualizadoEn')"
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
                                    label="Desde"
                                    :disabled="!filtro.CheckFecha || loading"
                                    @blur="dateFrom = parseDate(filtro.FechaInicial)"
                                    v-on="on">
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="dateFrom" no-title @input="menu1 = false"></v-date-picker>
                        </v-menu>
                        <!-- <p>Date in ISO format: <strong>{{ dateFrom }}</strong></p> -->
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
                                label="Hasta"
                                :disabled="!filtro.CheckFecha || loading"
                                @blur="dateTo = parseDate(filtro.FechaFinal)"
                                v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="dateTo" no-title @input="menu2 = false"></v-date-picker>
                    </v-menu>
                    <!-- <p>Date in ISO format: <strong>{{ dateTo }}</strong></p> -->
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2">
                        <v-checkbox
                            v-model="filtro.CheckActualizadoEn"
                            v-on:change="sesceleccionarUno('CheckActualizadoEn', 'CheckFecha')"
                            :disabled="loading"
                            :title="'Fecha de ultima modificación'"
                            prepend-icon="event">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="12" lg="5">
                        <v-menu
                            ref="menu3"
                            v-model="menu3"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-model="filtro.ActualizadoInicial"
                                    label="Desde"
                                    :disabled="!filtro.CheckActualizadoEn || loading"
                                    @blur="date2From = parseDate(filtro.ActualizadoInicial)"
                                    v-on="on">
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="date2From" no-title @input="menu3 = false"></v-date-picker>
                        </v-menu>
                        <!-- <p>Date in ISO format: <strong>{{ dateFrom }}</strong></p> -->
                    </v-col>
                    <v-col cols="12" lg="5">
                    <v-menu
                        ref="menu4"
                        v-model="menu4"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                v-model="filtro.ActualizadoFinal"
                                label="Hasta"
                                :disabled="!filtro.CheckActualizadoEn || loading"
                                @blur="date2To = parseDate(filtro.ActualizadoFinal)"
                                v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="date2To" no-title @input="menu4 = false"></v-date-picker>
                    </v-menu>
                    <!-- <p>Date in ISO format: <strong>{{ dateTo }}</strong></p> -->
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2">
                        <v-checkbox
                            v-model="filtro.CheckSede"
                            :disabled="loading"
                            prepend-icon="list_alt">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="10">
                        <v-select v-model="filtro.Sede" :items="sedes" label="Sede" item-text="nombre" item-value="id" :disabled="!filtro.CheckSede || loading">
                        </v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2">
                        <v-checkbox
                            v-model="filtro.CheckEstado"
                            :disabled="loading"
                            prepend-icon="list_alt">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="10">
                        <v-select v-model="filtro.Estado" :items="estados" label="Estado" item-text="nombre" item-value="id" :disabled="!filtro.CheckEstado || loading">
                        </v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2">
                        <v-checkbox
                            v-model="filtro.CheckContactado"
                            :disabled="loading"
                            prepend-icon="list_alt">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="10">
                        <v-select v-model="filtro.Contactado" :items="contactados" label="Agente" item-text="nombre" item-value="id" :disabled="!filtro.CheckContactado || loading">
                        </v-select>
                    </v-col>
                </v-row>
                <!-- <v-row>
                    <v-col cols="2">
                        <v-checkbox
                            v-model="filtro.CheckEmail"
                            :disabled="loading"
                            prepend-icon="email">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="10">
                        <v-text-field
                            v-model="filtro.Email"
                            label="E-mail"
                            :disabled="!filtro.CheckEmail || loading">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2">
                        <v-checkbox
                            v-model="filtro.CheckTelefono"
                            :disabled="loading"
                            prepend-icon="phone">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="10">
                        <v-text-field
                            v-model="filtro.Telefono"
                            label="Teléfono"
                            :disabled="!filtro.CheckTelefono || loading">
                        </v-text-field>
                    </v-col>
                </v-row> -->
            </v-container>
            <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text :disabled="loading" :loading="loading" @click="cerrar()">Cerrar</v-btn>
            <v-btn color="blue darken-1" text :disabled="loading" :loading="loading" @click="descargarReporte()">Descargar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

import { mapActions, mapMutations } from 'vuex';
import Vue from 'vue'
import config from '@/modules/config'

export default {
    
    name: 'LeadsDownloads',
    components: {},
    data() {
        return {
            loading: false,
            dateFrom:null,
            dateTo:null, 
            date2From:null,
            date2To:null, 
            menu1: false,
            menu2: false,
            menu3: false,
            menu4: false,
            sedes:[],
            filtro: {
                FechaInicial: this.formatDate(new Date().toISOString().substr(0, 10)), 
                FechaFinal: this.formatDate(new Date().toISOString().substr(0, 10)),
                ActualizadoInicial: this.formatDate(new Date().toISOString().substr(0, 10)), 
                ActualizadoFinal: this.formatDate(new Date().toISOString().substr(0, 10)),
                Email:'',
                Sede: '',
                Estado: '',
                CheckFecha: false,
                CheckEmail: false,
                CheckSede: false,
                CheckEstado: false,
                CheckActualizadoEn: false,
            },
            estados:[
                { "id": "asistio_primera_cita", "nombre": "Asiste a primera cita" }, 
                { "id": "interesado", "nombre": "Interesado" }, 
                { "id": "agendado_primera_vez", "nombre": "Agendado por primera vez" }, 
                { "id": "esperando_segunda_vez", "nombre": "Esperando segunda vez" }, 
                { "id": "registro_completo", "nombre": "Registro completo" }, 
                { "id": "errado", "nombre": "Errado" }, 
                { "id": "registro_incompleto", "nombre": "Registro incompleto" }
            ],
            contactados:[
                { "id": "asignado", "nombre": "Asignado a agente" },
                { 'id': "pendientes", "nombre": 'Pendientes'},
                { "id": "sin_solicitante", "nombre": "Sin solicitante" },
                { "id": "no_contestados", "nombre": "No contestados" },
                { "id": "todos", "nombre": "Todos" }, 
            ],
        }
    },
    methods: {
        ...mapActions({
            listarSedes: 'sedes/fetchLista',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        cerrar() {
            this.$emit('cerrar');
        },
        async descargarReporte(){
            this.loading = true
            let payload = {};
            payload.filters = this.copy(this.filtro);
            payload.filters.FechaInicial = this.parseDate(this.filtro.FechaInicial);
            payload.filters.FechaFinal = this.parseDate(this.filtro.FechaFinal);
            payload.filters.ActualizadoInicial = this.parseDate(this.filtro.ActualizadoInicial);
            payload.filters.ActualizadoFinal = this.parseDate(this.filtro.ActualizadoFinal);
            payload.download_tipo = 'csv'
            
            let response = await Vue.http.post("callcenter/descargar_cordinador", payload).finally(()=>{
                this.loading = false
            });

            let blob = new Blob([response.data], {type:response.headers.get('content-type')});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'leads.'+payload.download_tipo;
            link.click();
            
            this.$emit('cerrar');

        },
        async descargarReporteOriginal(){
            this.loading = true
            let payload = {};
            payload.filters = this.copy(this.filtro);
            payload.filters.FechaInicial = this.parseDate(this.filtro.FechaInicial);
            payload.filters.FechaFinal = this.parseDate(this.filtro.FechaFinal);
            payload.filters.ActualizadoInicial = this.parseDate(this.filtro.ActualizadoInicial);
            payload.filters.ActualizadoFinal = this.parseDate(this.filtro.ActualizadoFinal);
            payload.download_tipo = 'csv'
            
            let ruta = config.ROOT_API + "callcenter/descargar_cordinador?" + this.getUrlString(payload);

            let newWindow = window.open(ruta, '_blank');
            newWindow.focus();
            newWindow.onblur = function() { newWindow.close(); };
            this.loading = false
            this.$emit('cerrar');
        },
        getUrlString (params, keys = [], isArray = false) {
            const p = Object.keys(params).map(key => {
                let val = params[key]

                if ("[object Object]" === Object.prototype.toString.call(val) || Array.isArray(val)) {
                if (Array.isArray(params)) {
                    keys.push("")
                } else {
                    keys.push(key)
                }
                return this.getUrlString(val, keys, Array.isArray(val))
                } else {
                let tKey = key

                if (keys.length > 0) {
                    const tKeys = isArray ? keys : [...keys, key]
                    tKey = tKeys.reduce((str, k) => { return "" === str ? k : `${str}[${k}]` }, "")
                }
                if (isArray) {
                    return `${ tKey }[]=${ val }`
                } else {
                    return `${ tKey }=${ val }`
                }

                }
            }).join('&')

            keys.pop()
            return p
        }
        ,formatDate (date) {
            if (!date) return null
            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        parseDate (date) {
            if (!date) return null
            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },

        prepararPayload(){

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
        traerSedes() {
            this.listarSedes()
                .then(result => {
                    this.sedes = result;
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {
            });
        },
        sesceleccionarUno(p, s) {
            if( this.filtro[p] ) this.filtro[s] = false;
        }
    },
    mounted() {
      this.traerSedes()
    },
    watch: {
        dateFrom (val) {
            this.filtro.FechaInicial = this.formatDate(val)
        },
        dateTo (val) {
            this.filtro.FechaFinal = this.formatDate(val)
        },
        date2From (val) {
            this.filtro.ActualizadoInicial = this.formatDate(val)
        },
        date2To (val) {
            this.filtro.ActualizadoFinal = this.formatDate(val)
        },
    },
}
</script>