<template>
  <div id="UserHome">
    <v-container id="ModeSelector" class="mx-auto">
      <v-row class="mx-auto">
        <v-col cols="6">
          <!-- Hello User -->
          <v-card rounded="xl" elevation="6">
            <v-row justify="center">
              <v-col cols="7">
                <v-card-title>
                  <h5>Hello {{ callname() }}!</h5>
                </v-card-title>
                <v-card-subtitle>
                  It's good to see you again.
                </v-card-subtitle>
                <v-card-subtitle class="font-weight-bold primary--text">
                  Your Friend Id : {{ userData.uid }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="5" class="">
                <!-- <v-card class="pa-0 ma-0" rounded="circle" flat>
                  <v-img
                    :src="profile_image"
                    max-height="150"
                    max-width="150"
                  ></v-img>
                </v-card> -->
                  <v-row justify="center">
                    <v-card rounded="circle" flat>
                    <img :src="profile_image"
                    align="left"
                    width="150"
                    height="150"
                    alt="Avatar">
                    </v-card>
                  </v-row>
              </v-col>
            </v-row>
          </v-card>
          <!-- Courses in Progress -->
          <v-card rounded="xl" class="pa-5 mt-6" elevation="6">
            <v-row>
              <v-col cols="2" class="d-flex">
                <h1 id="huge" class="ml-3">3</h1>
              </v-col>
              <v-col cols="5" class="mt-3">
                <h3>Courses</h3>
                <span>in charge </span>
              </v-col>
              <v-spacer></v-spacer>
              <v-col>
                <v-btn rounded dark color="primary" class="mt-4" to="/Course">
                  view your course
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="6">
          <!-- Buttons -->
          <v-row>
            <v-btn
              rounded
              large
              block
              class="mt-6 pa-10"
              color="primary"
              to="/vdoc"
            >
              <h3>Excercise With People</h3>
            </v-btn>
          </v-row>
          <v-row>
            <v-btn
              rounded
              large
              block
              class="mt-6 pa-10"
              color="primary"
              @click="createRoom"
            >
              <h3>Excercise With Your Friend</h3>
            </v-btn>
          </v-row>
          <v-row>
              <v-btn
                rounded
                block
                large
                class="mt-6 pa-10"
                color="primary"
                to="/Table"
              >
                <h3>Table</h3>
              </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <!-- <v-container>
        <h1>สวัสดี </h1>
        <router-link to="/Excercise"><v-btn>ออกกำลังกายกับผู้อื่น</v-btn></router-link>
        <router-link to="/User/FindTrainer"><v-btn>ค้นหา Trainer ที่ถูกใจ</v-btn></router-link>
        <router-link to="/CreateRoom"><v-btn>สร้างห้องออกกำลังกายกับเพื่อน</v-btn></router-link>
        <router-link to="/ProfileSetting" ><v-btn>ตั้งค่าบัญชีผู้ใช้</v-btn></router-link>
        <router-link to="/User/Table" ><v-btn>Table</v-btn></router-link>
        <v-btn @click="logout">ออกจากระบบ</v-btn>
    </v-container> -->
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";

export default {
  name: "index",
  data() {
    return {
      profile_image:"",

    };
  },
  computed: {
    ...mapGetters({
      userData: "userData",
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
          this.$store.dispatch("logout");
          this.$router.push("/");
        })
        .catch((error) => {
          // An error happened.
          console.log(error);
        });
    },

    setPrevious() {
      if (this.$store.state.previous.pre !== "/User") {
        this.$store.commit("setPreviousPage", "/User");
      }
    },
    createRoom() {
      this.$router.push(`/custom-vdoc/new-room`);
    },
  },
  mounted() {
    this.setPrevious();
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
#huge{
  font-size: 50px;
}
</style>
