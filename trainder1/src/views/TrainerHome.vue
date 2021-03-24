<template>

   <v-container>
       <Auth/>
        <h1>สวัสดี Trainer</h1>

    </v-container>
</template>


<script>
import Auth from '../views/Auth'

export default {
     name : 'index',
    data(){
        return{

        }
    },
    methods:{

    },
    components: {
        Auth,
    }

}
</script>