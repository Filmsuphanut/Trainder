<template>
  <div>
    <v-container class="pa-0 primary" fluid>
      <!-- <v-flex class="d-flex flex-row justify-center" width="70%">
        <v-carousel cycle hide-delimiter-background show-arrows-on-hover height="350">
          <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.src">
          </v-carousel-item>
        </v-carousel>
      </v-flex>
      <v-divider></v-divider> -->
      <v-sheet
        style="border-bottom-left-radius: 20%; border-bottom-right-radius: 20%"
        class="white d-flex flex-row"
      >
        <v-card
          class="rounded-b-pill text-right d-flex flex-column justify-center align-end"
          elevation="0"
        >
          <v-spacer></v-spacer>
          <p class="text-h2" style="line-height: 1.2">
            Make Your
            <br />
            <span class="font-weight-bold info--text"> Perfect Body</span>
            <br />
            With The Trainer
            <span class="font-weight-bold info--text">your choice. </span>
          </p>
          <v-btn
            color="success"
            class="pa-8 elevation-0 rounded-lg"
            style="font-size: 1rem"
            to="User/FindTrainer"
            >Find Your Trainer Now!</v-btn
          >
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
        </v-card>
        <v-spacer></v-spacer>
        <v-img
          class="rounded-b-pill"
          style="max-width: 50%"
          src="../images/trainer.jpg"
        ></v-img>
      </v-sheet>

      <!-- Exercise Mode -->
      <v-flex class="d-flex flex-row justify-center mt-4">
        <span style="font-size: 2rem" class="white--text">Many way to Exercise</span>
      </v-flex>
      <v-sheet class="pa-5 primary d-flex flex-row justify-center">
        <v-card
          class="justify-center mx-3 pa-0 text-center"
          width="350"
          link
          elevation="6"
          @click="createRoom"
        >
          <v-img contain src="../images/friend2.jpg" height="200px"></v-img>
          <p class="text-h5">Exercise With Friend</p>
          <v-card-subtitle class="pa-5 black--text">
            Invite your friend or your trainer to a private Video call session.
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
          <p class="text-h5">Explore People</p>
          <v-card-subtitle class="pa-5 black--text">
            Having fun exercise with people around the world.</v-card-subtitle
          >
        </v-card>

        <v-card
          class="justify-center mx-3 pa-0 text-center"
          width="350"
          link
          elevation="6"
          to="/User/Course"
        >
          <v-img contain src="../images/schedule.jpg" height="200px"></v-img>
          <p class="text-h5">Plan Your Body</p>
          <v-card-subtitle class="pa-5 black--text">
            Checkout your schedule if you already Enroll to a course.</v-card-subtitle
          >
        </v-card>
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
      slides: [
        { src: require("../images/Course1.jpg") },
        { src: require("../images/Course2.jpg") },
        { src: require("../images/Course3.jpg") },
        { src: require("../images/Course4.jpg") },
      ],
      profile_image: "",
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
    this.$store.dispatch("getTableEvents");
    this.$store.dispatch("fetchUser_course");
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
