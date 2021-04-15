<template>
  <div>
    <v-text-field solo label="Input room's name " v-model="inputRoom"
      >Input</v-text-field
    >
    <v-btn color="info" @click="join">join</v-btn>
    <v-btn color="error" @click="leave">leave</v-btn>
    <v-btn color="warning" @click="initCamera">Open Camera</v-btn>
    <p>Room Logs</p>
    <v-sheet color="success" class="mt-3 d-flex flex-column white--text">
      <template v-for="(log, idx) in roomLogs">
        <p :key="idx">{{ log }}</p>
      </template>
    </v-sheet>
    <p>Room Chats</p>
    <v-sheet color="info" class="my-3 d-flex flex-column white--text">
      <template v-for="(log, idx) in roomChats">
        <p :key="idx">{{ log }}</p>
      </template>

      <v-row style="width:500px" class="justify-center align-center">
        <v-text-field class="mt-5" solo label="Chat" v-model="chat">
        </v-text-field>
        <v-btn color="success" @click="sendChat">Send</v-btn>
      </v-row>
    </v-sheet>
    <div id="vdoList">
      <p>Your Camera</p>
      <video id="myVdo" class="mt-5" playsinline autoplay muted></video>
      <p>Others Camera</p>
    </div>
  </div>
</template>

<script>
const config = {
  iceServers: [
    {
      // urls: ["stun:stun.l.google.com:19302"],
      urls: ["stun:stun.evera.cloud:5349"],
    },
    {
      urls: "turn:turn.evera.cloud:5349",
      username: "test",
      credential: "test321",
    },
  ],
};

import io from "socket.io-client";

let endpoint = "https://floating-island-08423.herokuapp.com";
// let endpoint = "http://191.101.184.233:3001/"
// let endpoint = "http://localhost:3000";
var socket = io(endpoint, {
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
      chat: "",
      roomChats: [],
    };
  },
  computed: {},
  methods: {
    async initCamera() {
      const video = document.getElementById("myVdo");
      // Media contrains
      const constraints = {
        video: { facingMode: "user", width: 960, height: 640 },
        audio: true,
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
      Ovideo.width  = 640
      Ovideo.height = 480
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
        this.addPeerConnection(id);
        console.log(`received offer from user : ${id}`);
        this.answer(id, description);
        // set theirs desc and answer
      });

      socket.on("answer", (id, description) => {
        if (this.peerConnections[id]) {
          sd = this.peerConnections[id].currentRemoteDescription;
          if (sd) {
            console.log(`received answer from user : ${id}`);
            this.peerConnections[id].setRemoteDescription(
              new RTCSessionDescription(description)
            );
          }
        }
      });

      socket.on("candidate", (id, candidate) => {
        if (this.peerConnections[id]){
          this.peerConnections[id].addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
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
      this.roomChats = [];
      this.chat = "";
      this.room = "";
    },
    sendChat() {
      socket.emit("chat message", this.room, this.chat);
      this.chat = "";
    },
  },
  mounted() {
    this.initRTC();
    socket.on("chat messaged", (user, msg) => {
      this.roomChats.push(`${user} : ${msg}`);
    });
    // this.streamingInit();
  },
};
</script>
