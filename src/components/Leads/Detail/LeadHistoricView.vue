<template>
    <div>
        <v-col cols="12">
            <v-row v-if="isCollapse">
                <v-expansion-panels  variant="outlined" accordion>
                    <v-expansion-panel>
                        <v-expansion-panel-header>     
                            <v-col cols="8">
                                <h4>
                                    {{resumen.texto}}
                                </h4>
                            </v-col>
                            <v-col cols="4" align="right">
                                <v-btn small color="info" text @click="actualizar" :disabled="loading">
                                    <v-icon>autorenew</v-icon>
                                </v-btn>
                            </v-col>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            
                            <v-layout column row style="height: 360px">       
                                <v-flex style="overflow: auto">  
                                    
                                    <v-list rounded :border="true" v-for="key_item in keys" :key="key_item.code" class="mx-auto" lines="three">
                                        <v-subheader style="text-transform: uppercase;">{{ key_item.titulo }}</v-subheader>
                                        <v-divider></v-divider>
                                        <v-list-item class="py-0 my-0" v-for="(item, index) in historial[key_item.code]" :key="index">
                                            <v-list-item-content class="py-0 my-0">

                                                <v-container class="bg-surface-variant">

                                                    <v-row v-bind:style="{ 'background-color': item.color ? item.color : '#FFF' }">
                                                        <v-col>                                                            
                                                            <v-row no-gutters>
                                                                <v-col cols="4" class="py-0">
                                                                    <span><b><v-icon small @click="viewDetail(item)">info</v-icon> Evento:</b> {{ item.evento }}</span>
                                                                </v-col>
                                                                <v-col cols="6" class="py-0">
                                                                    <span>{{ item.desc_evento }}</span>
                                                                </v-col>
                                                                <v-col cols="2" class="py-0">
                                                                    <span>{{ item.fecha_mostrar | moment("DD/MM/YYYY HH:mm:ss") }}</span>
                                                                </v-col>
                                                            </v-row>
                                                            
                                                            <v-row no-gutters>
                                                                <v-col class="py-2">
                                                                    <span><p class="text-left"><b>Observación:</b> {{ item.observacion }}</p></span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row no-gutters>
                                                                <v-col  cols="3" class="py-0">
                                                                    <span><b >Usuario:</b> <span>{{ item.usuario ? item.usuario.nombre : 'SISTEMA' }}</span> </span>
                                                                </v-col>
                                                                <v-col cols="5" class="py-0">
                                                                    <span><b>Perfil:</b> {{ item.usuario && item.usuario.perfil ? item.usuario.perfil + (item.usuario.grupo_usuario ? ` (${item.usuario.grupo_usuario})` : '') : '' }}</span>
                                                                </v-col>
                                                                <v-col cols="4" class="py-0">
                                                                    <span><b>Acción:</b> {{ item.accion }}</span>
                                                                </v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>

                                                    <v-row>
                                                        <v-col>
                                                            <v-divider></v-divider>
                                                        </v-col>
                                                    </v-row>
                                                </v-container>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>

                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-row>
            
            <v-row v-else>
                <v-col>
                    <v-row>
                        <v-col align="right">
                            <v-btn small color="info" text @click="actualizar" :disabled="loading">
                                <v-icon>autorenew</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-layout column style="height: 680px">
                                <!-- md6 -->
                                <v-flex style="overflow: auto">
                                    <v-list rounded :border="true" v-for="key_item in keys" :key="key_item.code" class="mx-auto" lines="three">
                                        <v-subheader style="text-transform: uppercase;">{{ key_item.titulo }}</v-subheader>
                                        <v-divider></v-divider>
                                        <v-list-item class="py-0 my-0" v-for="(item, index) in historial[key_item.code]" :key="index">
                                            <v-list-item-content class="py-0 my-0">
                                                <v-container class="bg-surface-variant">

                                                    <v-row v-bind:style="{ 'background-color': item.color ? item.color : '#FFF' }">
                                                        <v-col>
                                                            <v-row no-gutters>
                                                                <!-- <v-col cols="6" class="py-0">
                                                                    <b><v-icon small @click="viewDetail(item)">info</v-icon> Evento:</b> {{ item.evento }}
                                                                </v-col>
                                                                <v-col cols="6" class="py-0 text-right">
                                                                    {{ item.fecha_mostrar | moment("DD/MM/YYYY HH:mm") }}
                                                                </v-col> -->

                                                                <v-col cols="4" class="py-0">
                                                                    <span><b><v-icon small @click="viewDetail(item)">info</v-icon> Evento:</b> {{ item.evento }}</span>
                                                                </v-col>
                                                                <v-col cols="6" class="py-0">
                                                                    <span>{{ item.desc_evento }}</span>
                                                                </v-col>
                                                                <v-col cols="2" class="py-0 text-right">
                                                                    <span>{{ item.fecha_mostrar | moment("DD/MM/YYYY HH:mm:ss") }}</span>
                                                                </v-col>
                                                            </v-row>
                                                            <!-- <v-row no-gutters>
                                                                <v-col class="py-0 pl-5">
                                                                    {{ item.desc_evento }}
                                                                </v-col>
                                                            </v-row> -->
                                                            
                                                            <v-row no-gutters>
                                                                <v-col class="py-2">
                                                                    <span><p class="text-left my-0"><b>Observación:</b> {{ item.observacion }}</p></span>
                                                                </v-col>
                                                            </v-row>
                                                            <v-row no-gutters>
                                                                <v-col  cols="3" class="py-0">
                                                                    <span><b >Usuario:</b> <span>{{ item.usuario ? item.usuario.nombre : 'SISTEMA' }}</span> </span>
                                                                </v-col>
                                                                <v-col cols="5" class="py-0">
                                                                    <span><b>Perfil:</b> {{ item.usuario && item.usuario.perfil ? item.usuario.perfil + (item.usuario.grupo_usuario ? ` (${item.usuario.grupo_usuario})` : '') : '' }}</span>
                                                                </v-col>
                                                                <v-col cols="4" class="py-0 text-right">
                                                                    <span><b>Acción:</b> {{ item.accion }}</span>
                                                                </v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col>
                                                            <v-divider></v-divider>
                                                        </v-col>
                                                    </v-row>
                                                </v-container>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
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
        keys:[],
        detalles: [],
        dialog: false,
        loading: false,
        expanded: [true, true],
        resumen:{},
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
            if (this.lead_id) {
                this.loading = true;
                this.consultar({id:this.lead_id})
                .then(result => {
                    this.historial = result.datos;
                    this.keys = result.keys;
                    this.resumen = result.resumen;
                    this.expandAll();
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {
                    this.loading = false;
                });
            }
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
        },
        actualizar() {
            this.traerHistorial();
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
.historico-fecha {
    border-radius: 5px;
    border: solid 1px #000;
    background-color: #E3F2FD;
    padding: 0px 7px;
}
.usuario {
    display: inline-block;
    width:80%;
    line-height: 0.7;
    overflow:hidden;
    white-space:nowrap;
    -ms-text-overflow:ellipsis;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.bg-surface-variant {
    color: rgba(0,0,0,.6);
}

</style>