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
                        v-model="userdata.BD"
                        max="2000-12-31"
                        min="1940-01-01"
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
                            :rules="index==0 ? checkimage:checkimage_size_only"
                            accept="image/png, image/jpeg, image/jpg"
                            :placeholder="'Certificate ' + (index==0?' (required)':' (optional)')"
                            filled
                            prepend-icon="mdi-camera"
                            dense
                            rounded
                            :disabled="index==0? false:(index==1? (checkurl.length == 0):(index==2? (checkurl.length <= 1):true))"
                            :required="index==0"
                            @change="onUpload($event, index),loading = true"
                            @click:clear="checkurl.pop()"
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
                      >เพิ่มข้อมูล</v-btn>
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

function personalID_check(id){
  let i=0, sum=0;
  for(i=0, sum=0; i < 12; i++)
    sum += parseFloat(id.charAt(i)) * (13 - i);
    if((11 - sum % 11) % 10 != parseFloat(id.charAt(12))){
      // console.log(sum);
      // console.log((11 - sum % 11) % 10);
      // console.log(id.charAt(12));
      console.log("wrong personal id!");
      return false;
    }
    console.log("this is personal id!");
    return true;
  
}

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
            value.match(/^[0-9]+$/) &&
          personalID_check(value)) ||
          "หมายเลขบัตรประชาชนต้องเป็นตัวเลข และ เท่ากับ 13 ตัว",
      ],

      AddressRule: [
        (value) => !!value || "โปรดกรอกฟิลด์นี้",
        (value) =>
          (value && value.length <= 100 && 
          (!value.match("\'") &&
           !value.match("\"") &&
          !value.match("#") &&
          !value.match("AND") &&
          !value.match("OR") &&
          !value.match("—") &&
          !value.match(";"))) ||
          "ที่อยู่ต้องไม่เกิน 100 ตัวอักษร และ ไม่มีอัขระพิเศษดังนี้ (\' \" # AND OR — ;)",
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
            value.match(/^[0-9]+$/) &&
            (value[0] == '0' && 
            value[1] == '6' || 
            value[1] == '8' ||
            value[1] == '9')) ||
          "เบอร์โทรศัพท์มือถือต้องมีเลขขึ้นต้นเป็น 06, 08, 09 และ มี 10 หลัก",
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
      checkurl:[],
      checkimage:[value => (value && (value.size /1024 /1024 < 4))  || 'คุณต้องใส่รูปภาพอย่างน้อย 1 รูป และ ไฟล์ไม่เกิน 4 MB'] ,
      checkimage_size_only : [value => !value || (value.size /1024 /1024 < 4) || 'คุณต้องใส่รูปภาพอย่างน้อย 1 รูป และ ไฟล์ไม่เกิน 4 MB'],
    };
  },
  methods: {
    async regissubmit(e) {
      // Vue.axios.post("https://jsonplaceholder.typicode.com/todos",this.userdata).then((response) => {
      // console.log(JSON.stringify(response.data))})
      this.loading = true;

      if (this.$refs.form.validate()) {
        console.log("validate");
        //let user = firebase.auth().currentUser
        let user = this.$store.getters["userData"].data;
        let uid = user.uid;

        let db = firebase.firestore();
        let userRef = db.collection("userData");

        let userData = await userRef.where("uid", "==", uid).get();///////หาเพื่อเอา doc.id
        let docId = null;
        
        userData.forEach((doc) => {
          docId = doc.id;
        });

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
          }).then(()=> {

            this.push_store_and_go(userRef,user,"/TrainerHome");//////////หาเพื่อเอาข้อมูลที่ update แล้วมา commit ลง vuex
            //console.log(this.userdata);
          })



        e.preventDefault();
      }else{
        this.loading = false;
      }

    },

    // Upload Picture method
    onUpload(e, index) {
      //this.loading = true;
      this.imageData[index] = e;
      this.checkurl.push(URL.createObjectURL(e));
      console.log(this.checkurl)
      this.picture[index] = null;
      const storageRef = firebase
        storageRef.storage()
        .ref(`${this.imageData[index].name}`)
        .put(this.imageData[index]).then(data => {
            data.ref.getDownloadURL().then(url => {
              this.picture[index] = url;
              console.log(this.imageData[index]);
              console.log(this.picture[index]);
              this.loading = false;
          });
        }).catch(error => {
            console.log(error);
            this.loading = false;
        });


      // storageRef.on(`state_changed`, () =>
      //   storageRef.snapshot.ref.getDownloadURL().then((url) => {
      //     this.picture[index] = url;
      //     // console.log(this.imageData[index]);
      //     // console.log(this.picture[index]);
      //   })
      // );

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
        });
        this.$router.push(taget);
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
