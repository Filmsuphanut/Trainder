<template>
  <v-container>

    <!-- <v-btn @click="back" fab><v-icon center>arrow_back_ios</v-icon></v-btn><br><br> -->
    <v-row>
      <v-col cols="12">
        <v-card class="ma-5 pa-6" rounded="xl" dark color="primary">
          <v-row class="ma-2">
            
            <h2>
              <v-avatar color="white"><v-icon color="accent">mdi-folder-multiple</v-icon></v-avatar>
              Course Detail
            </h2>

            <v-spacer></v-spacer>
            <v-btn rounded="xl" class="text-center pa-2" color="accent" @click="Router_CreCourse">Create Course</v-btn>
          </v-row>
        
          <!-- Grid title -->

          <v-row class="my-3">
            <v-col
              v-for="(t, index) in title"
              :key="index"
              :cols="column[index]"
            >
              <v-card rounded="xl" class="text-center pa-2" color="accent">
                {{ t }}
              </v-card>
            </v-col>
          </v-row>

          <v-row v-for="course in courses" :key="course">
            <v-col cols="12">
              <v-card rounded="xl" color="secondary">
                <v-row>
                  <v-col cols="2" class="pl-6">
                    {{ course.name }}
                  </v-col>
                  <v-col cols="4" class="pl-6">
                    {{ course.description }}
                  </v-col>
                  <v-col cols="1" class="text-center">
                    {{ course.start }}
                  </v-col>
                  <v-col cols="1" class="text-center">
                    {{ course.end }}
                  </v-col>
                  <v-col cols="1" class="pl-6">
                    {{ course.purpose }}
                  </v-col>
                  <v-col cols="1" class="pl-6">
                    {{ course.genre }}
                  </v-col>
                  <v-col cols="1" class="text-center">
                    <v-btn fab small dark color="lime" @click="Router_EditCourse(course.id)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="1" class="text-center">
                    <v-btn fab small dark color="red" @click="snackdelete=true,del_id = course.id">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          
        </v-card>
      </v-col>
    </v-row>

<!-- dialog -->
  <v-dialog v-model="snackdelete" max-width="400" absolute persistent>
    <v-card dark color="white">
      <v-toolbar color="primary">
        <v-row>
          <v-col cols="1">
            <v-icon color="accent">mdi-check-bold</v-icon>
          </v-col>
          <v-col cols="5">
            แจ้งเตือน
          </v-col>
        </v-row>
      </v-toolbar><br>
      <v-card-text>
        <p style="color:gray">คุณต้องการลบคอร์สนี้หรือไม่</p>
      </v-card-text>
      <v-divider></v-divider>
        <v-card-actions>
          <v-btn class="white--text" color="green" @click="snackdelete=false" :loading="loading">
            ยกเลิก
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="white--text" color="red" @click="delete_Course(),loading=true" :loading="loading">
            ตกลง
          </v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>


  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Course",
  data() {
    return {
      column: ["2", "4", "1", "1", "1", "1", "1", "1"],
      title: [
        "Course Name",
        "Course Detail",
        "Start",
        "End",
        "Type",
        "Goal",
        "Edit",
        "Delete",
      ],

    courses:[],

    /////alert
    snackdelete:false,
    del_id:null,
    loading:false,


    };
  },
  methods: {
    async callCourse() {
      let user = this.$store.getters["userData"].data;
      let db = firebase.firestore();
      let courseRef = db.collection("Course");
      let trainerCourse = await courseRef
        .where("creator", "==", user.uid)
        .get();
      //let CourseDocid;

      trainerCourse.forEach((doc) => {
        this.courses.push(doc.data());
        console.log(doc.id, doc.data());

      });
    },

    async delete_Course(){

      let uid = this.$store.getters["userData"].data.uid;

      let db = firebase.firestore();
      let courseRef = db.collection("Course");
      let tableRef = db.collection("Table");
      let courseData = await courseRef.where("id","==",this.del_id).get();
      let tableData = await tableRef.where("uid","==",uid).get();
      let table_id
      let course_id;

      let table_del_doc = [];

      courseData.forEach(doc => {
        course_id = doc.id
      });

      tableData.forEach(doc => {
        table_id = doc.id;
      });

      let eventData = await tableRef.doc(table_id).collection("Event").get();

      eventData.forEach(doc => {
        if(doc.data().course_id == this.del_id){
          table_del_doc.push(doc.id);
        }
      })

      console.log(table_del_doc);
      for(let key in table_del_doc){
         await tableRef.doc(table_id).collection("Event").doc(table_del_doc[key]).delete();
      }


      await courseRef.doc(course_id).delete();


      this.snackdelete = false;
      this.loading = false;
      this.del_id = null;
      this.courses = [];
      this.callCourse();
      

    },



    callname(){
      let user = this.$store.getters["userData"];
      return user.data.fullName;
    },
    back() {
      let previous = this.$store.state.previous.pre;
      this.$router.push(previous);
    },
    Router_CreCourse() {
      this.setPrevious();
      this.$router.push("/Course/CreateCourse");
    },
    Router_EditCourse(e) {
      this.setPrevious();
      //console.log(e);
      this.$router.push(`/Course/EditCourse?id=${e}`);
    },
    setPrevious() {
      if (this.$store.state.previous.pre !== "/Course") {
        this.$store.commit("setPreviousPage", "/Course");
      }
    },
  },
  mounted() {
    this.$store.commit("setPreviousPage", "/TrainerHome");
    this.callCourse();
  },
};
</script>

<style></style>
