<template>
    <div>
        <v-col cols="12">
            
            <v-row v-if="isCollapse">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>     

                            <v-col>
                                <h4>
                                    HISTORIAL [{{historial && historial.length ? historial[0].accion+" : "+(historial[0].observacion?historial[0].observacion:'') : 'Sin historicos'}}]
                                </h4>
                            </v-col>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            
                            <v-layout column style="height: 110vh">       
                                <v-flex md6 style="overflow: auto">  
                                    <v-data-table dense full-width  
                                        v-if="historial && historial.length > 0"
                                        :headers="headerHistorial" 
                                        :items="historial" 
                                        hide-default-footer
                                        :items-per-page="-1"
                                        loading-text="Loading... Please wait"
                                        class="elevation-1"
                                        item-key="index"
                                        :single-expand="false"
                                        :expanded.sync="expanded"
                                        show-expand>
                                        <template v-slot:[`item.fecha`]="{ item }">
                                            <span v-if="item.fecha_mostrar">
                                                {{item.fecha_mostrar | moment("DD/MM/YYYY HH:mm") }}
                                            </span>
                                        </template>
                                        <template v-slot:[`item.tipo`]="{ item }">
                                            <v-icon></v-icon>
                                            <v-icon v-if="item.tipo == 'llamada' && ver_detalles" @click="viewDetail(item)" x-small>call</v-icon>
                                            <v-icon v-else-if="ver_detalles" x-small @click="viewDetail(item)">edit</v-icon>
                                            <v-icon v-else-if="item.tipo == 'llamada'" x-small>call</v-icon>
                                            <v-icon v-else x-small>edit</v-icon>
                                        </template>
                                        
                                        <template v-slot:top>
                                            <v-toolbar flat>
                                                <!-- <v-toolbar-title>HISTORIAL</v-toolbar-title> -->
                                                <v-toolbar-title><v-icon>folder</v-icon></v-toolbar-title>
                                                <v-divider class="mx-4" inset vertical></v-divider>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                color="primary"
                                                dark
                                                class="mb-2"
                                                @click="traerHistorial">
                                                Actualizar
                                                </v-btn>
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:expanded-item="{ headers, item }">
                                            <td :colspan="headers.length">
                                                {{ item.observacion }}
                                            </td>
                                        </template>
                                    </v-data-table>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-row>
            
            <v-row v-else>
                <v-col>
                    <v-row>
                        <v-col cols="12">
                            <v-layout column style="height: 110vh">       
                                <v-flex md6 style="overflow: auto">  
                                    <v-data-table dense full-width  
                                        v-if="historial && historial.length > 0"
                                        :headers="headerHistorial" 
                                        :items="historial" 
                                        hide-default-footer
                                        :items-per-page="-1"
                                        loading-text="Loading... Please wait"
                                        class="elevation-1"
                                        item-key="index"
                                        :single-expand="false"
                                        :expanded.sync="expanded"
                                        show-expand
                                        >
                                        <template v-slot:[`item.fecha`]="{ item }">
                                            <span v-if="item.fecha_mostrar">
                                                {{item.fecha_mostrar | moment("DD/MM/YYYY HH:mm") }}
                                            </span>
                                        </template>
                                        <template v-slot:[`item.tipo`]="{ item }">
                                            <v-icon></v-icon>
                                            <v-icon v-if="item.tipo == 'llamada' && ver_detalles" @click="viewDetail(item)" x-small>call</v-icon>
                                            <v-icon v-else-if="item.tipo == 'cita' && ver_detalles" x-small @click="viewDetail(item)">event</v-icon>
                                            <v-icon v-else-if="ver_detalles" x-small @click="viewDetail(item)">edit</v-icon>
                                            <v-icon v-else-if="item.tipo == 'llamada'" x-small>call</v-icon>
                                            <v-icon v-else-if="item.tipo == 'cita'" x-small>event</v-icon>
                                            <v-icon v-else x-small>edit</v-icon>
                                        </template>
                                        
                                        <template v-slot:top>
                                            <v-toolbar flat>
                                                <v-toolbar-title>HISTORIAL</v-toolbar-title>
                                                <v-divider class="mx-4" inset vertical></v-divider>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                color="primary"
                                                dark
                                                class="mb-2"
                                                @click="traerHistorial">
                                                Actualizar
                                                </v-btn>
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:expanded-item="{ headers, item }">
                                            <td :colspan="headers.length">
                                                {{ item.observacion }}
                                            </td>
                                        </template>
                                    </v-data-table>
                                </v-flex>
                            </v-layout>
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
            { text: 'Usuario', value: 'usuario.nombre' },
            { text: 'Evento', value: 'evento' },
            { text: 'Acción', value: 'accion' },
            // { text: 'Observación', value: 'observacion' },
            { text: '', value: 'data-table-expand' },
        ],
        historial: [],
        detalles: [],
        dialog: false,
        expanded: [],
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