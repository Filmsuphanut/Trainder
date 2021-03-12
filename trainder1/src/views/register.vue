<template>
    <v-container>
        <h1>สมัครสมาชิก</h1>
        
        <form id="userdata" @submit.prevent="regissubmit">
            <v-text-field label="ชื่อผู้ใช้" v-model="userdata.name"></v-text-field>
            <v-text-field label="รหัสผ่าน" type="password" v-model="userdata.pass"></v-text-field>
            <v-btn type="submit" >สมัครสมาชิก</v-btn>
        </form>
        
    </v-container>
</template>

<script>
// import Vue from 'vue'
// import axios from 'axios'
// import VueAxios from 'vue-axios'

// Vue.use(VueAxios, axios)

import axios from 'axios'

export default {
    name : 'register',
    data(){
        return{
            userdata:{name: null,pass:null},
        }
    },
    methods:{
        async regissubmit(e){
            // Vue.axios.post("https://jsonplaceholder.typicode.com/todos",this.userdata).then((response) => {
            // console.log(JSON.stringify(response.data))})
            const response = await axios.post('todos',this.userdata)
            console.log(response)
            e.preventDefault()
            this.$router.push('/')
        }
    },

}
</script>