<template>
  <v-container>
    <br>
      <v-row
        no-gutters
        style="height: 150px;">

        <v-col>
          <v-card class="ma-5 pa-5" rounded="xl" dark color="primary"
            height="100%"
            width="100%">

            <v-btn text @click="prev">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
           
            </v-card>
        </v-col>

        <v-col cols="12" sm="2" md="9">
            
        <v-card class="ma-5 pa-5" rounded="xl" dark color="primary" width="100%" height="100%">    
              <v-window   v-model="onboarding" reverse>
                <v-window-item
                  v-for="n in length"
                  :key="`card-${n}`">

                    <v-row class="fill-height"
                      align="center"
                      justify="center">

                      <v-img
                        src='../images/Slide3.jpg'
                      ></v-img>


                    </v-row>
                </v-window-item>
              </v-window>
        </v-card>
        
        </v-col>

        <v-col>
          <v-card class="ma-5 pa-5" rounded="xl" dark color="primary"
            height="100%"
            width="100%">
            
            <v-btn text @click="next">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            
            </v-card>
        </v-col>

      </v-row>


<!-- <v-row>
    <v-col>
      <v-btn
        text
        @click="prev">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>    
    </v-col>
    <v-col>





    </v-col>
    <v-spacer></v-spacer>
    <v-col>
      <v-btn
        text
        @click="next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

    </v-col>
  </v-row>  -->



<!-- 
 <v-card-actions class="justify-space-between" >
      <v-btn
        text
        @click="prev"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-item-group
        v-model="onboarding"
        class="text-center"
        mandatory>
      </v-item-group>


      <v-btn
        text
        @click="next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions> -->

    







<!--   <v-carousel hide-delimiters>
    <v-carousel-item
      v-for="(item,i) in items"
      :key="i"
      :src="item.src"
    ></v-carousel-item>
  </v-carousel> -->
  </v-container>
</template>

<script>

import firebase from 'firebase'
import axios from "axios";

export default {
  data(){
    return{
      trainer_uid:[],
      length: 10,
      onboarding: 0,
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
        async call_uid(){

          let uid = this.$store.getters["userData"].data.uid;
          let db = firebase.firestore();
          let userRef = db.collection("userData");
          let userData = await userRef.where("uid","==",uid).get();
          let docId ;

          userData.forEach(doc => {
            docId = doc.id;
          })

          let traineruid = await axios.get("http://localhost:5000/findTrainer/"+docId)

          this.trainer_uid = traineruid.data;
          console.log(this.trainer_uid);
        },
        next () {
          this.onboarding = this.onboarding + 1 === this.length
            ? 0
            : this.onboarding + 1
        },
        prev () {
          this.onboarding = this.onboarding - 1 < 0
            ? this.length - 1
            : this.onboarding - 1

        },
  },
}
</script>

<style>

</style>