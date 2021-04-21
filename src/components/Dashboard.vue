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
                <v-col cols="12" sm="6" lg="4">
                    <!-- v-model="menu1" -->
                    <v-menu 
                    ref="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    :value="shown"
                    max-width="290px"
                    min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="dateRangeText"
                                label="Rango de fecha"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on">
                            </v-text-field>
                            <!-- <v-text-field
                                v-model="dateFormatted"
                                label="Date"
                                hint="MM/DD/YYYY format"
                                persistent-hint
                                prepend-icon="mdi-calendar"
                                v-bind="attrs"
                                @blur="date = parseDate(dateFormatted)"
                                v-on="on">
                            </v-text-field> -->
                        </template>
                        <v-icon @click="closemenu">
                            close
                        </v-icon>
                        <!-- <v-date-picker
                            v-model="date"
                            no-title
                            @input="menu1 = false">
                        </v-date-picker> -->
                        <v-date-picker v-model="dates" no-title range @input="menu1 = false">
                            
                        </v-date-picker>
                    </v-menu>
                    <!--model: {{ dates }}-->
                </v-col>
            </v-container>
            <v-container>
                <v-row>
                    <v-col
                        v-for="item in estadisticas.datos"
                        :key="item.value"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="4">
                        <v-card v-if="item.tipo === 0">
                            <v-card-title class="subheading font-weight-bold">{{ item.title }}</v-card-title>

                            <v-divider></v-divider>

                            <v-list dense>
                                <v-list-item v-for="(v, k, i) in item.data" :key="i">
                                    <v-list-item-content>{{k}}:</v-list-item-content>
                                    <v-list-item-content :style="{'text-align':'right'}" class="align-end">{{ v }}</v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>


                        <v-card
                            class="mx-auto text-center"
                            color="green"
                            dark
                            max-width="600" v-if="item.tipo === 1">
                            <v-card-text>
                                <v-sheet color="rgba(0, 0, 0, .12)">
                                    <v-sparkline
                                        :value="item.data.values"
                                        :labels="item.data.labels"
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
                                    {{item.title}}
                                </div>
                            </v-card-text>

                            <!-- <v-divider></v-divider> -->

                            <!-- <v-card-actions class="justify-center">
                                <v-btn block text>Go to Report</v-btn>
                            </v-card-actions> -->
                        </v-card>
                        
                        <v-card
                            class="mx-auto text-center"
                            max-width="600" v-if="item.tipo === 2">
                            <v-card-text>
                                <apexchart type="area" height="350" :options="item.data.chartOptions" :series="item.data.series"></apexchart>
                            </v-card-text>

                            <!-- <v-card-text>
                                <div class="display-1 font-weight-thin">
                                    {{item.title}}
                                </div>
                            </v-card-text> -->
                            <!-- <v-card-actions class="justify-center">
                                <v-btn block text>Go to Report</v-btn>
                            </v-card-actions> -->
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <!-- multiple -->
            <!-- <v-expansion-panels  v-model="panels">
                <v-expansion-panel v-for="(data, key, index) in estadisticas" :key="index">
                    <v-expansion-panel-header dark color="indigo darken-5" flat :style="{'color':'white','font-weight':'900'}">
                        {{data.titulo}}

                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
            <v-row>
                <template>
                    <v-container fluid>
                        <v-data-iterator
                        :items="data.datos"
                        :items-per-page.sync="itemsPerPage"
                        hide-default-footer>
                        

                        <template v-slot:default="props">
                            <v-row>
                            <v-col
                                v-for="item in props.items"
                                :key="item.value"
                                cols="12"
                                sm="6"
                                md="4"
                                lg="4">
                                <v-card v-if="item.tipo === 0">
                                    <v-card-title class="subheading font-weight-bold">{{ item.title }}</v-card-title>

                                    <v-divider></v-divider>


                                    <v-list dense>
                                        <v-list-item v-for="(v, k, i) in item.data" :key="i">
                                            <v-list-item-content>{{k}}:</v-list-item-content>
                                            <v-list-item-content :style="{'text-align':'right'}" class="align-end">{{ v }}</v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card>


                                <v-card
                                    class="mx-auto text-center"
                                    color="green"
                                    dark
                                    max-width="600" v-if="item.tipo === 1">
                                    <v-card-text>
                                        <v-sheet color="rgba(0, 0, 0, .12)">
                                            <v-sparkline
                                                :value="item.data.values"
                                                :labels="item.data.labels"
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
                                            {{item.title}}
                                        </div>
                                    </v-card-text>


                                </v-card>
                                
                                <v-card
                                    class="mx-auto text-center"
                                    max-width="600" v-if="item.tipo === 2">
                                    <v-card-text>
                                        <apexchart type="area" height="350" :options="item.data.chartOptions" :series="item.data.series"></apexchart>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            </v-row>
                        </template>

                        </v-data-iterator>
                    </v-container>
                </template>
            </v-row>

                        </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels> -->

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
        shown: false
    }),
    mounted() {
        this.setDates();
        this.usuarioLogueado();
        this.consultar();
    },
    methods: {
        ...mapActions({
            consultarDashboard: 'dashboard/consultarDashboard',
            usuarioLogueado: 'dashboard/usuarioLogueado'
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
        consultar() {
            this.loading = true;
            this.consultarDashboard({desde: this.dates[0], hasta: this.dates[1]})
                .then(result => {
                    this.estadisticas = result.datos;
                })
                .catch(error => {
                    console.log(error)
                    this.setError(error)
                }).finally(() => {
                    this.loading = false;
                })
        },
        esUsuario(){
            if(this.user && this.user.data) {
                return ['callcenter', 'coordinador', 'superusuario', 'recepcion'].indexOf(this.user.data.rol) >= 0
            }else{
                return false;
            }
        },
        setDates() {
            this.dates[0] = this.$moment().format('YYYY-MM-DD');
            this.dates[1] = this.$moment().format('YYYY-MM-DD');
            console.log(this.user.data.email)
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
