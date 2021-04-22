<template>
  <div class="box2 text-center" width="300px" height="250px">
    <v-form id="userdata" ref="form" required @submit.prevent="loginsubmit">
      <v-text-field
        label="Email"
        :rules="checkdata"
        v-model="userdata.name"
      ></v-text-field>
      <v-text-field
        label="รหัสผ่าน"
        :rules="checkdata"
        type="password"
        required
        v-model="userdata.pass"
      ></v-text-field>
      <v-btn type="submit" :loading="loading" :disabled="loading"
        >เข้าสู่ระบบ</v-btn
      >
    </v-form>
    <v-btn :loading="loading" :disabled="loading" @click="signinpopup"
      >เข้าสู่ระบบด้วย Google</v-btn
    >
    <v-snackbar v-model="snackbar" :timeout="2000">
      {{ this.snacktext }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "login",
  data() {
    return {
      userdata: { name: null, pass: null },
      loading: false,
      snackbar: false,
      checkdata: [(val) => (val || "").length > 0 || "โปรดกรอกฟิลด์นี้"],
      snacktext: "",
    };
  },
  methods: {
    async loginsubmit(e) {
      ////////////////////////////////////////////////////////

      if (this.$refs.form.validate()) {
        this.loading = true;
        //const response = await axios.post('......',this.userdata)

        //console.log(this.userdata,response)

        firebase
          .auth()
          .signInWithEmailAndPassword(this.userdata.name, this.userdata.pass)
          .then((userCredential) => {
            var user = userCredential.user;
            //sessionStorage.setItem('name',JSON.stringify(this.userCredential.user.displayName))
            console.log(user);

            //เช็คว่าเป็น trainer หรือ user ปกติ
            this.getRole();
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            this.snacktext = "รหัสผ่านไม่ถูกต้อง";
            this.snackbar = true;
          });
        e.preventDefault();
      }
    },
    async signinpopup(e) {
      var provider = new firebase.auth.GoogleAuthProvider();

      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          //var credential = result.credential;
          //var token = credential.accessToken;
          var user = result.user;
          //console.log(credential,token,user.email)
          console.log(result);
          console.log(user.uid);
          //sessionStorage.setItem('name',JSON.stringify(this.userCredential.user.displayName))

          //Create user data and push to next page*************************************************
          this.CreateUserData(user);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
          console.log(errorCode, errorMessage, email, credential);
          this.snacktext = "เกิดข้อผิดพลาด";
          this.snackbar = true;
        });

      e.preventDefault();
    },

    async CreateUserData(user) {
      let db = firebase.firestore();
      let userRef = db.collection("userData");
      let userData = await userRef.where("uid", "==", user.uid).get();
      let docID = null;

      userData.forEach((doc) => {
        docID = doc.id;
      });

      console.log(docID);
      if (docID == null) {
        console.log("add");
        userRef.add({
          fullName: user.displayName,
          role: "normal",

          PersonalID: null,
          Address: null,
          Birthday: null,
          Gender: null,
          Career: null,
          PhoneNumber: null,
          EC_skill: null,
          Bank: null,
          BankAccountNumber: null,
          Purpose: null,
          profilePic:
            "https://firebasestorage.googleapis.com/v0/b/fir-b9dbd.appspot.com/o/people.jpg?alt=media&token=c73c8c03-fed9-4eda-a5d4-f2fb81a552f8",

          uid: user.uid,
        });
        this.$router.push("/register/auth");

        ///addTable
        let tableRef = db.collection("Table");
        tableRef.add({
          uid: user.uid,
        });

        this.addTable(user.uid, tableRef);
      } else {
        let userData = await db.collection("userData").where("uid", "==", user.uid).get();
        userData.forEach((doc) => {
          let form = {
            uid: doc.id,
            data: doc.data(),
          };
          this.$store.commit("setUserData", form);
        });

        this.$router.push("/user");
      }
    },

    async getRole() {
      let uid = firebase.auth().currentUser.uid;

      let db = firebase.firestore();
      let userRef = db.collection("userData");

      let userData = await userRef.where("uid", "==", uid).get();

      userData.forEach((doc) => {
        let role = doc.data().role;
        console.log(role);
        if (role === "trainer") {
          this.loading = false;
          this.$router.push("/TrainerHome");
        } else {
          this.loading = false;
          this.$router.push("/User");
        }
      });
    },
    async addTable(useruid, tableRef) {
      let userData = await tableRef.where("uid", "==", useruid).get();

      let docid = null;

      userData.forEach((doc) => {
        docid = doc.id;
        console.log(doc.id, "=>", doc.data());
      });

      tableRef
        .doc(docid)
        .collection("Event")
        .add({}); /////////////////////////////////รอแก้
    },
  },
};
</script>

<style scoped>
.box2 {
  border: 2px solid rgb(205, 205, 253);
  border-radius: 10px;
  padding: 25px 25px 25px 25px;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
  background-color: rgb(255, 255, 255);
  text-align: center;
  width: 300px;
  height: 270px;
}
</style>
