<template>
    <v-card>
        <v-card-title v-if="!ocultar">
            <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>
			<v-row v-if="!ocultar">
				<v-col cols="12" md="12">
                    <LeadInfoView :key="lead_id" :lead_id="lead_id" :setSedes="sedes"></LeadInfoView>
				</v-col>
			</v-row>
            <v-row class="mt-10" v-if="!ocultar">
                <LeadHistoricView :key="lead_id" :lead_id="lead_id" :ver_detalles="false" :collapse="true"></LeadHistoricView>
            </v-row>
            <v-form>
                
                <v-row>
                    <v-col cols="12" md="12">
                        <v-select v-model="resolucion.tipo_contacto" :items="tipos_contactos" label="Tipo de Contacto"
                        item-text="text" item-value="id"></v-select>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" md="12">
                        <v-select v-model="estado" :items="llamadas_estados" label="Estado" :error-messages=" !estado ? 'Debe seleccionar una opción': ''">
                        </v-select>
                    </v-col>
                </v-row>
                
                
                <v-row v-if="estado == 'matriculado'">
                    <v-select v-model="resolucion.tipo" :items="['Presencial','Masterclass','Converso']" label="Tipo de matricula"
                        item-text="text" item-value="id" :error-messages=" !resolucion.tipo ? 'Debe seleccionar una opción': ''">
                    </v-select>
                </v-row>
                <v-row v-if="estado == 'seguimiento'">
                    <v-col cols="12" md="12" sm="12">
                        <v-select v-model="resolucion.clase" @change="setTipo(resolucion.clase)" :items="['Matricula', 'Renovación', 'Cita']" label="Tipo de seguimiento"  :error-messages=" !resolucion.clase ? 'Debe seleccionar una opción': ''"></v-select>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-select v-if="resolucion.clase=='Matricula'" v-model="resolucion.tipo" :items="['No tiene el recurso económico en su totalidad','Debe pensarlo', 'La decisión depende de un tercero','Está cotizando']" label="Tipo de seguimiento" :error-messages=" !resolucion.tipo ? 'Debe seleccionar una opción': ''"></v-select>
                    </v-col>

                    <v-col cols="12">
                        Próxima llamada:
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <!--showTime hourFormat="12"-->
                        <Calendar v-model="resolucion.fecha_proxima_llamada" :minDate="fechaMinima" @date-select="traerDisponibilidadLlamadas" />
                        <div class="v-text-field__details" v-if="!resolucion.fecha_proxima_llamada">
                            <div class="v-messages theme--light error--text" role="alert">
                                <div class="v-messages__wrapper">
                                    <div class="v-messages__message">
                                        {{ 'Complete el campo fecha' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <Calendar id="calendar-timeonly" v-model="resolucion.hora_proxima_llamada" timeOnly :minDate="horaMinima" :maxDate="horaMaxima" hourFormat="12" />
                        <div class="v-text-field__details" v-if="!resolucion.hora_proxima_llamada">
                            <div class="v-messages theme--light error--text" role="alert">
                                <div class="v-messages__wrapper">
                                    <div class="v-messages__message">
                                        {{ 'Complete el campo hora' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
                    <v-textarea label="Observaciones" v-model="resolucion.observacion"></v-textarea>
                </v-row>

                <v-row v-if="estado == 'agendar_cita'">
                    <v-col cols="12" md="6">
                        <v-select v-model="resolucion.sede" :items="sedes" label="Sede"
                            item-text="text" item-value="id">
                        </v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-model="resolucion.fecha_cita" :items="fechas" label="Fecha"
                            item-text="text" item-value="id">
                        </v-select>

                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select  v-if="resolucion.fecha_cita" v-model="resolucion.hora_cita" :items="horas" label="Hora"
                            item-text="text" item-value="id"></v-select>
                    </v-col>
                </v-row>

                <v-row v-if="estado == 'agendar_cita_virtual'">
                    <v-col cols="12" md="6">
                        <v-select v-model="resolucion.fecha_cita" :items="fechas" label="Fecha"
                            item-text="text" item-value="id">
                        </v-select>

                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select  v-if="resolucion.fecha_cita" v-model="resolucion.hora_cita" :items="horas" label="Hora"
                            item-text="text" item-value="id"></v-select>
                    </v-col>
                </v-row>
                <v-row v-if="estado == 'errado'">
                    <v-col cols="12" md="12">
                        <v-select v-model="resolucion.errado_motivo" :items="estados.errados" label="Opciones"></v-select>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-textarea v-if="resolucion.errado_motivo === 'Otro'" label="Observación" v-model="resolucion.observacion"></v-textarea>
                    </v-col>
                </v-row>
                <v-row v-if="estado == 'agendar_llamada'">
                    <v-col cols="12" md="6" sm="6">
                        <Calendar v-model="resolucion.fecha_proxima_llamada" :minDate="fechaMinima" @date-select="traerDisponibilidadLlamadas" />
						<div class="v-text-field__details" v-if="!resolucion.fecha_proxima_llamada">
                            <div class="v-messages theme--light error--text" role="alert">
                                <div class="v-messages__wrapper">
                                    <div class="v-messages__message">
                                        {{ 'Complete el campo fecha' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6"  sm="6"> 
                        <Calendar id="calendar-timeonly" v-model="resolucion.hora_proxima_llamada" timeOnly :minDate="horaMinima" :maxDate="horaMaxima" hourFormat="12"/>
						<div class="v-text-field__details" v-if="!resolucion.hora_proxima_llamada">
                            <div class="v-messages theme--light error--text" role="alert">
                                <div class="v-messages__wrapper">
                                    <div class="v-messages__message">
                                        {{ 'Complete el campo hora' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <v-row v-if="estado == 'descartado'">
                    <v-col cols="12" md="12">
                        <v-select  v-model="resolucion.descartado_motivo" :items="estados.descartados" label="Motivo para descartalo"
                            item-text="text" item-value="value"></v-select>
                        <v-textarea v-if="resolucion.descartado_motivo=='otro'" label="Otro motivo" v-model="resolucion.descartado_motivo_otro" :required="resolucion.descartado_motivo=='otro'"></v-textarea>
                    </v-col>
                </v-row>

                <v-row v-if="estado == 'estudiante'">
                    <v-col cols="12" md="12">
                        <v-select  v-model="resolucion.estudiante_motivo" :items="estados.estudiantes" label="Motivo de la llamada"
                            item-text="text" item-value="value"></v-select>
                        <v-textarea v-if="resolucion.estudiante_motivo=='otro'" label="Otro motivo" v-model="resolucion.estudiante_motivo_otro" :required="resolucion.estudiante_motivo=='otro'"></v-textarea>
                    </v-col>
                </v-row>

                <v-row v-if="estado == 'abonado'">
                    <v-col cols="12">
                        Próxima llamada:
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <Calendar v-model="resolucion.fecha_proxima_llamada" :minDate="fechaMinima" @date-select="traerDisponibilidadLlamadas" />
                        <div class="v-text-field__details" v-if="!resolucion.fecha_proxima_llamada">
                            <div class="v-messages theme--light error--text" role="alert">
                                <div class="v-messages__wrapper">
                                    <div class="v-messages__message">
                                        {{ 'Complete el campo fecha' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <Calendar id="calendar-timeonly" v-model="resolucion.hora_proxima_llamada" timeOnly :minDate="horaMinima" :maxDate="horaMaxima" hourFormat="12" />
                        <div class="v-text-field__details" v-if="!resolucion.hora_proxima_llamada">
                            <div class="v-messages theme--light error--text" role="alert">
                                <div class="v-messages__wrapper">
                                    <div class="v-messages__message">
                                        {{ 'Complete el campo hora' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>

                    <v-textarea label="Observaciones" v-model="resolucion.observacion"></v-textarea>
                </v-row>

                <v-row v-if="estado == 'pago_pendiente'">
                    <v-col cols="12" md="6" sm="6">
                        <Calendar v-model="resolucion.fecha_proxima_llamada" :minDate="fechaMinima" @date-select="traerDisponibilidadLlamadas" />
                        <div class="v-text-field__details" v-if="!resolucion.fecha_proxima_llamada">
                            <div class="v-messages theme--light error--text" role="alert">
                                <div class="v-messages__wrapper">
                                    <div class="v-messages__message">
                                        {{ 'Complete el campo fecha' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">4
                        <Calendar id="calendar-timeonly" v-model="resolucion.hora_proxima_llamada" timeOnly :minDate="horaMinima" :maxDate="horaMaxima" hourFormat="12" />
                        <div class="v-text-field__details" v-if="!resolucion.hora_proxima_llamada">
                            <div class="v-messages theme--light error--text" role="alert">
                                <div class="v-messages__wrapper">
                                    <div class="v-messages__message">
                                        {{ 'Complete el campo hora' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-col>

                    <v-textarea label="Observaciones" v-model="resolucion.observacion"></v-textarea>
                </v-row>

                
                <v-row v-if="estado == 'venta_telefonica'">
                    <v-select v-model="resolucion.agente" label="Coordinador de admisiones" :items="coordinadores" item-text="primer_nombre" item-value="email" 
                    @change="consola()">
                        <template slot="item" slot-scope="data">
                            {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                        </template>
                        <template slot="selection" slot-scope="data">
                            {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                        </template>
                    </v-select>
                </v-row>
                
                <v-row v-if="estado == 'apoyo_financiero'">
                    <v-col cols="12">
                        <v-select v-model="resolucion.sede" :items="sedes" label="Sede"
                            item-text="text" item-value="id">
                        </v-select>
                    </v-col>
                </v-row>
                <v-row v-if="['seguimiento_whatsapp','venta_telefonica','masterclass'].includes(estado)">
                    <v-textarea label="Observaciones" v-model="resolucion.observacion"></v-textarea>
                </v-row>


            </v-form>

            <blockquote v-if="accion">
                {{accion_mensaje}} <br> ¿Desea crear este nuevo registro?
            </blockquote>
        </v-card-text>
        <v-card-actions v-if="!accion">
            <v-spacer></v-spacer>
            <v-btn :disabled="procesando" v-if="puedeRegistrar" color="red darken-1" text @click="registrar">Registrar</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
            <v-spacer></v-spacer>
            <v-btn :disabled="procesando" color="gray darken-1" text @click="cerrar">No</v-btn>
            <v-btn :disabled="procesando" color="red darken-1" text @click="registrarForzado">Si</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
    import { ref } from "vue";
    import {mapState,mapGetters,mapActions,mapMutations} from 'vuex';
    import LeadInfoView from '@/components/Leads/Detail/LeadInfoView'
    import LeadHistoricView from '@/components/Leads/Detail/LeadHistoricView';
    import Calendar from 'primevue/calendar';

    export default {
        name: 'CallcenterRegistrarLlamada',
        components:{
            LeadInfoView,
            LeadHistoricView,
            Calendar
        },
        data: () => ({
            date: new Date().toISOString().substring(0, 10),
            estados: {},
            llamadas_estados: [],
            tipos_contactos:[
                { id:'wolkvox_llamada', text:'Wolkvox - Llamada' },{ id:'wolkvox_whatsapp', text:'Wolkvox - Whatsapp' }
            ],
            estado: null,
            historial: [],
            resolucion: {
                tipo_contacto: 'wolkvox_llamada',
                sede: null,
                id: null,
                fecha_cita: null,
                hora_cita: null,
                fecha_proxima_llamada: null,
                hora_proxima_llamada: null,
                observacion: null,
                descartado_motivo: null,
                descartado_motivo_otro: null,
                estudiante_motivo: null,
                estudiante_motivo_otro: null,
                errado_motivo: null,
                forzar: false,
                agente: null,
                tipo: null,
                clase:null,
            },
            fechas: [],
            sedes: [],
            accion: '',
            accion_mensaje: '',
            coordinadores:[],
            fechaMinima:null,
            horaMinima:null,
            horaMaxima:null,
            procesando:false,
        }),

        props: {
            lead_id: String,
            ocultar: Boolean,
        },
        mounted() {
            this.fechaMinima = ref(new Date());
            console.log(this.fechaMinima)
            this.traerDisponibilidad();
            this.traerEstados();
            this.traerOrigenes();
        },
        methods: {
            ...mapActions({
                fetchDisponibilidad: 'agenda/fetchDisponibilidad',
                fetchDisponibilidadLlamadas: 'agenda/fetchDisponibilidadLlamadas',
                crear: 'leads/crearCita',
                cerrarLlamada: 'callcenter/cerrar',
                listarEstados: 'listado/fetchListaLlamadas',
                listarOrigenes: 'listado/fetchListaLeads',
            }),
            ...mapMutations({
				setInfo: 'setInfo',
            }),
            reiniciar() {
                this.resolucion = {
					sede: null,
					id: null,
					fecha_cita: null,
					hora_cita: null,
					fecha_proxima_llamada: null,
					hora_proxima_llamada: null,
					observacion: null,
                    descartado_motivo: null,
                    descartado_motivo_otro: null,
                    estudiante_motivo: null,
                    estudiante_motivo_otro: null,
                    forzar: false,
                    errado_motivo:null,
                    agente:null,
                    tipo:null,
                    clase:null,
                    tipo_contacto: "wolkvox_llamada"
                };
                this.estado=null;
                this.accion = '';
                this.accion_mensaje = '';
            },
            registrar() {
                this.procesando = true;
                this.resolucion.id = this.lead_id;
                this.resolucion.solucion = this.estado;
                let objeto = {...this.resolucion};
                if (objeto.fecha_proxima_llamada) {
                    objeto.fecha_proxima_llamada = this.$moment(objeto.fecha_proxima_llamada).format('YYYY-MM-DD')
                }
                if (objeto.hora_proxima_llamada) {
                    objeto.hora_proxima_llamada = this.$moment(objeto.hora_proxima_llamada).format('HH:mm')
                }
                this.cerrarLlamada(objeto)
                .then((result)=>{
                    this.accion = "";
					if(result.result=='ok'){
						this.setInfo('Proceso exitoso.')
					}
				}).catch(error => {
                    this.accion = "";
                    if (error.body.error) {
                        let result = error.body.error.split("@");
                        if (result && result.length) {
                            this.accion = result[result.length -1];
                            this.accion_mensaje = result[0];
                        } 
                    }
                })
                .finally(() => {
                    this.procesando = false;
                    if (!this.accion) {
                        this.cerrar();
                    }
                })
            },
            registrarForzado() {
                this.procesando = true;
                this.resolucion.id = this.lead_id;
                this.resolucion.solucion = this.estado;
                this.resolucion.forzar = true;
                let objeto = {...this.resolucion};
                if (objeto.fecha_proxima_llamada) {
                    objeto.fecha_proxima_llamada = this.$moment(objeto.fecha_proxima_llamada).format('YYYY-MM-DD')
                }
                if (objeto.hora_proxima_llamada) {
                    objeto.hora_proxima_llamada = this.$moment(objeto.hora_proxima_llamada).format('HH:mm')
                }
                this.cerrarLlamada(objeto)
                .then((result)=>{
                    this.accion = "";
					if(result.result=='ok'){
						this.setInfo('Proceso exitoso.')
					}
				}).catch(error => {
                    this.accion = "";
                    if (error.body.error) {
                        let result = error.body.error.split("@");
                        if (result && result.length) {
                            this.accion = result[result.length -1];
                            this.accion_mensaje = result[0];
                        } 
                    }
                })
                .finally(() => {
                    this.procesando = false;
                    if (!this.accion) {
                        this.cerrar();
                    }
                })
            },
            cerrar() {
                this.reiniciar();
                this.$emit('cerrar');
                this.$emit('actualizar');
            },
            formatDate(date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            parseDate(date) {
                if (!date) return null

                const [month, day, year] = date.split('/')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
            traerDisponibilidad() {

                this.fetchDisponibilidad()
                    .then(result => {
                        this.fechas = result.resultSet.fechas
                        this.sedes = result.resultSet.sedes
                    })
                    .catch(error => {
                        console.log(error)
                        this.setError(error)
                    }).finally(() => {

                    })
            },
            traerDisponibilidadLlamadas() {
                let payload = { fecha: this.resolucion.fecha_proxima_llamada };
                this.fetchDisponibilidadLlamadas(payload)
                    .then(result => {
                        this.horaMaxima = ref(new Date(`${this.$moment(this.resolucion.fecha_proxima_llamada).format('YYYY-MM-DD')} ${result.horaMaxima}`));
                        this.horaMinima = ref(new Date(`${this.$moment(this.resolucion.fecha_proxima_llamada).format('YYYY-MM-DD')} ${result.horaMinima}`));
                    })
                    .catch(error => {
                        console.log(error)
                        this.setError(error)
                    }).finally(() => {

                    })
            },
            traerEstados() {
                this.listarEstados()
                    .then(result => {
                        this.estados = result;
                        this.llamadas_estados = [];
                        if (this.estados && this.estados.llamadas) {
                            this.llamadas_estados = this.estados.llamadas.filter(x => x.tipo && x.tipo.includes('call'))
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    }).finally(() => {

                    });
            },
            traerOrigenes() {
                this.listarOrigenes()
                    .then(result => {
                        this.coordinadores = result.coordinadores;
                    })
                    .catch(error => {
                        console.log(error)
                    }).finally(() => {

                    });
            },
            consola() {
                console.log(this.resolucion);
            },
            setTipo(val){
                this.resolucion.tipo = val;
            }
        },
        computed: {
            ...mapState({
                error: state => state.error,
            }),
            ...mapGetters({
                detalle: 'leads/getDetalle',
            }),
            getTitle() {
                return 'Registro de llamada'
            },
            horas() {
                if (this.resolucion.fecha_cita) {
                    let fechaObj = this.fechas.find(element => {
                        if (element.id == this.resolucion.fecha_cita) {
                            return element
                        }
                    })
                    return fechaObj.franjas
                }
                return []
            },
            lead() {
                return this.detalle(this.lead_id)
            },
            puedeRegistrar(){
				if(this.estado=='agendar_cita'){
					if(this.resolucion.fecha_cita && this.resolucion.hora_cita && this.resolucion.sede){
						return true
					}
				}else if(this.estado=='agendar_cita_virtual'){
					if(this.resolucion.fecha_cita && this.resolucion.hora_cita){
						return true
					}
				}else if(this.estado=='agendar_llamada'){

					if(this.resolucion.fecha_proxima_llamada && this.resolucion.hora_proxima_llamada){
						return true
					}
				}else if(['no_contesta','masterclass','seguimiento_whatsapp','convocatoria_talento_humano'].includes(this.estado)){
					return true
				}
                else if(this.estado == 'seguimiento'){
                    if (this.resolucion.tipo && this.resolucion.fecha_proxima_llamada && this.resolucion.hora_proxima_llamada){
                        return true
                    }
				}    
                else if(this.estado == 'venta_telefonica'){
                    if (this.resolucion.agente){
                        return true
                    }
				}
                else if(this.estado == 'apoyo_financiero'){
                    if (this.resolucion.sede){
                        return true
                    }
				}else if(this.estado=='errado'){
                    if(this.resolucion.errado_motivo && this.resolucion.errado_motivo.length > 0){
                        return true    
                    }
                    if(this.resolucion.observacion && this.resolucion.errado_motivo === 'Otro'){
                        return true    
                    }
				}else if(this.estado=='descartado'){
                    if(this.resolucion.descartado_motivo){
                        if(this.resolucion.descartado_motivo=='otro'){
                            if(this.resolucion.descartado_motivo_otro){
                                return true
                            }
                        }else{
                            return true
                        }
                    }
                }else if(this.estado=='estudiante'){
                    if(this.resolucion.estudiante_motivo){
                        if(this.resolucion.estudiante_motivo=='otro'){
                            if(this.resolucion.estudiante_motivo_otro){
                                return true
                            }
                        }else{
                            return true
                        }
                    }
                } else if(['servicio_cliente','matricula_recaudo','matricula_nueva','convenio'].includes(this.estado)) {
                    return true;
                }else if(this.estado=='matriculado'){
                    if(this.resolucion.tipo){
                        return true
                    }
                } else if(this.estado=='abonado'){
                    if(this.resolucion.fecha_proxima_llamada && this.resolucion.hora_proxima_llamada && this.resolucion.observacion){
                        return true
                    }
                    
                }else if(this.estado=='pago_pendiente'){
                    if(this.resolucion.fecha_proxima_llamada && this.resolucion.hora_proxima_llamada && this.resolucion.observacion){
                        return true
                    }
                    
                }

				return false;
            }

        }
    };
</script>