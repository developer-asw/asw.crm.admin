<template>
<div>
    <v-toolbar flat light dense color="blue lighten-5">
        <!-- <v-toolbar-title>{{getTitle}}</v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <!--<v-btn small color="info" dark @click="consultar">
                <v-icon>autorenew</v-icon>
            </v-btn>-->
        </v-toolbar-items>
    </v-toolbar>

    <v-container v-if="esUsuario">
        <v-layout text-center wrap>
            <v-container>

                <v-row justify="space-around">
                    <v-col cols="12" sm="4" md="3">
                        
                        <v-select v-model="sede" :items="sedes" label="Sede" item-text="nombre" item-value="id" :disabled="loading"
                        multiple chips>
                        </v-select>
                    </v-col>
                    
                    <v-col cols="12" sm="4" md="5">
                        <v-container>
                            <v-menu ref="menu1" :close-on-content-click="false" transition="scale-transition" offset-y :value="shown" max-width="290px" min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="dateRangeText"
                                        label="Rango de fecha"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on">
                                    </v-text-field>
                                </template>
                                <v-icon @click="closemenu">
                                    close
                                </v-icon>
                                <v-date-picker v-model="dates" no-title range @input="menu1 = false">
                                    
                                </v-date-picker>
                            </v-menu>
                        </v-container>
                    </v-col>
                    <!--<v-col cols="12" sm="6" md="6"  class="pb-5">
                        <v-chip-group multiple active-class="primary--text">
                            <v-chip filter v-for="tag in tags" :key="tag" @click="seleccionarTag(tag)"> {{ tag }} </v-chip>
                        </v-chip-group>
                    </v-col>-->
                    <v-col cols="12" sm="6" md="2" class="pb-5">
                        <v-btn class="ma-2" color="primary darken-1" text @click="consultar"><v-icon left small>refresh</v-icon>&nbsp;Actualizar&nbsp;</v-btn>
                    </v-col>
                    
                </v-row>
                <v-row>
                    
                    <v-col
                        cols="12"
                        sm="12"
                        md="9"
                        lg="9">
                        <v-row>
                            <v-col v-if="d.grafico_por_dia" md="12" sm="12" cols="12">
                                
                                <v-card
                                    class="mx-auto text-center"
                                    >
                                    <v-card-text>
                                        <apexchart type="area" height="350" :options="d.grafico_por_dia.data.chartOptions" :series="d.grafico_por_dia.data.series"></apexchart>
                                    </v-card-text>

                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="3"
                        lg="3">
                        
                        <v-row>
                            <v-col v-if="d.general">
                                <v-card>
                                    <v-card-title class="subheading font-weight-bold">{{d.general.title}}</v-card-title>
                                    <v-divider></v-divider>

                                    <v-data-table
                                        :headers="[ { text: 'Titulo', align: 'start', value: 'title', }, { text: 'Total', align: 'start', value: 'value', }, { text: 'Porcentaje', align: 'start', value: 'percent', } ]"
                                        :items="d.general.data"
                                        hide-default-header
                                        hide-default-footer
                                        class="elevation-1">
                                        <template v-slot:[`item.percent`]="{ item }">
                                            {{ item.percent ? item.percent+'%':'' }}
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col md="12" sm="12" cols="12"><h3>Efectividad Por fuente de Dato</h3></v-col>
                    <v-col v-if="d.grafico_digital_vs_citas" md="4" sm="6" cols="12">
                        
                        <v-card
                            class="mx-auto text-center"
                            >
                            <v-card-text>
                                <apexchart type="bar" height="350" :options="d.grafico_digital_vs_citas.data.barOptions" :series="d.grafico_digital_vs_citas.data.series"></apexchart>
                            </v-card-text>

                        </v-card>
                    </v-col>
                    <v-col v-if="d.grafico_otros_vs_citas" md="4" sm="6" cols="12">
                        
                        <v-card
                            class="mx-auto text-center"
                            >
                            <v-card-text>
                                <apexchart type="bar" height="350" :options="d.grafico_otros_vs_citas.data.barOptions" :series="d.grafico_otros_vs_citas.data.series"></apexchart>
                            </v-card-text>

                        </v-card>
                    </v-col>
                    <v-col v-if="d.grafico_origenes_masterclass" md="4" sm="6" cols="12">
                        
                        <v-card
                            class="mx-auto text-center"
                            >
                            <v-card-text>
                                <apexchart type="bar" height="350" :options="d.grafico_origenes_masterclass.data.barOptions" :series="d.grafico_origenes_masterclass.data.series"></apexchart>
                            </v-card-text>

                        </v-card>
                    </v-col>
                    <v-col md="4" sm="6" cols="12"></v-col>
                    <v-col v-if="d.grafico_agendadas_vs_asistidas" md="4" sm="6" cols="12">
                        <v-card
                            class="mx-auto text-center"
                            >
                            <v-card-text>
                                <apexchart type="bar" height="350" :options="d.grafico_agendadas_vs_asistidas.data.barOptions" :series="d.grafico_agendadas_vs_asistidas.data.series"></apexchart>
                            </v-card-text>

                        </v-card>
                    </v-col>
                    <v-col md="4" sm="6" cols="12"></v-col>

                    <v-col md="4" sm="6" cols="12" v-if="d.grafico_masterclass">
                        <v-card
                            class="mx-auto text-center"
                            color="cyan"
                            dark
                            max-width="600">
                            <v-card-text>
                                <v-sheet color="rgba(0, 0, 0, .12)">
                                    <v-sparkline
                                        :value="d.grafico_masterclass.data.values"
                                        :labels="d.grafico_masterclass.data.labels"
                                        color="white"
                                        line-width="2"
                                        padding="16">
                                    <template v-slot:label="item">
                                        {{ item.value }} 
                                    </template>
                                    </v-sparkline>
                                </v-sheet>
                            </v-card-text>

                            <v-card-text>
                                <div class="display-1 font-weight-thin">
                                    <small>{{d.grafico_masterclass.title}}</small>
                                    <br>
                                    {{d.grafico_masterclass.total}}
                                    <v-btn small colot="info" text @click="descargar('datos_masterclass')">
                                        <v-icon>cloud_download</v-icon>
                                    </v-btn>
                                </div>
                            </v-card-text>


                        </v-card>
                    </v-col>

                    <v-col md="4" sm="6" cols="12" v-if="d.grafico_presencial">
                        <v-card
                            class="mx-auto text-center"
                            color="orange"
                            dark
                            max-width="600">
                            <v-card-text>
                                <v-sheet color="rgba(0, 0, 0, .12)">
                                    <v-sparkline
                                        :value="d.grafico_presencial.data.values"
                                        :labels="d.grafico_presencial.data.labels"
                                        color="white"
                                        line-width="2"
                                        padding="16">
                                    <template v-slot:label="item">
                                        {{ item.value }}
                                    </template>
                                    </v-sparkline>
                                </v-sheet>
                            </v-card-text>

                            <v-card-text>
                                <div class="display-1 font-weight-thin">
                                    <small>{{d.grafico_presencial.title}}</small>
                                    <br>
                                    {{d.grafico_presencial.total}}
                                    <v-btn small colot="info" text @click="descargar('datos_presencial')">
                                        <v-icon>cloud_download</v-icon>
                                    </v-btn>
                                </div>
                            </v-card-text>


                        </v-card>
                    </v-col>

                    <v-col md="4" sm="6" cols="12" v-if="d.grafico_matriculado">
                        <v-card
                            class="mx-auto text-center"
                            color="light-green"
                            dark
                            max-width="600">
                            <v-card-text>
                                <v-sheet color="rgba(0, 0, 0, .12)">
                                    <v-sparkline
                                        :value="d.grafico_matriculado.data.values"
                                        :labels="d.grafico_matriculado.data.labels"
                                        color="white"
                                        line-width="2"
                                        padding="16">
                                    <template v-slot:label="item">
                                        {{ item.value }}
                                    </template>
                                    </v-sparkline>
                                </v-sheet>
                            </v-card-text>

                            <v-card-text>
                                <div class="display-1 font-weight-thin">
                                    <small>{{d.grafico_matriculado.title}}</small>
                                    <br>
                                    {{d.grafico_matriculado.total}}
                                    <v-btn small colot="info" text @click="descargar('datos_matriculados')">
                                        <v-icon>cloud_download</v-icon>
                                    </v-btn>
                                </div>
                            </v-card-text>


                        </v-card>
                    </v-col>

                    <v-col lg="12" md="12" sm="12" cols="12" v-if="d.grafico_matriculas_sede">
                        <v-card class="mx-auto text-center">
                            <v-card-text>
                                <apexchart type="bar" height="350" :options="d.grafico_matriculas_sede.data.chartOptions" :series="d.grafico_matriculas_sede.data.series"></apexchart>
                            </v-card-text>

                        </v-card>
                    </v-col>

                    <v-col lg="12" md="12" sm="12" cols="12" v-if="d.grafico_por_sede">
                        <v-card class="mx-auto text-center">
                            <v-card-text>
                                <apexchart type="bar" height="350" :options="d.grafico_por_sede.data.chartOptions" :series="d.grafico_por_sede.data.series"></apexchart>
                            </v-card-text>

                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-layout>
    </v-container>
    <v-container v-else>
        <h1>Bienvenido a CRM</h1>
    </v-container>
