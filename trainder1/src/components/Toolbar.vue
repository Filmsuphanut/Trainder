<template>
  <v-toolbar>
    <v-toolbar-title
      style="cursor: pointer"
      @click="$router.push('/user')"
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
          <v-avatar>
            <v-img :src="$store.getters['userData'].data.profilePic"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list width="200">
        <v-btn plain @click="$router.push('/ProfileSetting')"> Profile Setting </v-btn>
        <br />
        <v-btn plain @click="logout"> logout </v-btn>
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
