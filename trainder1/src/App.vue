<template>
  <v-app id='v-application'>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
//import Index from './views/index';

export default {
  name: 'App',

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