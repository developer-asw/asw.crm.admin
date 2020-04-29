<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{getTitle}}</span>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="lead.primer_nombre" label="Nombres"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                        <v-text-field v-model="lead.primer_apellido" label="Apellidos">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-model="lead.sede" :items="sedes" label="Sede" item-text="nombre" item-value="id">
                        </v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="lead.movil" label="Telefono"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="lead.email" label="Email">
                        </v-text-field>
                    </v-col>

                    
                    <v-col cols="12" md="6">
                        <v-select v-model="lead.origen" label="Campaña" :items="listado.origenes" item-text="title" item-value="value">
                        </v-select>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                        <v-select v-model="lead.como_llego" label="¿Cómo llego?" :items="listado.comoLlego" item-text="title" item-value="value">
                        </v-select>
                    </v-col>

                </v-row>




            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="gurdarLeads">Guardar</v-btn>
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
        name: 'LeadsNewView',
        data: () => ({
            estados: ['Agendamiento'],
            estado: null,
            lead: {
                primer_nombre: null,
                primer_apellido: null,
                telefono: null,
                sede: null,
                email: null,
                origen: null,
            },
            sedes: [],
            listado: {}
        }),
        mounted() {
            this.traerSedes()
            this.traerOrigenes();
        },
        methods: {
            ...mapActions({
                listarSedes: 'sedes/fetchLista',
                generarLeads: 'leads/crearLeads',
                listarOrigenes: 'listado/fetchLista',
            }),
            ...mapMutations({}),

            reiniciar() {
                this.lead = {
                    primer_nombre: null,
                    primer_apellido: null,
                    movil: null,
                    sede: null,
                    email: null,
                    id: null

                };
            },

            gurdarLeads() {
                this.procesando = true;
                this.generarLeads(this.lead)
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
            },
            cerrar() {
                this.$emit('cerrar');
            },
            traerSedes() {
                this.listarSedes()
                    .then(result => {
                        this.sedes = result;
                    })
                    .catch(error => {
                        console.log(error)
                        ///this.setError(error)
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
                return 'Nuevo Leads'
            },
        }
    };
</script>