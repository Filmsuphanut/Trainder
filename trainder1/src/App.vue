<template>
  <v-app id="v-application">
    <link
      href="https://fonts.googleapis.com/css?family=Material+Icons"
      rel="stylesheet"
    />
    <v-main>
      <Toolbar v-if="$route.name!='Index' && $route.name!='/register'"></Toolbar>
      <router-view></router-view>
      <portal-target name="report"> </portal-target>
    </v-main>
  </v-app>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@400;500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400&display=swap");
* {
  /* font-family: 'Nunito', sans-serif !important; */
  box-sizing: border-box !important;
  /* font-family: 'Raleway', sans-serif; */
  font-family: "Noto Sans JP", sans-serif;
}
/* .col,.row,[class*='col-'],[class*='row-']{
  padding: 0 !important;
  margin: 0 !important;
} */
</style>

<script>
//import Index from './views/index';

import Toolbar from "./components/Toolbar.vue";

export default {
  name: "App",

  components: {
    Toolbar,
    //  Index,
  },

  data: () => ({
    //
  }),
};
</script>

<style scoped>
#v-application {
  /* background-color: #c3ffff; */
  background: white;
}
</style>
