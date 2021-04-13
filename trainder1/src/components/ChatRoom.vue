<template>
  <div class="my-5">
    <v-sheet color="warning" class="white--text">
      <v-col>
        <template v-for="(m, idx) in message">
          <div class="ma-3" :key="idx">
            {{ m }}
          </div>
        </template>
      </v-col>
    </v-sheet>
    <v-btn class="my-2" color="primary" @click="sendText">
      Send 555
    </v-btn>
  </div>
</template>

<script>
import io from 'socket.io-client'

var socket = io("http://localhost:3000", {
   withCredentials: true });
 
export default {
  data() {
    return {
      message: [],
    };
  },
  methods: {
    sendText() {
      // การส่งข้อมูลไปยัง server ผ่านทาง chat message
      socket.emit("chat message", 555);
    },
  },
  mounted() {
    socket.emit();
    socket.on("chat message", function(msg) {
      console.log(msg);
    });
    console.log(socket);
  },
};
</script>
