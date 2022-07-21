<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <!--<v-subheader>{{pagination.total}} registros</v-subheader>-->
                <v-subheader> - </v-subheader>
                <v-btn small color="info" dark @click="actualizar" :disabled="loading">
                    <v-icon>autorenew</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            
        </v-card>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'User',
    components: {
      
    },
    data () {
        return {
            loading: false,
            search: '',
            payload: {
                prioridad: 1,
            },
            //// Edits elementes
            editedIndex: -1,
            dialog: false,
            dialogDelete: false,
            editedItem: {},
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        this.actualizar();
    },
    methods:{
      ...mapActions({
          
      }),
        ...mapMutations({
            setInfo: 'setInfo',
        }),
        actualizar(){
            
        },
      
    },
    computed: {
        ...mapState({
            user: state => state.auth.user,   
        }),
        getTitle(){
            return 'Usuarios'
        }
    },
    watch: {
        
    }
}
</script>