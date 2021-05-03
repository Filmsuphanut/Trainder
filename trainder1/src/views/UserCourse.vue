<template>
  <v-container>
    <v-row justify="center">
      <v-card class="ma-4 pa-8" rounded="xl" color="secondary" width="980">
        <v-row justify="center">
          <v-sheet color="white" width="100%" rounded="xl">
            <v-toolbar color="primary" height="80" width="100%" dark>
              <h2>
                <v-avatar color="white"
                  ><v-icon color="accent" x-large>mdi-dumbbell</v-icon></v-avatar
                >
                คอร์สของฉัน
              </h2>
            </v-toolbar>

            <br /><br />

            <v-row justify="center">
              <v-card width="800" flat>
                <v-expansion-panels popout>
                  <v-expansion-panel v-for="(item, i) in my_course" :key="i">
                    <v-expansion-panel-header
                      expand-icon="mdi-menu-down"
                      dark
                      color="secondary"
                      >{{ item.name }}</v-expansion-panel-header
                    >
                    <v-expansion-panel-content
                      ><br />

                      <v-row justify="start">
                        <v-card class="ma-1" flat>
                          <v-card-text class="black--text">
                            ชื่อคอร์ส: {{ item.name }}<br />
                            รายละเอียดคอร์ส: {{ item.description }}<br />
                            ชื่อเทรนเนอร์: {{ item.creatorname }}<br />
                            วันเริ่มคอร์ส: {{ item.start }}<br />
                            วันจบคอร์ส: {{ item.end }}<br />
                            ประเภท: {{ item.genre }}<br />
                            วัตถุประสงค์: {{ item.purpose }}<br />
                          </v-card-text>
                        </v-card>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-card-text
                  class="d-flex flex-row justify-center"
                  v-if="my_course.length == 0"
                  >ยังไม่มีคอร์สเหรอ หา Trainer ดีๆ ใน Excercise with trainer
                  สิ</v-card-text
                >
              </v-card>
            </v-row>

            <v-row>
              <v-card flat height="80"> </v-card>
            </v-row>
          </v-sheet>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "UserCourse",
  data() {
    return {
      my_course: [],
    };
  },
  methods: {
    /////////////////////firebase
    async call_myCourse() {
      let user = this.$store.getters["userData"];
      let db = firebase.firestore();
      let courseRef = await db.collection("Course").get();

      courseRef.forEach((doc) => {
        let member = doc.data().member;
        //console.log(doc.id);
        if (member.includes(user.uid)) {
          let d = { ...doc.data() };
          d.creatorname = "";
          this.my_course.push({ ...d });
        }
      });
    },
    async call_trainername() {
      let user = this.$store.getters["userData"].data;
      let db = firebase.firestore();
      let courseRef = await db.collection("userData").get();
      //console.log(this.my_course);

      this.my_course.forEach((data) => {
        console.log(data.creator);
        courseRef.forEach((doc) => {
          if (doc.data().uid == data.creator) {
            data.creatorname = doc.data().fullName;
          }
        });
      });
    },
    //////////////////default method
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
      this.$router.push("/CreateCourse");
    },
    setPrevious() {
      if (this.$store.state.previous.pre !== "/Course") {
        this.$store.commit("setPreviousPage", "/Course");
      }
    },
  },
  async mounted() {
    await this.call_myCourse();
    await this.call_trainername();
    console.log(this.my_course);
    //this.$store.commit("setPreviousPage","/TrainerHome");
  },
};
</script>

<style></style>
