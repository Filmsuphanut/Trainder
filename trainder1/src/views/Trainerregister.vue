<template>
    <v-container>

    <br>
        <div class="bigbox">
        <v-row justify='start'>
        <v-btn to="/"><v-icon center>arrow_back_ios</v-icon></v-btn>
        </v-row>
        <br>
        <table class="tab" border="0">
            <tr><td width="35%" height="700px">
            <div class="box">
                <img src="../images/Logo.png"  align="center"><br><br>
            <v-form ref="form" @submit.prevent="regissubmit">

            

            <v-row justify='center'>
                <v-col>
                <v-text-field label="ชื่อจริง" :rules="checkdata" color="purple darken-2" v-model="userdata.firstname" required></v-text-field>
                <v-text-field label="นามสกุล" :rules="checkdata" v-model="userdata.lastname"></v-text-field>
                <v-text-field label="Email" :rules="checkdata" v-model="userdata.email"></v-text-field>
                <v-text-field label="รหัสผ่าน" :rules="passwordRules" type="password" v-model="userdata.pass"></v-text-field>
                <v-text-field label="ยืนยันรหัสผ่าน" :rules="confirmPasswordRules" type="password" v-model="cpass"></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-checkbox
                    v-model="checkbox"
                    required
                    @click.stop.prevent="dialog = true"
                    >
                <template v-slot:label>
                ฉันยอมรับ&nbsp;
                <a
                    href="#"
                    @click.stop.prevent="dialog = true"
                >กฎและข้อบังคับ</a>ของ Trainer
                </template>
                    </v-checkbox>
                </v-col>
            </v-row>
            
            <v-row justify='center'>
                <v-col class="text-right">
                <v-btn :disabled="!checkbox||loading" type="submit" :loading="loading" >สมัครสมาชิกเป็น Trainer</v-btn>    
                </v-col>
            </v-row>
                
            
            </v-form>
            </div>
            </td></tr>
            
        </table>
        </div>


        <v-dialog
            v-model="dialog"
            absolute
            max-width="400"
            persistent
            >
            <v-card>
                <v-card-title>
                กฎและข้อบังคับ
                </v-card-title>
                <v-card-text>
                <br>
                บลาบลาบลาบลาบลา

                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                <v-btn
                    text
                    @click="checkbox = false, dialog = false"
                >
                    ฉันไม่ยอมรับ
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    class="white--text"
                    color="green"
                    @click="checkbox = true, dialog = false"
                >
                    ฉันยอมรับ
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>

            <v-snackbar v-model="snackbar" :timeout="2000">
            {{snacktext}}

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

    </v-container>
</template>

<script>
//import axios from 'axios'
import firebase from 'firebase'

export default {
    name : 'Trainerregister',
    data(){
        return{
            userdata:{email: null,pass:null,firstname:null,lastname:null,user:false},
            cpass:null,
            
            passwordRules: [
                (value) => !!value || 'คุณยังไม่ได้ใส่รหัสผ่าน',
                (value) => (value && value.length >= 8) || 'รหัสผ่านต้องมากกว่าหรือเท่ากับ 8 ตัวอักษร',
            ],
            confirmPasswordRules: [
                (value) => !!value || 'โปรดกรอกรหัสผ่านอีกครั้ง',
                (value) =>
                value === this.userdata.pass || 'รหัสผ่านไม่ตรงกัน',
            ],
            checkdata:[val => (val || '').length > 0 || 'โปรดกรอกฟิลด์นี้'],

            checkbox:false,
            dialog:false,
            loading:false,
            snackbar:false,
            snackalert:{duplicate: 'Email นี้ถูกใช้ไปแล้ว',captcha: 'CAPTCHA ไม่ถูกต้อง'},
            snacktext:null,

        }
    },
    methods:{
        async regissubmit(e){

            if(this.$refs.form.validate()){

                    firebase.auth().createUserWithEmailAndPassword(this.userdata.email, this.userdata.pass)
                    .then((userCredential) => {
                        var user = userCredential.user
                        console.log(user)


                        
                        let db = firebase.firestore();
                        let userRef = db.collection("userData");

                            userRef.add({
                            fullName: [this.userdata.firstname, this.userdata.lastname].join(
                                " "),
                            role: "trainer",
                            uid: user.uid,
                            });

                        //this.$store.commit("setUid",user.uid)
                        this.$router.push('/TrainerSignIn')

                    })
                    .catch((error) => {
                        var errorCode = error.code
                        var errorMessage = error.message
                        console.log(errorCode,errorMessage)
                        this.snacktext = this.snackalert.false
                        this.snackbar = true
                    });

                e.preventDefault()


                // if(response.data === 'false'){
                //     this.snackbar = true
                //     this.snacktext = this.snackalert.duplicate
                // }else if(response.data === 'error'){
                //     this.snackbar = true
                //     this.snacktext = this.snackalert.captcha
                // }else{
                //     this.$router.push('/')
                // }

            }   
        }
    },

}
</script>


<style scoped>

.box {
background-color: rgb(255, 255, 255);
    border: 2px solid rgb(205, 205, 253); 
    padding: 5% 15% 10% 15%;
    border-radius: 10px;
    text-align: center;
     width: 100%;
    height: 100%;
      box-shadow:
  /* 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12); */

}
.bigbox{
    background-color: rgb(255, 255, 255);
    text-align: center;
     padding: 2% 2% 2% 2%;
    width:100%;
    height:100%;
    border: 2px solid rgb(152, 152, 255); 
    border-radius: 10px;
      box-shadow:
  0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12);
}

.tab{
  margin-left: auto;
  margin-right: auto;

}
</style>