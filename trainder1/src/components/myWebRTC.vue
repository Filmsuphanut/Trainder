<template>
  <div>
    <video playsinline autoplay muted></video>
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
      credential: "YzYNCouZM1mhqhmseWk6",
    },
  ],
};

import io from "socket.io-client";

var socket = io("http://localhost:3000", {
  withCredentials: true,
});

export default {
  data() {
    return {
      peerConnections: {},
      socketId: "",
    };
  },
  methods: {
    streamingInit() {
      const video = document.querySelector("video");
      // Media contrains
      const constraints = {
        video: { facingMode: "user" },
        // Uncomment to enable audio
        // audio: true,
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          video.srcObject = stream;
          socket.emit("broadcaster");
        })
        .catch((error) => console.error(error));

      socket.on("watcher", (id) => {
        const peerConnection = new RTCPeerConnection(config);
        this.peerConnections[id] = peerConnection;

        let stream = video.srcObject;
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
          }
        };

        peerConnection
          .createOffer()
          .then((sdp) => peerConnection.setLocalDescription(sdp))
          .then(() => {
            socket.emit("offer", id, peerConnection.localDescription);
          });
      });

      socket.on("answer", (id, description) => {
        this.peerConnections[id].setRemoteDescription(description);
      });

      socket.on("candidate", (id, candidate) => {
        this.peerConnections[id].addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      });

      socket.on("disconnectPeer", (id) => {
        this.peerConnections[id].close();
        delete this.peerConnections[id];
      });

      window.onunload = window.onbeforeunload = () => {
        socket.close();
      };
    },
  },
  mounted() {
    socket.on("connect", () => {
      console.log(socket.id);
    });
    this.streamingInit();
  },
};
</script>
