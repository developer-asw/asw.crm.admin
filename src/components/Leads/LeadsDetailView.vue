<template>
    <div>
        <v-card>
            <v-card-title>
                <span class="headline">{{getTitle}}</span>
                
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        FECHA INGRESO: <br>
                        {{lead.fecha_ingreso | moment("DD/MM/YYYY") }}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        SEDE: <br>
                        {{lead.sede_full ? lead.sede_full.nombre : 'Sin sede'}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        IDENTIFICACIÓN: <br>{{lead.identificacion}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        NOMBRE COMPLETO: <br>{{lead.full_name}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        E-MAIL: <br>{{lead.email}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        TELÉFONO: <br>{{lead.movil}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        RENOVACIÓN: <br>{{lead.renovacion}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        CAMPAÑA: <br>{{getOrigen}}
                    </v-col>
                    
                    <v-col cols="12" sm="6" md="4" lg="3">
                        ¿CÓMO LLEGO?: <br>{{getComoLlego}}
                    </v-col>

                    <v-col cols="12" sm="6" md="4" lg="3">
                        ¿CÓMO SE ENTERO?: <br>{{getComoSeEntero}}
                    </v-col>

                    <v-col cols="12" sm="6" md="4" lg="3">
                        PROGRAMA DE INTERÉS: <br>{{getProgramaInteres}}
                    </v-col>

                    <v-col cols="12" sm="6" md="4" lg="3">
                        AGENTE: <br>{{getAgente}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        ESTADO: <br>{{lead.ultima_llamada_estado}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        COMENTARIOS PAGINA WEB: <br>{{lead.comentarios}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        OBSERVACIONES: <br>{{getObservacion}}
                    </v-col>

                </v-row>

                <v-row>
                    <!-- <v-card-actions> -->
                        <v-spacer></v-spacer>
                        <v-btn class="ma-2" color="red darken-1" text :to="{ name: 'seguimiento_edit', params: { id: leadId } }"><v-icon left small>edit</v-icon>&nbsp;Editar&nbsp;</v-btn>
                        
                        <v-btn class="ma-2" v-if="puedeSolicitar()" color="green darken-1" text @click="iniciarSolicitar()" :loading="loading">
                            <v-icon left small>phone</v-icon>&nbsp;Accion &nbsp;
                        </v-btn>
                        <v-btn class="ma-2" v-else-if="estaAsignado()" color="green darken-1" text @click="iniciarCerrar()" :loading="loading">
                            <v-icon left small>warning</v-icon>&nbsp;Accion &nbsp;
                        </v-btn>
                        <v-btn class="ma-2" v-else color="green darken-1" text @click="historyOnly()" :loading="loading">
                            <v-icon left small>phone_locked</v-icon>&nbsp;Accion &nbsp;
                        </v-btn>

                        <v-btn class="ma-2" color="blue darken-1" text @click="regresar"><v-icon>navigate_before</v-icon>&nbsp;Regresar&nbsp;</v-btn>
                    <!-- </v-card-actions>  -->
                </v-row>
                <v-row class="mt-10">
                    <LeadHistoricView :key="leadId" :lead_id="leadId" :ver_detalles="true"></LeadHistoricView>
                </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-model="llamada.show" max-width="800px">
            <!-- <CallcenterRegistrarLlamada :lead_id="leadId" @cerrar="cerrarDialog" @actualizar="actualizar" @copiarDatoParent="copiarDato"></CallcenterRegistrarLlamada> -->
            <CallcenterRegistrarLlamada :lead_id="leadId" @cerrar="cerrarDialog" @actualizar="actualizar" @copiarDatoParent="copiarDato"></CallcenterRegistrarLlamada>
        </v-dialog>
    </div>
</template>
<script>

import {
    mapState,
    mapGetters,
    mapActions,
    mapMutations
} from 'vuex';

import CallcenterRegistrarLlamada from '@/components/Callcenter/CallcenterRegistrarLlamada'
import LeadHistoricView from '@/components/Leads/Detail/LeadHistoricView'

export default {
    name: 'LeadsDetailView',
    components: {
        CallcenterRegistrarLlamada,
        LeadHistoricView
    },
    data: () => ({
        loading: false,
        dialog: false,
        lead: {
            primer_nombre: null,
            segundo_nombre: null,
            primer_apellido: null,
            segundo_apellido: null,
            telefono: null,
            sede: null,
            email: null,
            origen: null,
            llamadas:[]
        },
        listado: {},
        headerSeguimientos: [
            { text: '', value: 'tipo' },
            { text: 'Fecha', value: 'fecha' },
            { text: 'Usuario', value: 'usuario.nombre' },
            { text: 'Acción', value: 'accion' },
            { text: 'Observación', value: 'observacion' },
        ],
        detalles:[],
        llamada: {
            show: false,
        }
    }),
    mounted() {
        this.traerLead();
        this.traerOrigenes();
    },
    methods: {
        ...mapActions({
            consultar: 'leads/fetchLeadHistorial',
            listarOrigenes: 'listado/fetchListaLeads',
            solicitar: 'callcenter/solicitar',
            fetchDetalle: 'leads/fetchDetalle'
        }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        traerOrigenes() {
            this.listarOrigenes()
                .then(result => {
                    this.listado = result;
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {

                });
        },
        regresar() {
            this.$router.back();
        },
        cerrarDialog(){
            this.llamada.show = false;
        },
        actualizar() {
            this.traerLead();
        },
        copiarDato(value) {
            this.$copyText(value).then(() => {
                    this.setInfo('Copiado en list:' + value) 
                }).catch(error => {
                    console.log(error);this.setInfo(error)
                }
            );
        },
        ////////////////////
        traerLead() {
            this.viewItemConsulta();
        },
        puedeSolicitar(){
            if(this.lead.ultima_llamada && this.lead.ultima_llamada.estado == 'pendiente'){
                return true
            }
            return false
        },
        iniciarSolicitar(){
            this.loading = true;
            this.solicitar({id_lead:this.leadId})
            .then((result) => {
                if(result.result == 'ok') {
                    this.viewItem()
                }
                if(result.result == 'llamando'){
                    this.setInfo('Ya fue asignado')
                }            
            })
            .finally(()=>{
                this.loading = false;
            })
        },
        estaAsignado() {
            if(this.lead.ultima_llamada && this.lead.ultima_llamada.estado == 'llamando' && this.lead.ultima_llamada.agente && this.lead.ultima_llamada.agente.email == this.user.data.email){
                return true
            }
            return false
        },
        iniciarCerrar(){
            this.viewItem()
        },
        historyOnly() {
            this.setInfo('Ya lo llamaron');
            this.llamada.show = true;
            this.llamada.llamada = false;
        },
        viewItem() {
            this.loading = true;
            this.fetchDetalle({id:this.leadId}).then((result) => {
                if(result.datos && result.datos.uid){
                    let phoneCopy = result.datos.uid
                    if(phoneCopy) {
                        if(phoneCopy.startsWith('57')){
                        phoneCopy = phoneCopy.substring(2)
                        }
                        if(phoneCopy.length==10){
                        phoneCopy = '9'+phoneCopy
                        }
                        this.$copyText(phoneCopy).then(() => {
                            this.setInfo('Autorizado y Copiado')
                        })
                        .catch(error=>{
                            console.log(error)
                        })
                    }
                }
                //this.viewDialog = true
                this.llamada.show = true
                this.llamada.llamada = true;
            })
            .finally(() => {
                this.loading = false;
            })  
        },
        viewItemConsulta() {
            this.loading = true;
            this.fetchDetalle({id:this.leadId}).then((result) => {
                if(result.datos){
                    this.lead = result.datos;
                }
            })
            .finally(() => {
                this.loading = false;
            })  
        },
        ////////////LLAMADAS
    },
    computed: {
        ...mapState({
            error: state => state.error,
        }),
        ...mapGetters({
            
        }),
        getTitle() {
            return 'Leads'
        },
        getOrigen() {
            if(this.listado && this.listado.origenes) {
                let origen = this.listado.origenes.find((x) => x.value == this.lead.origen);
                if( origen ) {
                    return origen.title;
                }
            }
            return this.lead.origen;
        },
        getComoLlego(){
            return this.lead.como_llego;
        },
        getComoSeEntero(){
            return this.lead.como_se_entero;
        },
        getProgramaInteres() {
            return this.lead.programa_interes;
        },
        getAgente() {
            if(this.listado && this.listado.agentes) {
                let agente = this.listado.agentes.find((x) => x.email == this.lead.agente);
                if(agente) {
                    return `${agente.primer_nombre} ${agente.primer_apellido}`
                }
            }
            return this.lead.agente;
        },
        getObservacion() {
            if(this.lead.observacion) {
                return this.lead.observacion;
            }
            if(this.lead.descartado_motivo) {
                return this.lead.descartado_motivo;
            }
            if(this.lead.errado_motivo) {
                return this.lead.errado_motivo;
            }
            return "Sin observaciones";
        },
        leadId(){
            return this.$route.params.id
        }
    }
};
</script>