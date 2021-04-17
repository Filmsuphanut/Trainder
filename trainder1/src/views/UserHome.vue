<template>

   <v-container>
        <h1>สวัสดี {{callname()}}</h1>
        <router-link to="/Excercise"><v-btn>ออกกำลังกายกับผู้อื่น</v-btn></router-link>
        <router-link to="/User/FindTrainer"><v-btn>ค้นหา Trainer ที่ถูกใจ</v-btn></router-link>
        <router-link to="/CreateRoom"><v-btn>สร้างห้องออกกำลังกายกับเพื่อน</v-btn></router-link>
        <router-link to="/ProfileSetting" ><v-btn>ตั้งค่าบัญชีผู้ใช้</v-btn></router-link>
        <router-link to="/User/Table" ><v-btn>Table</v-btn></router-link>
        <v-btn @click="logout">ออกจากระบบ</v-btn>

    </v-container>
</template>


<script>

import firebase from 'firebase'

export default {
     name : 'index',
    data(){
        return{

        }
    },
    methods:{
        callname(){////หาชื่อ user

            let user = firebase.auth().currentUser
            let displayname
            //const vm = this.$store

            if (user != null) {
                displayname = user.displayName

                // var admin = require('firebase-admin');
                // const uid = user.uid;
                // console.log(uid)

                // admin
                // .auth()
                // .createCustomToken(uid)
                // .then((customToken) => {
                //     console.log(customToken)
                    

                // })
                // .catch((error) => {
                //     console.log('Error creating custom token:', error);
                // });


                //vm.commit("setToken",idToken)
                



            return displayname

            }
            //else{
                
                //let token = vm.state.user.token
                //console.log('else + ' + token)

                // firebase.auth().signInWithCustomToken(token)
                // .then((userCredential) => {
                //     // Signed in
                //     var user = userCredential.user;
                //     console.log(user)
                //     return user.displayName
                //     // ...
                // })
                // .catch((error) => {
                //     var errorCode = error.code;
                //     var errorMessage = error.message;
                //     console.log(errorCode,errorMessage)
                // });
                
            //}

            

//********************************************


        },

        logout(){

            firebase.auth().signOut().then(() => {
            // Sign-out successful.
            console.log("logout")
            this.$router.push('/')

            }).catch((error) => {
            // An error happened.
            console.log(error);
            });  

        },

        setPrevious(){
            if(this.$store.state.previous.pre !== "/User"){
                this.$store.commit("setPreviousPage","/User");
            }
        },


    },
    mounted(){
        this.setPrevious();
    },

}
</script>