<template>
  <v-container>

      <table class="tab" border="0">
        <tr>
          <td width="900" height="700px">
            <div class="box">
              <img
                src="../images/Logo.png"
                width="200"
                height="190"
                align="center"
              /><br /><br />

              <v-form ref="form" @submit.prevent="regissubmit">
                <v-row justify="center">
                  <v-col>
                    <v-text-field
                      label="ชื่อจริง"
                      :rules="checkdata"
                      color="purple darken-2"
                      v-model="userdata.firstname"
                      required
                    ></v-text-field>
                    <v-text-field
                      label="นามสกุล"
                      :rules="checkdata"
                      v-model="userdata.lastname"
                    ></v-text-field>
                    <v-text-field
                      label="Email"
                      :rules="checkdata"
                      v-model="userdata.email"
                    ></v-text-field>
                    <v-text-field
                      label="รหัสผ่าน"
                      :rules="passwordRules"
                      type="password"
                      v-model="userdata.pass"
                    ></v-text-field>
                    <v-text-field
                      label="ยืนยันรหัสผ่าน"
                      :rules="confirmPasswordRules"
                      type="password"
                      v-model="cpass"
                    ></v-text-field>
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
                        <a href="#" @click.stop.prevent="dialog = true"
                          >กฎและข้อบังคับ</a
                        >
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col class="text-right">
                    <v-btn
                      :disabled="!checkbox || loading"
                      type="submit"
                      :loading="loading"
                      rounded
                      color="primary"
                      >สมัครสมาชิก</v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </td>
        </tr>
      </table>


<!-- dialog -->

    <v-dialog v-model="dialog" absolute max-width="450" persistent>
      <v-card>
        <v-card-title>
          กฎและข้อบังคับ
        </v-card-title>
        <br>
        <v-card-text>

          <p>Trainder เป็นแอพพลิเคชั่นสำหรับหาคู่ออกกำลังกายออนไลน์ โดยใช้การ Live Video เป็นหลัก
          ซึ่งแอพพลิเคชั่นของเราจะให้อิสระกับผู้ใช้ในการใช้งานแอพของเรา
        แต่จะมีกฎและข้อบังคับต่างๆเล็กน้อยที่ควรทราบและปฎิบัติตาม เพื่อเสริมสร้างสังคมที่ดีของ Trainder ดังนี้</p>
        </v-card-text>

        <v-card-text>
          <body>1.ไม่แสดงพฤติกรรมที่หยาบคาย หรือ ไม่เป็นมิตรกับผู้อื่น ขณะ Live Video</body>
          <body>2.ไม่ทำการ Hate Speech กับผู้อื่นขณะทำการ Live Video</body>
          <body>3.ไม่แสดงออกพฤติกรรมที่เกี่ยวกับการ Sexually Harassment ขณะทำการ Live Video</body>
          <body>4.เพื่อปกป้องข้อมูลของท่าน กรุณาอย่าทำการบอกข้อมูลส่วนตัวให้กับคนแปลกหน้า</body>
          <body>5.ถ้าหากท่านพบเห็นการกระทำดังกล่าว กรุณาทำการ Report เพื่อเสริมสร้างสังคมของ Trainder ให้ดีขึ้น</body>


        </v-card-text>

        <v-card-text>
          <body>ข้อมูลส่วนบุคคลของท่านจะถูกเก็บเป็นความลับ ถ้าหากข้อมูลของท่านรั่วไหลจากตัวท่านเอง ทางแอพของเราจะไม่รับผิดชอบในทุกกรณี</body>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text @click="(checkbox = false), (dialog = false)">
            ฉันไม่ยอมรับ
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="white--text"
            color="green"
            @click="(checkbox = true), (dialog = false)"
          >
            ฉันยอมรับ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  name: "register",
  data() {
    return {
      userdata: {
        email: null,
        pass: null,
        firstname: null,
        lastname: null,
        user: true,
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
        true: "ลงทะเบียนสำเร็จแล้ว",
        false: "Email นี้ถูกใช้ไปแล้ว",
      },
      snacktext: null,

    };
  },
  methods: {
    async regissubmit(e) {
      //let rou = this.$router
      if (this.$refs.form.validate()) {
        //const response = await axios.post('todos',this.userdata)
        this.loading = true;     

        firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.userdata.email,
            this.userdata.pass
          )
          .then((userCredential) => {
            var user = userCredential.user;
            console.log(user);

            //firestore
            let db = firebase.firestore();
            let userRef = db.collection("userData");

            userRef.add({
            fullName: [this.userdata.firstname, this.userdata.lastname].join(" "),
            role: "normal",

            PersonalID: null, 
            Address: null , 
            Birthday: null , 
            Gender: null , 
            Career: null , 
            PhoneNumber: null ,
            EC_skill: null ,
            Bank: null ,
            BankAccountNumber: null ,
            Purpose: null,
            profilePic:"https://firebasestorage.googleapis.com/v0/b/fir-b9dbd.appspot.com/o/people.jpg?alt=media&token=c73c8c03-fed9-4eda-a5d4-f2fb81a552f8",
            
            uid: user.uid,
            });

            ///addTable
            let tableRef = db.collection("Table");
            tableRef.add({
                uid: user.uid,
              });

            this.addTable(user,tableRef)

            ////updateProfile
            user.updateProfile({
              displayName: [this.userdata.firstname, this.userdata.lastname].join(" "),
            })

            this.push_store_and_go(userRef,user,"/register/auth")

              //rou.push("/register/auth");///////////////////////
 


          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            this.snacktext = this.snackalert.false;
            this.snackbar = true;
            this.loading = false;
          });
        e.preventDefault();
      }
    },
    
    async addTable(user,tableRef){

        let userData = await tableRef.where("uid", "==", user.uid).get();

        let docid = null;

        userData.forEach(doc => {
          docid = doc.id;
          console.log(doc.id, '=>', doc.data());
        });

        tableRef.doc(docid).collection('Event').add({}); /////////////////////////////////รอแก้
    },
    async push_store_and_go(userRef,user,taget){//////////หาเพื่อเอาข้อมูลที่ update แล้วมา commit ลง vuex

        let userData = await userRef.where("uid", "==", user.uid).get();
          userData.forEach((doc) => {
            let form = {
              uid: doc.id,
              data: doc.data(),
              email: user.email,
          };
          this.$store.commit("setUserData", form);
        })
          console.log("save successfully !!");
          this.$router.push(taget)
    },

  },
};
</script>

<style scoped>
.box {
  background-color: rgb(255, 255, 255);
  border: 2px solid rgb(198, 66, 66);
  padding: 5% 15% 10% 15%;
  border-radius: 10px;
  text-align: center;
  width: 100%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
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
  border: 2px solid rgb(198, 66, 66);
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
