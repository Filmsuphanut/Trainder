<template>
  <div style="height:100vh">
    <v-row v-if="online" style="height:100%">
      <v-col>
        <div id="vdoList">
          <v-col>
            <video id="myVdo" class="mt-5" playsinline autoplay muted></video>
            <div class="d-flex justify-space-around">
              <v-btn color="warning" @click="camera">Toggle Camera</v-btn>
              <v-btn color="warning" @click="mute">Toggle Mute</v-btn>
            </div>
          </v-col>
        </div>
      </v-col>

      <v-col cols="4">
        <v-card class="d-flex flex-column pa-5" style="height:100%">
          <div>
            <p>user : {{ username }}</p>
            <v-text-field
              outlined
              label="Input room's name "
              v-model="inputRoom"
              hide-details
              >Input</v-text-field
            >
            <v-btn color="info" @click="join">join</v-btn>
            <v-btn color="error" @click="leave">leave</v-btn>

            <p class="ma-0">Chats</p>
          </div>
          <v-sheet
            color="info"
            class="d-flex flex-column white--text flex-grow-1"
          >
            <div class="flex-grow-1">
              <template v-for="(log, idx) in roomChats">
                <p :key="idx">{{ log }}</p>
              </template>
            </div>
            <div>
              <v-row class="d-flex justify-center align-center">
                <div style="width:20vw">
                  <v-text-field
                    background-color="white"
                    outlined
                    label="Chat"
                    v-model="chat"
                    @keydown.enter="sendChat"
                    hide-details
                    dense
                  >
                  </v-text-field>
                </div>
                <div>
                  <v-btn color="success" @click="sendChat">Send</v-btn>
                </div>
              </v-row>
            </div>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>

    <v-overlay :absolute="false" :value="nameInput" opacity="0.95">
      <v-card width="500" light>
        <v-card-title class="info white--text">
          <v-icon large left>
            mdi-twitter
          </v-icon>
          <span class="title font-weight-light">Trainder</span>
        </v-card-title>
        <v-card-text class="pa-5">
          <label class="text-h6">Please fill your name</label>
          <v-text-field
            outlined
            placeholder="david..."
            hide-details
            v-model="username"
            @keydown.enter="onInputName"
            prepend-inner-icon="mdi-account"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="pa-6"
            block
            v-if="username"
            color="success"
            @click="onInputName"
            >Proceed</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </div>
</template>

<style></style>

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

// let endpoint = "https://floating-island-08423.herokuapp.com";
// let endpoint = "https://api.evera.cloud";
// let endpoint = "http://191.101.184.233:3001/"
let endpoint = "http://localhost:5000";
var socket;

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
      online: false,
      username: "",
      nameInput: true,
      roomMemCount: 0,
    };
  },
  computed: {
    micStatus() {
      const video = document.getElementById("myVdo");
      if (video) {
        const stream = video.srcObject;
        return stream.getAudioTracks()[0].enabled;
      }
      return false;
    },
  },
  methods: {
    onInputName() {
      this.initRTC();
      this.nameInput = false;
    },
    async initCamera() {
      const video = document.getElementById("myVdo");
      // Media contrains
      const constraints = {
        video: { facingMode: "user", width: 640, height: 480 },
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
    camera() {
      const video = document.getElementById("myVdo");
      if (video) {
        const stream = video.srcObject;
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0]
          .enabled;
      }
    },
    mute() {
      const video = document.getElementById("myVdo");
      if (video) {
        const stream = video.srcObject;
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0]
          .enabled;
      }
    },
    initRTC() {
      this.nameInput = false;
      socket = io(endpoint, {
        withCredentials: true,
      });
      socket.on("connect", () => {
        // console.log(socket.id);
        socket.emit("deliver-info", {
          uid: this.makeid(15),
          name: this.username,
        });
      });

      socket.on("connected", (id) => {
        this.online = true;
      });
      socket.on("chat messaged", (_, userData, msg) => {
        this.roomChats.push(`${userData.name} : ${msg}`);
      });

      window.onunload = window.onbeforeunload = () => {
        this.leave();
        socket.close();
      };
    },
    addPeerConnection(id) {
      var Ovideo = document.getElementById(id);
      if (!Ovideo) {
        Ovideo = document.createElement("video");
        Ovideo.id = id;
        Ovideo.autoplay = true;
        Ovideo.playsInline = true;
        Ovideo.width = 640;
        Ovideo.height = 480;
        document.getElementById("vdoList").appendChild(Ovideo);
      }
      // offer stream
      this.peerConnections[id] = new RTCPeerConnection(config);
      this.peerConnections[id].onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", this.room, id, event.candidate);
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
            id,
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
          socket.emit(
            "answer",
            this.room,
            id,
            this.peerConnections[id].localDescription
          );
        });
    },
    async join() {
      if (this.room == this.inputRoom) return alert("Already in that room.");

      this.leave();
      this.room = this.inputRoom;
      await this.initCamera();
      socket.emit("join-room", this.room);

      socket.on("joined", (data) => {
        this.roomChats = [];
        this.roomChats.push("your has joined rooms : " + this.room);
        this.roomChats.push("user inside room :" + data.users.join(", "));
        // data.users.forEach((id) => {
        //   if (id == socket.id) return;
        //   this.addPeerConnection(id);
        // });
      });

      socket.on("user-joined-room", (id, userData) => {
        this.roomChats.push(`user ${userData.name} joined`);
        console.log(`offering to user : ${id}`);
        this.offer(id);
      });
      // other offer stream
      socket.on("offer", (id, to, description) => {
        if (socket.id == to) {
          this.addPeerConnection(id);
          console.log(`received offer from user : ${id}`);
          this.answer(id, description);
        }
        // set theirs desc and answer
      });

      socket.on("answer", (id, to, description) => {
        if (socket.id == to) {
          console.log(`received answer from user : ${id}`);
          this.peerConnections[id].setRemoteDescription(
            new RTCSessionDescription(description)
          );
        }
      });

      socket.on("candidate", (id, to, candidate) => {
        if (this.peerConnections[id] && socket.id == to) {
          this.peerConnections[id].addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      });

      socket.on("user-leaved-room", (id, userData) => {
        this.roomChats.push(`user ${userData.name} has leaved rooms.`);
        const video = document.getElementById(id);
        if (video) video.remove();
        this.peerConnections[id].close();
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
          if (item && item.id != "myVdo") item.remove();
          // or item.parentNode.removeChild(item); for older browsers (Edge-)
        });
      this.roomChats = [];
      this.chat = "";
      this.room = "";
    },
    sendChat() {
      socket.emit("chat message", this.room, this.chat);
      this.chat = "";
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
  mounted() {
    // this.streamingInit();
  },
};
</script>
