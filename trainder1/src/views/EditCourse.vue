<template>
  <v-container>
  <v-card>
    <v-tabs background-color="primary" right >
      <v-sheet rounded="xl" color="primary">
        <v-card-text>
          <h3 align="left" style="color:white">รายละเอียดคอร์สของคุณ</h3>
        </v-card-text>
        
      </v-sheet>
      <v-spacer></v-spacer>
      <v-tab><v-icon>mdi-file-multiple-outline</v-icon>ข้อมูลคอร์ส</v-tab>
      <v-tab><v-icon>mdi-calendar-check-outline</v-icon>ตารางคอร์ส</v-tab>

    <v-tab-item >
      <v-card color="secondary" flat>
      <v-row justify="center" align="center" >
      <v-card elevation="4" class="ma-7 pa-4" width="600" height="800">

        <v-card class="ma-2 pa-1" rounded="xl" dark color="primary" width="250">
          <v-col>
            <v-toolbar-title><v-icon>mdi-file-multiple-outline</v-icon>ข้อมูลคอร์สของคุณ</v-toolbar-title>
          </v-col>
        </v-card>

        <v-form ref="Courseform" @submit.prevent="updateCourse">

          <v-sheet height="30"></v-sheet>
          <v-text-field v-model="CourseData.name" type="text" label="ชื่อคอร์ส" outlined :rules="checkdata"></v-text-field>
          <v-textarea v-model="CourseData.description" type="text" outlined label="รายละเอียดคอร์ส"></v-textarea>

          <v-select v-model="CourseData.purpose"
            :items="['ลดน้ำหนัก',
              'เพิ่มกล้ามเนื้อ',
              'หุ่นที่ดี',
              'เพื่อสุขภาพ',]"
            label="เป้าหมายของคอร์ส"
            :rules="checkdata" outlined
          ></v-select>

          <v-select v-model="CourseData.genre"
             :items="[
              'เวทเทรนนิ่ง',
              'แอโรบิค',
              'ออกกำลังกายทั่วไป',
              'โยคะ',
              'คาร์ดิโอ',
              'อื่นๆ',]"
            label="ประเภทของคอร์ส"
            :rules="checkdata" outlined
          ></v-select>

          <v-text-field v-model="CourseData.start" type="date" label="วันเริ่มคอร์ส" outlined disabled></v-text-field>
          <v-text-field v-model="CourseData.end" type="date" label="วันจบคอร์ส" outlined disabled></v-text-field>


          <v-row justify="end">
            <v-btn type="submit" color="primay" class="mr-4" :loading="loading">อัพเดทข้อมูลคอร์ส</v-btn>
          </v-row>

        </v-form>
        </v-card>
        </v-row>
      
      </v-card>
      </v-tab-item>


<!-- course table -->
      <v-tab-item>
        <v-card color="secondary" flat>
        <v-row justify="center" align="center" >
        <v-card elevation="4" class="ma-7 pa-2" width="900" height="750">

        <v-card class="ma-2 pa-1" rounded="xl" dark color="primary" width="400">
          <v-col>
            <v-toolbar-title width="400"><v-icon>mdi-calendar</v-icon>ตารางออกกำลังกายใน Course ของคุณ</v-toolbar-title>
          </v-col>
        </v-card>

        <v-card>
        <v-sheet tile class="d-flex">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title outlined class="ma-3"><p style="font-size:18px">{{ title }}</p></v-toolbar-title>


          <v-spacer></v-spacer>

          <v-btn v-if="type == 'day'" outlined class="ma-2" @click="backViewDay">กลับ</v-btn>
          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>

        <v-sheet height="600" width="100%">
          <v-calendar
            ref="calendar"
            v-model="value"
            color="primary"
            :short-intervals="false"
            :weekdays="[0, 1, 2, 3, 4, 5, 6]"
            :type="type"
            :events="events"
            :now="today"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            @change="updateRange"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
          ></v-calendar>
        </v-sheet>
        </v-card>



        </v-card>
        </v-row>
        </v-card>
      </v-tab-item>

    </v-tabs>
</v-card>

    <!--  table dialog -->
    <v-dialog v-model="selectedOpen" max-width="500">
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar :color="selectedEvent.color" dark>
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <br />
          <v-form>
            {{ selectedEvent.details }}
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

