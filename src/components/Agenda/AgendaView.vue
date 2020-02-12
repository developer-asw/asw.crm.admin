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

                        <v-select v-if="estado == 'Agendamiento'" v-model="nueva_cita.sede_id" :items="sedes"
                            label="Sede" item-text="text" item-value="id">
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




            </v-form>

        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="agendar">Agendar</v-btn>
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
            estados: ['Agendamiento'],
            estado: null,
            nueva_cita: {
                sede_id: null,
                fecha: null,
                hora: null,
                lead_id: null
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
            }),
            ...mapMutations({}),
            agendar() {
                this.nueva_cita.lead_id = this.lead_id;
                this.crear(this.nueva_cita)
                    .finally(() => {
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