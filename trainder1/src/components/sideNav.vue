<template>
  <v-navigation-drawer class="elevation-3" style="z-index: 10" app>
    <v-sheet class="pa-4 text-center">
      <v-avatar class="mb-4" size="80">
        <v-img :src="userData.data.profilePic"></v-img>
      </v-avatar>
      <div>Welcome back!</div>
      <h3 class="primary--text">{{ userData.data.fullName }}</h3>
    </v-sheet>
    <v-divider></v-divider>

    <v-list>
      <v-subheader>What's up going?</v-subheader>
      <v-list-item-group color="primary">
        <!-- main -->
        <v-list-item link to="/user">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

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

        <v-list-item link to="/ProfileSetting">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      userData: "userData",
    }),
  },
};
</script>
