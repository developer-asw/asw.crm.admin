<template>
    <!-- <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
    </template> -->
    <v-card>
        <v-card-title>
            <span class="headline">Transferir datos</span>
        </v-card-title>
        <v-card-text>
            <v-container >
                <v-row>
                    <p>Transferir de: {{orientador ? orientador.primer_nombre : ''}} {{orientador ? orientador.primer_apellido : ''}} {{orientador && orientador.grupo ? orientador.grupo.nombre : ''}}</p>
                </v-row>
                <v-row>
                    <v-select multiple v-model="payload.orientadores" label="Orientadores" :items="orientadores" item-text="value" item-value="email" :disabled="disabled">
                        <template slot="item" slot-scope="data">
                            {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                        </template>
                        <template slot="selection" slot-scope="data">
                            {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                        </template>
                        <template v-slot:prepend-item>
                            <v-list-item
                            ripple
                            @mousedown.prevent
                            @click="toggle"
                            >
                            <v-list-item-action>
                                <v-icon :color="payload.orientadores.length > 0 ? 'indigo darken-4' : ''">
                                {{ icon }}
                                </v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>
                                Select All
                                </v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                            <v-divider class="mt-2"></v-divider>
                        </template>
                        
                    </v-select>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text :disabled="loading" :loading="loading" @click="cerrar()">Cerrar</v-btn>
            <v-btn color="blue darken-1" text :disabled="loading" :loading="loading" @click="transferir()">Transferir</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

import { mapActions, mapMutations, mapState } from 'vuex';

export default {
    
    name: 'Transferir',
    components: {},
    data() {
        return {
            loading: false,
            disabled: false,
            payload:{
                orientador:null,
                datos:[],
                orientadores:[],
            },
            orientadores:[],
            orientador:null
        }
    },
    props: {
        orientador_id: String,
        datos_seleccionado:Array
    },
    methods: {
        ...mapActions({
            listarOrientadores: 'orientadores/getOrientadores',
            postTransferir: 'orientadores/transferir',
            detalle: 'orientadores/fetchUserDetalle',

        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
        cerrar() {
            this.$emit('cerrar');
        },

        transferir(){
            this.loading = true;
            this.procesando = true;
            this.postTransferir(this.payload).then((result)=>{
                    this.setInfo(result.mensaje)
				}).catch(error => {
                    console.log(error)
                    if (error.body.error) {
                        this.setError(error.body.error)
                    } else {
                        this.setError("Problemas al procesar la solicitud, intente más tarde.")
                    }
                })
                .finally(() => {
                    this.loading = false;
                    this.procesando = false;
                    this.cerrar();
                })

        },
        copy(o) {
            if (o === null) return null;
            var output, v, key;
            output = Array.isArray(o) ? [] : {};
            for (key in o) {
                v = o[key];
                output[key] = (typeof v === "object") ? this.copy(v) : v;
            }
            return output;
        },
        traerOrientadores() {
            this.listarOrientadores()
                .then(result => {
                    this.orientadores = result.datos;
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {
            });
        },
        traerDetalle() {
            this.detalle({id:this.orientador_id})
                .then(result => {
                    this.orientador = result;
                    if (this.orientador) {
                        this.payload.orientador = this.orientador.email;
                    }
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {
            });
        },
        toggle () {
            this.$nextTick(() => {
                if (this.likesAllFruit) {
                    this.payload.orientadores = []
                } else {
                    this.payload.orientadores = this.orientadores.slice()
                }
            })
        }
    },
    computed:{
        ...mapState({
            user: state => state.auth.user_info,
        }),
        userEmail() {
            return this.user && this.user ? this.user.email : null
        },
        likesAllFruit () {
            return this.payload.orientadores.length === this.orientadores.length
        },
        likesSomeFruit () {
            return this.payload.orientadores.length > 0 && !this.likesAllFruit
        },
        icon () {
            if (this.likesAllFruit) return 'mdi-close-box'
            if (this.likesSomeFruit) return 'mdi-minus-box'
            return 'mdi-checkbox-blank-outline'
        },
    },
    mounted() {
        this.traerOrientadores();
        this.traerDetalle();
        this.payload.datos = this.datos_seleccionado;
    },
}
</script>