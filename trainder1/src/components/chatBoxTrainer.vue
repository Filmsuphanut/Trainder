<template>
  <div>
    <v-menu :close-on-content-click="false" offset-y left>
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          :value="chatEvent"
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
            @click="clearEvent"
          >
            <v-icon>mdi-account-multiple</v-icon>
          </v-btn>
        </v-badge>
      </template>

      <v-card width="450" style="min-height: 300px" max-height="550" class="mx-auto">
        <v-toolbar color="primary" dark>
          <v-btn v-if="tab" @click="back" icon class="hidden-xs-only">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>{{ tab ? target.target.name : "รายชื่อติดต่อ" }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <add-friend v-if="!tab" />
          <chat-option @back="tab = 0" :user="target" v-if="tab" />
        </v-toolbar>
        <v-tabs-items v-model="tab">
          <!-- list -->
          <v-tab-item>
            <v-list v-if="items.length">
              <template v-for="(item, index) in friendLists">
                <div :key="index">
                  <v-hover v-slot="{ hover }">
                    <v-list-item
                      :class="hover ? 'blue-grey lighten-5' : ''"
                      :key="item.name"
                      style="cursor: pointer"
                      three-line
                    >
                      <v-list-item-avatar>
                        <v-img :src="item.img"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title
                          class="secondary--text"
                          v-html="item.name"
                        ></v-list-item-title>

                        <v-list-item-subtitle v-if="getLastChat(item.uid).length">
                          <span class="text--primary">
                            {{ getName(getLastChat(item.uid)[0].sender) }}</span
                          >
                          &mdash; {{ getLastChat(item.uid)[0].msg }}
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-btn
                        class="elevation-2 white"
                        :style="hover ? '' : 'visibility: hidden;'"
                        text
                        icon
                        color="primary"
                        @click="openChat(item)"
                      >
                        <v-icon class="primary--text">mdi-chevron-right</v-icon>
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

          <v-tab-item>
            <chat v-if="tab" :user="target" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-menu>
  </div>
</template>

<style></style>

<script>
import chat from "./chat.vue";
import ChatOption from "./chatOption.vue";

import { mapGetters } from "vuex";
import AddFriend from "./addFriend.vue";

export default {
  components: { chat, ChatOption, AddFriend },
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
          subtitle: "Have any ideas about what we should get Heidi for her birthday?",
        },
        {
          img: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
          name: "Britta Holt",
          subtitle: "We should eat this: Grate, Squash, Corn, and tomatillo Tacos.",
        },
      ],
      target: { target: "", current: "" },
    };
  },
  computed: {
    ...mapGetters({
      userData: "userData",
      lists: "friendLists",
      chatEvent: "chatEvent",
      getLastChat: "getLastChat",
      getDataById: "getDataById",
    }),
    current() {
      return {
        name: this.userData.data.fullName,
        uid: this.userData.uid,
        img: this.userData.data.profilePic,
      };
    },
    friendLists() {
      return Object.keys(this.lists).map((uid) => {
        return {
          name: this.lists[uid].data.name,
          uid: uid,
          img: this.lists[uid].data.img,
          logUid: this.lists[uid].logsId,
        };
      });
    },
  },
  methods: {
    getName(id) {
      const friend = this.getDataById(id);
      if (friend) {
        return friend.data.name;
      } else {
        return this.userData.data.fullName;
      }
    },
    back() {
      this.tab = 0;
      this.$set(this.target, "target", "");
    },
    clearEvent() {
      this.$store.commit("setChatEvent", false);
    },
    openChat(user) {
      this.tab = 1;
      this.target = {
        target: {
          name: user.name,
          uid: user.uid,
          img: user.img,
        },
        current: this.current,
        logDoc: user.logUid,
      };
    },
    async fetch() {
      await this.$store.dispatch("fetchFriends");
    },
  },
  async created() {
    this.fetch();
  },
};
</script>
