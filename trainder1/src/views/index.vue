<template>
    <v-container>
        <br><br><br>
        <h1>Trainder</h1>
        <br><br><br>
        <Login/>
        <v-row justify="end">
            <v-col cols="4" md="3">
                <div class="box2 pa-5 text-center rounded-0" >
                <div>ยังไม่มี id เหรอ ?</div><br>
                <v-btn  to="/register">สมัครสมาชิกเลย</v-btn>
                </div>
            </v-col>
        </v-row>
        
    </v-container>
</template>

<script>

import Login from './login'

export default {
     name : 'index',
    components:{
        Login,
    },
    data(){
        return{
        }
    },
    methods:{

    },
}
</script>


<style>

.box2 {
background-color: rgb(255, 255, 255);
  text-align: center;

  
}
</style>