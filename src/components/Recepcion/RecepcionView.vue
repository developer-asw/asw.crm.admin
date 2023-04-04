<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar-title>
                    <v-btn small text @click="$router.back()" :disabled="loading">
                        <v-icon>arrow_back_ios</v-icon>
                    </v-btn>
                    {{getTitle}}
                </v-toolbar-title>
                <!--<span class="headline">{{getTitle}}</span>-->
                
            </v-card-title> 
            
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="3" md="2"></v-col>
                    <v-col cols="12" sm="6" md="8">
                        <EditLead :key="lead_id" :lead_id="lead_id" :setSedes="sedes" @actualizar="actualizarHistorial"></EditLead>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="2" md="1"></v-col>

                    <v-col cols="12" sm="8" md="10">
                        <v-select v-model="sede" :disabled="sede !=  null" :items="sedes" label="Sede" item-text="text" item-value="id"></v-select>
                        <v-spacer></v-spacer>
                        <div class="text-right">
                            <!--<v-btn class="ma-2" color="blue darken-1" text @click="consola"><v-icon left small>event</v-icon>Consola</v-btn>-->
                            <v-btn v-if="setAsisteCita" class="ma-2" color="red darken-1" text @click="asiste"><v-icon left small>event</v-icon>&nbsp;Asiste&nbsp;</v-btn>
                            
                            <v-btn class="ma-2" v-if="puedeSolicitar() && permiso('OP_AGENTE')" color="green darken-1" text @click="iniciarSolicitar()" :loading="loading" title="Callcenter"><v-icon left small>phone</v-icon>&nbsp;Llamar &nbsp;</v-btn>
                            <v-btn class="ma-2" v-else-if="estaAsignado() && permiso('OP_AGENTE')" color="green darken-1" text @click="iniciarCerrarCallcenter()" :loading="loading" title="Callcenter"><v-icon left small>warning</v-icon>&nbsp;Llamar &nbsp;</v-btn>
                            <v-btn class="ma-2" v-else-if="permiso('OP_AGENTE')" color="green darken-1" text @click="historyOnlyCallcenter()" :loading="loading" title="Callcenter"><v-icon left small>phone_locked</v-icon>&nbsp;Llamar &nbsp;</v-btn>

                            <v-btn class="ma-2" v-if="puedeSolicitarApoyoFinanciero() && permiso('OP_AF_REGISTRAR_LLAMADA')" color="green darken-1" text @click="iniciarSolicitarApoyoFinanciero()" :loading="loading" title="Apoyo Finaciero"><v-icon left small>phone</v-icon>&nbsp;Apoyo Financiero &nbsp;</v-btn>
                            <v-btn class="ma-2" v-else-if="estaAsignadoApoyoFinanciero() && permiso('OP_AF_REGISTRAR_LLAMADA')" color="green darken-1" text @click="iniciarCerrarApofoFinanciero()" :loading="loading" title="Apoyo Finaciero"><v-icon left small>warning</v-icon>&nbsp;Apoyo Financiero &nbsp;</v-btn>
                            <v-btn class="ma-2" v-else-if="permiso('OP_AF_REGISTRAR_LLAMADA')" color="green darken-1" text @click="historyOnlyApoyoFinanciero() && permiso('OP_AF_REGISTRAR_LLAMADA')" :loading="loading" title="Apoyo Finaciero"><v-icon left small>phone_locked</v-icon>&nbsp;Apoyo Financiero &nbsp;</v-btn>

                            <!--<v-btn class="ma-2" color="red darken-1" text :to="{ name: 'lead_edit', params: { id: leadId } }"><v-icon left small>edit</v-icon>&nbsp;Editar&nbsp;</v-btn>-->
                            <v-btn class="ma-2" color="orange darken-1" text :to="{ name: 'lead_edit', params: { id: lead_id } }"><v-icon left small>edit</v-icon>&nbsp;Editar&nbsp;</v-btn>
                            <v-btn class="ma-2" color="blue darken-1" text @click="regresar"><v-icon>navigate_before</v-icon>&nbsp;Regresar&nbsp;</v-btn>
                        </div>
                    </v-col>
                     <!-- <v-card-actions>  -->

                     <!-- </v-card-actions>   -->
                </v-row>
                
                <v-row class="mt-10">
                    <v-col cols="12" md="1"  sm="2"></v-col>
                    <v-col cols="12" md="10" sm="8">
                        <LeadHistoricView :key="lead_id" :lead_id="lead_id"  :ver_detalles="true"></LeadHistoricView>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="800px">
            <RecepcionRegistrarAsistencia :lead_id="lead_id" :sede_id="sede"  @cerrar="cerrarDialog" @actualizar="actualizar"></RecepcionRegistrarAsistencia>
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

import RecepcionRegistrarAsistencia from '@/components/Recepcion/RecepcionRegistrarAsistencia'
import EditLead from '@/components/Callcenter/EditLead'
import LeadHistoricView from '@/components/Leads/Detail/LeadHistoricView'


    export default {
        name: 'RecepcionView',
        components: {
            RecepcionRegistrarAsistencia,
            EditLead,
            LeadHistoricView
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
            sedes: [],
            fechas: [],
            sede: null,
            fechaMinima:null,
            horaMinima:null,
            horaMaxima:null
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
            viewItemCita() {
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
                this.viewItemCita();
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
            puedeSolicitar() {
            if (
                this.lead.ultima_llamada &&
                this.lead.ultima_llamada.estado == "pendiente"
            ) {
                return true;
            }
            return false;
            },
            puedeSolicitarApoyoFinanciero(){
                if((this.lead.af_ultima_llamada && ['pendiente','terminado'].includes(this.lead.af_ultima_llamada.estado)) || (!this.lead.af_ultima_llamada)){
                    return true
                }
                return false
            },
            estaAsignado() {
                if (this.lead.ultima_llamada && this.lead.ultima_llamada.estado == "llamando" && this.lead.ultima_llamada.agente ) {
                    return true;
                }
                return false;
            },
            estaAsignadoApoyoFinanciero() {
                if(this.lead.af_ultima_llamada && this.lead.af_ultima_llamada.estado == 'llamando' && this.lead.af_ultima_llamada.agente && this.lead.af_ultima_llamada.agente.email == this.user.email){
                    return true
                }
                return false
            },
            iniciarSolicitar() {
                this.loading = true;
                this.solicitarCallcenter({ id_lead: this.leadId }).then((result) => {
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
                this.solicitarApoyoFinanciero({ id_lead: this.leadId }).then((result) => {
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
                this.fetchDetalle({ id: this.leadId }).then((result) => {
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
                this.fetchDetalle({ id: this.leadId }).then((result) => {
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