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
      <v-list-item-group color="primary">
        <!-- main -->
        <template v-for="(item, index) in menus">
          <v-list-item :key="index" link :to="item.link">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      userMenu: [
        {
          icon: "mdi-home",
          label: "Home",
          link: "/user",
        },
        {
          icon: "mdi-calendar-arrow-right",
          label: "Schedule",
          link: "/user",
        },
        {
          icon: "mdi-folder-heart",
          label: "Your Stat",
          link: "/Stats",
        },
        {
          icon: "mdi-folder-multiple",
          label: "Attending Course",
          link: "/User/Course",
        },
      ],
      trainerMenu: [
        {
          icon: "mdi-home",
          label: "Home",
          link: "/TrainerHome",
        },
        {
          icon: "mdi-folder-multiple",
          label: "Course Managment",
          link: "/Course",
        },
        {
          icon: "mdi-calendar-text",
          label: "Table",
          link: "/Table",
        },
      ],
      common: [
        {
          icon: "mdi-cog",
          label: "Settings",
          link: "/ProfileSetting",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      userData: "userData",
      role: "userRole",
    }),
    menus() {
      return [
        ...(this.role == "trainer" ? this.trainerMenu : this.userMenu),
        ...this.common,
      ];
    },
  },
};
</script>
