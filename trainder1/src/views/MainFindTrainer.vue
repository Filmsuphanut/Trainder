<template>
  <v-container>
      <v-row
        no-gutters
        style="height: 150px;">

        <v-col>
          <v-card class="ma-2 pa-2" rounded="xl" dark color="primary" height="100%" width="100%" align="center">
            <v-card dark color="primary" outlined height="45%" >
            </v-card>
            <v-btn fab text @click="next"><v-icon x-large>mdi-gesture-swipe-left</v-icon></v-btn>
          </v-card>
        </v-col>

        <v-col cols="12" sm="2" md="9">

        <v-card class="ma-2 pa-2" rounded="xl" dark color="blue" width="100%" height="100%">
 
              <v-window v-model="onboarding">
                <v-carousel-item v-for="(item,i) in trainer_data" :key="`card-${i}`">
                  <v-row align="center" justify="center">
                    <v-card class="ma-5 pa-2" rounded="xl">
                      <v-row align="center" justify="center">
                      <v-card rounded="xl" width="600" height="550">
                        <v-img class="white--text align-end" :src="item.profilePic" height="100%" max-width="600" @click="onDetails(item)">

                          <v-card-title>
                            <v-col cols="8">
                              <v-card class="ma-1 pa-3 semi-transparent" rounded="xl" dark color="primary" width="100%" height="100%" align="left" justify="start"> 
                              {{item.fullName}}<br>เพศ : {{item.Gender}}
                              </v-card>
                            </v-col>
                            <v-col cols="4">
                              <v-card class="ma-2 pa-2 semi-transparent" rounded="xl" dark color="primary" width="100%" height="100%" align="center" justify="center"> 
                              {{item.EC_skill}}
                              </v-card>
                              <v-card class="ma-2 pa-2 semi-transparent" rounded="xl" dark color="primary" width="100%" height="100%" align="center" justify="center">
                              {{item.Purpose}}
                              </v-card>
                            </v-col>
                          </v-card-title>

                        </v-img>
                      </v-card>
                      </v-row>
                    </v-card>
                  </v-row>
                </v-carousel-item>                    
              </v-window>
        </v-card>
    
        </v-col>
        <v-col>
          
          <v-card class="ma-2 pa-2" rounded="xl" dark color="primary" height="100%" width="100%" align="center" >
            <v-card dark color="primary" outlined height="45%" >
            </v-card>          
            <v-btn text fab @click="like"><v-icon x-large >mdi-thumb-up</v-icon></v-btn>
          </v-card>
        </v-col>
      </v-row>

<!-- details -->

<v-dialog v-model="detail_dialog">
  <v-container>
    <v-row align="center" justify="center" >

      <!-- รายละเอียด -->
      <v-card class="ma-4 pa-4" rounded="xl" dark color="primary" width="100%" height="100%">
        <v-row>
          <v-col cols="2">
            <v-card class="ma-2 pa-2" rounded="xl" height="195" width="190">
              <v-img class="white--text align-end" :src="details.profilePic" height="180" width="180"></v-img>
            </v-card> 
          </v-col>
          <v-col cols="4">
            <v-card class="ma-2 pa-4" rounded="xl" color="secondary">
              ชื่อ : {{details.fullName}}<br>
              เพศ : {{details.Gender}}<br>
              วันเกิด : {{details.Birthday}}<br>
              อาชีพ : {{details.Career}}<br>
              ติดต่อ : {{details.PhoneNumber}}<br>
              ทักษะที่ถนัด : {{details.EC_skill}}<br>
              เป้าหมาย : {{details.Purpose}}
            </v-card>
          </v-col>
          <v-col cols="3">

            <v-card class="ma-2 pa-4" rounded="xl" color="green">
              คอร์สที่กำลังเปิดอยู่ :<br>
              <div v-for="(item,i) in trainer_course" :key="i">
                <div v-if="item.id == details.uid">- {{item.name}}</div>
              </div>
            </v-card>

          </v-col>
        </v-row>
      </v-card>

      <!-- เกียรติบัตร -->
      <v-card class="ma-4 pa-4" rounded="xl" dark color="secondary" width="100%" height="100%">
        <v-row class="ma-1">
          <h2>
          เกียรติบัตรที่เกี่ยวข้องกับการออกกำลังกาย
          </h2>
        </v-row>
        <v-row justify="start">
          <v-col cols="4">
            <v-card hidden rounded="xl" height="150" width="250" >
            <v-img class="white--text align-end" :src="details.cert1" height="150" width="250" @click="onViewImage(details.cert1)"></v-img>
            </v-card> 
          </v-col>

          <v-col cols="4" v-if="details.cert2 != null">
            <v-card rounded="xl" height="150" width="250">
              <v-img class="white--text align-end" :src="details.cert2" height="150" width="250" @click="onViewImage(details.cert2)"></v-img>
            </v-card>
          </v-col>
          <v-col cols="3" v-if="details.cert3 != null">
            <v-card rounded="xl" height="150" width="250">
              <v-img class="white--text align-end" :src="details.cert3" height="150" width="250" @click="onViewImage(details.cert3)"></v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</v-dialog>


<!-- view image -->
<v-dialog v-model="viewimage">
  <v-container>
    <v-row align="center" justify="center" >
      <v-img class="white--text align-end" :src="view_img" height="70%" width="70%"></v-img>
    </v-row>
  </v-container>
</v-dialog>

<!-- loading -->
<v-overlay :value="page_loading" :opacity="0.8">
      <v-progress-circular
        :width="20"
        :size="250"
        indeterminate
        color="white"
      ></v-progress-circular><br><br>
      <v-row align="center" justify="center" >กำลังค้นหา Trainer .....</v-row>
</v-overlay>


<!-- like -->


  </v-container>
