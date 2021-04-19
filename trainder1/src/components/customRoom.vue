<template>
  <div class="black vdoScreen">
    <div
      v-if="online"
      class="d-flex flex-row flex-wrap justify-center align-center vdoScreen"
      id="vdoList"
    >
      <v-card class="black ma-5 rounded-xl" height="320">
        <video
          width="auto"
          height="320"
          id="myVdo"
          playsinline
          autoplay
          muted
        ></video>
      </v-card>

      <!-- <template v-for="(peer, idx) in peers">
        <v-card
          class="black ma-5 rounded-xl"
          :id="peer"
          :key="idx"
          height="320"
        >
        </v-card>
      </template> -->
      <!-- <template v-for="(stream, idx) in streams">
            <video :key="idx" :srcObject.prop="stream" />
        </template> -->
    </div>

    <v-navigation-drawer app right width="456" v-model="chatBar" temporary>
      <v-card
        class="d-flex flex-column"
        outlined
        elevation="0"
        style="height: 100%"
      >
        <v-card-title
          primary-title
          class="d-flex flex-column align-start info white--text"
        >
          <h3>Chats Box</h3>
          <h5>
            Your Name : {{ username }} <br />
            Room : {{ room }}
          </h5>
        </v-card-title>

        <v-sheet class="d-flex flex-column flex-grow-1">
          <div
            class="flex-grow-1 pa-3"
            style="overflow-y: scroll; height: 500px; max-height: 100%"
          >
            <template v-for="(log, idx) in roomChats">
              <p :class="isCurrentUser(log) ? 'text-right' : ''" :key="idx">
                {{ log }}
              </p>
            </template>
          </div>
          <div
            class="white d-flex justify-center align-center elevation-5 px-5"
            style="height: 70px"
          >
            <v-text-field
              rounded
              background-color="white"
              outlined
              label="Chat"
              v-model="chat"
              @keydown.enter="sendChat"
              hide-details
            >
            </v-text-field>
            <div>
              <v-btn icon fab color="success" @click="sendChat">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </div>
          </div>
        </v-sheet>
      </v-card>
    </v-navigation-drawer>

    <v-footer app height="80">
      <div
        class="d-flex justify-center align-center"
        style="height: 100%; width: 100%; position: relative"
      >
        <v-menu
          offset-y
          top
          :close-on-click="false"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on"> Room </v-btn>
          </template>

          <div
            style="width: 300px"
            class="d-flex justify-center align-center pa-3 white"
          >
            <v-text-field
              outlined
              label="Input room's name "
              v-model="inputRoom"
              hide-details
              >Input</v-text-field
            >
            <v-btn class="ml-3" color="info" @click="join(inputRoom)">join</v-btn>
          </div>
        </v-menu>
        <v-spacer></v-spacer>
        <v-btn
          icon
          fab
          color="success"
          class="vdoIcon"
          @click="camera"
          outlined
        >
          <v-icon>mdi-video</v-icon>
        </v-btn>
        <v-btn icon fab color="warning" class="vdoIcon" @click="mute" outlined>
          <v-icon>mdi-microphone</v-icon>
        </v-btn>
        <v-btn icon fab color="error" class="vdoIcon" @click="leave" outlined>
          <v-icon>mdi-phone-hangup</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          icon
          fab
          color="primary"
          class="vdoIcon ml-auto"
          @click="chatBar = room ? !chatBar : chatBar"
          outlined
        >
          <v-icon>mdi-chat</v-icon>
        </v-btn>
      </div>
    </v-footer>

    <!-- input -->
    <v-overlay :absolute="false" :value="nameInput" opacity="0.95">
      <v-card width="500" light>
        <v-card-title class="info white--text">
          <v-icon large left> mdi-twitter </v-icon>
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
          <label class="text-h6">Please fill your UID</label>
          <v-text-field
            outlined
            placeholder="xa9wq;dk-ds213zmdpas"
            hide-details
            v-model="uid"
            @keydown.enter="onInputName"
            prepend-inner-icon="mdi-identifier"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="pa-6"
            block
            v-if="username && uid"
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

<style>
.vdoIcon {
  margin: 4px;
  padding: 12px;
  border-width: medium !important;
}
.vdoScreen {
  height: calc(100vh - 80px);
  max-height: calc(100vh - 80px);
}
video {
  width: auto;
  max-height: 100%;
}
</style>

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
      chatBar: false,
      online: false,
      username: "",
      uid: "",
      nameInput: true,
      roomMemCount: 0,
      streams: [],
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
    peers() {
      return Object.keys(this.peerConnections);
    },
  },
  methods: {
    isCurrentUser(text) {
      return this.username == text.split(" ")[0];
    },
    onInputName() {
      if (this.username && this.uid) {
        this.initRTC();
        this.nameInput = false;
      }
    },
    async initCamera() {
      const video = document.getElementById("myVdo");
      // Media contrains
      const constraints = {
        video: { facingMode: "user", width: 1920, height: 1080 },
        audio: true,
        // Uncomment to enable audio
        // audio: true,
      };
      await navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          video.srcObject = stream;
          this.streams.push(stream);
        })
        .catch((error) => console.error(error));
      this.streams.push();
    },
    closeCamera(id) {
      const video = document.getElementById(id);
      video.srcObject = null;
    },
    camera() {
      const video = document.getElementById("myVdo");
      if (video) {
        const stream = video.srcObject;
        if (stream)
          stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0]
            .enabled;
      }
    },
    mute() {
      const video = document.getElementById("myVdo");
      if (video) {
        const stream = video.srcObject;
        if (stream)
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
          uid: this.uid,
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
        Ovideo.height = 320;
        Ovideo.playsInline = true;
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
        this.streams.push(event.streams[0]);
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
    async join(room) {
      // if (this.room == this.inputRoom) return alert("Already inside the room.");
      this.leave();
      this.room = room;
      await this.initCamera();
      socket.emit("join-room", this.room);

      socket.on("joined", (data) => {
        this.roomChats = [];
        this.roomChats.push("your has joined rooms : " + this.room);
        this.roomChats.push("user inside room :" + data.users.join(", "));
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
      this.closeCamera("myVdo");
      //clear all listener
      socket.on("user-leaved-room", () => {});
      socket.on("user-joined-room", () => {});
      this.peerConnections = {};
      Array.prototype.slice
        .call(document.getElementsByTagName("video"))
        .forEach(function(item) {
          if (item && item.id != "myVdo" && item.id != "myScreen")
            item.remove();
          // or item.parentNode.removeChild(item); for older browsers (Edge-)
        });
      this.roomChats = [];
      this.chat = "";
      this.room = "";
    },
    // async shareScreen() {
    //   const video = document.getElementById("myVdo");
    //   // Media contrains
    //   const constraints = {
    //     video: { facingMode: "user", width: 640, height: 480 },
    //     audio: true,
    //   };
    //   await navigator.mediaDevices
    //     .getDisplayMedia(constraints)
    //     .then((stream) => {
    //       video.srcObject = stream;
    //       // send join to other
    //     })
    //     .catch((error) => console.error(error));
    // },
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