<!-- snackbar -->

  <v-dialog v-model="snackupdate" max-width="400">
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
          <p style="color:gray">อัพเดทข้อมูลคอร์สเรียบร้อย</p>
          </v-card-text>
    </v-card>
  </v-dialog>

  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "EditCourse",
  data() {
    return {
    ////////////course
        CourseData:null,
        courseid:null,
    
        ///////////////////////////table
        type: "month",
        //pre_type: "month",
        types: ["month", "week"],
        mode: "stack",
        value: new Date().toISOString().substr(0, 10),
        today: new Date().toISOString().substr(0, 10),
        events: [],
        start: null,
        end: null,

        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        currentlyEditing: null,

        /////////////rule
        checkdata: [(val) => !!val ||(val || "").length > 0 || "โปรดกรอกฟิลด์นี้"],
        loading:false,
        snackupdate:false,

    };
  },
  methods: {
    back() {
      let previous = this.$store.state.previous.pre;
      this.$router.push(previous);
    },

    ///////////////////////// course method

    async CallCourse(id) {
      // let user = this.$store.getters["userData"].data;
      let db = firebase.firestore();
      let courseRef = db.collection("Course");
      let trainerCourse = await courseRef.where("id", "==", id).get();
      let eventDocid;
      let userData;

      trainerCourse.forEach((doc) => {
        eventDocid = doc.id;
        userData = doc.data();
      });

    this.CourseData = userData;

      let event = await courseRef
        .doc(eventDocid)
        .collection("Event")
        .get();

      event.forEach((doc) => {
        if (JSON.stringify(doc.data()) != "{}") {
          let data = doc.data();
          console.log(data);
          //data.id = doc.id;
          this.events.push(data);
        }
      });
      //console.log(this.events);
    },

    async updateCourse(){

        this.loading = true;
        if(this.$refs.Courseform.validate()){

            let db = firebase.firestore()
            let courseRef = db.collection("Course");
            let trianerCourse = await courseRef.where("id","==",this.courseid).get();
            let course_docid;

            trianerCourse.forEach(doc => {
              course_docid = doc.id;
            })

            courseRef.doc(course_docid).update({
              name:this.CourseData.name,
              description:this.CourseData.description,
              genre:this.CourseData.genre,
              purpose:this.CourseData.purpose,
            }).then(() =>{
              this.snackupdate = true;
              this.loading = false;
            })

        }else{
            this.loading = false;
        }
        
    },


    /////////////////////////////////////// table methods
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    viewDay({ date }) {
      this.value = date;
      //this.pre_type = this.type;
      this.type = "day";
      this.eventstart = new Date(date).toISOString().substr(0, 16);
      this.eventend = new Date(date).toISOString().substr(0, 16);
    },
    backViewDay() {
      this.value = this.today;
      //this.type = this.pre_type;
      this.type = 'month';
    },

    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },

    //////////////////mounted
  },
  mounted() {
    this.courseid = this.$route.query.id;

    this.CallCourse(this.courseid);
  },
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day; //+ this.nth(start.day)
      const endDay = end.day; //+ this.nth(end.day)

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
          if (
            this.monthFormatter(start) == this.monthFormatter(end) &&
            start.year == end.year
          ) {
            return `${startDay} - ${endDay} ${startMonth}  ${startYear}`;
          } else if (
            this.monthFormatter(start) != this.monthFormatter(end) &&
            start.year == end.year
          ) {
            return `${startDay} ${startMonth} ${startYear} - ${endDay} ${suffixMonth} ${startYear}`;
          } else {
            return `${startDay} ${startMonth} ${startYear} - ${endDay} ${suffixMonth} ${suffixYear}`;
          }

        //return `${startDay} ${startMonth}  ${startYear} - ${endDay} ${suffixMonth} ${suffixYear}`

        case "day":
          return `${startDay} ${startMonth}  ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },
  },
};
</script>

<style scoped>
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
.boxtable {
  background-color: rgb(255, 255, 255);
  border: 2px solid rgb(205, 205, 253);
  padding: 5% 5% 5% 5%;
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
.bigbox {
  background-color: rgb(255, 255, 255);
  text-align: center;
  padding: 2% 2% 2% 2%;
  width: 100%;
  height: 100%;
  border: 2px solid rgb(152, 152, 255);
  border-radius: 10px;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
}

.tab {
  margin-left: auto;
  margin-right: auto;
}
</style>
