<template>
  <v-toolbar>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title class="d-flex align-center">
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
    <v-btn icon>
      <v-icon>mdi-message</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-avatar>
            <v-img src="../images/hello.png"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-btn plain @click="logout">
          logout
        </v-btn>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import firebase from "firebase";

export default {
  methods: {
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
  }
}
</script>