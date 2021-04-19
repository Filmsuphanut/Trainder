<template>
  <v-app id="v-application">
    <link
      href="https://fonts.googleapis.com/css?family=Material+Icons"
      rel="stylesheet"
    />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style>
*{
  box-sizing: border-box !important;
}
[class*='col-'],[class*='row-']{
  padding: 0 !important;
}

</style>


<script>
//import Index from './views/index';

export default {
  name: "App",

  components: {
    //  Index,
  },

  data: () => ({
    //
  }),
};
</script>

<style scoped>
#v-application {
  background-color: #c3ffff;
}
</style>
