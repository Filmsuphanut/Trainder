<template>

   <v-container>
       <Auth/>
        <h1>สวัสดี {{callname()}}</h1>

    </v-container>
</template>


<script>
import Auth from '../views/Auth'
import firebase from 'firebase'

export default {
     name : 'index',
    data(){
        return{

        }
    },
    methods:{
        callname(){////ยืนยันตัวตนของ user 

            let user = firebase.auth().currentUser
            let displayname

            if (user != null) {
                displayname = user.displayName
                            // The user's ID, unique to the Firebase project. Do NOT use
                            // this value to authenticate with your backend server, if
                            // you have one. Use User.getToken() instead.
            }
            return displayname
        },

    },
    components: {
        Auth,
    }

}
</script>