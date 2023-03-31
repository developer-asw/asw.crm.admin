<template>
    <div>
        <v-col cols="12">
            
            <v-row v-if="isCollapse">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>     

                            <v-col>
                                <h4>
                                    HISTORIAL [{{historial && historial.length ? (historial[0].accion+" : "+(historial[0].observacion?historial[0].observacion:'')) : 'Sin historicos'}}]
                                </h4>
                            </v-col>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            
                            <v-layout column style="height: 110vh">       
                                <v-flex md6 style="overflow: auto">  
                                    <!--<v-card>
                                        <v-card-text>
                                            <v-timeline density="compact" align="start">
                                                <v-timeline-item v-for="(item, index) in historial" :key="index" :dot-color="item.color" size="x-small">
                                                <div class="mb-4">
                                                    <div class="d-flex">
                                                        <div class="font-weight-normal me-auto justify-start">
                                                            <strong>{{ item.usuario ? item.usuario.nombre : 'SISTEMA' }}</strong> @{{ item.fecha_mostrar | moment("DD/MM/YYYY HH:mm") }}
                                                        </div>
                                                        <small class="justify-end"><b>{{ item.accion }}</b></small>
                                                    </div>
                                                    <div><b>Evento:</b> {{ item.evento }}</div>
                                                    <div>{{ item.desc_evento }}</div>
                                                    <div><b>Observación:</b> {{ item.observacion }}</div>
                                                </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </v-card-text>
                                    </v-card>-->
                                    <v-data-table dense full-width  
                                        v-if="historial && historial.length > 0"
                                        :headers="headerHistorial" 
                                        :items="historial" 
                                        hide-default-footer
                                        :items-per-page="-1"
                                        loading-text="Loading... Please wait"
                                        class="elevation-1 tabla-historial"
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
                                                <v-toolbar-title><v-icon>folder</v-icon></v-toolbar-title>
                                                <v-divider class="mx-4" inset vertical></v-divider>
                                                <v-spacer></v-spacer>
                                                <v-btn class="ma-2" color="primary" text @click="traerHistorial"><v-icon left small>refresh</v-icon>&nbsp;Actualizar&nbsp;</v-btn>
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:expanded-item="{ headers, item }" class="row-observacion">
                                            <td class="observacion" :colspan="headers.length">
                                                {{ getObservacion(item) }}
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
                                    <!--<v-card>
                                        <v-img height="200" src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg" cover class="text-white">
                                        <v-toolbar color="rgba(0, 0, 0, 0)" theme="dark">
                                            <template v-slot:prepend>
                                            <v-btn icon="$menu"></v-btn>
                                            </template>

                                            <v-toolbar-title class="text-h6">
                                            Messages
                                            </v-toolbar-title>

                                            <template v-slot:append>
                                            <v-btn icon="mdi-dots-vertical"></v-btn>
                                            </template>
                                        </v-toolbar>
                                        </v-img>-->
                                        
                                        <!--<div class="font-weight-bold ms-1 mb-2">Today</div>-->
                                        <!--<v-card-text>
                                            <v-timeline density="compact" align="start">
                                                <v-timeline-item v-for="(item, index) in historial" :key="index" :dot-color="item.color" size="x-small">
                                                <div class="mb-4">
                                                    <div class="d-flex">
                                                        <div class="font-weight-normal me-auto justify-start">
                                                            <strong>{{ item.usuario ? item.usuario.nombre : 'SISTEMA' }}</strong> @{{ item.fecha_mostrar | moment("DD/MM/YYYY HH:mm") }}
                                                        </div>
                                                        <small class="justify-end"><b>{{ item.accion }}</b></small>
                                                    </div>
                                                    <div><b>Evento:</b> {{ item.evento }}</div>
                                                    <div>{{ item.desc_evento }}</div>
                                                    <div><b>Observación:</b> {{ item.observacion }}</div>
                                                </div>
                                                </v-timeline-item>
                                            </v-timeline>
                                        </v-card-text>
                                    </v-card>-->
                                    <v-data-table dense full-width  
                                        v-if="historial && historial.length > 0"
                                        :headers="headerHistorial" 
                                        :items="historial" 
                                        hide-default-footer
                                        :items-per-page="-1"
                                        loading-text="Loading... Please wait"
                                        class="elevation-1 tabla-historial"
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
                                                <v-btn class="ma-2" color="green darken-1" text @click="traerHistorial"><v-icon left small>refresh</v-icon>&nbsp;Actualizar&nbsp;</v-btn>
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:expanded-item="{ headers, item }" class="row-observacion">
                                            <td class="observacion" :colspan="headers.length">
                                                &raquo; {{ getObservacion(item) }}
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
            { text: 'Acción', value: 'desc_evento' },
            // { text: 'Observación', value: 'observacion' },
            { text: '', value: 'data-table-expand' },
        ],
        historial: [],
        detalles: [],
        dialog: false,
        expanded: [true, true],
        messages: [
        {
          from: 'You',
          message: `Sure, I'll see you later.`,
          time: '10:42am',
          color: 'deep-purple-lighten-1',
        },
        {
          from: 'John Doe',
          message: 'Yeah, sure. Does 1:00pm work?',
          time: '10:37am',
          color: 'green',
        },
        {
          from: 'You',
          message: 'Did you still want to grab lunch today?',
          time: '9:47am',
          color: 'deep-purple-lighten-1',
        },
      ]
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
                    this.expandAll();
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
        },
        expandAll: function() {
            this.$data.expanded = this.$data.historial;
        },
        collapseAll: function() {
            this.$data.expanded = [];
        },
        getObservacion(item){
            if (item.descartado_motivo) return item.descartado_motivo;
            if (item.estudiante_motivo) return item.estudiante_motivo;
            if (item.errado_motivo) return item.errado_motivo;
            return item.observacion;
        }
    },
    computed: {
        isCollapse() {
            return this.collapse;
        }
    }
}
</script>

<style type="text/css">     

.tabla-historial th {
    border-bottom: solid 2px gray !important;
}
.tabla-historial thead {
    background-color: #979797;
}
.tabla-historial thead th span {
    color: white;
}

.tabla-historial .observacion {
    border-bottom: solid 2px gray !important;
    height: 30px;
}
.tabla-historial tr.v-data-table__expanded__content {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
}

</style>