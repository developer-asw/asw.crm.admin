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
                            :disabled="loading"
                            :title="'Fecha de ingreso'"
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
                                    label="Ingreso en (>)"
                                    :disabled="!filtro.CheckFecha || loading"
                                    @blur="dateFrom = parseDate(filtro.FechaInicial)"
                                    v-on="on">
                                </v-text-field>
                            </template>
                            <v-date-picker :min="fechaMinima" v-model="dateFrom" no-title @input="menu1 = false"></v-date-picker>
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
                                label="Ingreso en (<)"
                                :disabled="!filtro.CheckFecha || loading"
                                @blur="dateTo = parseDate(filtro.FechaFinal)"
                                v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker :min="fechaMinima" v-model="dateTo" no-title @input="menu2 = false"></v-date-picker>
                    </v-menu>
                    <!-- <p>Date in ISO format: <strong>{{ dateTo }}</strong></p> -->
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2">
                        <v-checkbox
                            v-model="filtro.CheckAgente"
                            :disabled="loading"
                            prepend-icon="list_alt">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="10">
                        <h4 style="margin-top: 20px;">Incluir Primer Contacto en rango seleccionado</h4>
                        <!--<v-radio-group label="Agente:" v-model="filtro.Agente" row>
                            <v-radio label="Último" value="ultimo" :disabled="!filtro.CheckAgente || loading"></v-radio>
                            <v-radio label="Primero" value="primero" :disabled="!filtro.CheckAgente || loading"></v-radio>
                        </v-radio-group>-->
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
                        <v-select v-model="filtro.Sede" :items="sedes" label="Sede" item-text="nombre" item-value="id" :disabled="!filtro.CheckSede || loading"
                        multiple chips>
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
                        <v-select v-model="filtro.Estado" :items="llamadas_estados" label="Estados" item-text="text" item-value="value" :disabled="!filtro.CheckEstado || loading"
                        multiple chips>
                        </v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2">
                        <v-checkbox
                            v-model="filtro.CheckCategoria"
                            :disabled="loading"
                            prepend-icon="list_alt">
                        </v-checkbox>
                    </v-col>
                    <v-col cols="10">
                        <v-select v-model="filtro.Categoria" :items="categorias" label="Categoría" :disabled="!filtro.CheckCategoria || loading"
                        multiple chips>
                        </v-select>
                    </v-col>
                </v-row>
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

import { mapActions, mapMutations, mapState } from 'vuex';
import Vue from 'vue'
import config from '@/modules/config'
import util from "../../utility/util";

export default {
    
    name: 'LeadsDownloads',
    components: {},
    data() {
        return {
            loading: false,
            fechaMinima: null,
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
                FechaInicial: this.formatDate(new Date().toISOString().substring(0, 10)), 
                FechaFinal: this.formatDate(new Date().toISOString().substring(0, 10)),
                Email:'',
                Sede: '',
                Estado: '',
                Categoria: '',
                Agente: 'ultimo',
                CheckFecha: false,
                CheckEmail: false,
                CheckSede: false,
                CheckAgente: false,
                CheckEstado: false,
                CheckCategoria: false,
            },
            estados:{},
            llamadas_estados: [],
            categorias:[],
            util:util
        }
    },
    methods: {
        ...mapActions({
            listarSedes: 'sedes/fetchLista',
            listarEstados: 'listado/fetchListaLlamadas',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        cerrar() {
            this.$emit('cerrar');
        },
        cambios() {
            console.log(this.filtro)
        },
        async descargarReporteOriginal(){
            this.loading = true
            let payload = {};
            payload.filters = this.copy(this.filtro);
            payload.filters.FechaInicial = this.parseDate(this.filtro.FechaInicial);
            payload.filters.FechaFinal = this.parseDate(this.filtro.FechaFinal);
            payload.download_tipo = 'csv'
            
            let response = await Vue.http.post("callcenter/descargar_cordinador", payload).finally(()=>{
                this.loading = false
            });
            /*var w = window.open('about:blank');
            w.document.open();
            w.document.write(response.data);
            w.document.close();*/
            let blob = new Blob([response.data], {encoding:"UTF-8",type:"text/plain;charset=UTF-8"});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'leads.'+payload.download_tipo;
            link.click();
            
            this.$emit('cerrar');

        },
        async descargarReporte(){
            this.loading = true
            let payload = {};
            payload.filters = this.copy(this.filtro);
            payload.filters.usuario_email = this.userEmail;
            payload.filters.FechaInicial = this.parseDate(this.filtro.FechaInicial);
            payload.filters.FechaFinal = this.parseDate(this.filtro.FechaFinal);
            payload.download_tipo = 'csv'
            
            let ruta = config.ROOT_API + "callcenter/descargar_cordinador?" + this.util.getUrlString(payload);

            let newWindow = window.open(ruta, '_blank');
            newWindow.focus();
            newWindow.onblur = function() { newWindow.close(); };
            this.loading = false
            this.$emit('cerrar');
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
        },
        traerEstados() {
            this.listarEstados()
            .then(result => {
                this.estados = result;
                this.llamadas_estados = [];
                if (this.estados && this.estados.llamadas) {
                    this.llamadas_estados = this.estados.llamadas;
                }
                this.categorias = this.estados.categorias;
                if (result.fecha_minima) {
                    this.fechaMinima = result.fecha_minima;
                }
            })
            .catch(error => {
                console.log(error)
            }).finally(() => {

            });
        }
    },
    computed:{
        ...mapState({
            user: state => state.auth.user_info,
        }),
        userEmail() {
            return this.user && this.user ? this.user.email : null
        }
    },
    mounted() {
      this.traerSedes();
      this.traerEstados();
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