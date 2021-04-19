<template>
    <MyWebRTC />
</template>

<script>
// import WebRTC from "vue-webrtc";
// import WebRTC from '../components/WebRTC'
// ISSUE 5: https://github.com/westonsoftware/vue-webrtc/issues/5
// import * as io from "socket.io-client";
// import ChatRoom from './ChatRoom.vue';
import MyWebRTC from './myWebRTC.vue';
// import Watcher from './watcher.vue';
// window.io = io;
//
//
export default {
  components : {
    // ChatRoom,
    MyWebRTC,
    // Watcher
  },
  data() {
    return {
      img: "",
      roomId: "test",
      joinEnable: true,
      
    };
  },
  methods: {
    join() {
      // this.joinEnable = false;
      // this.$refs.webrtc.join();
      // this.joinEnable = true;
    },
    shareScreen() {
      // this.$refs.webrtc.shareScreen();
    },
    onOpen(e) {
      console.log("Open-Room : ", e);
    },
    logEvent(event) {
      console.log("Event : ", event);
    },
    onError(error, stream) {
      console.log("On Error Event", error, stream);
    },
    makeid(length) {
      var result = [];
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result.push(
          characters.charAt(Math.floor(Math.random() * charactersLength))
        );
      }
      return result.join("");
    },
  },
};
</script>

<style></style>
