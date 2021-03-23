<template>

        <div class="box2 text-center"   width="300px" height="250px" >
           <v-form id="userdata" ref="form" required @submit.prevent="loginsubmit">
            <v-text-field label="Email" :rules="checkdata" v-model="userdata.name"></v-text-field>
            <v-text-field label="รหัสผ่าน" :rules="checkdata" type="password" required v-model="userdata.pass"></v-text-field>
            <v-btn type="submit" :loading="loading" :disabled="loading">เข้าสู่ระบบ</v-btn>
        </v-form>
        <v-btn :loading="loading" :disabled="loading" @click="signinpopup">เข้าสู่ระบบด้วย Google</v-btn>
            <v-snackbar v-model="snackbar" :timeout="2000">
            {{this.snacktext}}

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
//import axios from 'axios'
import firebase from 'firebase'

export default {
    name : 'login',
    data(){
        return{
            userdata:{name:null,pass:null},
            loading:false,
            snackbar:false,
            checkdata:[val => (val || '').length > 0 || 'โปรดกรอกฟิลด์นี้'],
            snacktext:'',
        }
    },
    methods:{
        async loginsubmit(e){////////////////////////////////////////////////////////

        if(this.$refs.form.validate()){
            //const response = await axios.post('......',this.userdata)
            
            //console.log(this.userdata,response)
            firebase.auth().signInWithEmailAndPassword(this.userdata.name, this.userdata.pass)
            .then((userCredential) => {
                var user = userCredential.user
                //sessionStorage.setItem('name',JSON.stringify(this.userCredential.user.displayName))
                console.log(user)

                //เช็คว่าเป็น trainer หรือ user ปกติ
                this.$router.push('/UserHome')

            })
            .catch((error) => {
                 var errorCode = error.code;
                 var errorMessage = error.message;
                 console.log(errorCode,errorMessage)
                 this.snacktext = 'รหัสผ่านไม่ถูกต้อง'
                 this.snackbar = true
            });
            e.preventDefault()

        }

        },
        async signinpopup(e){
        
            var provider = new firebase.auth.GoogleAuthProvider();

            provider.addScope('https://www.googleapis.com/auth/contacts.readonly')

            firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;
                var token = credential.accessToken;
                var user = result.user;
                console.log(credential,token,user.email)
                console.log(result)
                //sessionStorage.setItem('name',JSON.stringify(this.userCredential.user.displayName))


                let db = firebase.firestore();
                let userRef = db.collection("userData");

                    userRef.add({
                    fullName:user.displayName,
                    role: "normal",
                    uid: user.uid,
                    });


                this.$router.push('/UserHome')

            }).catch((error) => {//////////////////////////////////////////////***** */
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                console.log(errorCode,errorMessage,email,credential)
                this.snacktext = 'Email นี้ถูกใช้ไปแล้ว'
                this.snackbar = true
            })
            
            e.preventDefault()
            
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
  height: 270px;
}
</style>