</template>

<script>

import firebase from 'firebase'
import axios from "axios";
import { mapGetters } from "vuex"

export default {
     computed: {
     ...mapGetters(['getDataById'])
     },
  data(){
    return{

/////userdata
      trainer_data:[],
      //trainer_uid:["9BYUvF26Csh88qaSJqcTLl01aio2", "OWURYweiUZYTLIpjdbQVE2m76ln2", "MIwAq89IgGf4TSWKxhUCKHpg4ew2", "fygy3jorUIO82eFuh9rdj2nYLxz1", "BuUXeK2fpxTK9GkaPXpzaYoNhaj2", "7kvEYIv5iiMjy6OoGl2RyszicIm1", "TmNfIxowq5OsLXXFAWCATlgsoCA2", "3GxUlWaxyFQNCXfsr3Q0WepXMjr1", "Zn6S7MfcoghN8F0GiCED4smHKpk2", "Uq1gB8P3dEbhprLMWVwixBJynCW2"],
      trainer_uid:[],
      trainer_course:[],

///////////slide
      details:[],
      view_img:"",
      length: 0,
      onboarding: 0,

//////////dialog
      detail_dialog:false,
      page_loading:false,
      viewimage:false,

///////////trainer like
      Trainerlike:false,

    }
  },
  methods:{
        // callname(){////ชื่อ user 
        //     let user = firebase.auth().currentUser
        //     let displayname

        //     if (user != null) {
        //         displayname = user.displayName
        //     }
        //     return displayname
        // },
        async connection(){

          this.page_loading = true;
          this.call_uid().then(() =>{

            this.callData(this.trainer_uid);
            this.length = this.trainer_uid.length;
            this.page_loading = false;

          })
        },


        async call_uid(){

          //let uid = this.$store.getters["userData"].data.uid;
          let docId = this.$store.getters["userData"].uid;

          let db = firebase.firestore();
          let userRef = db.collection("userData");
          //let userData = await userRef.where("uid","==",uid).get();
          
          let traineruid = await axios.get("findTrainer/"+docId) //returned top 10 trainer uid

          this.trainer_uid = traineruid.data;
          //console.log(this.trainer_uid);
        },

        async callData(uid_obj){

          let db = firebase.firestore();
          let userRef = db.collection("userData");
          let courseRef = db.collection("Course");

          for(let i in uid_obj){

            let userData = await userRef.where("uid","==",uid_obj[i]).get();
            let userdocid = "";
            
            userData.forEach(doc => {///ข้อมูล
              let data = doc.data()
              data.docid = doc.id;
              userdocid = doc.id
              this.trainer_data.push(data);
            });

            let courseData = await courseRef.where("creator","==",userdocid).get();

            courseData.forEach(doc =>{//หา doc id ของ course
              //couresDocid = doc.id;
              let data = {id:uid_obj[i],name:doc.data().name};
              //console.log(uid_obj[i],doc.data());
              this.trainer_course.push(data);
              //console.log(this.trainer_course);
            })
                       
          }///endfor

        },
        async like(){

          let docid = this.$store.getters["userData"].uid;

          // await this.addFriend(docid,this.trainer_data[this.onboarding].docid).then(() => {
          //   console.log("complete")
          // })

          //let logsId = this.$store.state.friendList[this.trainer_data[this.onboarding].docid].logsId;
          let logsId = this.getDataById(this.trainer_data[this.onboarding].docid).logsId;
          console.log(logsId);

          // await this.sendChat(docid,logsId,"hello world").then(() => {
          //   console.log("send msg")
          // })

        },

////////////////////////////////////// details
        onDetails(e){
          this.details = e;
          this.detail_dialog = true
        },
        onViewImage(e){
          this.viewimage = true;
          this.view_img = e;
        },



///////////////////////////////////////////// next prev

        next() {
          let preonboarding = this.onboarding;
          this.onboarding = this.onboarding + 1 === this.length? 0: this.onboarding + 1;
          
          if((preonboarding == this.length - 1) &&(this.onboarding == 0)){
            this.trainer_data = [];
            console.log('Reconnection...');
            this.connection();  
          }

        },
        prev () {
          this.onboarding = this.onboarding - 1 < 0? this.length - 1: this.onboarding - 1;
        },

///////////////////api

    async addFriend(my_docid,trainer_docid) {
      //this.ready = false;
      // if (this.uid) {

        console.log(`${process.env.VUE_APP_ENDPOINT}/addFriend`);
        try {
          let res = await axios.post(`${process.env.VUE_APP_ENDPOINT}/addFriend`, {
            id1: my_docid,
            id2: trainer_docid,
          });
          alert("Done");
          await this.$store.dispatch("fetchFriends");
          this.overlay = false;
        } catch (err) {
          alert(err);
        }

      // } 
      
      // else {
      //   this.$refs["uid1"].validate(true);
      // }
      //this.ready = true;
    },

    async sendChat(my_docid,log_docid,msg) {

      await axios.put("saveLog", {
        // LogRef: this.user.logDoc,
        // sender: this.user.current.uid,
        LogRef:log_docid,
        sender:my_docid,
        msg: msg,
        date: new Date().toLocaleTimeString(),
      });
    },


  },
  
  mounted(){
    this.connection();
  }

  
}
</script>

<style scpoped>
.semi-transparent {
   opacity: 0.9;
 }
.semi-transparent-blue {
   background-color: #005696 !important;
   opacity: 0.75;
 }
.box {
  background-color: rgb(255, 255, 255);
  border: 2px solid rgb(205, 205, 253);
  padding: 5% 15% 10% 15%;
  border-radius: 10px;
  text-align: center;
  width: 100%;
  height: 100%;
  box-shadow: 2;
  /* 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12); */
}
</style>