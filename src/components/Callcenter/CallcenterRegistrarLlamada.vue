<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>
			<v-row v-if="lead">
				<v-col cols="12" md="12">
				<span @click="$copyText(lead.full_name);setInfo(lead.full_name)">{{lead.full_name}}</span><br>
				<span @click="$copyText(lead.movil);setInfo(lead.movil)">{{lead.movil}}</span><br>
				<span @click="$copyText(lead.email);setInfo(lead.email)">{{lead.email}}</span><br>
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
						<!--
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                            transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="date" label="Fecha proxima llamada" prepend-icon="event"
                                    v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="resolucion.fecha_proxima_llamada" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                                <v-btn text color="primary" @click="$refs.menu.save(resolucion.fecha_proxima_llamada)">
                                    OK</v-btn>
                            </v-date-picker>
                        </v-menu>
						-->
                    </v-col>
                    <v-col cols="12" md="6">
						<v-time-picker v-model="resolucion.hora_proxima_llamada" full-width>
						</v-time-picker>
                        <!--
                        <v-menu ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                            :return-value.sync="time" transition="scale-transition" offset-y max-width="290px"
                            min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="time" label="Hora proxima llamada" prepend-icon="access_time" readonly
                                    v-on="on"></v-text-field>
                            </template>
                            <v-time-picker v-if="menu2" v-model="resolucion.hora_proxima_llamada" full-width @click:minute="$refs.menu.save(resolucion.hora_proxima_llamada)">
                            </v-time-picker>
                        </v-menu>
                    -->
                    </v-col>
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
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex';
    import Vue from 'vue'
    import VueClipboard from 'vue-clipboard2'
    Vue.use(VueClipboard)

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
            },
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
					return true
				}
				return false;
            }

        }
    };
</script>