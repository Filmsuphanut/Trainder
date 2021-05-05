<template>
  <v-container>

        <br>
          <v-row justify="center">
            <v-card class="box" width="900" height="1850" >

              <v-form ref="form" @submit.prevent="updateUserData">
              
                <h2 align="left">บันทึกข้อมูลผู้ใช้ใหม่</h2>
                <br />

                <!-- <table border="1">
                  <tr>
                    <td>
                      <img
                        :src="userData.profilePic"
                        align="left"
                        width="150"
                        height="150"
                        alt="Avatar" >
                    </td>
                    <td width="50"></td>
                    <td>
                      <tr>
                        <td>
                          <v-text-field
                            label="Email"
                            v-model="userData.email"
                            :disabled="true"
                            outlined
                          ></v-text-field>
                        </td>
                      </tr>
                      <tr>
                        <td width="400">
                          <v-text-field
                            label="ชื่อ"
                            :rules="checkdata"
                            v-model="userData.firstname"
                            :disabled="true"
                            outlined
                          ></v-text-field>

                          <v-text-field
                            label="นามสกุล"
                            :rules="checkdata"
                            v-model="userData.lastname"
                            :disabled="true"
                            outlined
                          ></v-text-field>
                        </td>
                      </tr>
                    </td>
                  </tr>
                  <template>
                    
                    <v-file-input
                      prepend-icon="mdi-camera"
                      accept="image/png, image/jpeg, image/jpg"
                      label="เปลี่ยนรูปโปรไฟล์"
                      filled
                      dense
                      rounded
                      :rules="checkimage"
                      @change="onUpload($event)"
                      @click:clear="clearPic()"
                    ></v-file-input>

                  </template>
                </table> -->
              <v-row justify="start">
                <v-col cols="4">

                    <v-sheet color="white"  width="100"  height="40"></v-sheet>

                  <v-row justify="center">
                    <v-card rounded="xl">
                    <img :src="userData.profilePic"
                    align="left"
                    width="170"
                    height="170"
                    alt="Avatar">
                    </v-card>
                  </v-row>

                  <v-row justify="center">
                  <v-sheet color="white"  width="50"  height="20"></v-sheet>
                  </v-row>

                  <v-row justify="center">
                  <template>
                    <v-file-input
                      prepend-icon="mdi-camera"
                      accept="image/png, image/jpeg, image/jpg"
                      label="เปลี่ยนรูปโปรไฟล์"
                      filled
                      dense
                      rounded
                      :rules="checkimage"
                      @change="onUpload($event)"
                      @click:clear="clearPic()"
                    ></v-file-input>
                  </template>
                  </v-row>

                </v-col>

                <v-col cols="8">
                  <v-text-field
                    label="Email"
                    v-model="userData.email"
                    :disabled="true"
                    outlined
                    ></v-text-field>
                  <v-text-field
                    label="ชื่อ"
                    :rules="checkdata"
                    v-model="userData.firstname"
                    required
                    :disabled="true"
                    outlined                    
                    ></v-text-field>
                  <v-text-field
                    label="นามสกุล"
                    :rules="checkdata"
                    v-model="userData.lastname"
                    required
                    :disabled="true"
                    outlined
                    ></v-text-field>
                </v-col>
              </v-row>



                <br />
                <p align="left">ข้อมูลส่วนตัว</p>

                <v-text-field
                  label="เลขบัตรประจำตัวประชาชน"
                  :rules="personalIDRule"
                  v-model="userData.personalID"
                  required
                  outlined
                ></v-text-field>

                <v-select
                  :items="gen"
                  label="เพศ"
                  v-model="userData.gender"
                  required
                  :rules="checkdata"
                  outlined
                ></v-select>



                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                  value="userData.BD"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="userData.BD"
                      label="วันเกิด"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      required
                      :rules="checkdata"
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="userData.BD"
                    max="2000-12-31"
                    min="1940-01-01"
                  ></v-date-picker>
                </v-menu>

                <v-textarea
                  label="ที่อยู่"
                  v-model="userData.address"
                  color="blue"
                  :rules="AddressRule"
                  required
                  outlined
                >
                  <template v-slot:label>
                    <div>ที่อยู่ <small>(ต้องไม่เกิน 100 ตัว)</small></div>
                  </template>
                </v-textarea>
                <br />

                <v-select
                  :items="jobs"
                  label="อาชีพ"
                  v-model="userData.career"
                  :rules="checkdata"
                  required
                  outlined
                ></v-select>

                <v-text-field
                  label="โทรศัพท์ติดต่อ"
                  :rules="PhoneNumberRule"
                  v-model="userData.phone"
                  required
                  outlined
                ></v-text-field>

                <br />
                <p align="left">ข้อมูลทางการเงิน</p>

                <v-select
                  :items="banklist"
                  label="ธนาคาร"
                  v-model="userData.bank"
                  :disabled="!userData.bankaccountNumber == ''"
                  required
                  outlined
                ></v-select>

                <v-text-field
                  v-if="userData.bank"
                  label="หมายเลขบัญชีธนาคาร"
                  :rules="bankaccountNumberRule"
                  v-model="userData.bankaccountNumber"
                  required
                  outlined
                ></v-text-field>

                <!-- /////////   ///////// -->
                <br />
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
                  v-model="userData.purpose"
                  required
                  :rules="checkdata"
                  outlined
                ></v-select>
                <br />

                <p align="left" style="font-size:80%;">
                  ความถนัดในการออกกำลังกาย
                </p>

                <v-row align="center" justify="center">
                  <v-col cols="10" sm="6" md="6">
                    <v-checkbox
                      v-model="userData.ec_skill"
                      label="เวทเทรนนิ่ง"
                      value="เวทเทรนนิ่ง"
                      :rules="checkboxRule"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="userData.ec_skill"
                      label="แอโรบิค"
                      value="แอโรบิค"
                      :rules="checkboxRule"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="userData.ec_skill"
                      label="ออกกำลังกายทั่วไป"
                      value="ออกกำลังกายทั่วไป"
                      :rules="checkboxRule"
                    ></v-checkbox>
                  </v-col>

                  <v-col cols="10" sm="6" md="6">
                    <v-checkbox
                      v-model="userData.ec_skill"
                      label="โยคะ"
                      value="โยคะ"
                      :rules="checkboxRule"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="userData.ec_skill"
                      label="คาร์ดิโอ"
                      value="คาร์ดิโอ"
                      :rules="checkboxRule"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="userData.ec_skill"
                      label="อื่นๆ"
                      value="อื่นๆ"
                      :rules="checkboxRule"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <!-- /////////   ///////// -->
                <v-row justify="end">
                  <v-btn :disabled="loading" type="submit" :loading="loading">บันทึกข้อมูลผู้ใช้</v-btn>
                </v-row>
                
                
              </v-form>
            </v-card>
          </v-row>
          

