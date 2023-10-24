<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <!--<v-subheader>{{pagination.total}} registros</v-subheader>-->
                <v-subheader> - </v-subheader>
                <v-btn small color="info" dark @click="consola" :disabled="loading">
                    <v-icon>info</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card class="pl-4 pr-4">
            <v-card-title>
                <v-toolbar-title>
                    <v-btn no-gutters small text @click="$router.back()" :disabled="loading">
                        <v-icon>arrow_back_ios</v-icon>
                    </v-btn>
                    {{getTitle}}
                </v-toolbar-title>
                <!--<span class="headline">{{getTitle}}</span>-->
                
            </v-card-title> 
            
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="4" md="4">
                        <v-row>
                            <v-col cols="12">
                                <v-select v-model="sede" :disabled="sede !=  null" :items="sedes" label="Sede" item-text="text" item-value="id"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-row justify="center">
                                    <v-btn small v-if="setAsisteCita" class="ma-2" color="red darken-1" text @click="asiste" :disabled="activo === 'NO'" :loading="loading" title="Asiste a sede"><v-icon left small>event</v-icon>Asiste</v-btn>
                                    
                                    <v-btn small class="ma-2 p-0" v-if="puedeSolicitarCallcenter() && (permiso('OP_REGISTRAR_LLAMADA') || permiso('OP_AGENTE'))" color="green darken-1" text @click="iniciarSolicitar()" :disabled="activo === 'NO'" :loading="loading" title="Callcenter"><v-icon left small>phone</v-icon>Llamar</v-btn>
                                    <v-btn small class="ma-2 p-0" v-else-if="estaAsignadoCallcenter() && (permiso('OP_REGISTRAR_LLAMADA') || permiso('OP_AGENTE'))" color="green darken-1" text @click="iniciarCerrarCallcenter()" :disabled="activo === 'NO'" :loading="loading" title="Callcenter"><v-icon left small>warning</v-icon>Llamar</v-btn>
                                    <v-btn small class="ma-2 p-0" v-else-if="(permiso('OP_REGISTRAR_LLAMADA') || permiso('OP_AGENTE'))" color="green darken-1" text @click="historyOnlyCallcenter()" :disabled="activo === 'NO'" :loading="loading" title="Callcenter"><v-icon left small>phone_locked</v-icon>Llamar</v-btn>
        
                                    <v-btn small class="ma-2" v-if="puedeSolicitarApoyoFinanciero() && permiso('OP_AF_REGISTRAR_LLAMADA')" color="green darken-1" text @click="iniciarSolicitarApoyoFinanciero()" :loading="loading" :disabled="activo === 'NO'" title="Apoyo Finaciero"><v-icon left small>phone</v-icon>Llamar A.</v-btn>
                                    <v-btn small class="ma-2" v-else-if="estaAsignadoApoyoFinanciero() && permiso('OP_AF_REGISTRAR_LLAMADA')" color="green darken-1" text @click="iniciarCerrarApofoFinanciero()" :loading="loading" :disabled="activo === 'NO'" title="Apoyo Finaciero"><v-icon left small>warning</v-icon>Llamar A.</v-btn>
                                    <v-btn small class="ma-2" v-else-if="permiso('OP_AF_REGISTRAR_LLAMADA')" color="green darken-1" text @click="historyOnlyApoyoFinanciero() && permiso('OP_AF_REGISTRAR_LLAMADA')" :loading="loading" :disabled="activo === 'NO'" title="Apoyo Finaciero"><v-icon left small>phone_locked</v-icon>Llamar A.</v-btn>
                                </v-row>
                                <v-row v-if="activo === 'NO'">
                                    <v-col justify="center">
                                        <p class="text-center secondary">Deshabilitado el dia {{this.$moment(lead.date_disabled).format('DD/MM/YYYY h:mm a')}}</p>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12">
                                <EditLead :key="lead_id" :lead_id="lead_id" :setSedes="sedes" @actualizar="actualizarHistorial"></EditLead>
                            </v-col>
                            <v-col cols="12" justify="center">
                                <div class="text-center">
                                    <v-btn small class="ma-2" color="orange darken-1" text @click="dirigir('lead_edit', lead_id)"><v-icon left small>edit</v-icon> Editar</v-btn>
                                    <v-btn small class="ma-2" color="blue darken-1" text @click="regresar"><v-icon>navigate_before</v-icon> Regresar</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" sm="7" md="7">
                        <v-row justify="center">
                            <v-col cols="12" md="10" sm="8">
                                <LeadTimeLine :key="lead_id" :lead_id="lead_id"></LeadTimeLine>
                            </v-col>
                        </v-row>
                        
                        <v-row class="mt-10">
                            <v-col cols="12">
                                <LeadHistoricView :key="lead_id" :lead_id="lead_id"  :ver_detalles="true"></LeadHistoricView>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!--<v-col cols="12" sm="6" md="3">
                        <LeadAdicional :key="lead_id" :lead_id="lead_id" :setSedes="sedes"></LeadAdicional>
                    </v-col>-->
                    <v-col cols="12" sm="1" md="1">
                        <v-sheet height="400" class="overflow-hidden" style="position: relative;">
                            <v-container class="fill-height">
                                <v-row align="center" justify="center">
                                    <v-btn small block color="primary" dark @click.stop="drawer = !drawer">
                                        Matricula
                                    </v-btn>
                                    <v-btn class="mt-2" small block color="primary" dark @click.stop="llamadas = !llamadas">
                                        Llamadas
                                    </v-btn>
                                </v-row>
                            </v-container>
                        </v-sheet>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-navigation-drawer v-model="drawer" fixed temporary right :width="325">
                            <LeadAdicional :key="lead_id" :lead_id="lead_id" :setSedes="sedes"></LeadAdicional>
                        </v-navigation-drawer>
                        <v-navigation-drawer v-model="llamadas" fixed temporary right :width="325">
                            <LeadLlamadas :key="lead_id" :lead_id="lead_id"  :ver_detalles="true"></LeadLlamadas>
                        </v-navigation-drawer>
                    </v-col>
                </v-row>


            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="800px">
            <RecepcionRegistrarAsistencia :lead_id="lead_id" :sede_id="sede"  @cerrar="cerrarDialog" @actualizar="actualizar"></RecepcionRegistrarAsistencia>
        </v-dialog>
        
        <v-dialog v-model="llamada.show" max-width="800px">
        <CallcenterRegistrarLlamada
            :key="'callcenter'"
            :lead_id="lead_id"
            :ocultar="false"
            @cerrar="cerrarDialogCallcenter"
            @actualizar="actualizar"
            @copiarDatoParent="copiarDato"
        ></CallcenterRegistrarLlamada>
        </v-dialog>
        <v-dialog v-model="llamadaApoyoFinanciero.show" max-width="800px">
        <RegistrarLlamadaApoyoFinanciero
            :key="'apoyo_financiero'"
            :lead_id="lead_id"
            :ocultar="false"
            @cerrar="cerrarDialogApoyoFinanciero"
            @actualizar="actualizar"
            @copiarDatoParent="copiarDato"
        ></RegistrarLlamadaApoyoFinanciero>
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

