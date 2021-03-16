<template>
  <v-container>
    <br />

    <div class="bigbox">
      <v-row justify="start">
        <v-btn to="/"><v-icon center>arrow_back_ios</v-icon></v-btn>
      </v-row>
      <br />

      <table class="tab" border="0">
        <tr>
          <td width="35%" height="700px">
            <div class="box">
              <img
                src="../images/Logo.png"
                width="200"
                height="80"
                align="center"
              /><br /><br />

              <v-form ref="form" @submit.prevent="regissubmit">
                <v-row justify="center">
                  <v-col>
                    <v-text-field
                      label="อะไรก็ได้"
                      :rules="checkdata"
                      v-model="userdata.test"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col class="text-right">
                    <v-btn :disabled="loading" type="submit" :loading="loading"
                      >เพิ่มข้อมูล</v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <v-snackbar v-model="snackbar" :timeout="2000">
      {{ snacktext }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
//import axios from 'axios'
import firebase from "firebase";

export default {
  name: "Trainerregister",
  data() {
    return {
      userdata: {
          test:null,
      },
      cpass: null,

      passwordRules: [
        (value) => !!value || "คุณยังไม่ได้ใส่รหัสผ่าน",
        (value) =>
          (value && value.length >= 8) ||
          "รหัสผ่านต้องมากกว่าหรือเท่ากับ 8 ตัวอักษร",
      ],
      confirmPasswordRules: [
        (value) => !!value || "โปรดกรอกรหัสผ่านอีกครั้ง",
        (value) => value === this.userdata.pass || "รหัสผ่านไม่ตรงกัน",
      ],
      checkdata: [(val) => (val || "").length > 0 || "โปรดกรอกฟิลด์นี้"],

      checkbox: false,
      dialog: false,
      loading: false,
      snackbar: false,
      snackalert: {
        duplicate: "Email นี้ถูกใช้ไปแล้ว",
        captcha: "CAPTCHA ไม่ถูกต้อง",
      },
      snacktext: null,
    };
  },
  methods: {
    async regissubmit(e) {
      // Vue.axios.post("https://jsonplaceholder.typicode.com/todos",this.userdata).then((response) => {
      // console.log(JSON.stringify(response.data))})
      
      if (this.$refs.form.validate()) {

        let uid = firebase.auth().currentUser.uid;

        let db = firebase.firestore();
        let userRef = db.collection("userData");

        let userData = await userRef.where("uid", "==", uid).get();
        console.log(uid)


        userData.forEach((doc) => {
            let docId = doc.id
            userRef.doc(docId).update({
                testField : this.userdata.test
            })       
        });

        this.$router.push('/TrainerHome')


        // userRef.add({
        // fullName: [this.userdata.firstname, this.userdata.lastname].join(" "),
        // role: "normal",
        // uid: user.uid,
        // });

        ///เก็บไว้ใน database

        //     firebase.auth().createUserWithEmailAndPassword(this.userdata.email, this.userdata.pass)
        //     .then((userCredential) => {
        //         var user = userCredential.user
        //         console.log(user)
        //         this.$router.push('/')
        //     })
        //     .catch((error) => {
        //         var errorCode = error.code
        //         var errorMessage = error.message
        //         console.log(errorCode,errorMessage)
        //         this.snacktext = this.snackalert.false
        //         this.snackbar = true
        //     });

        e.preventDefault();
      }
    },
  },
};
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
  box-shadow: ;
  /* 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12); */
}
.bigbox {
  background-color: rgb(255, 255, 255);
  text-align: center;
  padding: 2% 2% 2% 2%;
  width: 100%;
  height: 100%;
  border: 2px solid rgb(152, 152, 255);
  border-radius: 10px;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
}

.tab {
  margin-left: auto;
  margin-right: auto;
}
</style>
