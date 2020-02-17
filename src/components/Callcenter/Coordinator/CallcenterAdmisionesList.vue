<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>
                {{getTitle}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-subheader></v-subheader>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn small color="info" dark @click="viewNewLead()">
                            <v-icon>assignment_ind</v-icon>
                        </v-btn>
                    </template>
                    <span>Programmatic tooltip</span>
                </v-tooltip>

            </v-toolbar-items>
        </v-toolbar>
        <v-data-table :headers="headers" :items="lista" :loading="loading" loading-text="Loading... Please wait"
            class="elevation-1">
            <template v-slot:item.full_name="{ item }">
                <span @click="$copyText(item.full_name);setInfo(item.full_name)">{{item.full_name}}</span>
            </template>

            <template v-slot:item.movil="{ item }">
                <span @click="$copyText(item.movil);setInfo(item.movil)">{{item.movil}}</span>
            </template>

            <template v-slot:item.email="{ item }">
                <span @click="$copyText(item.email);setInfo(item.email)">{{item.email}}</span>
            </template>

            <template v-slot:item.action="{ item }">
                <v-icon smallclass="mr-2" @click="viewItem(item)">
                    remove_red_eye
                </v-icon>
            </template>

            <template v-slot:item.sede="{ item }">
                <span v-if="item.sede_full">{{item.sede_full.nombre}}</span>
                <span v-else>{{item.sede}}</span>
            </template>
        </v-data-table>
        <v-dialog v-model="viewDialog" persistent max-width="800px">
            <AgendaAsistencia :lead_id="leadIdDialog"  @cerrar="cerrarDialog" @actualizar="actualizar"></AgendaAsistencia>
        </v-dialog>
        <v-dialog v-model="viewDialogNewLead" persistent max-width="800px">
            <LeadsNewView :lead_id="leadIdDialog"  @cerrar="cerrarDialog" @actualizar="actualizar"></LeadsNewView >
        </v-dialog>
    </div>
</template>
<script>
    import {
        mapState,
        mapActions,
        mapMutations
    } from 'vuex';
    import AgendaAsistencia from '@/components/Agenda/AgendaAsistencia'
    import LeadsNewView from '@/components/Leads/LeadsNewView'
    export default {
        name: 'CallcenterAdmisionesList',
        components: {
            AgendaAsistencia,
            LeadsNewView
        },
        mounted() {
            this.actualizar()
        },
        data() {
            return {
                headers: [{
                        text: 'Primer contacto',
                        value: 'inicia_callcenter'
                    },
                    {
                        text: 'Nombre',
                        value: 'full_name'
                    },
                    {
                        text: 'Móvil',
                        value: 'movil'
                    },
                    {
                        text: 'Email',
                        value: 'email'
                    },
                    {
                        text: 'Sede',
                        value: 'sede'
                    },
                    {
                        text: 'Fecha',
                        value: 'ultima_cita.fecha'
                    },
                    {
                        text: 'Hora',
                        value: 'ultima_cita.hora'
                    },
                    {
                        text: 'Agente',
                        value: 'agente_callcenter'
                    },
                    {
                        text: 'Actions',
                        value: 'action',
                        sortable: false
                    }
                ],

                viewDialog: false,
                viewDialogNewLead:false,
                loading: false,
                rowsPerPage: [100],
                search: '',
                payload: {},
                leadSeleccionado: null
            }
        },
        methods: {
            ...mapActions({
                fetchLista: 'callcenter_admisiones/fetchLista',
                fetchDetalle: 'leads/fetchDetalle',

            }),
            ...mapMutations({
                setInfo: 'setInfo',
            }),
            actualizar() {
                this.loading = true;
                this.fetchLista()
                    .finally(() => {
                        this.loading = false;
                    })
            },
            viewItem(item) {
                this.loading = true;
                this.fetchDetalle({
                        id: item._id
                    })
                    .then(() => {
                        this.leadSeleccionado = item
                        this.viewDialog = true
                    })
                    .finally(() => {
                        this.loading = false;
                    })

            },
            viewNewLead() {
                this.viewDialogNewLead = true
            },
            cerrarDialog() {
                this.viewDialog = false;
                this.viewDialogNewLead = false;
                this.leadSeleccionado = null
            },

        },
        computed: {
            ...mapState({
                lista: state => state.callcenter_admisiones.lista,
                pagination: state => state.callcenter_admisiones.pagination,
            }),
            getTitle() {
                return 'Callcenter Admisiones'
            },
            leadIdDialog() {
                if (this.leadSeleccionado) {
                    return this.leadSeleccionado._id
                } else {
                    return null
                }

            }
        }
    }
</script>