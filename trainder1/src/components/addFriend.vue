<template>
  <div>
    <v-btn icon fab color="white" class="vdoIcon ml-auto" @click="overlay = true">
      <v-icon>mdi-account-plus</v-icon>
    </v-btn>
    <portal to="report">
      <v-overlay z-index="20" :value="overlay">
        <v-card width="400" light>
          <v-card-title class="primary white--text text-center" primary-title>
            <v-icon class="white--text mr-3">mdi-account-plus</v-icon>
            Add Friend
            <v-spacer></v-spacer>
            <v-btn @click="overlay = false" text icon color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-3">
            <p class="text-h6">Please enter your friend Id</p>
            <v-text-field
              ref="uid1"
              color="info"
              :rules="[(value) => !!value || 'Required.']"
              label="id"
              outlined
              v-model="uid"
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="!ready" @click="addFriend" color="success">Add</v-btn>
          </v-card-actions>
        </v-card>
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
