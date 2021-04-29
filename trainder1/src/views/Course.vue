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
                    <v-btn fab small dark color="lime">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="1" class="text-center">
                    <v-btn fab small dark color="red">
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
    //   courses: [
    //     {
    //       name: "นัดยิ้มที่ริมบึง",
    //       description: "I love pussy and ass",
    //       start: "2020-04-29",
    //       end: "2020-05-29",
    //       purpose: "Arobic in the bed",
    //       genre: "pussy",
    //     },
    //  ],
    courses:[],
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
        // CourseDocid = doc.id;
      });

      // let CourseList = await courseRef.doc(CourseDocid).collection("List").get();
      // console.log(CourseList)

      // CourseList.forEach(doc => {
      //    console.log(doc.id," => ",doc.data())
      //    if(JSON.stringify(doc.data()) != "{}"){
      //        this.list.push(doc.data())
      //    }
      // })
    },

    callname() {
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
