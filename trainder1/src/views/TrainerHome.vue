<template>

   <v-container>
        <h1>สวัสดี Trainer {{name}}</h1>
        <v-btn @click="logout">logout</v-btn>
    </v-container>
</template>


<script>
//import Auth from '../views/Auth'

export default {
     name : 't',
    data(){
        return{
            name: sessionStorage.getItem('name'),
        }
    },
    methods:{
        logout(){
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('role')
            sessionStorage.removeItem('name')
            this.$router.push('/')
        }
    },
    // components: {
    //     Auth,
    // }

}
</script>