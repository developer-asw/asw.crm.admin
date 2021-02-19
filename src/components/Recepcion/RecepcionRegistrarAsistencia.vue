<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>
			<v-row v-if="lead">
				<v-col cols="12" md="12">
                    <LeadInfoView :lead_id="lead_id" :setLead="lead" :setSedes="sedes"></LeadInfoView>
				</v-col>
			</v-row>
            <v-form>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-select v-model="estado" :items="llamadas_estados" label="Estado"></v-select>
                    </v-col>
                </v-row>
                <v-row v-if="estado == 'asistido'">
                    <v-col cols="12" md="6">
                        <v-select v-model="resolucion.sede" :items="sedes" label="Sede Asitencia"
                            item-text="text" item-value="id">
                        </v-select>
                        <v-select v-model="resolucion.orientador" :items="orientadores" label="Orientador Asignado" item-text="nombre_completo" item-value="id">
                        </v-select>
                    </v-col>
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
                <v-row v-if="estado == 'errado'">
                    <v-col cols="12" md="12">
                        <v-select v-model="resolucion.errado_motivo" :items="estados.errados" label="Opciones"></v-select>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-textarea v-if="resolucion.errado_motivo === 'Otro'" label="Observación" v-model="resolucion.observacion"></v-textarea>
                    </v-col>
                </v-row>
                <v-row v-if="estado == 'agendar_llamada'">
                    <v-col cols="12" md="6">
						<v-date-picker v-model="resolucion.fecha_proxima_llamada"></v-date-picker>
                    </v-col>
                    <v-col cols="12" md="6">
						<v-time-picker v-model="resolucion.hora_proxima_llamada" full-width>
						</v-time-picker>
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
                    <v-col cols="12" md="6">
                        <v-date-picker v-model="resolucion.fecha_proxima_llamada"></v-date-picker>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-time-picker v-model="resolucion.hora_proxima_llamada" full-width>
                        </v-time-picker>
                    </v-col>

                    <v-textarea label="Observaciones" v-model="resolucion.observacion"></v-textarea>
                </v-row>

                <v-row v-if="estado == 'pago_pendiente'">
                    <v-col cols="12" md="6">
                        <v-date-picker v-model="resolucion.fecha_proxima_llamada"></v-date-picker>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-time-picker v-model="resolucion.hora_proxima_llamada" full-width>
                        </v-time-picker>
                    </v-col>

                    <v-textarea label="Observaciones" v-model="resolucion.observacion"></v-textarea>
                </v-row>
            </v-form>

        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="puedeRegistrar" color="red darken-1" text @click="registrar">Registrar</v-btn>
            
        </v-card-actions>
    </v-card>
</template>
<script>
    import {mapState,mapGetters,mapActions,mapMutations} from 'vuex';
    import LeadInfoView from '@/components/Leads/Detail/LeadInfoView'

    export default {
        name: 'RecepcionRegistrarAsistencia',
        components:{
            LeadInfoView
        },
        data: () => ({
            date: new Date().toISOString().substr(0, 10),
            estados: {},
            llamadas_estados: [],
            estado: null,
            historial: [],
            resolucion: {
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
                errado_motivo: null
            },
            fechas: [],
            sedes: [],
            orientadores: [],
        }),

        props: {
            lead_id: String,
            sede_id: Number
        },
        mounted() {
            this.usuarioLogueado();
            this.traerDisponibilidad();
            this.traerEstados();
            this.reiniciar();
        },
        methods: {
            ...mapActions({
                usuarioLogueado: 'consultar/usuarioLogueado',
                fetchDisponibilidad: 'agenda/fetchDisponibilidad',
                crear: 'leads/crearCita',
                cerrarCita: 'recepcionista/cerrar',
                listarEstados: 'listado/fetchListaLlamadas',
            }),
            ...mapMutations({
				setInfo: 'setInfo',
            }),
            reiniciar() {
                this.resolucion = {
					sede: this.sede_id ? this.sede_id : this.getSedeUsuario(),
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
                };
                this.estado=null;
            },
            registrar() {
                this.procesando = true;
                this.resolucion.id = this.lead_id;
                this.resolucion.solucion = this.estado;

                this.cerrarCita(this.resolucion)
                .then((result)=>{
					if(result.result=='ok'){
						this.setInfo('Proceso exitoso.')
					}
				})
                .finally(() => {
                    this.reiniciar();
                    this.procesando = false;
                    this.$emit('cerrar');
                    this.$emit('actualizar');
                })
            },
            cerrar() {
                this.$emit('cerrar');
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
                        this.orientadores = result.resultSet.orientadores
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
                            this.llamadas_estados = this.estados.llamadas.filter(x => (x.tipo && x.tipo == 'recepcion') || !x.tipo)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    }).finally(() => {

                    });
            },
            getSedeUsuario(){
                if(this.user && this.user.data) {
                    return this.user.data.sede_id;
                }else{
                    return null;
                }
            }
        },
        computed: {
            ...mapState({
                user: state => state.consultar.user,  
                error: state => state.error,
            }),
            ...mapGetters({
                detalle: 'leads/getDetalle',
            }),
            getTitle() {
                return 'Registro de asistencia'
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
				}else if(this.estado=='agendar_llamada'){
					if(this.resolucion.fecha_proxima_llamada && this.resolucion.hora_proxima_llamada){
						return true
					}
				}else if(this.estado=='no_contesta' || this.estado == 'venta_telefonica' || this.estado == 'asistido' || this.estado == 'ausencia'){
					return true
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
                } else if(this.estado == 'matricula_nueva' || this.estado == 'matricula_recaudo') {
                    return true;
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