</div>

</template>

<script>

import { mapState, mapActions, mapMutations } from 'vuex';
import VueApexCharts from 'vue-apexcharts';
import config from '@/modules/config';
import util from "@/utility/util";

export default {
name: 'Dashboard',
    components: { 
        apexchart: VueApexCharts, 
    },
    data: () => ({
        estadisticas: [],
        panels: 0,
        itemsPerPage:6,
        dates: [],
        menu1: false,
        shown: false,
        d:{
            grafico_por_dia:null,
            grafico_masterclass: null,
            grafico_presencial: null,
            grafico_matriculado: null,
            grafico_cumplimientoCita: null,
            grafico_datosDigitales: null,
            grafico_datosDigitalesMercadeo: null,
            grafico_por_sede: null,
            general:null,
            grafico_digital_vs_citas:null,
            grafico_otros_vs_citas:null,
            grafico_agendadas_vs_asistidas: null,
            grafico_matriculas_sede: null,
            grafico_origenes_masterclass: null
        },
        tags: ["Digital", "Convenio", "Referido", "Renovación", "Walk-In", "Otros"],
        tagSelected: [],
        sedes:[],
        sede:null,
        loading:false,
        util:util
    }),
    mounted() {
        this.setDates();
        this.traerSedes();
        this.consultar();
    },
    methods: {
        ...mapActions({
            consultarDashboard: 'dashboard/consultarDashboard',
            consulta1: 'dashboard/consultarDatosPorDia',
            consulta2: 'dashboard/consultarDatosGeneral',
            consulta3: 'dashboard/consultarDatosMasterclass',
            consulta4: 'dashboard/consultarDatosPresencial',
            consulta5: 'dashboard/consultarDatosMatriculado',
            consulta6: 'dashboard/consultarDatosPorSede',
            consulta8: 'dashboard/consultarDatosDigitalVsCitas',
            consulta9: 'dashboard/consultarDatosOtrosVsCitas',
            consulta10: 'dashboard/consultarDatosAgendadasVsAsistidas',
            consulta11: 'dashboard/consultarMatriculasPorSede',
            consulta12: 'dashboard/consultarOrigenesMasterclass',
            listarSedes: 'sedes/fetchLista',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
        consultar() {
            this.loading = true;
            this.payload = {desde: this.dates[0], hasta: this.dates[1], sede:this.sede, tipo: this.tagSelected};
            this.consulta1(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_por_dia = result.datos;
                        if (this.d.grafico_por_dia.data && this.d.grafico_por_dia.data.chartOptions && this.d.grafico_por_dia.data.chartOptions.chart) {
                            this.d.grafico_por_dia.data.chartOptions.chart = {selection: { enabled: true }};
                            var $this = this;
                            this.d.grafico_por_dia.data.chartOptions.chart.toolbar= {
                                tools: {
                                    download: false, // descargar csv datos dibujados
                                    selection: false,
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false | '<img src="/img/download-icon.png" width="20">',
                                    customIcons: [{
                                        icon: '<img src="/img/download-icon.png" width="20">',
                                        title: 'Descargar datos.',
                                        click: function () {
                                            $this.descargar('datos_por_dia');
                                        },
                                        appendTo: 'top' // left / top means the button will be appended to the left most or right most position
                                    }]
                                }
                            };
                        }
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta2(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.general = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta3(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_masterclass = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta4(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_presencial = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta5(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_matriculado = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta6(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_por_sede = result.datos;
                        if (this.d.grafico_por_sede.data && this.d.grafico_por_sede.data.chartOptions) {
                            var $this = this;
                            if (!this.d.grafico_por_sede.data.chartOptions.chart) {
                                this.d.grafico_por_sede.data.chartOptions.chart = {selection: { enabled: true }};
                            }
                            this.d.grafico_por_sede.data.chartOptions.chart.height = 450;
                            this.d.grafico_por_sede.data.chartOptions.chart.toolbar= {
                                tools: {
                                    download: false, // descargar csv datos dibujados
                                    selection: false,
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false | '<img src="/img/download-icon.png" width="20">',
                                    customIcons: [{
                                        icon: '<img src="/img/download-icon.png" width="20">',
                                        title: 'Descargar datos.',
                                        click: function () {
                                            $this.descargar('datos_por_sede');
                                        },
                                        appendTo: 'top' // left / top means the button will be appended to the left most or right most position
                                    }]
                                }
                            };
                        }
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; });
            
            this.loading = true;
            this.consulta8(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_digital_vs_citas = result.datos;
                        if (this.d.grafico_digital_vs_citas.data && this.d.grafico_digital_vs_citas.data.barOptions) {
                            var $this = this;
                            if (!this.d.grafico_digital_vs_citas.data.barOptions.chart) {
                                this.d.grafico_digital_vs_citas.data.barOptions.chart = {selection: { enabled: true }};
                            }
                            this.d.grafico_digital_vs_citas.data.barOptions.chart.toolbar= {
                                tools: {
                                    download: false, // descargar csv datos dibujados
                                    selection: false,
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false | '<img src="/img/download-icon.png" width="20">',
                                    customIcons: [{
                                        icon: '<img src="/img/download-icon.png" width="20">',
                                        title: 'Descargar datos.',
                                        click: function () {
                                            $this.descargar('digital_vs_citas');
                                        },
                                        appendTo: 'top' // left / top means the button will be appended to the left most or right most position
                                    }]
                                }
                            };
                        }
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.consulta9(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_otros_vs_citas = result.datos;
                        if (this.d.grafico_otros_vs_citas.data && this.d.grafico_otros_vs_citas.data.barOptions) {
                            var $this = this;
                            if (!this.d.grafico_otros_vs_citas.data.barOptions.chart) {
                                this.d.grafico_otros_vs_citas.data.barOptions.chart = {selection: { enabled: true }};
                            }
                            this.d.grafico_otros_vs_citas.data.barOptions.chart.toolbar= {
                                tools: {
                                    download: false, // descargar csv datos dibujados
                                    selection: false,
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false | '<img src="/img/download-icon.png" width="20">',
                                    customIcons: [{
                                        icon: '<img src="/img/download-icon.png" width="20">',
                                        title: 'Descargar datos.',
                                        click: function () {
                                            $this.descargar('otrosmedios_vs_citas');
                                        },
                                        appendTo: 'top' // left / top means the button will be appended to the left most or right most position
                                    }]
                                }
                            };
                        }
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.consulta10(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_agendadas_vs_asistidas = result.datos;
                        if (this.d.grafico_agendadas_vs_asistidas.data && this.d.grafico_agendadas_vs_asistidas.data.barOptions) {
                            var $this = this;
                            if (!this.d.grafico_agendadas_vs_asistidas.data.barOptions.chart) {
                                this.d.grafico_agendadas_vs_asistidas.data.barOptions.chart = {selection: { enabled: true }};
                            }
                            this.d.grafico_agendadas_vs_asistidas.data.barOptions.chart.toolbar= {
                                tools: {
                                    download: false, // descargar csv datos dibujados
                                    selection: false,
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false | '<img src="/img/download-icon.png" width="20">',
                                    customIcons: [{
                                        icon: '<img src="/img/download-icon.png" width="20">',
                                        title: 'Descargar datos.',
                                        click: function () {
                                            $this.descargar('agendadas_vs_asistidas');
                                        },
                                        appendTo: 'top' // left / top means the button will be appended to the left most or right most position
                                    }]
                                }
                            };
                        }
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.consulta11(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_matriculas_sede = result.datos;
                        if (this.d.grafico_matriculas_sede.data && this.d.grafico_matriculas_sede.data.chartOptions) {
                            var $this = this;
                            if (!this.d.grafico_matriculas_sede.data.chartOptions.chart) {
                                this.d.grafico_matriculas_sede.data.chartOptions.chart = {selection: { enabled: true }};
                            }
                            this.d.grafico_matriculas_sede.data.chartOptions.chart.toolbar= {
                                tools: {
                                    download: false, // descargar csv datos dibujados
                                    selection: false,
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false | '<img src="/img/download-icon.png" width="20">',
                                    customIcons: [{
                                        icon: '<img src="/img/download-icon.png" width="20">',
                                        title: 'Descargar datos.',
                                        click: function () {
                                            $this.descargar('matriculas_por_sede');
                                        },
                                        appendTo: 'top' // left / top means the button will be appended to the left most or right most position
                                    }]
                                }
                            };
                        }
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.consulta12(this.payload)
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_origenes_masterclass = result.datos;
                        if (this.d.grafico_origenes_masterclass.data && this.d.grafico_origenes_masterclass.data.barOptions) {
                            var $this = this;
                            if (!this.d.grafico_origenes_masterclass.data.barOptions.chart) {
                                this.d.grafico_origenes_masterclass.data.barOptions.chart = {selection: { enabled: true }};
                            }
                            this.d.grafico_origenes_masterclass.data.barOptions.chart.toolbar= {
                                tools: {
                                    download: false, // descargar csv datos dibujados
                                    selection: false,
                                    zoom: false,
                                    zoomin: false,
                                    zoomout: false,
                                    pan: false,
                                    reset: false | '<img src="/img/download-icon.png" width="20">',
                                    customIcons: [{
                                        icon: '<img src="/img/download-icon.png" width="20">',
                                        title: 'Descargar datos.',
                                        click: function () {
                                            $this.descargar('masterclass_vs_citas');
                                        },
                                        appendTo: 'top' // left / top means the button will be appended to the left most or right most position
                                    }]
                                }
                            };
                        }
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
                
        },
        setDates() {
            this.dates[0] = this.$moment().format('YYYY-MM-01');
            this.dates[1] = this.$moment().format('YYYY-MM-DD');
        },
        
        closemenu() {
            this.shown = false;
        },
        verSeleccionados() {
            console.log(this.tagSelected)
        },
        seleccionarTag(tag) {
            let index = this.tagSelected.indexOf(tag);
            if (this.tagSelected.indexOf(tag) === -1) {
                this.tagSelected.push(tag)
            }else {
                this.tagSelected.splice(index, 1)
            }
        },
        traerSedes() {
            this.listarSedes()
            .then(result => {
                this.sedes = result;
            })
            .catch(error => {
                console.error(error)
            }).finally(() => {

            });
        },
        descargar(grafica){
            this.loading = true
            let payload = {...this.payload};
            payload.usuario_email = this.userEmail;
            payload.download_tipo = 'csv';
            payload.grafica = grafica;
            
            let ruta = config.ROOT_API + "leads/descargar_dashboard?" + this.util.getUrlString(payload);
            let newWindow = window.open(ruta, '_blank');
            newWindow.focus();
            newWindow.onblur = function() { newWindow.close(); };
            this.loading = false
        }

    },
    computed:{
        ...mapState({
            user: state => state.auth.user_info,
        }),
        dateRangeText () {
            return this.dates.map(x => this.$moment(x).format("DD/MM/YYYY")).join(' ~ ')
        },
        allSelected () {
            return this.selected.length === this.items.length
        },
        selections () {
            const selections = []
            for (const selection of this.selected) {
                selections.push(selection)
            }
            return selections
        },
        esUsuario(){
            if(this.user && this.user.activo) {
                return true;
            }else{
                return false;
            }
        },
        userEmail() {
            return this.user && this.user ? this.user.email : null
        }
    },
    watch: {
      selected () {
        this.search = ''
      },
    }
};
</script>
