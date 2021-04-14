<template>
  <div>
    <v-text-field label="Input room's name " v-model="inputRoom"
      >Input</v-text-field
    >
    <v-btn color="info" @click="join">join</v-btn>
    <v-btn color="error" @click="leave">leave</v-btn>
    <v-btn color="warning" @click="initCamera">Open Camera</v-btn>
    <v-sheet color="success" class="mt-3 d-flex flex-column white--text">
      <template v-for="(log, idx) in roomLogs">
        <p :key="idx">{{ log }}</p>
      </template>
    </v-sheet>
    <div id="vdoList">
      <p>Your Camera</p>
      <video id="myVdo" class="mt-5" playsinline autoplay muted></video>
      <p>Others Camera</p>
    </div>
    {{ Object.keys(peerConnections) }}
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
      connectedPeers: {},
      socketId: "",
      inputRoom: "",
      room: "",
      currentRoom: "",
      roomLogs: [],
    };
  },
  computed: {},
  methods: {
    async initCamera() {
      const video = document.getElementById("myVdo");
      // Media contrains
      const constraints = {
        video: { facingMode: "user" },
        // Uncomment to enable audio
        // audio: true,
      };
      await navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          video.srcObject = stream;
          // send join to other
        })
        .catch((error) => console.error(error));
    },
    initRTC() {
      socket.on("connect", () => {
        // console.log(socket.id);
      });

      window.onunload = window.onbeforeunload = () => {
        this.leave();
        socket.close();
      };
    },
    addPeerConnection(id) {
      const Ovideo = document.createElement("video");
      Ovideo.id = id;
      Ovideo.autoplay = true;
      Ovideo.playsInline = true;
      document.getElementById("vdoList").appendChild(Ovideo);
      // offer stream
      this.peerConnections[id] = new RTCPeerConnection(config);
      this.peerConnections[id].onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", this.room, event.candidate);
        }
      };
      this.peerConnections[id].ontrack = (event) => {
        Ovideo.srcObject = event.streams[0];
        console.log(`Found track : ${event}`);
      };
    },
    offer(id) {
      const video = document.getElementById("myVdo");
      let stream = video.srcObject;
      this.addPeerConnection(id);
      stream
        .getTracks()
        .forEach((track) => this.peerConnections[id].addTrack(track, stream));

      this.peerConnections[id]
        .createOffer()
        .then((sdp) => this.peerConnections[id].setLocalDescription(sdp))
        .then(() => {
          socket.emit(
            "offer",
            this.room,
            this.peerConnections[id].localDescription
          );
        });
    },
    answer(id, description) {
      const video = document.getElementById("myVdo");
      let stream = video.srcObject;
      stream
        .getTracks()
        .forEach((track) => this.peerConnections[id].addTrack(track, stream));

      this.peerConnections[id]
        .setRemoteDescription(new RTCSessionDescription(description))
        .then(() => this.peerConnections[id].createAnswer())
        .then((sdp) => this.peerConnections[id].setLocalDescription(sdp))
        .then(() => {
          console.log(`answer to user : ${id}`);
          socket.emit("answer", id, this.peerConnections[id].localDescription);
        });
    },
    async join() {
      if (this.room == this.inputRoom) return alert("Already in that room.");

      this.leave();
      this.room = this.inputRoom;
      await this.initCamera();
      socket.emit("join-room", this.room);

      socket.on("joined", (data) => {
        this.roomLogs = [];
        this.roomLogs.push("your has joined rooms : " + this.room);
        this.roomLogs.push("user inside room :" + data.users.join(", "));
        // data.users.forEach((id) => {
        //   if (id == socket.id) return;
        //   this.addPeerConnection(id);
        // });
      });

      socket.on("user-joined-room", (id) => {
        this.roomLogs.push(`user ${id} joined`);
        console.log(`offering to user : ${id}`);
        this.offer(id);
      });
      // other offer stream
      socket.on("offer", (id, description) => {
        if (!this.connectedPeers[id]) {
          this.addPeerConnection(id);
          console.log(`received offer from user : ${id}`);
          this.answer(id, description);
          this.connectedPeers[id] = true;
        }
        // set theirs desc and answer
      });

      socket.on("answer", (id, description) => {
        if (!this.connectedPeers[id]) {
          console.log(`received answer from user : ${id}`);
          this.peerConnections[id].setRemoteDescription(
            new RTCSessionDescription(description)
          );
          this.connectedPeers[id] = true;
        }
      });

      socket.on("candidate", (id, candidate) => {
        this.peerConnections[id].addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      });

      socket.on("user-leaved-room", (id) => {
        this.roomLogs.push(`user ${id} has leaved rooms.`);
        const video = document.getElementById(id);
        video.remove();
        this.peerConnections[id].close();
        this.coonnectedPeers[id] = false;
        delete this.peerConnections[id];
      });
    },
    leave() {
      if (this.room) socket.emit("leave-room", this.room);
      //clear all listener
      socket.on("user-leaved-room", () => {});
      socket.on("user-joined-room", () => {});
      this.peerConnections = {};
      Array.prototype.slice
        .call(document.getElementsByTagName("video"))
        .forEach(function(item) {
          if (item.id != "myVdo") item.remove();
          // or item.parentNode.removeChild(item); for older browsers (Edge-)
        });
      this.roomLogs = [];
      this.room = "";
    },
  },
  mounted() {
    this.initRTC();
    // this.streamingInit();
  },
};
</script>
