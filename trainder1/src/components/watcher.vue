<template>
<div>
  <video id="watcher" playsinline autoplay muted></video>
</div>
</template>

<script>
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
    {
      urls: ["turn:13.250.13.83:3478?transport=udp"],
        username: "YzYNCouZM1mhqhmseWk6",
      credential: "YzYNCouZM1mhqhmseWk6"
    }
  ],
};
import io from "socket.io-client";

var socket = io("http://localhost:3000", {
  withCredentials: true,
});

export default {
  data() {
    return {
      peerConnection : "",
    };
  },
  methods: {
    watcherInit() {
      const video = document.getElementById("watcher")
      socket.on("offer", (id, description) => {
        this.peerConnection = new RTCPeerConnection(config);
        this.peerConnection
          .setRemoteDescription(description)
          .then(() => this.peerConnection.createAnswer())
          .then((sdp) => this.peerConnection.setLocalDescription(sdp))
          .then(() => {
            socket.emit("answer", id, this.peerConnection.localDescription);
          });
        this.peerConnection.ontrack = (event) => {
          video.srcObject = event.streams[0];
        };
        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
          }
        };
      });
    
      socket.on("connect", () => {
        socket.emit("watcher");
      });

      socket.on("broadcaster", () => {
        socket.emit("watcher");
      });

      window.onunload = window.onbeforeunload = () => {
        socket.close();
        this.peerConnection.close();
      };
    },
  },
  mounted() {
    this.watcherInit();
  },
};
</script>
