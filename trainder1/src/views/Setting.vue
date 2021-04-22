<template>
  <v-container>
    <br />
    <div class="bigbox">
      <v-row justify="start">
        <v-btn @click="back"><v-icon center>arrow_back_ios</v-icon></v-btn>
      </v-row>
      <br />
      <table class="tab" border="0">
        <tr>
          <td width="700" height="700px">
            <div class="box">
              <v-form ref="form" @submit.prevent="updateUserData">
                <h1 align="left">ตั้งค่าบัญชีผู้ใช้</h1>
                <br />

                <table border="0">
                  <tr>
                    <td>
                      <img
                        :src="userData.profilePic"
                        align="left"
                        width="150"
                        height="150"
                        alt="Avatar"
                      /><br /><br />
                    </td>
                    <td width="50"></td>
                    <td>
                      <tr>
                        <td>
                          <v-text-field
                            label="Email"
                            v-model="userData.email"
                            :disabled="true"
                          ></v-text-field>
                        </td>
                      </tr>
                      <tr>
                        <td width="400">
                          <v-text-field
                            label="ชื่อ"
                            :rules="checkdata"
                            v-model="userData.firstname"
                            required
                          ></v-text-field>

                          <v-text-field
                            label="นามสกุล"
                            :rules="checkdata"
                            v-model="userData.lastname"
                            required
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
                  <tr>
                    <td colspan="1">สถานะผู้ใช้ : {{ userData.role }}</td>
                  </tr>
                </table>

                <br />
                <p align="left">ข้อมูลส่วนตัว</p>

                <v-text-field
                  label="เลขบัตรประจำตัวประชาชน"
                  :rules="personalIDRule"
                  v-model="userData.personalID"
                  required
                ></v-text-field>

                <v-select
                  :items="gen"
                  label="เพศ"
                  v-model="userData.gender"
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
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="userData.BD"
                    max="2000-12-31"
                    min="1940-01-01"
                    @change="this.$refs.menu.save(userData.BD)"
                  ></v-date-picker>
                </v-menu>

                <v-textarea
                  label="ที่อยู่"
                  v-model="userData.address"
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
                  v-model="userData.career"
                  :rules="checkdata"
                  required
                ></v-select>

                <v-text-field
                  label="โทรศัพท์ติดต่อ"
                  :rules="PhoneNumberRule"
                  v-model="userData.phone"
                  required
                ></v-text-field>

                <br />
                <p align="left">ข้อมูลทางการเงิน</p>

                <v-select
                  :items="banklist"
                  label="ธนาคาร"
                  v-model="userData.bank"
                  :disabled="!userData.bankaccountNumber == ''"
                ></v-select>

                <v-text-field
                  v-if="userData.bank"
                  label="หมายเลขบัญชีธนาคาร"
                  :rules="bankaccountNumberRule"
                  v-model="userData.bankaccountNumber"
                  required
                ></v-text-field>

                <v-select
                  :items="gen"
                  label="เพศ"
                  v-model="userData.gender"
                  required
                  :rules="checkdata"
                ></v-select>

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

                <br /><br />
                <v-btn :disabled="loading" type="submit" :loading="loading"
                  >Update</v-btn
                >
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
import firebase from "firebase";
export default {
  name: "Setting",
  data() {
    return {
      userData: {
        email: null,
        firstname: null,
        lastname: null,
        role: null,
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
        profilePic: "",
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
    };
  },
  methods: {
    back() {
      let previous = this.$store.state.previous.pre;
      this.$router.push(previous);
    },
    async updateUserData(e) {
      if (this.$refs.form.validate()) 
      {
        this.loading = true;
        let user = firebase.auth().currentUser;
        let uid = firebase.auth().currentUser.uid;
        console.log("called method");
        let db = firebase.firestore();
        let userRef = db.collection("userData");
        let userData = await userRef.where("uid", "==", uid).get();
        //let userData = await userRef.where("uid", "==", uid);
        let docId;
        userData.forEach((doc) => {
          console.log(doc);
          docId = doc.id;
        });
        let userDataRef = await userRef.doc(docId);
        userDataRef
          .update({
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
            console.log("update userProfile successfully !!");
            user.updateProfile({
              displayName: [
                this.userData.firstname,
                this.userData.lastname,
              ].join(" "),
            });
            console.log("update displayname successfully !!");
            this.snacktext = "อัพเดทข้อมูลผู้ใช้เรียบร้อย";
            this.snackbar = true;
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
    }
  },
  async mounted() {
    let uid = firebase.auth().currentUser.uid;
    console.log(uid);
    let db = firebase.firestore();
    let userRef = db.collection("userData");
    let userData = await userRef.where("uid", "==", uid).get();
    this.userData.email = firebase.auth().currentUser.email;
    userData.forEach((doc) => {
      //console.log(doc.id, '=>', doc.data());
      this.userData.firstname =
        doc.data().fullName == null ? null : doc.data().fullName.split(" ")[0];
      this.userData.lastname =
        doc.data().fullName == null ? null : doc.data().fullName.split(" ")[1];
      this.userData.role =
        doc.data().role == null
          ? null
          : doc.data().role == "trainer"
          ? "เทรนเนอร์"
          : "ผู้ใช้ทั่วไป";
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
  border: 2px solid rgb(205, 205, 253);
  padding: 5% 15% 10% 15%;
  border-radius: 10px;
  text-align: center;
  width: 100%;
  height: 100%;
  box-shadow: 2;
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