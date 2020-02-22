<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12" md="6" sm="12">
                        <v-select v-model="asistencia.estado" :items="estados" label="Estado cita">
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
            estados: [
                { text: 'Asistio', value: 'asistido' },
                { text: 'No asistio', value: 'ausencia' },
            ],
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
                this.cambiarEstado({id:this.lead_id,estado:this.asistencia.estado})
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