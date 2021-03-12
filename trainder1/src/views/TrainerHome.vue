<template>

   <v-container>
       <Auth/>
        <h1>สวัสดี Trainer {{name}}</h1>

    </v-container>
</template>


<script>
import Auth from '../views/Auth'

export default {
     name : 'index',
    data(){
        return{
            name: sessionStorage.getItem('name'),
        }
    },
    methods:{

    },
    components: {
        Auth,
    }

}
</script>