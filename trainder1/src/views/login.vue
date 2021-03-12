<template>

<v-row justify="end" >
    <v-col cols="5" md="3" >
        
        <div class="box pa-5 text-center rounded-0" >
           <form id="userdata" @submit.prevent="loginsubmit">
            <v-text-field label="ชื่อผู้ใช้" v-model="userdata.name"></v-text-field>
            <v-text-field label="รหัสผ่าน" type="password" v-model="userdata.pass"></v-text-field>
            <v-btn type="submit">เข้าสู่ระบบ</v-btn>
        </form>     
        
    </div></v-col>
</v-row>

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
            sessionStorage.setItem('name',response.data.name)//role trainer normaluser ?

            if(sessionStorage.getItem('role') === 'Trainer'){
                this.$router.push('/TrainerHome')
            }else if(sessionStorage.getItem('role') === 'User'){
                this.$router.push('/UserHome')
            }

        }
    },

}
</script>


<style>

.box {
  box-shadow:
  0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12);
    background-color: rgb(255, 255, 255);
  text-align: center;

  
}
</style>