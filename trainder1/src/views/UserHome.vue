<template>

   <v-container>
        <h1>สวัสดี {{callname()}}</h1>
        <router-link to="/Excercise"><v-btn>ออกกำลังกายกับผู้อื่น</v-btn></router-link>
        <router-link to="/FindTrainer"><v-btn>ค้นหา Trainer ที่ถูกใจ</v-btn></router-link>
        <router-link to="/CreateRoom"><v-btn>สร้างห้องออกกำลังกายกับเพื่อน</v-btn></router-link>

    </v-container>
</template>


<script>
import firebase from 'firebase'
//import store from 'vuex'

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


    },
    components: {

    }

}
</script>