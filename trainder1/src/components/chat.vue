<template>
  <v-card
    class="d-flex flex-column"
    width="450"
    outlined
    elevation="0"
    style="height: 100%"
  >
    <v-card-text
      class="pa-0 ma-0 pt-3"
      style="height:400px;max-height:400px; overflow-y:scroll"
    >
      <template v-for="(log, idx) in logs">
        <div
          class="py-1"
          :key="idx"
          :class="
            isCurrentUser(log.sender) ? 'd-flex justify-end text-right' : ''
          "
        >
          <div class="d-flex mb-2 ">
            <v-avatar style="border: 2px solid #c64242 " v-if="!isCurrentUser(log.sender)" class="mx-2">
              <img :src="user.target.img" alt="John" />
            </v-avatar>
            <div
              style="width: fit-content;
                  height: fit-content;
                  border : thin solid #ff7474
                  "
              :style="
                isCurrentUser(log.sender)
                  ? 'border-right-width : thick'
                  : 'border-left-width : thick'
              "
              class="pa-2 rounded-lg"
            >
              <p class="secondary--text font-weight-bold ma-0">
                <span v-if="isCurrentUser(log.sender)" class="text-caption">{{
                  log.date
                }}</span>
                {{ log.sender }}
                <span v-if="!isCurrentUser(log.sender)" class="text-caption">{{
                  log.date
                }}</span>
              </p>
              <p class="ma-0 black--text">
                {{ log.msg }}
              </p>
            </div>
            <v-avatar style="border: 2px solid #c64242 " v-if="isCurrentUser(log.sender)" class="mx-2">
              <img :src="user.current.img" alt="Me" />
            </v-avatar>
          </div>
        </div>
      </template>
    </v-card-text>

    <v-card-actions class="pa-0 ma-0">
      <div
        class="white d-flex justify-center align-center elevation-5 px-5"
        style="height: 70px;width:100%"
      >
        <v-text-field
          rounded
          background-color="white"
          outlined
          label="Chat"
          v-model="msg"
          @keydown.enter="sendChat"
          hide-details
        >
        </v-text-field>
        <div>
          <v-btn icon fab color="primary" @click="sendChat">
            <v-icon large>mdi-send</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["user"],
  data() {
    return {
      logs: [
        {
          sender: "Felix",
          msg: "hello friend.",
          date: new Date().toLocaleTimeString(),
        },
        {
          sender: "Felix",
          msg: "my name is pew~diepie",
          date: new Date().toLocaleTimeString(),
        },
        {
          sender: "vodka",
          msg: "I love marzia 💖.",
          date: new Date().toLocaleTimeString(),
        },
        {
          sender: "Felix",
          msg: "send me your meme.",
          date: new Date().toLocaleTimeString(),
        },
      ],
      msg: "",
    };
  },
  methods: {
    sendChat() {},
    isCurrentUser(user) {
      return user == this.user.current.name;
    },
  },
};
</script>
