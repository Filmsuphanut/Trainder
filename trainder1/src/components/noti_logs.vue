<template>
  <div>
    <v-menu :close-on-content-click="false" offset-y left>
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          :value="notification.length"
          dot
          bordered
          bottom
          color="error"
          offset-x="15"
          offset-y="10"
          overlap
        >
          <v-btn
            dark
            color="primary"
            class="elevation-1 mx-1"
            fab
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-bell</v-icon>
          </v-btn>
        </v-badge>
      </template>

      <v-card
        width="450"
        style="min-height: 300px"
        max-height="550"
        class="mx-auto"
      >
        <v-toolbar color="primary" dark>
          <v-toolbar-title> Notification </v-toolbar-title>
        </v-toolbar>
        <v-tabs-items v-model="tab">
          <!-- list -->
          <v-tab-item>
            <v-list v-if="items.length" three-line>
              <template v-for="(item, index) in notification">
                <div :key="index">
                  <v-hover v-slot="{ hover }">
                    <v-list-item
                      :class="hover ? 'blue-grey lighten-5' : ''"
                      :key="item.name"
                      style="cursor: pointer"
                    >
                      <v-list-item-avatar>
                        <v-img :src="item.img"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title
                          class="secondary--text"
                          v-html="item.name"
                        ></v-list-item-title>

                        <v-list-item-subtitle v-html="item.msg">
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-btn
                        @click="deleteNoti(index)"
                        v-if="hover"
                        fab
                        color="warning"
                        class="mx-1"
                        small
                        text
                      >
                        <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                    </v-list-item>
                  </v-hover>
                </div>
              </template>
            </v-list>
            <v-card-text class="text-center text-h5 grey--text" v-else>
              Look Empty Here...
            </v-card-text>
          </v-tab-item>
          <!-- chat -->
        </v-tabs-items>
      </v-card>
    </v-menu>
  </div>
</template>

<style></style>

<script>
import { mapGetters } from "vuex";
import { fb } from "../firebase";
const db = fb.firestore();
export default {
  data() {
    return {
      tab: 0,
      items: [
        {
          img: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
          name: "Brunch weekend",
          subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        {
          img: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          name: "Summer Barbeque",
          subtitle: `Wish I could come, but I'm out of town this weekend.`,
        },
        {
          img: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
          name: "Sandra Adams",
          subtitle: "Do you have Paris recommendations? Have you ever been?",
        },
        {
          img: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
          name: "Trevor Hansen",
          subtitle:
            "Have any ideas about what we should get Heidi for her birthday?",
        },
        {
          img: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
          name: "Britta Holt",
          subtitle:
            "We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
        },
      ],
      target: { target: "", current: "" },
    };
  },
  computed: {
    ...mapGetters({
      notification: "notification",
      userData: "userData",
    }),
  },
  methods: {
    back() {
      this.tab = 0;
      this.$set(this.target, "target", "");
    },
    async fetch() {
      await this.$store.dispatch("fetchNotication");
      db.collection("userData")
        .doc(this.userData.uid)
        .onSnapshot(async () => {
          await this.$store.dispatch("fetchNotication");
        });
    },
    deleteNoti(index) {
      let deleted = [...this.notification];
      deleted.splice(index, 1);
      this.$store.commit("setNotification", deleted);
      this.$store.dispatch("updateNoti");
    },
  },
  async created() {
    this.fetch();
  },
};
</script>
