<template>
    <v-container>

    <br>
        <div class="bigbox">
        <v-row justify='start'>
        <v-btn @click="back"><v-icon center>arrow_back_ios</v-icon></v-btn>
        </v-row>
        <br>
        <table class="tab" border="1">
            <tr><td width="620" height="700px">
            <div class="box">
                <img src="../images/Logo.png"  align="center"><br><br>

            <v-form ref="form" @submit.prevent="updateUserData">

                <table border="1">

                    Email
                        <v-text-field
                        label="Email"
                        :rules="checkdata"
                         v-model="userData.email"
                        :disabled="true"
                        ></v-text-field>

                        <v-text-field
                        label="firstname"
                        :rules="checkdata"
                         v-model="userData.firstname"
                        ></v-text-field>

                        <v-text-field
                        label="lastname"
                        :rules="checkdata"
                         v-model="userData.lastname"
                        ></v-text-field>

                        <v-text-field
                        label="personalID"
                        :rules="checkdata"
                         v-model="userData.personalID"
                        ></v-text-field>

                        <v-text-field
                        label="address"
                        :rules="checkdata"
                         v-model="userData.address"
                        ></v-text-field>            

                        <v-text-field
                        label="gender"
                        :rules="checkdata"
                         v-model="userData.gender"
                        ></v-text-field>  


                        <v-text-field
                        label="BD"
                        :rules="checkdata"
                         v-model="userData.BD"
                        ></v-text-field>  


                        <v-text-field
                        label="bank"
                        :rules="checkdata"
                         v-model="userData.bank"
                        ></v-text-field>  

                        <v-text-field
                        label="bankaccountNumber"
                        :rules="checkdata"
                         v-model="userData.bankaccountNumber"
                        ></v-text-field>  

                        <v-text-field
                        label="phone"
                        :rules="checkdata"
                         v-model="userData.phone"
                        ></v-text-field>  

                        <v-text-field
                        label="career"
                        :rules="checkdata"
                         v-model="userData.career"
                        ></v-text-field>  

                    <v-btn :disabled="loading" type="submit" :loading="loading">Update</v-btn>
                </table>
            </v-form>


            </div>
            </td></tr>
        </table>
        </div>

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

import firebase from 'firebase'

export default {
    name:"Setting",
    data(){
        return{
            userData:{
                email:null,
                firstname:null,
                lastname:null,
                personalID: null,
                address: null, 
                gender: null, 
                BD: null, 
                bank: null,
                bankaccountNumber: null,
                phone: null,
                career: null, 
                },

            checkdata: [(val) => (val || "").length > 0 || "โปรดกรอกฟิลด์นี้"],
            checkboxRule: [( ec_skill ) => (ec_skill || []).length > 0 || "โปรดเลือกอย่างน้อย 1 ในรายการนี้"],

            loading: false,
            snackbar: false,
            snackalert: "Email นี้ถูกใช้ไปแล้ว",
            snacktext: null,
        }
    },
    methods:{

        back(){
            let previous = this.$store.state.previous.pre
            this.$router.push(previous)
        },

        updateUserData(){
            console.log(this.userData)
        },

    },
    async mounted(){
            
            let uid = firebase.auth().currentUser.uid;
            console.log(uid)

            let db = firebase.firestore();
            let userRef = db.collection("userData");

            let userData = await userRef.where("uid", "==", uid).get();

            this.userData.email = firebase.auth().currentUser.email;

            userData.forEach(doc => {
                //console.log(doc.id, '=>', doc.data());
                this.userData.firstname = (doc.data().fullName == undefined? null:(doc.data().fullName).split(" ")[0] );
                this.userData.lastname = (doc.data().fullName == undefined? null:(doc.data().fullName).split(" ")[1]);
                this.userData.personalID = (doc.data().PersonalID == undefined? "ไม่มีข้อมูล กรุณาเพิ่มข้อมูล":doc.data().PersonalID);
                this.userData.address = (doc.data().Address == undefined? "ไม่มีข้อมูล กรุณาเพิ่มข้อมูล":doc.data().Address);
                this.userData.gender = (doc.data().Gender == undefined? "ไม่มีข้อมูล กรุณาเพิ่มข้อมูล":doc.data().Gender);
                this.userData.BD = (doc.data().Birthday == undefined? "ไม่มีข้อมูล กรุณาเพิ่มข้อมูล":doc.data().Birthday);
                this.userData.bank = (doc.data().Bank == undefined? "ไม่มีข้อมูล กรุณาเพิ่มข้อมูล":doc.data().Bank);
                this.userData.bankaccountNumber = (doc.data().BankAccountNumber == undefined? "ไม่มีข้อมูล กรุณาเพิ่มข้อมูล":doc.data().BankAccountNumber);
                this.userData.phone = (doc.data().PhoneNumber == undefined? "ไม่มีข้อมูล กรุณาเพิ่มข้อมูล":doc.data().PhoneNumber);
                this.userData.career = (doc.data().Career == undefined? "ไม่มีข้อมูล กรุณาเพิ่มข้อมูล":doc.data().Career);
            });
    }



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