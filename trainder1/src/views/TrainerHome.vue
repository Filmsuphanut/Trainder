<template>
  <div id="UserHome">
    <v-container class="pa-0 primary" fluid>
      <v-sheet class="pb-5 white d-flex flex-row">
        <v-card
          class="rounded-b-pill pr-0 text-right d-flex flex-column justify-center align-end"
          elevation="0"
        >
          <v-spacer></v-spacer>
          <p class="text-h2" style="line-height: 1.2">
            Together we stand <br />
            <span class="font-weight-bold info--text">All for One <br /> </span>
            And <span class="font-weight-bold info--text"> One for all! </span>
            <!-- <span class="font-weight-bold info--text">Helping </span>
            Create
            <span class="font-weight-bold info--text">Healthy </span>
            Habits -->
          </p>
          <v-btn
            color="success"
            class="pa-8 elevation-0 rounded-lg"
            style="font-size: 1rem"
            to="/Course"
            >สร้างคอร์สของคุณ</v-btn
          >
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
        </v-card>
        <v-spacer></v-spacer>
        <v-img style="max-width: 50%" src="../images/trainerhome.jpg"></v-img>
      </v-sheet>
      <v-sheet height="100px" class="white"> </v-sheet>

      <!-- Courses in Progress -->
      <v-sheet class="transparent" style="position: relative">
        <v-card
          width="500"
          class="pa-5 ma-0 d-flex flex-row rounded-l-xl"
          elevation="6"
          style="position: absolute; top: -70px; right: 0"
        >
          <v-col cols="3" class="text-center my-auto">
            <h1 id="huge" class="ml-3">{{ course.length }}</h1>
          </v-col>
          <v-col cols="3" class="my-auto">
            <h3>คอร์ส</h3>
            <span>ที่รับผิดชอบ </span>
          </v-col>
          <v-col class="text-center my-auto">
            <v-btn rounded dark color="primary" class="mt-4" to="/Course">
              ดูคอร์สของคุณ
            </v-btn>
          </v-col>
        </v-card>
        <!-- Buttons -->
        <v-sheet height="100" style="visibility: hidden"> </v-sheet>
        <v-sheet class="transparent pa-5 d-flex flex-row justify-center">
          <v-card
            class="justify-center mx-3 pa-0 text-center"
            width="350"
            link
            elevation="6"
            @click="createRoom"
          >
            <v-img contain src="../images/friend2.jpg" height="200px"></v-img>
            <p class="text-h5">ออกกำลังกายกับเพื่อนของคุณ</p>
            <v-card-subtitle class="pa-5 black--text">
              เข้าสู่เซสชันวิดีโอคอลส่วนตัวกับเพื่อนหรือเทรนเนอร์ของคุณ
            </v-card-subtitle>
          </v-card>

          <v-card
            class="justify-center mx-3 pa-0 text-center"
            width="350"
            link
            elevation="6"
            to="/vdoc"
          >
            <v-img contain src="../images/people3.jpg" height="200px"></v-img>
            <p class="text-h5">ค้นหาเพื่อนรอบโลก</p>
            <v-card-subtitle class="pa-5 black--text">
              สนุกไปกับการออกกำลังกายผ่านวิดีโอคอลกับเพื่อนใหม่รอบโลก</v-card-subtitle
            >
          </v-card>

          <v-card
            class="justify-center mx-3 pa-0 text-center"
            width="350"
            link
            elevation="6"
            to="/Table"
          >
            <v-img contain src="../images/schedule.jpg" height="200px"></v-img>
            <p class="text-h5">วางแผนการออกกำลังกาย</p>
            <v-card-subtitle class="pa-5 black--text">
              ตรวจสอบตารางออกกำลังของคอร์สเรียนที่กำลังดำเนินการอยู่</v-card-subtitle
            >
          </v-card>
        </v-sheet>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";

export default {
  name: "index",
  data() {
    return {
      profile_image: "",
    };
  },
  computed: {
    ...mapGetters({
      userData: "userData",
      course: "course",
    }),
  },
  methods: {
    callname() {
      ////หาชื่อ user

      //let user = firebase.auth().currentUser;
      let user = this.$store.getters["userData"];

      // let db = firebase.firestore()
      // let userRef = db.collection("userData");
      // let userData = await userRef.where("uid","==",user.data.uid).get();

      // userData.forEach(doc => {
      this.profile_image = this.$store.getters["userData"].data.profilePic;
      // })

      //console.log(test.data.fullName)

      // var admin = require('firebase-admin');
      // const uid = user.uid;
      // console.log(uid)

      // admin
      // .auth()
      // .createCustomToken(uid)
      // .then((customToken) => {
      //     console.log(customToken)

      // })
      // .catch((error) => {
      //     console.log('Error creating custom token:', error);
      // });

      //vm.commit("setToken",idToken)

      return user.data.fullName;

      //else{

      //let token = vm.state.user.token
      //console.log('else + ' + token)

      // firebase.auth().signInWithCustomToken(token)
      // .then((userCredential) => {
      //     // Signed in
      //     var user = userCredential.user;
      //     console.log(user)
      //     return user.displayName
      //     // ...
      // })
      // .catch((error) => {
      //     var errorCode = error.code;
      //     var errorMessage = error.message;
      //     console.log(errorCode,errorMessage)
      // });

      //}

      //********************************************
    },

    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          console.log("logout");
          this.$router.push("/");
          this.$store.dispatch("logout");
        })
        .catch((error) => {
          // An error happened.
          console.log(error);
        });
    },

    // setPrevious() {
    //   if (this.$store.state.previous.pre !== "/User") {
    //     this.$store.commit("setPreviousPage", "/User");
    //   }
    // },
    createRoom() {
      this.$router.push(`/custom-vdoc/new-room`);
    },
  },
  mounted() {
    //this.setPrevious();
    this.$store.dispatch("getTableEvents");
    this.$store.dispatch("fetchCourse");
  },
};
</script>

<style scoped>
.v-card {
  margin: 16px;
  padding: 16px;
}
.routerLink {
  text-decoration: none;
}
#huge {
  font-size: 50px;
}
</style>
