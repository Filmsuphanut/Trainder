<template>
  <div class="black vdoScreen">
    <div
      class="d-flex flex-row flex-wrap justify-center align-center vdoScreen"
      id="vdoList"
    >
      <video
        class="rounded-xl"
        width="auto"
        height="320"
        id="myVdo"
        playsinline
        autoplay
        muted
      ></video>
    </div>
    <!-- chat -->
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
              <div
                :key="idx"
                :class="
                  isCurrentUser(log.sender)
                    ? 'd-flex justify-end text-right'
                    : ''
                "
              >
                <div
                  style="width: fit-content;
                  height: fit-content;
                  border : thin solid #2196f3
                  "
                  :style="
                    isCurrentUser(log.sender)
                      ? 'border-right-width : thick'
                      : 'border-left-width : thick'
                  "
                  class="mb-2 pa-2 rounded-lg"
                >
                  <p class="info--text font-weight-bold ma-0">
                    <span
                      v-if="isCurrentUser(log.sender)"
                      class="text-caption"
                      >{{ log.date }}</span
                    >
                    {{ log.sender }}
                    <span
                      v-if="!isCurrentUser(log.sender)"
                      class="text-caption"
                      >{{ log.date }}</span
                    >
                  </p>
                  <p class="ma-0">
                    {{ log.msg }}
                  </p>
                </div>
              </div>
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
    <!-- footer -->
    <v-footer app height="80">
      <div
        class="d-flex justify-center align-center"
        style="height: 100%; width: 100%; position: relative"
      >
        <a @click="copy" class="ma-0 pa-0">
          <v-icon class="info--text">mdi-link-variant</v-icon> Invite link</a
        >
        <v-spacer></v-spacer>
        <v-btn
          fab
          color="success"
          class="vdoIcon"
          @click="devices.cam = !devices.cam"
          :outlined="!devices.cam"
        >
          <v-icon>mdi-video</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          color="warning"
          class="vdoIcon"
          @click="devices.mic = !devices.mic"
          :outlined="!devices.mic"
        >
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
    <!-- before join -->
    <v-overlay :absolute="false" :value="overlays.devices" opacity="0.95">
      <v-card width="500" light>
        <v-card-title class="info white--text">
          <v-icon large left> mdi-twitter </v-icon>
          <span class="title font-weight-light">Trainder</span>
        </v-card-title>
        <v-card-text class="pa-5">
          <label class="text-h6">Devices</label>
          <v-row class="" justify="space-around">
            <v-switch
              v-model="devices.cam"
              label="camera"
              color="success"
              inset
            ></v-switch>
            <v-switch
              inset
              v-model="devices.mic"
              label="microphone"
              color="success"
              hide-details
            ></v-switch>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="pa-6" block color="success" @click="onSelectDevice"
            >Join Room</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <!-- input -->
    <v-overlay :absolute="false" :value="overlays.nameInput" opacity="0.95">
      <v-card width="500" light>
        <v-card-title class="info white--text">
          <v-icon large left> mdi-weight-lifter </v-icon>
          <span class="title font-weight-light">Trainder Video Chat</span>
        </v-card-title>
        <v-card-text class="mt-3 pa-5 px-8">
          <p class="text-h5 info--text">Join</p>
          <v-row justify="center" align="center">
            <v-col class="pa-1">
              <v-text-field
                outlined
                placeholder="Ex. gECE43px3C"
                hide-details
                label="Room Id"
                v-model="room"
                prepend-inner-icon="mdi-rename-box"
              >
              </v-text-field>
            </v-col>
            <v-col cols="4" class="pa-1">
              <v-btn
                class="pa-6"
                style="height:56px"
                block
                :disabled="room == ''"
                color="success"
                @click="joinRoom"
                >Join</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="py-0">
          <p class="text-h6   text-center ma-0">- - - OR - - -</p>
        </v-card-text>
        <v-card-text class="px-8 py-1 pb-5">
          <v-btn class="pa-8 my-2" block color="warning" @click="createRoom"
            >Create</v-btn
          >
        </v-card-text>
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
  border: 2px solid white;
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
import { mapGetters } from "vuex";
// let endpoint = "https://floating-island-08423.herokuapp.com";
// let endpoint = "https://api.evera.cloud";
// let endpoint = "http://191.101.184.233:3001/"
let endpoint = "http://localhost:5000";
var socket;

