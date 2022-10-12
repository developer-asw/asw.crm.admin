<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>

            <v-form>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-select v-model="estado" :items="estados" label="Estado"></v-select>
                    </v-col>
                </v-row>
                <v-row v-if="estado == 'Agendamiento'">
                    <v-col cols="12" md="6">
                        <v-select v-if="estado == 'Agendamiento'" v-model="nueva_cita.sede" :items="sedes" label="Sede"
                            item-text="text" item-value="id">
                        </v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-if="estado" v-model="nueva_cita.fecha" :items="fechas" label="Fecha"
                            item-text="text" item-value="id">
                        </v-select>

                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-if="nueva_cita.fecha" v-model="nueva_cita.hora" :items="horas" label="Hora"
                            item-text="text" item-value="id"></v-select>
                    </v-col>
                </v-row>
                <v-row v-if="estado == 'Dato errado'">
                    <v-col cols="12" md="12">
                        <v-textarea label="Observación" v-model="nueva_cita.observación"></v-textarea>

                    </v-col>

                </v-row>
                <v-row v-if="estado == 'Llamar despues'">
                    <v-col cols="12" md="6">
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                            transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="date" label="Fecha proxima llamada" prepend-icon="event"
                                    v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="nueva_cita.fecha_proxima_llamada" :min="fechaMinima" @click:date="traerDisponibilidadLlamadas" no-title scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                                <v-btn text color="primary" @click="$refs.menu.save(nueva_cita.fecha_proxima_llamada)">OK</v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-menu ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                            :return-value.sync="time" transition="scale-transition" offset-y max-width="290px"
                            min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="time" label="Hora proxima llamada" prepend-icon="access_time" readonly
                                    v-on="on"></v-text-field>
                            </template>
                            <v-time-picker v-if="menu2" v-model="nueva_cita.hora_proxima_llamada" :min="horaMinima" :max="horaMaxima" full-width @click:minute="$refs.menu.save(nueva_cita.hora_proxima_llamada)">
                            </v-time-picker>
                        </v-menu>
                    </v-col>
                </v-row>

            </v-form>

        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="agendar">Guardar</v-btn>
            <v-btn color="blue darken-1" text @click="cerrar">Cerrar</v-btn>
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
    export default {
        name: 'AgendaView',
        data: () => ({
            menu: false,
            menu2: false,
            date: new Date().toISOString().substr(0, 10),
            time: null,
            estados: ['Agendar Cita', 'Agendar Llamada', 'No contesta', 'Dato errado'],
            estado: null,
            nueva_cita: {
                sede: null,
                fecha: null,
                hora: null,
                id: null,
                observación: null,
                fecha_proxima_llamada: null,
                hora_proxima_llamada: null
            },
            fechas: [],
            sedes: [],
            fechaMinima:null,
            horaMinima:null,
            horaMaxima:null,
        }),

        props: {
            lead_id: String,
        },
        mounted() {
            this.fechaMinima = this.$moment().format('YYYY-MM-DD');
            this.traerDisponibilidad()
        },
        methods: {
            ...mapActions({
                fetchDisponibilidad: 'agenda/fetchDisponibilidad',
                fetchDisponibilidadLlamadas: 'agenda/fetchDisponibilidadLlamadas',
                crear: 'leads/crearCita',
            }),
            ...mapMutations({}),
            reiniciar() {
                this.nueva_cita = {
                    sede: null,
                    fecha: null,
                    hora: null,
                    id: null
                };
            },
            agendar() {
                this.procesando = true;
                this.nueva_cita.id = this.lead_id;
                this.crear(this.nueva_cita)
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
            traerDisponibilidadLlamadas() {
                let payload = { fecha: this.nueva_cita.fecha_proxima_llamada };
                this.fetchDisponibilidadLlamadas(payload)
                    .then(result => {
                        this.horaMaxima = result.horaMaxima;
                        this.horaMinima = result.horaMinima;
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
                return 'Agenda'
            },
            horas() {
                if (this.nueva_cita.fecha) {
                    let fechaObj = this.fechas.find(element => {
                        console.log(this.nueva_cita.fecha)
                        if (element.id == this.nueva_cita.fecha) {
                            return element
                        }
                    })
                    return fechaObj.franjas
                }
                return []
            },
            lead() {
                return this.detalle(this.lead_id)
            }

        }
    };
</script>