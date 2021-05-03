<template>
  <div>
    <v-navigation-drawer app>
      <v-sheet color="grey lighten-4" class="pa-4 text-center">
        <v-avatar class="mb-4" size="100">
          <v-img :src="profile_image"></v-img>
        </v-avatar>

        <div>Welcome back!</div>
        <h3>{{callname()}}</h3>
        <br>
        <span>Your Friend Id : {{ userData.uid }}</span>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-subheader>What's up going?</v-subheader>
        <v-list-item-group color="primary">
          <!-- Schedule -->
          <v-list-item link to="/Table">
            <v-list-item-icon>
              <v-icon>mdi-calendar-arrow-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Schedule</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- Your stat -->
          <v-list-item link to="/Stats">
            <v-list-item-icon>
              <v-icon>mdi-folder-heart</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Your Stat</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- Attending Course -->
          <v-list-item link to="/User/Course">
            <v-list-item-icon>
              <v-icon>mdi-folder-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Attending Course</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-container class="pt-2 px-6" fluid>
      <v-flex class="d-flex flex-row justify-center" width="70%">
        <v-carousel
          cycle
          hide-delimiter-background
          show-arrows-on-hover
          height="350"
        >
          <v-carousel-item
            v-for="(slide, i) in slides"
            :key="i"
            :src="slide.src"
          >
          </v-carousel-item>
        </v-carousel>
      </v-flex>
      <v-divider></v-divider>

      <!-- Exercise Mode -->
      <v-flex class="d-flex flex-row justify-center mt-4">
        <span style="font-size:25px; font-family:verdana">Excercise Mode</span>
      </v-flex>
      <v-flex class="d-flex flex-row justify-center ma-5">
        <v-card class="justify-center mx-3" max-width="300" link elevation="6" @click="createRoom">
          <v-img src="../images/friend.png" height="200px"></v-img>
          <v-card-title>
            With Friend
          </v-card-title>
          <v-card-subtitle>
            Video call with your friends at once
          </v-card-subtitle>
        </v-card>

        <v-card class="justify-center mx-3" max-width="300" link elevation="6" to="/vdoc">
          <v-img src="../images/withpeople.jpg" height="200px"></v-img>
          <v-card-title>
            With People
          </v-card-title>
          <v-card-subtitle>
            Having fun exercise with random people
          </v-card-subtitle>
        </v-card>
      </v-flex>
      <v-divider></v-divider>

      <!-- looking for trainer -->
      <v-flex class="d-flex flex-row justify-center mt-4 ml-8">
        <span style="font-size:25px; font-family:verdana"
          >Looking for Trainer?</span
        >
      </v-flex>
      <v-flex class="d-flex flex-row justify-center ma-5">
        <v-card class="justify-center mx-3" link max-width="57%" elevation="6" to="User/FindTrainer">
          <div class="d-flex flex-row">
            <v-img
              src="../images/Slide4.jpg"
              max-height="200"
              max-width="50%"
            ></v-img>
            <div class="d-flex flex-column">
              <v-card-title>
                Find Trainer
              </v-card-title>
              <v-card-subtitle>
                Choose your own Trainer that suits you
              </v-card-subtitle>
            </div>
          </div>
        </v-card>
      </v-flex>
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
#huge {
  font-size: 50px;
}
</style>
