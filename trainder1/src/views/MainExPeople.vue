<template>
    <v-container>

      <h1>Excercise with people</h1>
    <p>hello</p>
    <div style="color:blue">สวัสดี {{callname()}}</div>
    <v-btn @click="postUID">ส่ง uid</v-btn>

  </v-container>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase'



export default {
  data(){
    return{

    }
  },
  methods:{

        callname(){////ชื่อ user 
            let user = firebase.auth().currentUser
            let displayname

            if (user != null) {
                displayname = user.displayName
            }
            return displayname
        },

        async postUID(){
            let user = firebase.auth().currentUser

            axios.post("users",user.uid).then((response) => {
            console.log(JSON.stringify(response.data))})

        },

  },
}
</script>

<style>

</style>