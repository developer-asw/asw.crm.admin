<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >

    <v-list dense>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{getNombres}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item link @click="dirigir('/')">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Inicio</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="dirigir('/leads')">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Leads</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="dirigir('/plantillas')">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Plantillas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="dirigir('/orientadores')">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Orientadores</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="dirigir('/agenda')">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Agenda</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
       
        <v-divider></v-divider>
        

    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Leads App</v-toolbar-title>
    </v-app-bar>

    <v-content>  
      <router-view></router-view>
    </v-content>

    <v-footer color="indigo" >
      <span class="white--text">American School Way &copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>

  import {mapState,mapActions} from 'vuex';

  export default {
    data: () => ({
      drawer: null
    }),
    props: {
      //source: String
    },
    methods:{
      ...mapActions({
        logout: 'auth/logout',
      }),
      dirigir(value){
        this.$router.push(value)
      },
      processLogout () {
        this.logout().then(
          this.$router.push('/login')
        )
      }
    },
    computed: {
      ...mapState({
        user: state => state.auth.user,   
      }),
      getNombres(){
        if(this.user){
          return this.user.data.primer_nombre+' '+this.user.data.primer_apellido
        }
        return ''
      }
    }
  }
</script>