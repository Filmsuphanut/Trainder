<template>
  <div>
    <v-menu
      :close-on-content-click="false"
      :close-on-click="false"
      offset-y
      left
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          color="primary"
          class="rounded-pill"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-chat</v-icon>
        </v-btn>
      </template>

      <v-card max-width="450" max-height="550" class="mx-auto">
        <v-toolbar color="primary" dark>
          <v-btn v-if="tab" @click="tab = 0" icon class="hidden-xs-only">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>{{ tab ? target.target.name : "Inbox"}}</v-toolbar-title>
        </v-toolbar>
        <v-tabs-items v-model="tab">
          <!-- list -->
          <v-tab-item>
            <v-list three-line>
              <template v-for="(item, index) in items">
                <div :key="index">
                  <v-hover v-slot="{ hover }">
                    <v-list-item
                      :class="hover ? 'blue-grey lighten-5' : ''"
                      :key="item.name"
                      style="cursor : pointer"
                    >
                      <v-list-item-avatar>
                        <v-img :src="item.img"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title
                          class="secondary--text"
                          v-html="item.name"
                        ></v-list-item-title>

                        <v-list-item-subtitle>
                          <span class="text--primary">{{ item.name }}</span>
                          &mdash;
                          {{ item.subtitle }}
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-btn
                        class="elevation-2 white  "
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
          </v-tab-item>
          <!-- chat -->
          <v-tab-item>
            <chat :user="target" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-menu>
  </div>
</template>

<style></style>

<script>
import chat from "./chat.vue";
export default {
  components: { chat },
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
      current: {
        name: "Felix",
        uid: "",
        img:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4e-wP2Sy2tAIVZ-cLQYvKJtB5sUz6Sj9O9g&usqp=CAU",
      },
      target: "",
    };
  },
  methods: {
    openChat(user) {
      this.tab = 1;
      this.target = {
        target: {
          name: user.name,
          uid: "",
          img: user.img,
        },
        current: this.current,
      };
    },
  },
};
</script>
