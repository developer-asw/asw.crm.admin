<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12" md="6" sm="12">
                        <v-select v-model="asistencia.estado" :items="estados" label="Estado cita" item-text="nombre"
                            item-value="nombre">
                        </v-select>
                    </v-col>

                </v-row>

            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="confirmarAsistencia">Guardar</v-btn>
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
        name: 'AgendaAsistencia',
        data: () => ({
            estados: ['asistido', 'No asistio'],
            asistencia : {
                estado: null,
            }
            
        }),
        props: {
            lead_id: String,
        },
        methods: {
            ...mapActions({
                cambiarEstado: 'agenda/confirmarAsistencia',
            }),
            ...mapMutations({}),
            cerrar() {
                this.$emit('cerrar');
            },
            confirmarAsistencia() {
                this.procesando = true;
                this.asistencia.fecha = this.lead.ultima_cita.fecha;
                this.asistencia.sede_id = this.lead.ultima_cita.sede.id;
                this.asistencia.franja = this.lead.ultima_cita.hora;
                this.asistencia.id = this.lead_id;
                this.cambiarEstado(this.asistencia)
                    .then(result => {

                        if (result.data.lead) {
                            this.lead = result.data.lead
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        ///this.setError(error)
                    }).finally(() => {
                        this.reiniciar();
                        this.procesando = false;
                        this.$emit('cerrar');
                        this.$emit('actualizar');
                    });
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
                return 'Estado de la cita'
            },
            lead() {
                return this.detalle(this.lead_id)
            }
        }

    }
</script>