import CallcenterRegistrarLlamada from "@/components/Callcenter/CallcenterRegistrarLlamada";
import RegistrarLlamadaApoyoFinanciero from "@/components/ApoyoFinanciero/RegistrarLlamada";
import RecepcionRegistrarAsistencia from '@/components/Recepcion/RecepcionRegistrarAsistencia';
import EditLead from '@/components/Callcenter/EditLead';
import LeadHistoricView from '@/components/Leads/Detail/LeadHistoricView';
import LeadLlamadas from '@/components/Leads/Detail/LeadLlamadas';
import LeadTimeLine from '@/components/Leads/Detail/LeadTimeLine';
import LeadAdicional from '@/components/Leads/Detail/LeadAdicional';

export default {
    name: 'RecepcionView',
    components: {
        RecepcionRegistrarAsistencia,
        EditLead,
        LeadHistoricView,
        CallcenterRegistrarLlamada,
        RegistrarLlamadaApoyoFinanciero,
        LeadTimeLine,
        LeadAdicional,
        LeadLlamadas
    },
    data: () => ({
        loading: false,
        dialog: false,
        listado: {},
        headerSeguimientos: [
            { text: '', value: 'tipo' },
            { text: 'Fecha', value: 'fecha', width: '20%', align: 'center' },
            { text: 'Usuario', value: 'usuario.nombre', align: 'right' },
            { text: 'Llamar', value: 'accion' },
            { text: 'Observación', value: 'observacion' },
        ],
        detalles:[],
        llamada: {
            show: false,
        },
        llamadaApoyoFinanciero: {
            show: false,
        },
        sedes: [],
        fechas: [],
        sede: null,
        fechaMinima:null,
        horaMinima:null,
        horaMaxima:null,
        drawer: null,
        llamadas:null,
        items: [
          { title: 'Home', icon: 'mdi-view-dashboard' },
          { title: 'About', icon: 'mdi-forum' },
        ]
    }),
    mounted() {
        this.fechaMinima = this.$moment().format('YYYY-MM-DD');
        this.traerSedesYFechas();
        this.viewItem();
    },
    methods: {
        ...mapActions({
            fetchDetalle: 'leads/fetchDetalle',
            solicitarCita: 'recepcionista/solicitar',
            solicitarApoyoFinanciero:'callcenter/solicitarAF',
            solicitarCallcenter: "callcenter/solicitar",
            fetchDisponibilidad: 'agenda/fetchDisponibilidad',
            fetchDisponibilidadLlamadas: 'agenda/fetchDisponibilidadLlamadas',
            cambiarEstado: 'agenda/confirmarAsistencia',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
            setLead: 'leads/setDetalle',
        }),
        traerSedesYFechas() {
            this.fetchDisponibilidad()
                .then(result => {
                    this.fechas = result.resultSet.fechas
                    this.sedes = result.resultSet.sedes
                    this.sede = this.getSedeUsuario();
                })
                .catch(error => {
                    console.log(error)
                    this.setError(error)
                }).finally(() => {

                })
        },
        regresar() {
            this.$router.back();
        },
        copiarDato(value) {
            this.$copyText(value).then(() => {
                    this.setInfo('Copiado en list:' + value) 
                }).catch(error => {
                    console.log(error);this.setInfo(error)
                }
            );
        },
        viewItem() {
            this.loading = true;
            this.fetchDetalle({id:this.lead_id})
            .finally(() => {
                this.loading = false;
            })  
        },
        viewDialog() {
            this.dialog = !this.dialog;
        },
        asiste(){
            this.dialog = true;
        },
        cerrarDialog(){
            this.dialog = false;
        },
        actualizar(){
            this.viewItem();
        },
        consola(){
            console.log(this.lead)
        },
        getSedeUsuario(){
            if(this.user && this.user.sede_id) {
                return this.user.sede_id;
            }else{
                return null;
            }
        },
        actualizarHistorial() {

        },
        puedeSolicitarCallcenter() {
        if (this.lead && this.lead.ultima_llamada && this.lead.ultima_llamada.estado == "pendiente") {
            return true;
        }
        return false;
        },
        puedeSolicitarApoyoFinanciero(){
            if((this.lead && this.lead.af_ultima_llamada && ['pendiente','terminado'].includes(this.lead.af_ultima_llamada.estado)) || (this.lead && !this.lead.af_ultima_llamada)){
                return true
            }
            return false
        },
        estaAsignadoCallcenter() {
            if (this.lead && this.lead.ultima_llamada && this.lead.ultima_llamada.estado == "llamando" && this.lead.ultima_llamada.agente ) {
                return true;
            }
            return false;
        },
        estaAsignadoApoyoFinanciero() {
            if(this.lead && this.lead.af_ultima_llamada && this.lead.af_ultima_llamada.estado == 'llamando' && this.lead.af_ultima_llamada.agente && this.lead.af_ultima_llamada.agente.email == this.user.email){
                return true
            }
            return false
        },
        iniciarSolicitar() {
            this.loading = true;
            this.solicitarCallcenter({ id_lead: this.lead_id }).then((result) => {
                if (result.result == "ok") {
                    this.viewItemCallcenter();
                }
                if (result.result == "llamando") {
                    this.setInfo("Ya fue asignado");
                }
            })
            .finally(() => {
                this.loading = false;
            });
        },
        iniciarSolicitarApoyoFinanciero() {
            this.loading = true;
            this.solicitarApoyoFinanciero({ id_lead: this.lead_id }).then((result) => {
                if (result.result == "ok") {
                    this.viewItemApoyoFinanciero();
                }
                if (result.result == "llamando") {
                    this.setInfo("Ya fue asignado");
                }
            })
            .finally(() => {
                this.loading = false;
            });
        },
        iniciarCerrarCallcenter() {
            this.viewItemCallcenter();
        },
        iniciarCerrarApofoFinanciero(){
            this.viewItemApoyoFinanciero()
        },
        viewItemCallcenter() {
            this.loading = true;
            this.fetchDetalle({ id: this.lead_id }).then((result) => {
                if (result.datos && result.datos.uid) {
                    let phoneCopy = result.datos.uid;
                    if (phoneCopy) {
                    if (phoneCopy.startsWith("57")) {
                        phoneCopy = phoneCopy.substring(2);
                    }
                    if (phoneCopy.length == 10) {
                        phoneCopy = "9" + phoneCopy;
                    }
                    this.$copyText(phoneCopy)
                        .then(() => {
                        this.setInfo("Autorizado y Copiado");
                        })
                        .catch((error) => {
                        console.log(error);
                        });
                    }
                }
                this.llamada.show = true;
                this.llamada.llamada = true;
            })
            .finally(() => {
            this.loading = false;
            });
        },
        viewItemApoyoFinanciero() {
            this.loading = true;
            this.fetchDetalle({ id: this.lead_id }).then((result) => {
                if (result.datos && result.datos.uid) {
                    let phoneCopy = result.datos.uid;
                    if (phoneCopy) {
                    if (phoneCopy.startsWith("57")) {
                        phoneCopy = phoneCopy.substring(2);
                    }
                    if (phoneCopy.length == 10) {
                        phoneCopy = "9" + phoneCopy;
                    }
                    this.$copyText(phoneCopy)
                        .then(() => {
                        this.setInfo("Autorizado y Copiado");
                        })
                        .catch((error) => {
                        console.log(error);
                        });
                    }
                }
                this.llamadaApoyoFinanciero.show = true;
                this.llamadaApoyoFinanciero.llamada = true;
            })
            .finally(() => {
                this.loading = false;
            });
        },
        historyOnlyCallcenter() {
            this.setInfo("Ya lo llamaron");
            this.llamada.show = true;
            this.llamada.llamada = false;
        },
        historyOnlyApoyoFinanciero() {
            this.setInfo("Ya lo llamaron");
            this.llamadaApoyoFinanciero.show = true;
            this.llamadaApoyoFinanciero.llamada = false;
        },
        cerrarDialogCallcenter() {
            this.llamada.show = false;
        },
        cerrarDialogApoyoFinanciero() {
            this.llamadaApoyoFinanciero.show = false;
        },
        dirigir(ruta, id) {
            if(this.permiso('OP_LEAD_EDITAR')) {
                // :to="{ name: 'lead_edit', params: { id: lead_id } }"
                this.$router.push({ name: ruta, params: { id: id } })
                // this.$router.push(`/recepcion/${value._id}/view`)
            }else {
                this.setInfo("Su perfil no tiene este permiso activo");
            }
        },
    },
    computed: {
        ...mapState({
            error: state => state.error,
            user: state => state.auth.user_info,
        }),
        ...mapGetters({
            
        }),
        getTitle() {
            return 'Recepcion'
        },
        lead_id(){
            return this.$route.params.id
        },
        lead() {
            return this.detalle(this.lead_id)
        },
        activo() {
            if (this.lead) return this.lead._activo;
            return null;
        },
        ...mapGetters({
            detalle: 'leads/getDetalle',
            permiso: 'auth/permiso', 
        }),
        setAsisteCita(){
            return this.permiso('OP_ASISTIR_CITA') ? true : false;
        }
    }
};
</script>