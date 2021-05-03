<template>
  <div>
    <portal to="report">
      <v-overlay value=""> </v-overlay>
    </portal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["show"],
  data() {
    return {};
  },
  methods: {
    invite() {},
  },
};
</script>
