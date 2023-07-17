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
                        <v-btn class="ma-2" color="primary darken-1" text @click="inicializar"><v-icon left small>refresh</v-icon>&nbsp;Actualizar&nbsp;</v-btn>
                    </v-col>
                    
                </v-row>
                <v-row>
                    
                    <v-col cols="12" sm="12" md="9" lg="9">
                        <v-row>
                            <IngresoPorDia ref="ingresoPorDia"></IngresoPorDia>
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
                                    <DatosCitas ref="citasAgendadasvsAsistidas"></DatosCitas>
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
    </v-container>
    <v-container v-else>
        <h1>Bienvenido a CRM</h1>
    </v-container>
</div>

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
import config from '@/modules/config';
import util from "@/utility/util";

export default {
name: 'Dashboard',
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
        estadisticas: [],
        panels: 0,
        itemsPerPage:6,
        dates: [],
        menu1: false,
        shown: false,
        d:{
            grafico_masterclass: null,
            grafico_presencial: null,
            grafico_matriculado: null,
            grafico_cumplimientoCita: null,
            grafico_datosDigitales: null,
            grafico_datosDigitalesMercadeo: null,
            general:null,
            grafico_digital_vs_citas:null,
            grafico_otros_vs_citas:null,
            grafico_agendadas_vs_asistidas: null,
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
        this.inicializar();
    },
    methods: {
        ...mapActions({
            listarSedes: 'sedes/fetchLista',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }), 
        consultar() {
            this.$refs.ingresoPorDia.consultar(this.payload);
            this.$refs.embudo.consultar(this.payload);
            this.$refs.digitalMatriculadosVsCita.consultar(this.payload);
            this.$refs.otrosMediosMatriculadosVsCita.consultar(this.payload);
            this.$refs.masterclassMatriculadosVsCita.consultar(this.payload);
            this.$refs.citasAgendadasvsAsistidas.consultar(this.payload);
            this.$refs.matriculadosPorSede.consultar(this.payload);
            this.$refs.datosPorSede.consultar(this.payload);
            this.$refs.ingresoMasterClass.consultar(this.payload);
            this.$refs.ingresoPresencial.consultar(this.payload);
            this.$refs.ingresoMatriculados.consultar(this.payload);
        },
        inicializar() {
            this.payload = {desde: this.dates[0], hasta: this.dates[1], sede:this.sede, tipo: this.tagSelected};
            console.log("DASHBOARD")
            setTimeout(this.consultar, 300);


                
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
            this.loading = true;
            this.listarSedes()
            .then(result => {
                this.sedes = result;
            })
            .catch(error => {
                console.error(error)
            }).finally(() => {
                this.loading = false;
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
        },
        fechaInicio() {
            if (this.dates.length) {
                return this.dates[0];
            }
            return "";
        },
        fechaFin() {
            if (this.dates.length) {
                return this.dates[this.dates.length - 1];
            }
            return "";
        }
    },
    watch: {
      selected () {
        this.search = ''
      },
    }
};
</script>
