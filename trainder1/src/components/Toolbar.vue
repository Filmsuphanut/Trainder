<template>
  <v-toolbar class="elevation-0" style="z-index: 10; border: 0px">
    <v-toolbar-title
      style="cursor: pointer"
      @click="$router.push(role == 'trainer' ? '/TrainerHome' : '/user')"
      class="d-flex align-center"
    >
      <v-img
        alt="Trainder Logo"
        class="shrink mr-2"
        contain
        src="../images/Logo.png"
        transition="scale-transition"
        width="40"
      />
      <span>Trainder</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <span class="primary--text mx-4"
      ><span class="black--text">Your Friend Id : </span>{{ userData.uid }}</span
    >
    <chat-box-trainer v-if="role == 'trainer'" />
    <chat-box v-else />
    <noti-logs />
    <!-- <v-btn icon>
        <v-avatar>
            <v-img src="../images/hello.png"></v-img>
        </v-avatar>
      </v-btn> -->

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ml-3 primary" outlined icon v-bind="attrs" v-on="on">
          <v-avatar width="40">
            <v-img :src="$store.getters['userData'].data.profilePic"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list style="border: thin solid black" width="200">
        <v-list-item @click="$router.push('/ProfileSetting')">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import chatBox from "./chatBox.vue";
import firebase from "firebase";
import NotiLogs from "./noti_logs.vue";
import ChatBoxTrainer from "./chatBoxTrainer.vue";
import { mapGetters } from "vuex";

export default {
  components: { chatBox, NotiLogs, ChatBoxTrainer },
  data() {
    return {
      profile_image: "",
    };
  },
  computed: {
    ...mapGetters({
      role: "userRole",
      userData: "userData",
    }),
  },
  methods: {
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
  },
  async created() {
    await this.$store.dispatch("fetchNotication");
    await this.$store.dispatch("fetchFriends");
  },
};
</script>
