<template>
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
                <v-col cols="12" sm="6" md="2" class="pb-5">
                    <v-btn class="ma-2" color="primary darken-1" text @click="consultar"><v-icon left small>refresh</v-icon>&nbsp;Actualizar&nbsp;</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12" md="9" lg="9">
                    <v-row>
                        <IngresoPorDia ref="ingresoPorDia" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></IngresoPorDia>
                    </v-row>
                </v-col>
                <v-col cols="12" sm="6" md="3" lg="3">
                    <v-row>
                        <v-col>
                            <Embudo ref="embudo"></Embudo>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="12" sm="12" cols="12">
                    <v-row align="center" justify="center">
                        <v-col md="12" sm="12" cols="12">
                            <h3>Efectividad Por fuente de Dato</h3>
                        </v-col>
                        <v-col md="4" sm="6" cols="12">
                            <v-row>
                                <DatosDigital ref="digitalMatriculadosVsCita"></DatosDigital>
                            </v-row>
                        </v-col>
                        <v-col md="4" sm="6" cols="12">
                            <v-row>
                                <DatosOtrosMedios ref="otrosMediosMatriculadosVsCita"></DatosOtrosMedios>
                            </v-row>
                        </v-col>
                        <v-col md="4" sm="6" cols="12">
                            <v-row>
                                <DatosMasterclass ref="masterclassMatriculadosVsCita"></DatosMasterclass>
                            </v-row>
                        </v-col>
                        
                        <v-col md="4" sm="6" cols="12">
                            <v-row>
                                <DatosCitas ref="citasAgendadasvsAsistidas" @comenzar="comenzarLoading" @terminar="terminarLoading"></DatosCitas>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col md="4" sm="6" cols="12">
                    <IngresoMasterClass ref="ingresoMasterClass"></IngresoMasterClass>
                </v-col>

                <v-col md="4" sm="6" cols="12">
                    <IngresoPresencial ref="ingresoPresencial"></IngresoPresencial>
                </v-col>

                <v-col md="4" sm="6" cols="12">
                    <IngresoMatriculados ref="ingresoMatriculados"></IngresoMatriculados>
                </v-col>

                <v-col lg="12" md="12" sm="12" cols="12">
                    <v-row>
                        <MatriculadosPorSede ref="matriculadosPorSede"></MatriculadosPorSede>
                    </v-row>
                </v-col>

                <v-col lg="12" md="12" sm="12" cols="12">
                    <v-row>
                        <DatosPorSede ref="datosPorSede"></DatosPorSede>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-layout>
</template>
<script>
    import IngresoPorDia from '@/components/Dashboard/Graficas/IngresoPorDia';
    import Embudo from '@/components/Dashboard/Graficas/Embudo';
    import DatosDigital from '@/components/Dashboard/Graficas/DatosDigital';
    import DatosOtrosMedios from '@/components/Dashboard/Graficas/DatosOtrosMedios';
    import DatosMasterclass from '@/components/Dashboard/Graficas/DatosMasterclass';
    import DatosCitas from '@/components/Dashboard/Graficas/DatosCitas';
    import MatriculadosPorSede from '@/components/Dashboard/Graficas/MatriculadosPorSede';
    import DatosPorSede from '@/components/Dashboard/Graficas/DatosPorSede';
    import IngresoPresencial from '@/components/Dashboard/Graficas/IngresoPresencial';
    import IngresoMasterClass from '@/components/Dashboard/Graficas/IngresoMasterClass';
    import IngresoMatriculados from '@/components/Dashboard/Graficas/IngresoMatriculados';
    import { mapState, mapActions, mapMutations } from 'vuex';
    
    export default {
    name: 'General',
        components: { 
            IngresoPorDia,
            Embudo,
            DatosDigital,
            DatosOtrosMedios,
            DatosMasterclass,
            DatosCitas,
            MatriculadosPorSede,
            DatosPorSede,
            IngresoPresencial,
            IngresoMasterClass,
            IngresoMatriculados
        },
        data: () => ({
            opciones:[],
            opcion:null,
            dates: [],
            menu1: false,
            shown: false,
            sedes:[],
            sede:null,
            loading:false
        }),
        mounted() {
            this.setDates();
            this.traerSedes();
        },
        methods: {
            ...mapActions({
                listarSedes: 'sedes/fetchLista',
            }),
            ...mapMutations({
                setInfo: 'setInfo',
                setError: 'setError',
            }),
            actualizar() {
                this.consultarComponentes('ingresoPorDia', new Date());
                this.consultarComponentes('embudo', new Date());
                this.consultarComponentes('digitalMatriculadosVsCita', new Date());
                this.consultarComponentes('otrosMediosMatriculadosVsCita', new Date());
                this.consultarComponentes('masterclassMatriculadosVsCita', new Date());
                this.consultarComponentes('citasAgendadasvsAsistidas', new Date());
                this.consultarComponentes('matriculadosPorSede', new Date());
                this.consultarComponentes('datosPorSede', new Date());
                this.consultarComponentes('ingresoMasterClass', new Date());
                this.consultarComponentes('ingresoPresencial', new Date());
                this.consultarComponentes('ingresoMatriculados', new Date());
            },
            consultar() {
                this.payload = {desde: this.dates[0], hasta: this.dates[1], sede:this.sede};
                this.actualizar();
            },
            setDates() {
                this.dates[0] = this.$moment().format('YYYY-MM-01');
                this.dates[1] = this.$moment().format('YYYY-MM-DD');
            },
            closemenu() {
                this.shown = false;
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
            terminar() {
                this.loading = false;
                this.loadingProp = false;
                this.$emit('terminar');
            },
            comenzar() {
                this.loading = true;
                this.loadingProp = true;
                this.$emit('comenzar');
            },
            consultarComponentes(componente, comienza) {
                if (this.$refs[componente] && typeof this.$refs[componente].consultar === "function") {
                    this.$refs[componente].consultar(this.payload);
                } else if(((new Date()).getTime() - comienza.getTime()) / 1000 / 60 > 1) {
                    // CLEAR
                } else {
                    console.log((new Date()).getTime() - comienza.getTime());
                    setTimeout(() => {
                        this.consultarComponentes(componente, comienza);
                    }, 200);
                }
            },
            comenzarLoading() {
                this.loading = true;
            },
            terminarLoading() {
                this.loading = false;  
            }

        },
        computed:{
            ...mapState({
                user: state => state.auth.user_info,
            }),
            dateRangeText () {
                return this.dates.map(x => this.$moment(x).format("DD/MM/YYYY")).join(' ~ ')
            },
            loadingProp() {
                return this.loading;
            },
        },
        watch: {
          selected () {
            this.search = ''
          },
        }
    };
</script>
    