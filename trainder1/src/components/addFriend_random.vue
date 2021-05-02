<template>
  <div>
    <v-btn
      outlined
      icon
      fab
      color="primary"
      class="vdoIcon ml-auto"
      @click="overlay = true"
    >
      <v-icon>mdi-account-plus</v-icon>
    </v-btn>
    <portal to="report">
      <v-overlay z-index="20" :value="overlay">
        <v-progress-circular indeterminate size="200">Processing...</v-progress-circular>
      </v-overlay>
    </portal>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      overlay: false,
      ready: true,
      uid: "",
    };
  },
  computed: {
    ...mapGetters({
      userData: "userData",
    }),
  },
  methods: {
    async addFriend() {
      this.ready = false;
      if (this.uid) {
        console.log(`${process.env.VUE_APP_ENDPOINT}/addFriend`);
        try {
          let res = await axios.post(`${process.env.VUE_APP_ENDPOINT}/addFriend`, {
            id1: this.userData.uid,
            id2: this.uid,
          });
          alert("Done");
          await this.$store.dispatch("fetchFriends");
          this.overlay = false;
        } catch (err) {
          alert(err);
        }
      } else {
        this.$refs["uid1"].validate(true);
      }
      this.ready = true;
    },
  },
};
</script>
