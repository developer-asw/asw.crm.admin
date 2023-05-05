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
                                    
                                    <v-list rounded :border="true" v-for="key_item in keys" :key="key_item.code" class="mx-auto" lines="three">
                                        <v-subheader style="text-transform: uppercase;">{{ key_item.titulo }}</v-subheader>
                                        <v-divider></v-divider>
                                        <v-list-item v-for="(item, index) in historial[key_item.code]" :key="index">
                                            <v-list-item-content class="pb-0">

                                                <v-list-item-subtitle>
                                                    <v-row>
                                                        <v-col cols="3" class="py-3">
                                                            <b>Evento:</b> {{ item.evento }}
                                                        </v-col>
                                                        <v-col cols="5" class="py-3">
                                                            {{ item.desc_evento }}
                                                        </v-col>
                                                        <v-col cols="4" class="py-3">
                                                            {{ item.fecha_mostrar | moment("DD/MM/YYYY HH:mm") }}
                                                        </v-col>
                                                    </v-row>
                                                </v-list-item-subtitle>
                                                
                                                <v-list-item-subtitle>
                                                    <v-row>
                                                        <v-col class="py-3">
                                                            <b>Observación:</b> {{ item.observacion }}
                                                        </v-col>
                                                    </v-row>
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle>
                                                    <v-row>
                                                        <v-col  cols="3" class="py-3">
                                                            <b >Usuario:</b> <span>{{ item.usuario ? item.usuario.nombre : 'SISTEMA' }}</span> 
                                                        </v-col>
                                                        <v-col cols="5" class="py-3">
                                                            <b>Perfil:</b> {{ item.usuario && item.usuario.perfil ? item.usuario.perfil : '' }}
                                                        </v-col>
                                                        <v-col cols="4" class="py-3">
                                                            <b>Acción:</b> {{ item.accion }}
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col>
                                                            <v-divider></v-divider>
                                                        </v-col>
                                                    </v-row>
                                                </v-list-item-subtitle>
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
                        <v-col cols="12">
                            <v-layout column style="height: 175vh">
                                <v-flex md6 style="overflow: auto">

                                    <v-list rounded :border="true" v-for="key_item in keys" :key="key_item.code" class="mx-auto" lines="three">
                                        <v-subheader style="text-transform: uppercase;">{{ key_item.titulo }}</v-subheader>
                                        <v-divider></v-divider>
                                        <v-list-item v-for="(item, index) in historial[key_item.code]" :key="index">
                                            <v-list-item-content class="pb-0">

                                                <v-list-item-subtitle>
                                                    <v-row>
                                                        <v-col cols="3" class="py-3">
                                                            <b>Evento:</b> {{ item.evento }}
                                                        </v-col>
                                                        <v-col cols="5" class="py-3">
                                                            {{ item.desc_evento }}
                                                        </v-col>
                                                        <v-col cols="4" class="py-3">
                                                            {{ item.fecha_mostrar | moment("DD/MM/YYYY HH:mm") }}
                                                        </v-col>
                                                    </v-row>
                                                </v-list-item-subtitle>
                                                
                                                <v-list-item-subtitle>
                                                    <v-row>
                                                        <v-col class="py-3">
                                                            <b>Observación:</b> {{ item.observacion }}
                                                        </v-col>
                                                    </v-row>
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle>
                                                    <v-row>
                                                        <v-col  cols="3" class="py-3">
                                                            <b >Usuario:</b> <span>{{ item.usuario ? item.usuario.nombre : 'SISTEMA' }}</span> 
                                                        </v-col>
                                                        <v-col cols="5" class="py-3">
                                                            <b>Perfil:</b> {{ item.usuario && item.usuario.perfil ? item.usuario.perfil : '' }}
                                                        </v-col>
                                                        <v-col cols="4" class="py-3">
                                                            <b>Acción:</b> {{ item.accion }}
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col>
                                                            <v-divider></v-divider>
                                                        </v-col>
                                                    </v-row>
                                                </v-list-item-subtitle>
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
        expanded: [true, true],
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
                    this.keys = result.keys;
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

</style>