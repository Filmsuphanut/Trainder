<template>
    <v-container>
        <h1>เข้าสู่ระบบ</h1>
        <form id="userdata" @submit.prevent="loginsubmit">
            <v-text-field label="ชื่อผู้ใช้" v-model="userdata.name"></v-text-field>
            <v-text-field label="รหัสผ่าน" type="password" v-model="userdata.pass"></v-text-field>
            <v-btn type="submit" >เข้าสู่ระบบ</v-btn>
        </form>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    name : 'login',
    data(){
        return{
            userdata:{name:null,pass:null},
        }
    },
    methods:{
        async loginsubmit(e){
            const response = await axios.post('todos',this.userdata)
            console.log(this.userdata,response)
            e.preventDefault()

            sessionStorage.setItem('token',response.data.id)//token
            sessionStorage.setItem('role',response.data.name)//role trainer normaluser ?
        }
    },

}
</script>