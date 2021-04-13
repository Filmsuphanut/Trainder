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
          <td width="620" height="700px">
            <div class="box">
              <img src="../images/Logo.png" align="center" /><br /><br />

              <v-form ref="form" @submit.prevent="regissubmit">
                <v-row justify="center">
                  <v-col>
                    <br />
                    <p align="left">ข้อมูลส่วนตัว</p>

                    <v-text-field
                      label="เลขบัตรประจำตัวประชาชน"
                      :rules="personalIDRule"
                      v-model="userdata.personalID"
                      required
                    ></v-text-field>

                    <v-select
                      :items="gen"
                      label="เพศ"
                      v-model="userdata.gender"
                      required
                      :rules="checkdata"
                    ></v-select>

                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                      value="userdata.BD"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="userdata.BD"
                          label="วันเกิด"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="checkdata"
                          required
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        ref="picker"
                        v-model="userdata.BD"
                        max="2000-12-31"
                        min="1940-01-01"
                        @change="this.$refs.menu.save(userdata.BD)"
                      ></v-date-picker>
                    </v-menu>

                    <v-textarea
                      label="ที่อยู่"
                      v-model="userdata.address"
                      color="blue"
                      :rules="AddressRule"
                      required
                    >
                      <template v-slot:label>
                        <div>ที่อยู่ <small>(ต้องไม่เกิน 100 ตัว)</small></div>
                      </template>
                    </v-textarea>
                    <br />

                    <v-select
                      :items="jobs"
                      label="อาชีพ"
                      v-model="userdata.career"
                      required
                      :rules="checkdata"
                    ></v-select>

                    <v-text-field
                      label="โทรศัพท์ติดต่อ"
                      :rules="PhoneNumberRule"
                      v-model="userdata.phone"
                      required
                    ></v-text-field>

                    <br /><br />
                    <p align="left">ข้อมูลเกี่ยวกับการออกกำลังกาย</p>

                    <br />
                    <v-select
                      :items="[
                        'ลดน้ำหนัก',
                        'เพิ่มกล้ามเนื้อ',
                        'หุ่นที่ดี',
                        'เพื่อสุขภาพ',
                      ]"
                      label="เป้าหมายในการออกกำลังกาย"
                      v-model="userdata.purpose"
                      required
                      :rules="checkdata"
                    ></v-select>

                    <br /><br />
                    <p align="left" style="font-size:80%;">
                      โปรดเลือกความถนัดในการออกกำลังกายของท่าน 1
                      อย่างในรายการนี้
                    </p>

                    <v-row align="center" justify="center">
                      <v-col cols="10" sm="6" md="6">
                        <v-checkbox
                          v-model="userdata.ec_skill"
                          label="เวทเทรนนิ่ง"
                          value="เวทเทรนนิ่ง"
                          :rules="checkboxRule"
                        ></v-checkbox>
                        <v-checkbox
                          v-model="userdata.ec_skill"
                          label="แอโรบิค"
                          value="แอโรบิค"
                          :rules="checkboxRule"
                        ></v-checkbox>
                        <v-checkbox
                          v-model="userdata.ec_skill"
                          label="ออกกำลังกายทั่วไป"
                          value="ออกกำลังกายทั่วไป"
                          :rules="checkboxRule"
                        ></v-checkbox>
                      </v-col>

                      <v-col cols="10" sm="6" md="6">
                        <v-checkbox
                          v-model="userdata.ec_skill"
                          label="โยคะ"
                          value="โยคะ"
                          :rules="checkboxRule"
                        ></v-checkbox>
                        <v-checkbox
                          v-model="userdata.ec_skill"
                          label="คาร์ดิโอ"
                          value="คาร์ดิโอ"
                          :rules="checkboxRule"
                        ></v-checkbox>
                        <v-checkbox
                          v-model="userdata.ec_skill"
                          label="อื่นๆ"
                          value="อื่นๆ"
                          :rules="checkboxRule"
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <!-- Upload Certificate -->

                    <br /><br />
                    <p align="left" style="font-size:80%;">
                      โปรดทำการอัพโหลดเกียรติบัตรที่เกี่ยวข้อง <br />
                      (ตัวอย่าง: เกียรติบัตรการจบการศึกษาสาขาวิทยาศาสตร์การกีฬา,
                      etc.)
                    </p>

                    <!-- Upload Certificate 1 [required] -->
                    <div>
                        <template v-for="(inp, index) in 3">
                          <v-file-input 
                            :key="index"
                            :rules="rules"
                            accept="image/png, image/jpeg, image/jpg"
                            :placeholder="'Certificate ' + (index==0?' (required)':' (optional)')"
                            filled
                            prepend-icon="mdi-camera"
                            dense
                            rounded
                            :required="index==1"
                            @change="onUpload($event, index)"
                          ></v-file-input>
                        </template>
                    </div>
                    <!-- Done Upload Certificate -->

                    <br /><br />
                    <p align="left">ข้อมูลทางการเงิน</p>

                    <v-select
                      :items="banklist"
                      label="ธนาคาร"
                      v-model="userdata.bank"
                      required
                      :rules="checkdata"
                      :disabled="!userdata.bankaccountNumber == ''"
                    ></v-select>

                    <v-text-field
                      v-if="userdata.bank"
                      label="หมายเลขบัญชีธนาคาร"
                      :rules="bankaccountNumberRule"
                      v-model="userdata.bankaccountNumber"
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
        personalID: null,
        address: null,
        gender: null,
        BD: null,
        bank: null,
        bankaccountNumber: "",
        phone: null,
        career: null,
        ec_skill: null,
        purpose: null,
      },

      gen: ["ชาย", "หญิง", "ไม่ระบุ"],
      banklist: [
        "ธนาคารกรุงเทพ",
        "ธนาคารกสิกรไทย",
        "ธนาคารกรุงไทย",
        "ธนาคารทหารไทย",
        "ธนาคารไทยพาณิชย์",
        "ธนาคารกรุงศรีอยุธยา",
        "ธนาคารออมสิน",
      ],
      jobs: ["ทำงานราชการ", "ทำงานเอกชน", "ทำอาชีพอิสระ"],

      personalIDRule: [
        (value) => !!value || "โปรดกรอกฟิลด์นี้",
        (value) =>
          (value &&
            value.length == 13 &&
            typeof parseInt(value) == "number" &&
            parseInt(value) >= 0) ||
          "หมายเลขบัตรประชาชนต้องเป็นตัวเลข และ เท่ากับ 13 ตัว",
      ],

      AddressRule: [
        (value) => !!value || "โปรดกรอกฟิลด์นี้",
        (value) =>
          (value && value.length <= 100) || "ที่อยู่ต้องไม่เกิน 100 ตัวอักษร",
      ],

      bankaccountNumberRule: [
        (value) => !!value || "โปรดกรอกฟิลด์นี้",
        (value) =>
          (value &&
            (this.userdata.bank == "ธนาคารออมสิน"
              ? value.length == 12
              : value.length == 10) &&
            value.match(/^[0-9]+$/)) ||
          //typeof parseInt(value) == "number" &&
          // parseInt(value) >= 0) ||
          "หมายเลขบัญชีธนาคารไม่ถูกต้อง",
      ],

      PhoneNumberRule: [
        (value) => !!value || "โปรดกรอกฟิลด์นี้",
        (value) =>
          (value &&
            value.length == 10 &&
            typeof parseInt(value) == "number" &&
            parseInt(value) >= 0) ||
          "เบอร์โทรศัพท์ต้องเป็นตัวเลข และ มี 10 หลัก",
      ],

      checkdata: [(val) => (val || "").length > 0 || "โปรดกรอกฟิลด์นี้"],
      checkboxRule: [
        (ec_skill) => (ec_skill || []).length > 0 || "โปรดเลือก 1 ในรายการนี้",
      ],

      loading: false,
      snackbar: false,
      snackalert: "Email นี้ถูกใช้ไปแล้ว",
      snacktext: null,

      // Upload Picture Variables
      picture: [null, null, null],
      imageData: [null, null, null],
    };
  },
  methods: {
    async regissubmit(e) {
      // Vue.axios.post("https://jsonplaceholder.typicode.com/todos",this.userdata).then((response) => {
      // console.log(JSON.stringify(response.data))})
      this.loading = true;
      if (this.$refs.form.validate()) {
        let uid = firebase.auth().currentUser.uid;

        let db = firebase.firestore();
        let userRef = db.collection("userData");

        let userData = await userRef.where("uid", "==", uid).get();
        console.log(uid);

        userData.forEach((doc) => {
          let docId = doc.id;
          userRef.doc(docId).update({
            PersonalID: this.userdata.personalID,
            Address: this.userdata.address,
            Birthday: this.userdata.BD,
            Gender: this.userdata.gender,
            Career: this.userdata.career,
            PhoneNumber: this.userdata.phone,
            EC_skill: this.userdata.ec_skill,
            Bank: this.userdata.bank,
            BankAccountNumber: this.userdata.bankaccountNumber,
            Purpose: this.userdata.purpose,
            cert1: this.picture[0],
            cert2: this.picture[1],
            cert3: this.picture[2],
          });
        });

        this.$router.push("/TrainerHome");

        console.log(this.userdata);

        //ไม่เกี่ยว

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
      this.loading = false;
    },

    test() {
      console.log(parseInt(this.userdata.personalID) <= 0);
    },

    // Upload Picture method
    onUpload(e, index) {
      this.imageData[index] = e;
      this.picture[index] = null;
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData[index].name}`)
        .put(this.imageData[index]);
      storageRef.on(`state_changed`, () =>
        storageRef.snapshot.ref.getDownloadURL().then((url) => {
          this.picture[index] = url;
          console.log(this.imageData[index]);
          console.log(this.picture[index]);
        })
      );
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
  box-shadow: 20;
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

.unstyled,
.v-input
  > .v-input-control
  > .v-input-slot
  > .v-text-field__slot
  > input
  > ::-webkit-inner-spin-button,
::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
</style>
