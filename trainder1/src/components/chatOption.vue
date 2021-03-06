<template>
  <div>
    <v-menu :close-on-content-click="false" :close-on-click="false" offset-y left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon class="rounded-pill" v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>

      <v-card max-width="350" max-height="550" class="mx-auto">
        <v-list dense>
          <v-list-item-group color="primary">
            <template v-for="(item, i) in items">
              <div :key="i" @click="item.func">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </template>
            <div v-if="userRole == 'trainer'" @click="openInvite">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">mdi-dumbbell</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Invite </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-menu>
    <portal to="report">
      <v-overlay z-index="20" :value="overlays.report.show">
        <v-card width="400" light>
          <v-card-title class="primary white--text text-center" primary-title>
            <v-icon class="white--text mr-3">mdi-alert</v-icon>
            Report
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

    <portal to="report2">
      <v-overlay z-index="20" :value="overlays.invite.show">
        <v-card width="600" light>
          <v-card-title class="primary white--text text-center" primary-title>
            <v-icon class="white--text mr-3">mdi-dumbbell</v-icon>
            Invitation
            <v-spacer></v-spacer>
            <v-btn @click="overlays.invite.show = false" text icon color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-3 mt-3">
            <p style="font-size: 1.25rem; font-weight: bold">เลือกคอร์ส</p>
            <v-radio-group v-model="overlays.invite.radio">
              <v-radio
                v-for="n in courses"
                :key="n.docId"
                :label="`${n.name}`"
                :value="{ id: n.docId, name: n.name }"
              ></v-radio>
            </v-radio-group>
            <p style="font-size: 1.25rem; font-weight: bold">ส่งข้อความให้เขาหน่อยสิ..</p>
            <p>ผู้ใช้งาน : {{ user.target.name }}</p>
            <v-textarea
              outlined
              ref="course"
              label="Details"
              color="info"
              v-model="overlays.invite.msg"
              hide-details
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!overlays.invite.radio"
              :loading="!overlays.invite.ready"
              @click="invite"
              color="error"
              >Send</v-btn
            >
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
  props: ["user"],
  data() {
    return {
      overlays: {
        report: {
          show: false,
          msg: "",
          ready: true,
        },
        invite: {
          show: false,
          msg: "",
          ready: true,
          radio: "",
        },
      },
      selectedItem: 1,
      items: [
        {
          text: "Unfriend",
          icon: "mdi-account-minus",
          func: this.unfriend,
        },
        {
          text: "Report",
          icon: "mdi-flag",
          func: () => {
            this.overlays.report.show = true;
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      userRole: "userRole",
      courses: "course",
    }),
  },
  methods: {
    async unfriend() {
      console.log("unfriend");
      if (confirm(`Confirm Unfriend ${this.user.target.name} ?`)) {
        let res = await axios.delete("unFriend", {
          data: {
            id1: this.user.current.uid,
            id2: this.user.target.uid,
          },
        });
        await this.$store.dispatch("fetchFriends");
        this.$emit("back");
        alert(res ? "Done." : "Failed. Try agian.");
      }
    },
    async report() {
      this.overlays.report.ready = false;
      let res = await this.$store.dispatch("report", {
        reporter: this.user.current.uid,
        target: this.user.target.uid,
        msg: this.overlays.report.msg,
      });
      this.overlays.report.ready = true;
      alert(res ? "Done." : "Failed. Try agian.");
      if (res) this.overlays.report.show = false;
    },
    async openInvite() {
      await this.$store.dispatch("fetchCourse");
      this.overlays.invite.show = true;
    },
    async invite() {
      if (this.overlays.invite.radio) {
        await axios.put("pushNoti", {
          userId: this.user.target.uid,
          sender: this.user.current.uid,
          msg: {
            course_id: this.overlays.invite.radio.id,
            text: `คอร์ส : ${this.overlays.invite.radio.name} <br />
                   ข้อความ : ${this.overlays.invite.msg}`,
          },
          date: new Date().toLocaleTimeString(),
          type: "invite",
        });
        alert("Done");
      } else {
        this.$refs["course"].validate();
      }
    },
  },
};
</script>