export default {
  data() {
    return {
      peerConnections: {},
      inputRoom: "",
      chat: "",
      roomChats: [],
      chatBar: false,
      online: false,
      // uid: "",
      roomMemCount: 0,
      streams: [],
      devices: {
        mic: true,
        cam: true,
      },
      overlays: {
        nameInput: true,
        devices: false,
      },
      rooms: {
        name: "",
        objective: "",
      },
      room: "",
    };
  },
  watch: {
    micStatus() {
      console.log("mic", this.micStatus);
      if (this.micStatus) {
        this.openMic();
      } else this.closeMic();
    },
    camStatus() {
      console.log("cam", this.camStatus);
      if (this.camStatus) {
        this.openCam();
      } else this.closeCam();
    },
  },
  computed: {
    peers() {
      return Object.keys(this.peerConnections);
    },
    ...mapGetters({
      userData: "userData",
    }),
    uid() {
      return this.userData ? this.userData.uid : "";
    },
    username() {
      return this.userData ? this.userData.data.fullName : "";
    },
    micStatus() {
      return this.devices.mic;
    },
    camStatus() {
      return this.devices.cam;
    },
  },
  methods: {
    copy() {
      const text = `${window.location.host}/custom-vdoc/${this.room}`;
      navigator.clipboard.writeText(text).then(
        function() {
          alert("Copy Room Url Success;");
        },
        function(err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
    },
    isCurrentUser(text) {
      return this.username == text;
    },
    onSelectDevice() {
      this.overlays.devices = false;
      this.join(this.room);
    },
    createRoom() {
      this.room = this.makeid(10);
      this.initRTC();
      this.initCamera();
      this.overlays.nameInput = false;
      this.overlays.devices = true;
    },
    joinRoom() {
      this.initRTC();
      this.initCamera();
      this.overlays.nameInput = false;
      this.overlays.devices = true;
    },
    onHangup() {
      this.overlays.nameInput = true;
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
        })
        .catch((error) => console.error(error));
    },
    openCam() {
      const video = document.getElementById("myVdo");
      if (video) {
        const stream = video.srcObject;
        if (stream) stream.getVideoTracks()[0].enabled = true;
      }
    },
    closeCam() {
      const video = document.getElementById("myVdo");
      if (video) {
        const stream = video.srcObject;
        if (stream) stream.getVideoTracks()[0].enabled = false;
      }
    },
    openMic() {
      const video = document.getElementById("myVdo");
      if (video) {
        const stream = video.srcObject;
        if (stream) stream.getAudioTracks()[0].enabled = true;
      }
    },
    closeMic() {
      const video = document.getElementById("myVdo");
      if (video) {
        const stream = video.srcObject;
        if (stream) stream.getAudioTracks()[0].enabled = false;
      }
    },
    initRTC() {
      this.nameInput = false;
      socket = io(endpoint, {
        withCredentials: true,
      });
      socket.on("connect", () => {
        // console.log(socket.id);
        socket.emit("deliver-info-custom", {
          uid: this.uid,
          name: this.username,
        });
      });

      socket.on("connected", (id) => {
        this.online = true;
      });
      socket.on("chat messaged", (_, userData, msg, date) => {
        this.roomChats.push({
          sender: userData.name,
          msg: msg,
          date: date,
        });
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
        Ovideo.classList.add("rounded-xl");
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
      if (!room) return alert("Room name must not empty");
      // if (this.room == this.inputRoom) return alert("Already inside the room.");
      this.room = room;
      // await this.initCamera();
      socket.emit("join-room", this.room);

      socket.on("joined", (data) => {
        this.roomChats = [];
        this.roomChats.push({
          sender: "System",
          msg: `You has joined a room ${this.room}`,
          date: new Date().toLocaleTimeString(),
        });
        this.roomChats.push({
          sender: "System",
          msg: `People inside this room : ${data.users.join(", ")}`,
          date: new Date().toLocaleTimeString(),
        });
      });

      socket.on("user-joined-room", (id, userData) => {
        let form = {
          sender: "System",
          msg: `User ${userData.name} joined`,
          date: new Date().toLocaleTimeString(),
        };
        this.roomChats.push(form);
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
        let form = {
          sender: "System",
          msg: `User ${userData.name} has leaved rooms.`,
          date: new Date().toLocaleTimeString(),
        };
        this.roomChats.push(form);
        const video = document.getElementById(id);
        if (video) video.remove();
        this.peerConnections[id].close();
        delete this.peerConnections[id];
      });
    },
    leave() {
      if (this.room) socket.emit("leave-room", this.room);
      this.devices.mic = false
      this.devices.cam = false
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
      this.overlays.nameInput = true
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
      socket.emit(
        "chat message",
        this.room,
        this.chat,
        new Date().toLocaleTimeString()
      );
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
    if (this.$route.params.id == "new-room") {
      this.room = "";
    } else {
      this.room = this.$route.params.id;
    }
    // this.streamingInit();
  },
};
</script>
