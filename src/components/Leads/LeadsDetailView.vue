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
                        ESTADO: <br>{{lead.estado}}
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        OBSERVACIONES: <br>{{getObservacion}}
                    </v-col>

                </v-row>

                <v-row>
                    <!-- <v-card-actions> -->
                        <v-spacer></v-spacer>
                        <v-btn class="ma-2" color="red darken-1" text :to="{ name: 'seguimiento_edit', params: { id: leadIdDialog } }"><v-icon left small>edit</v-icon>&nbsp;Editar&nbsp;</v-btn>
                        
                        <v-btn class="ma-2" v-if="puedeSolicitar()" color="green darken-1" text @click="iniciarSolicitar()">
                            <v-icon left small>phone</v-icon>&nbsp;Accion &nbsp;
                        </v-btn>
                        <v-btn class="ma-2" v-else-if="estaAsignado()" color="green darken-1" text @click="iniciarCerrar()">
                            <v-icon left small>warning</v-icon>&nbsp;Accion &nbsp;
                        </v-btn>
                        <v-btn class="ma-2" v-else color="green darken-1" text @click="historyOnly()">
                            <v-icon left small>phone_locked</v-icon>&nbsp;Accion &nbsp;
                        </v-btn>

                        <v-btn class="ma-2" color="blue darken-1" text @click="regresar"><v-icon>navigate_before</v-icon>&nbsp;Regresar&nbsp;</v-btn>
                    <!-- </v-card-actions>  -->
                </v-row>
                <v-row class="mt-10">
                    <!-- <v-col cols="12" sm="2" md="3" lg="2" class="d-sm-none d-md-flex"></v-col>
                    sm="12" md="6" lg="8" -->
                    <v-col cols="12">
                        <div class="text-center pb-2 pt-2">
                            <h3>SEGUIMIENTO</h3>
                        </div>
                            <!-- hide-default-footer -->
                        <v-data-table 
                            v-if="lead.seguimientos && lead.seguimientos.length > 0"
                            :headers="headerSeguimientos" 
                            :items="lead.seguimientos" 
                            :loading="loading" 
                            loading-text="Loading... Please wait"
                            class="elevation-1">
                            <template v-slot:item.created_at="{ item }">
                                <span v-if="item.created_at">
                                    {{item.created_at | moment("DD/MM/YYYY HH:mm:ss") }}
                                </span>
                            </template>
                            <template v-slot:item.fecha_solicitado="{ item }">
                                <span v-if="item.fecha_solicitado">
                                    {{item.fecha_solicitado | moment("DD/MM/YYYY") }}
                                </span>
                            </template>
                            <template v-slot:item.fecha_realizado="{ item }">
                                <span v-if="item.fecha_realizado">
                                    {{item.fecha_realizado | moment("DD/MM/YYYY") }}
                                </span>
                            </template>
                            <template v-slot:item.tipo="{ item }">
                                <v-icon v-if="item.tipo == 'llamada'" @click="viewDetail(item)">call</v-icon>
                                <v-icon v-else @click="viewDetail(item)">event</v-icon>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-model="llamada.show" max-width="800px">
            <!-- <CallcenterRegistrarLlamada :lead_id="leadIdDialog" @cerrar="cerrarDialog" @actualizar="actualizar" @copiarDatoParent="copiarDato"></CallcenterRegistrarLlamada> -->
            
            <v-card>
                <v-card-text>
                    <v-tabs vertical>
                        <v-tab left v-if="llamada.llamada">
                            <v-icon left>phone</v-icon>
                        </v-tab>
                        <v-tab>
                            <v-icon left>history</v-icon>
                        </v-tab>
                        <v-tab-item v-if="llamada.llamada">
                            <CallcenterRegistrarLlamada :lead_id="leadIdDialog" @cerrar="cerrarDialog" @actualizar="actualizar" @copiarDatoParent="copiarDato"></CallcenterRegistrarLlamada>
                        </v-tab-item>
                        <v-tab-item>
                            <CallcenterHistorico :btnCerrar="false" :lead_id="leadIdDialog" @cerrar="cerrarDialog" @copiarDatoParent="copiarDato"></CallcenterHistorico>
                        </v-tab-item>
                    </v-tabs>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cerrarDialog">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" width="500" >
            <!-- <template v-slot:activator="{ on, attrs }">
                <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                    Click Me
                </v-btn>
            </template> -->

            <v-card>
                <v-card-title class="headline grey lighten-2">
                    Detalles
                </v-card-title>

                <v-card-text>
                    <v-list :disabled="true" :dense="true" :flat="true">
                        <!-- <v-subheader>REPORTS</v-subheader> -->
                        <v-list-item-group color="primary">
                            <v-list-item v-for="(item, i) in detalles" :key="i">
                                <v-list-item-content>
                                    {{item}}
                                <!-- <v-list-item-title v-html="item.title"></v-list-item-title>
                                <v-list-item-subtitle v-if="twoLine || threeLine" v-html="item.subtitle"></v-list-item-subtitle> -->
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="!detalles || detalles.length == 0">
                                <v-list-item-content>
                                    No se encontraron información;
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>

                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false" >
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
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
  import CallcenterHistorico from '@/components/Callcenter/CallcenterHistorico'

    export default {
        name: 'LeadsDetailView',
        components: {
            CallcenterRegistrarLlamada,
            CallcenterHistorico
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
                { text: 'Registrado', value: 'created_at' },
                { text: 'Usuario', value: 'usuario.nombre' },
                { text: 'Acción', value: 'accion' },
                { text: 'Observación', value: 'observacion' },
                // { text: 'Cuando llamar', value: 'fecha_solicitado' },
                // { text: 'Llamado', value: 'fecha_realizado' },
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
                consultar: 'leads/fetchDetalle',
                listarOrigenes: 'listado/fetchListaLeads',
            }),
            ...mapMutations({
				setInfo: 'setInfo',
            }),
            traerLead() {
                this.consultar({id:this.$route.params.id})
                    .then(result => {
                        // console.log(result);
                        this.lead = result.datos;
                    })
                    .catch(error => {
                        console.log(error)
                    }).finally(() => {

                    });
            },
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
            puedeSolicitar(){
                if(this.lead.ultima_llamada && this.lead.ultima_llamada.estado == 'pendiente'){
                    return true
                }
                return false
            },
            iniciarSolicitar(){
                this.llamada.show = true
                this.llamada.llamada = true;
            },
            estaAsignado() {
                if(this.lead.ultima_llamada && this.lead.ultima_llamada.estado == 'llamando' && this.lead.ultima_llamada.agente && this.lead.ultima_llamada.agente.email == this.user.data.email){
                    return true
                }
                return false
            },
            iniciarCerrar(){
                this.llamada.show = true
                this.llamada.llamada = true;
            },
            historyOnly() {
                this.setInfo('Ya lo llamaron');
                this.llamada.show = true;
                this.llamada.llamada = false;
            },
            ////////////LLAMADAS

            viewHistory(item) {
                this.loading = true;
                this.fetchDetalle({id:item._id}).finally(()=>{
                    this.loading = false;
                    this.viewDialogHistorico = true;
                    this.leadSeleccionado = item
                });
            },
            cerrarHistory(){
                this.viewDialogHistorico = false;
                this.leadSeleccionado = null
            },
            viewDetail(item) {
                // console.log(item)
                this.detalles = item.detalles;
                this.dialog = true;
            }
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
            leadIdDialog(){
                if(this.lead){
                    return this.lead._id
                }else{
                    return null
                }
            }
        }
    };
</script>