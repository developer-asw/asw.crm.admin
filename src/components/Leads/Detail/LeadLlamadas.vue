<template>
    <div>
        <v-col cols="12">
            <h2>Historico llamadas</h2>
            <v-divider class="mt-4"></v-divider>
            <p v-for="(item,index) in llamadas" :key="index">
                <small>
                    <b>{{item.fecha_mostrar}}</b> {{item.code}}
                </small>
            </p>
        </v-col>

    </div>
</template>
<script>

import { mapActions } from 'vuex';//,,mapMutations, mapState, mapGetters, 

export default {
    name: "LeadLlamadas",
    data: () => ({
        llamadas: [],
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
        this.traerLlamadas();
    },
    methods: {
        ...mapActions({
            consultar: 'leads/fetchLlamadas',
        }),
        traerLlamadas() {
            if (this.lead_id) {
                this.loading = true;
                this.consultar({id:this.lead_id})
                .then(result => {
                    this.llamadas = result.datos;
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {
                    this.loading = false;
                });
            }
        },
        actualizar() {
            this.traerLlamadas();
        },
        presentDate(value){
            return this.$moment(value).format('DD/MM/YYYY h:mm a')
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