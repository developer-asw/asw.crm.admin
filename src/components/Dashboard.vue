<template>
<div>
    <v-toolbar flat light dense color="blue lighten-5">
        <!-- <v-toolbar-title>{{getTitle}}</v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn small color="info" dark @click="consultar">
                <v-icon>autorenew</v-icon>
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>

    <v-container v-if="esUsuario()">
        
        <v-layout text-center wrap>
            <v-container>
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
                            <v-col md="4" sm="12" cols="12" v-if="d.grafico_masterclass">
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
                                            {{d.grafico_masterclass.title}}
                                        </div>
                                    </v-card-text>


                                </v-card>
                            </v-col>
                            <v-col md="4" sm="12" cols="12" v-if="d.grafico_presencial">
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
                                            {{d.grafico_presencial.title}}
                                        </div>
                                    </v-card-text>


                                </v-card>
                            </v-col>
                            <v-col md="4" sm="12" cols="12" v-if="d.grafico_matriculado">
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
                                            {{d.grafico_matriculado.title}}
                                        </div>
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
                            <v-col>
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
                        </v-row>
                        <v-row>
                            <v-col v-if="d.general">
                                <v-card>
                                    <v-card-title class="subheading font-weight-bold">General</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                        <v-list-item v-for="(v, k, i) in d.general.data" :key="i">
                                            <v-list-item-content>{{k}}:</v-list-item-content>
                                            <v-list-item-content :style="{'text-align':'right'}" class="align-end">{{ v }}</v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </v-col>
                        </v-row>
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
import VueApexCharts from 'vue-apexcharts'

export default {
name: 'Dashboard',
    components: { 
        apexchart: VueApexCharts, 
    },
    data: () => ({
        estadisticas: [],
        panels: 0,
        // panels: [0],
        itemsPerPage:6,
        dates: ['2019-09-10', '2019-09-20'],
        menu1: false,
        shown: false,
        d:{
            grafico_por_dia:null,
            grafico_masterclass: null,
            grafico_presencial: null,
            grafico_matriculado: null,
            grafico_por_sede: null,
            general:null
        }
    }),
    mounted() {
        this.setDates();
        this.usuarioLogueado();
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
            usuarioLogueado: 'dashboard/usuarioLogueado'
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
        consultar() {
            this.loading = true;
            this.consulta1({desde: this.dates[0], hasta: this.dates[1]})
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_por_dia = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta2({desde: this.dates[0], hasta: this.dates[1]})
                .then(result => {
                    if(result && result.datos) {
                        this.d.general = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta3({desde: this.dates[0], hasta: this.dates[1]})
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_masterclass = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta4({desde: this.dates[0], hasta: this.dates[1]})
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_presencial = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta5({desde: this.dates[0], hasta: this.dates[1]})
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_matriculado = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
            this.loading = true;
            this.consulta6({desde: this.dates[0], hasta: this.dates[1]})
                .then(result => {
                    if(result && result.datos) {
                        this.d.grafico_por_sede = result.datos;
                    }
                })
                .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })
        },
        esUsuario(){
            if(this.user && this.user.data) {
                return ['callcenter', 'coordinador', 'superusuario', 'recepcion'].indexOf(this.user.data.rol) >= 0
            }else{
                return false;
            }
        },
        setDates() {
            this.dates[0] = this.$moment().format('YYYY-MM-01');
            this.dates[1] = this.$moment().format('YYYY-MM-DD');
        },
        
        closemenu() {
            this.shown = false;
        }
    },
    computed:{
        ...mapState({
            user: state => state.dashboard.user,  
        }),
        dateRangeText () {
            return this.dates.map(x => this.$moment(x).format("DD/MM/YYYY")).join(' ~ ')
        }
    }
};
</script>
