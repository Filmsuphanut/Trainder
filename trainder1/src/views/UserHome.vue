<template>
  <div id="UserHome">
    <v-container id="ModeSelector" class="mx-auto">
      <v-row class="mx-auto">
        <!-- Hello User -->
        <v-col cols="6">
          <v-card rounded="xl">
            <v-row>
              <v-col cols="7">
                <v-card-title>
                  <h5>Hello {{ callname() }}!</h5>
                </v-card-title>
                <v-card-subtitle>
                  It's good to see you again.
                </v-card-subtitle>
                <v-card-subtitle class="font-weight-bold primary--text">
                  Your Friend Id : {{userData.uid}}
                </v-card-subtitle>
              </v-col>
              <v-col cols="5" class="">
                <v-img
                  src="../images/hello.png"
                  max-height="250"
                  max-width="150"
                ></v-img>
              </v-col>
            </v-row>
          </v-card>
          <!-- Profile Settings -->
          <v-card style="cursor:pointer" class="rounded-lg" @click="$router.push('/ProfileSetting')" >
            <v-row>
              <v-col cols="6" class="pl-5">
                <h2  >
                  Profile Setting
                </h2>
              </v-col>
              <!-- <v-col v-for="button in buttons" :key="button" cols="2">
                <v-btn fab small dark :color=button.color>
                  <v-icon>{{button.icon}}</v-icon>
                </v-btn>
              </v-col> -->
            </v-row>
          </v-card>
          <v-row justify="space-between">
            <!-- Remaining Task-->
            <v-col>
              <v-card class="text-center" rounded="xl">
                <h1 class="ma-4">11</h1>
                <h3>Your Task</h3>
                <span>Weight Training</span>
              </v-card>
            </v-col>
            <!-- Courses in Progress -->
            <v-col>
              <v-card class="text-center" rounded="xl">
                <h1 class="ma-4">3</h1>
                <h3>Courses</h3>
                <span>in progress </span>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <!-- Buttons -->
          <v-row>
            <v-btn
              rounded
              large
              block
              class="mt-7 pa-10"
              color="primary"
              to="/User/FindTrainer"
            >
              <h3>Excercise With Trainer</h3>
            </v-btn>
          </v-row>
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
            <v-col cols="6">
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
            </v-col>
            <v-col cols="6">
              <v-btn
                rounded
                block
                large
                class="mt-6 pa-10"
                color="primary"
                to="/Stats"
              >
                <h3>Your Stat</h3>
              </v-btn>
            </v-col>
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
import {mapGetters} from 'vuex'

export default {
  name: "index",
  data() {
    return {
      buttons: [
        {
          icon: "mdi-facebook",
          color: "indigo",
        },
        {
          icon: "mdi-twitter",
          color: "cyan",
        },
        {
          icon: "mdi-instagram",
          color: "pink",
        },
      ],
    };
  },
  computed : {
    ...mapGetters({
      userData : "userData"
    })
  },
  methods: {
    callname() {
      ////หาชื่อ user

      //let user = firebase.auth().currentUser;
      let user = this.$store.getters["userData"];


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
          this.$store.dispatch("logout")
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
      this.$router.push(`/custom-vdoc/new-room`)
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
</style>
