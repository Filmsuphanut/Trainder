<template>
  <div>
    <portal to="report">
      <v-overlay :value="show">
        <v-card width="400" light>
          <v-card-title class="primary white--text text-center" primary-title>
            <v-icon class="white--text mr-3">mdi-dumbbell</v-icon>
            Invite
            <v-spacer></v-spacer>
            <v-btn @click="overlays.report.show = false" text icon color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-3">
            <p class="text-h6">Please inform us the details.</p>
            <p>User : {{ user.target.name }}</p>
            <v-textarea
              outlined
              label="Details"
              color="info"
              v-model="overlays.report.msg"
              hide-details
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="!overlays.report.ready" @click="report" color="error"
              >Report this user</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-overlay>
    </portal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["show", "sender", "target"],
  data() {
    return {};
  },
  methods: {
    async invite() {
      await axios.post("pushNoti", {
        userId: this.target,
        sender: this.sender,
        msg: {
          course_id: "",
          text: "",
        },
        date: new Date().toLocaleTimeString,
        type: "invite",
      });
      alert("Done");
    },
  },
};
</script>
