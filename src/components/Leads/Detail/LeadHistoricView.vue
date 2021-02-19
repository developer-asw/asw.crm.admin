<template>
    <div>
        <v-col cols="12">
            
            <v-row v-if="isCollapse">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>                        
                            <v-col cols="8"><h4>HISTORIAL</h4></v-col>
                            <v-col cols="4" class="text-right"><v-icon @click="traerHistorial" right>refresh</v-icon></v-col>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-data-table dense
                                v-if="historial && historial.length > 0"
                                :headers="headerHistorial" 
                                :items="historial" 
                                loading-text="Loading... Please wait"
                                class="elevation-1">
                                <template v-slot:[`item.fecha`]="{ item }">
                                    <span v-if="item.fecha">
                                        {{item.fecha | moment("DD/MM/YYYY") }}
                                    </span>
                                </template>
                                <template v-slot:[`item.hora`]="{ item }">
                                    <span v-if="item.fecha">
                                        {{item.fecha | moment("HH:mm:ss") }}
                                    </span>
                                </template>
                                <template v-slot:[`item.tipo`]="{ item }">
                                    <v-icon></v-icon>
                                    <v-icon v-if="item.tipo == 'llamada' && ver_detalles" @click="viewDetail(item)" x-small>call</v-icon>
                                    <v-icon v-else-if="ver_detalles" x-small @click="viewDetail(item)">edit</v-icon>
                                    <v-icon v-else-if="item.tipo == 'llamada'" x-small>call</v-icon>
                                    <v-icon v-else x-small>edit</v-icon>
                                </template>
                            </v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

            </v-row>

            <v-row v-else>
                <v-col>
                    <v-row>
                        <v-col cols="8"><h4>HISTORIAL</h4></v-col>
                        <v-col cols="4" class="text-right"><v-icon @click="traerHistorial" right>refresh</v-icon></v-col>
                    </v-row>
                    <v-row>

                        <v-col cols="12">

                            <v-data-table dense
                                v-if="historial && historial.length > 0"
                                :headers="headerHistorial" 
                                :items="historial" 
                                loading-text="Loading... Please wait"
                                class="elevation-1">
                                <template v-slot:[`item.fecha`]="{ item }">
                                    <span v-if="item.fecha">
                                        {{item.fecha | moment("DD/MM/YYYY") }}
                                    </span>
                                </template>
                                <template v-slot:[`item.hora`]="{ item }">
                                    <span v-if="item.fecha">
                                        {{item.fecha | moment("HH:mm:ss") }}
                                    </span>
                                </template>
                                <template v-slot:[`item.tipo`]="{ item }">
                                    <v-icon></v-icon>
                                    <v-icon v-if="item.tipo == 'llamada' && ver_detalles" @click="viewDetail(item)" x-small>call</v-icon>
                                    <v-icon v-else-if="ver_detalles" x-small @click="viewDetail(item)">edit</v-icon>
                                    <v-icon v-else-if="item.tipo == 'llamada'" x-small>call</v-icon>
                                    <v-icon v-else x-small>edit</v-icon>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>
        </v-col>

        <v-dialog v-model="dialog" width="500" >
            <v-card>
                <v-card-title class="headline grey lighten-2">
                    Detalles
                </v-card-title>

                <v-card-text>
                    <v-list :disabled="true" :dense="true" :flat="true">
                        <!-- <v-subheader>REPORTS</v-subheader> -->
                        <v-list-item-group color="primary">
                            <v-list-item v-for="(item, i) in detalles" :key="i">
                                <v-list-item-content>
                                    {{item}}
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="!detalles || detalles.length == 0">
                                <v-list-item-content>
                                    No se encontraron información;
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>

                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false" >
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>

import { mapActions } from 'vuex';//,,mapMutations, mapState, mapGetters, 

export default {
    name: "LeadHistoricView",
    data: () => ({
        headerHistorial: [
            { text: '', value: 'tipo' },
            { text: 'Fecha', value: 'fecha' },
            { text: 'Hora', value: 'hora' },
            { text: 'Usuario', value: 'usuario.nombre' },
            { text: 'Acción', value: 'accion' },
            { text: 'Observación', value: 'observacion' },
        ],
        historial: [],
        detalles: [],
        dialog: false,
    }),
    props: {
        lead_id: String,
        ver_detalles: Boolean,
        collapse: Boolean
    },
    mounted() {
        this.traerHistorial();
    },
    methods: {
        ...mapActions({
            consultar: 'leads/fetchLeadHistorial',
        }),
        traerHistorial() {
            if (this.lead_id)
            this.consultar({id:this.lead_id})
                .then(result => {
                    this.historial = result.datos;
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {

                });
        },
        viewDetail(item) {
            if (this.ver_detalles) {
                this.detalles = item.detalles;
                this.dialog = true;
            }
        }
    },
    computed: {
        isCollapse() {
            return this.collapse;
        }
    }
}
</script>