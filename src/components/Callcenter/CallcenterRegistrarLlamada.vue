<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>
			<v-row v-if="lead">
				<v-col cols="12" md="12">
                    <span>{{lead.full_name}}</span><br>
                    <span>{{lead.uid}}</span><br>
                    <span>{{lead.email}}</span><br>
                    <span v-if="lead.sede_full">{{lead.sede_full.nombre}}</span>
				</v-col>
			</v-row>
            <v-form>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-select v-model="estado" :items="estados" label="Estado"></v-select>
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
                        <v-textarea label="Observación" v-model="resolucion.observacion"></v-textarea>

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
                        <v-select  v-model="resolucion.descartado_motivo" :items="descartado_motivos" label="Motivo para descartalo"
                            item-text="text" item-value="value"></v-select>
                        <v-textarea v-if="resolucion.descartado_motivo=='otro'" label="Otro motivo" v-model="resolucion.descartado_motivo_otro"></v-textarea>
                    </v-col>
                </v-row>

                <v-row v-if="estado == 'estudiante'">
                    <v-col cols="12" md="12">
                        <v-select  v-model="resolucion.estudiante_motivo" :items="estudiante_motivos" label="Motivo de la llamada"
                            item-text="text" item-value="value"></v-select>
                        <v-textarea v-if="resolucion.estudiante_motivo=='otro'" label="Otro motivo" v-model="resolucion.estudiante_motivo_otro"></v-textarea>
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

    export default {
        name: 'CallcenterRegistrarLlamada',
        data: () => ({
            menu: false,
            menu2: false,
            date: new Date().toISOString().substr(0, 10),
            time: null,
            estados: [
				{ text: 'Agendar Cita', value: 'agendar_cita' },
				{ text: 'Agendar Llamada', value: 'agendar_llamada' },
				{ text: 'No contesta', value: 'no_contesta' },
				{ text: 'Dato errado', value: 'errado' },
                { text: 'Descartado', value: 'descartado' },
                { text: 'Es estudiante', value: 'estudiante' },
                { text: 'Abonado', value: 'abonado' },
                { text: 'Pago pendiente', value: 'pago_pendiente' },
			],
            estado: null,
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
            },
            descartado_motivos: [
                { text: 'Muy costoso', value: 'Muy costoso' },
                { text: 'No tiene tiempo', value: 'No tiene tiempo' },
                { text: 'Metodologia', value: 'Metodologia' },
                { text: 'Otra institución', value: 'Otra institución' },
                { text: 'Otro', value: 'otro' },
            ],
            estudiante_motivos: [
                { text: 'Clases virtuales', value: 'Clases virtuales' },
                { text: 'Tutorias', value: 'Tutorias' },
                { text: 'Vigencias', value: 'Vigencias' },
                { text: 'Cancelación', value: 'Cancelación' },
                { text: 'Otro', value: 'otro' },
            ],
            fechas: [],
            sedes: [],
        }),

        props: {
            lead_id: String,
        },
        mounted() {
            this.traerDisponibilidad()
        },
        methods: {
            ...mapActions({
                fetchDisponibilidad: 'agenda/fetchDisponibilidad',
                crear: 'leads/crearCita',
                cerrarLlamada: 'callcenter/cerrar',
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
                };
                this.estado=null;
            },
            registrar() {
                this.procesando = true;
                this.resolucion.id = this.lead_id;
                this.resolucion.solucion = this.estado;

                this.cerrarLlamada(this.resolucion)
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
                    })
                    .catch(error => {
                        console.log(error)
                        this.setError(error)
                    }).finally(() => {

                    })
            },

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
				}else if(this.estado=='agendar_llamada'){
					if(this.resolucion.fecha_proxima_llamada && this.resolucion.hora_proxima_llamada){
						return true
					}
				}else if(this.estado=='no_contesta'){
					return true
				}else if(this.estado=='errado'){
                    if(this.resolucion.observacion){
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
                    
                }else if(this.estado=='abonado'){
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