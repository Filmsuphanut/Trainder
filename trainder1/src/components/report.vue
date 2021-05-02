<template>
  <div>
    <v-btn
      :loading="!ready"
      @click="show = true"
      outlined
      icon
      fab
      style="background: white"
      color="primary"
      class="vdoIcon ml-auto"
    >
      <v-icon>mdi-flag</v-icon>
    </v-btn>

    <portal to="report">
      <v-overlay z-index="20" :value="show">
        <v-card width="400" light>
          <v-card-title class="primary white--text text-center" primary-title>
            <v-icon class="white--text mr-3">mdi-alert</v-icon>
            Report
            <v-spacer></v-spacer>
            <v-btn @click="show = false" text icon color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-3">
            <p class="text-h6">Please inform us the details.</p>
            <p>User : {{ user.target }}</p>
            <v-textarea
              outlined
              label="Details"
              color="info"
              v-model="msg"
              hide-details
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="!ready" @click="report" color="error"
              >Report this user</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-overlay>
    </portal>
  </div>
</template>

<script>
export default {
  props: ["user"],
  data() {
    return {
      ready: true,
      msg: "",
      show: false,
    };
  },
  methods: {
    async report() {
      this.ready = false;
      let res = await this.$store.dispatch("report", {
        reporter: this.user.current,
        target: this.user.target,
        msg: this.msg,
      });
      this.ready = true;
      alert(res ? "Done." : "Failed. Try agian.");
      if (res) this.show = false;
    },
  },
};
</script>
