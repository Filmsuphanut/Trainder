<template>

   <v-container>
        <h1>สวัสดี {{callname()}}</h1>
        <router-link to="/ProfileSetting" ><v-btn>ตั้งค่าบัญชีผู้ใช้</v-btn></router-link>
        <router-link to="/Table"><v-btn>ตารางออกกำลังกาย</v-btn></router-link>
        <router-link to="/Course"><v-btn>Course Detail</v-btn></router-link>
        <v-btn @click="logout">ออกจากระบบ</v-btn>
    </v-container>
</template>


<script>

import firebase from 'firebase';

export default {
     name : 'index',
    data(){
        return{

        }
    },
    methods:{

        logout(){

            firebase.auth().signOut().then(() => {
            // Sign-out successful.
            console.log("logout")
            this.$store.dispatch("logout")
            this.$router.push('/')

            }).catch((error) => {
            // An error happened.
            console.log(error);
            });  

        },
        callname(){////หาชื่อ user
            let user = this.$store.getters["userData"];
            return user.data.fullName
        },
        setPrevious(){
            if(this.$store.state.previous.pre !== "/TrainerHome"){
                this.$store.commit("setPreviousPage","/TrainerHome");
            }
        },

    },
    mounted(){
        this.setPrevious();
    },

}
</script>