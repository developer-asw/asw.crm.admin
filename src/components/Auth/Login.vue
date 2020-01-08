<template>

      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Leads App</v-toolbar-title>
                <v-spacer></v-spacer>
                
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="user.username" prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
                  <v-text-field v-model="user.password" id="password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="processLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    
</template>

<script>
  import {mapActions,mapMutations} from 'vuex';
  
  export default {
    
    name: 'login',
    data () {
      return {
        user: {
          username: '',
          password: '',
        },
      }
    },
    methods: {
      ...mapActions({
        login: 'auth/login',
        
      }),
      ...mapMutations({

      }),
      processLogin () {
        this.login(this.user).then(
          user => {
            console.log('logged:'+user)
            this.$router.push('/');
          },
          error => {
            console.log(error)
          })
      }
    }
  }
</script>