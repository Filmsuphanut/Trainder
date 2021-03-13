<template>


        
        <div class="box2 text-center"   width="300px" height="250px" >
           <form id="userdata" @submit.prevent="loginsubmit">
            <v-text-field label="Email" v-model="userdata.name"></v-text-field>
            <v-text-field label="รหัสผ่าน" type="password" v-model="userdata.pass"></v-text-field>
            <v-btn type="submit" :loading="loading" :disabled="loading" >เข้าสู่ระบบ</v-btn>
        </form>     
        

            <v-snackbar v-model="snackbar" :timeout="2000">
            รหัสผ่านไม่ถูกต้อง

            <template v-slot:action="{ attrs }">
                <v-btn
                color="red"
                text
                v-bind="attrs"
                @click="snackbar = false"
                >
                Close
                </v-btn>
            </template>
            </v-snackbar>

    </div>


</template>

<script>
import axios from 'axios'
export default {
    name : 'login',
    data(){
        return{
            userdata:{name:null,pass:null},
            loading:false,
            snackbar:false,
        }
    },
    methods:{
        async loginsubmit(e){////////////////////////////////////////////////////////
            this.loading = true
            const response = await axios.post('todos',this.userdata)
            console.log(this.userdata,response)
            
            e.preventDefault()
            this.loading = false

            if(response.data.id === 'true'){

                sessionStorage.setItem('token',response.data.id)//token
                sessionStorage.setItem('role',response.data.name)//role trainer normaluser ?
                sessionStorage.setItem('name',response.data.name)//role trainer normaluser ?

                if(sessionStorage.getItem('role') === 'Trainer'){
                    this.$router.push('/TrainerHome')
                }else if(sessionStorage.getItem('role') === 'User'){
                    this.$router.push('/UserHome')
                }

            }else{
                this.snackbar = true
            }

        },
    },    
    
}
</script>


<style scoped>

.box2 {
    
    border: 2px solid rgb(205, 205, 253);
    border-radius: 10px;
    padding: 25px 25px 25px 25px;
  box-shadow:
  0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12);
    background-color: rgb(255, 255, 255);
  text-align: center;
   width: 300px;
  height: 250px;
}
</style>