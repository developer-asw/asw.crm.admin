<template>
    <Timeline :value="events" layout="horizontal" align="top">
        <template #marker="slotProps">
            <span class="custom-marker shadow-2" :style="{color: slotProps.item.color}">
                <i v-if="((lead && lead.station == slotProps.item.id) || (!lead && station == slotProps.item.id))  || completado(slotProps.item.orden)" class="pi pi-circle-on"></i>
                <i v-else class="pi pi-circle-off"></i>
            </span>
        </template>
        <template #content="slotProps">
            <small>{{slotProps.item.title}}</small>
        </template>
    </Timeline>
</template>

<script>

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';//,,
import Timeline from 'primevue/timeline';

export default {
    name: 'LeadTimeLine',
    components:{
        Timeline,
    },
    data: () => ({
        events: [
            {id:'prospecto', title:"Prospecto", color:"#607d8b", orden:1}, 
            {id:'cita', title:"Cita", color:"#607d8b", orden:2}, 
            {id:'matriculado', title:"Matriculado", color:"#607d8b", orden:3}, 
            {id:'apoyo_financiero', title:"Apoyo Financiero", color:"#607d8b", orden:4}, 
            {id:'post_venta', title:"Post Venta", color:"#607d8b", orden:5}, 
            {id:'',title:'',color:"#FFF", orden:6}
        ]
    }),
    props: {
        lead_id: String,
        station: String,
        setSedes: Array,
    },
    mounted() {
        
    },
    methods: {
        ...mapActions({

        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
        completado(orden) {
            var station = this.lead && this.lead.station ? this.lead.station : (!this.lead && this.station ? this.station : null);
            const event = this.events.find(x => x.id == station);
            if (event && event.orden > orden) {
                return true;
            }
            return false;
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
            return 'Time Line Lead'
        },
        lead() {
            return this.detalle(this.lead_id)
        }

    }
}
</script>

<style>

.p-timeline-event:nth-child(5) .p-timeline-event-connector {
    background-color: #fff !important;
    color: #fff !important;
}

.p-timeline-event:last-child .p-timeline-event-connector{
    background-color: #fff !important;
    color: #fff !important;
}
</style>