<!-- snack -->
<!-- 
    <v-snackbar v-model="snackbar" :timeout="2000">
      {{ snacktext }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar> -->

  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "register2",
  data() {
    return {
      userData: {
        email: null,
        firstname: null,
        lastname: null,
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
        profilePic: null,

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
          (value && value.length <= 100 && !value.match("   ")) || "ที่อยู่ต้องไม่เกิน 100 ตัวอักษร และ spacbar ต้องน้อยกว่า 3 ตัว" ,
      ],

      bankaccountNumberRule: [
        (value) => !!value || "โปรดกรอกฟิลด์นี้",
        (value) =>
          (value &&
            (this.userData.bank == "ธนาคารออมสิน"
              ? value.length == 12
              : value.length == 10) &&
            value.match(/^[0-9]+$/)) ||
          // typeof parseInt(value) == "number" &&
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
        (ec_skill) =>
          (ec_skill || []).length > 0 || "โปรดเลือกอย่างน้อย 1 ในรายการนี้",
      ],

      loading: false,
      snackbar: false,
      snacktext: null,

      //Profile Picture
      profilePic: null,
      imageData: null,
      altPic: null,
      checkUrl: null,
      checkimage:[value => !value || (value.size < 2000000) || 'กรุณาอัพไฟล์ที่มีขนาดไม่เกิน 2 mb'] ,
      uploadimage:false,

////////////////////////////////////


    };
  },
  methods: {
    async updateUserData(e) {

      if (this.$refs.form.validate()) {
          console.log("function")
        this.loading = true;
        //let user = firebase.auth().currentUser
        let user = this.$store.getters["userData"].data;
        let uid = user.uid;

        console.log("called method");

        let db = firebase.firestore();
        let userRef = db.collection("userData");

        let userData = await userRef.where("uid", "==", uid).get();
        let docId;

        userData.forEach((doc) => {
          console.log(doc);
          docId = doc.id;
        });

        userRef.doc(docId).update({
            fullName: [this.userData.firstname, this.userData.lastname].join(
              " "
            ),
            PersonalID: this.userData.personalID,
            Address: this.userData.address,
            Birthday: this.userData.BD,
            Gender: this.userData.gender,
            Career: this.userData.career,
            PhoneNumber: this.userData.phone,
            EC_skill: this.userData.ec_skill,
            Bank: this.userData.bank,
            BankAccountNumber: this.userData.bankaccountNumber,
            Purpose: this.userData.purpose,
            profilePic: this.userData.profilePic,
            
          })
          .then(() => {
            console.log("save userProfile successfully !!");
            this.push_store_and_go(userRef,user,"/User");

            //////////////////////////////////////////////////////////
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log("update error : ", error);
          });
      }
      e.preventDefault();

      // {
      // });

      ///////////////////////////////////////////////
    },

    // Upload Picture method
    onUpload(e) {
      this.imageData = e;
      this.altPic = this.userData.profilePic;
      //this.checkurl.push(URL.createObjectURL(e));
      //console.log(this.checkurl);
      console.log("Uploading...");
      //this.picture = null;
      const storageRef = firebase
        storageRef.storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData).then(data => {
            data.ref.getDownloadURL().then(url => {
              this.userData.profilePic = url;
              console.log(this.userData.profilePic);
          });
        }).catch(error => {
            console.log(error);
        });
      // storageRef.on(`state_changed`, () =>
      //   storageRef.snapshot.ref.getDownloadURL().then((url) => {
      //     this.userData.profilePic = url;
      //     console.log(this.userData.profilePic);
      //     // console.log(this.imageData[index]);
      //     // console.log(this.picture[index]);
      //   })
      // );
    },

    clearPic() {
      console.log("Click Clear");
      console.log('picture url: ' + this.userData.profilePic);
      this.userData.profilePic = this.altPic;
      this.uploadimage = false;
      console.log(this.uploadimage);
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
//// end method

  async mounted() {
    //let uid = firebase.auth().currentUser.uid;
    let uid = this.$store.getters["userData"].data.uid;
    console.log(uid);

    let db = firebase.firestore();
    let userRef = db.collection("userData");

    let userData = await userRef.where("uid", "==", uid).get();

    this.userData.email = this.$store.getters["userData"].email//firebase.auth().currentUser.email;

    userData.forEach((doc) => {
      //console.log(doc.id, '=>', doc.data());
      this.userData.firstname =
        doc.data().fullName == null ? null : doc.data().fullName.split(" ")[0];
      this.userData.lastname =
        doc.data().fullName == null ? null : doc.data().fullName.split(" ")[1];
      this.userData.personalID = doc.data().PersonalID;
      this.userData.address = doc.data().Address;
      this.userData.gender = doc.data().Gender;
      this.userData.BD = doc.data().Birthday;
      this.userData.bank = doc.data().Bank;
      this.userData.bankaccountNumber = doc.data().BankAccountNumber;
      this.userData.phone = doc.data().PhoneNumber;
      this.userData.career = doc.data().Career;
      this.userData.ec_skill = doc.data().EC_skill;
      this.userData.purpose = doc.data().Purpose;
      this.userData.profilePic = doc.data().profilePic;
    });
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
