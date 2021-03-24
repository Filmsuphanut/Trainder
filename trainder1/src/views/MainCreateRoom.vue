<template>
    <v-container>

      <h1>Create Room</h1>
    <p>hello</p>

  </v-container>
</template>

<script>

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
  },
}
</script>

<style>

</style>