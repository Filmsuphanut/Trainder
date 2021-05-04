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

      <div style="position: fixed; left: 10px">
        <v-btn
          :loading="!ready"
          @click="addFriend"
          outlined
          icon
          fab
          color="primary"
          class="vdoIcon ml-auto"
          style="background: white"
        >
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
        <report :user="reportData" />
      </div>
    </div>
    <!-- chat -->
    <v-navigation-drawer app right width="456" v-model="chatBar" temporary>
      <v-card class="d-flex flex-column" outlined elevation="0" style="height: 100%">
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
                :class="isCurrentUser(log.sender) ? 'd-flex justify-end text-right' : ''"
              >
                <div
                  style="
                    width: fit-content;
                    height: fit-content;
                    border: thin solid #2196f3;
                  "
                  :style="
                    isCurrentUser(log.sender)
                      ? 'border-right-width : thick'
                      : 'border-left-width : thick'
                  "
                  class="mb-2 pa-2 rounded-lg"
                >
                  <p class="info--text font-weight-bold ma-0">
                    <span v-if="isCurrentUser(log.sender)" class="text-caption">{{
                      log.date
                    }}</span>
                    {{ log.sender }}
                    <span v-if="!isCurrentUser(log.sender)" class="text-caption">{{
                      log.date
                    }}</span>
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

        <v-btn icon fab color="info" class="vdoIcon" @click="leave" outlined>
          <v-icon>mdi-autorenew</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          icon
          fab
          color="primary"
          class="vdoIcon ml-auto"
          style="background: white; position: absolute; right: 0"
          @click="chatBar = room ? !chatBar : chatBar"
          outlined
        >
          <v-icon>mdi-chat</v-icon>
        </v-btn>
      </div>
    </v-footer>
    <!-- loader  -->
    <v-overlay :value="!room">
      <v-progress-circular indeterminate size="200">Waiting... 🤩</v-progress-circular>
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
import { config, endpoint } from "../websocket";
import io from "socket.io-client";
import { mapGetters } from "vuex";
import addFriend from "./addFriend.vue";
import AddFriendRandom from "./addFriend_random.vue";
import axios from "axios";
import Report from "./report.vue";
var socket;

export default {
  components: { addFriend, AddFriendRandom, Report },
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
      ready: true,
      partner_uid: "",
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
    reportData() {
      return {
        current: this.uid,
        target: this.partner_uid,
      };
    },
  },
  methods: {
    async addFriend() {
      this.ready = false;
      if (this.partner_uid) {
        try {
          let res = await axios.post(`addFriend`, {
            id1: this.uid,
            id2: this.partner_uid,
          });
          alert("Done");
          await this.$store.dispatch("fetchFriends");
        } catch (err) {
          alert(err);
        }
      } else {
      }
      this.ready = true;
    },
    isCurrentUser(text) {
      return this.username == text;
    },
    createRoom() {
      this.room = this.makeid(10);
      this.initRTC();
      this.initCamera();
      this.overlays.devices = true;
    },
    joinRoom() {
      this.initRTC();
      this.initCamera();
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
        socket.emit("deliver-info", {
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

      socket.on("found-room", (to, room) => {
        if (this.uid == to) {
          console.log(to, room);
          this.join(room);
        }
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
          socket.emit("offer", this.room, id, this.peerConnections[id].localDescription);
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
          socket.emit("answer", this.room, id, this.peerConnections[id].localDescription);
        });
    },
    async join(room) {
      // if (this.room == this.inputRoom) return alert("Already inside the room.");
      this.room = room;
      // await this.initCamera();
      socket.emit("join-room", this.room);

      socket.on("joined", (data) => {
        console.log(data);
        let partner = data.users.find((el) => el != this.uid);
        if (partner) {
          this.partner_uid = partner.uid;
        }
        this.roomChats = [];
      });

      socket.on("add-friend-request", (room) => {
        socket.emit("send-friend-uid", room, this.uid);
      });

      socket.on("user-joined-room", (id, userData) => {
        console.log(`offering to user : ${id}`);
        this.partner_uid = userData.uid;
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
          this.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
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

      //clear all listener
      socket.on("user-leaved-room", () => {});
      socket.on("user-joined-room", () => {});
      Object.keys(this.peerConnections).forEach((peer) => {
        this.peerConnections[peer].close();
        delete this.peerConnections[peer];
      });
      Array.prototype.slice
        .call(document.getElementsByTagName("video"))
        .forEach(function (item) {
          if (item && item.id != "myVdo" && item.id != "myScreen") item.remove();
          // or item.parentNode.removeChild(item); for older browsers (Edge-)
        });
      this.roomChats = [];
      this.chat = "";
      this.room = "";
      socket.emit("deliver-info", {
        uid: this.uid,
        name: this.username,
      });
    },
    sendChat() {
      socket.emit("chat message", this.room, this.chat, new Date().toLocaleTimeString());
      this.chat = "";
    },
    makeid(length) {
      var result = [];
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
      }
      return result.join("");
    },
    async startTimer() {
      await axios.get("timerStart?uid=" + this.userData.data.uid);
    },
  },
  mounted() {
    this.initRTC();
    this.initCamera();
    this.startTimer();
    // this.streamingInit();
  },
  async beforeDestroy() {
    await axios.get("timerStop?uid=" + this.userData.data.uid);
  },
};
</script>
