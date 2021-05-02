<template>
  <v-container>
    <v-card class="ma-5 pa-6" rounded="xl" color="primary">
      <h2 style="color:white" class="ma-3">
        <v-avatar color="white"
          ><v-icon color="accent">mdi-calendar-blank-multiple</v-icon></v-avatar
        >
        ตารางออกกำลังกายของคุณ
      </h2>

      <div class="bigbox">
        <v-sheet tile height="54" rounded="xl" class="d-flex">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <v-btn outlined class="ma-2" @click="addEventDialog = true" rounded color="primary" dark>
            เพิ่มกิจกรรมใหม่
          </v-btn>

          <v-btn outlined class="ma-2" @click="setToday" rounded color="primary" dark>
            ดูกิจกรรมวันนี้
          </v-btn>

          <v-toolbar-title outlined class="ma-3">{{ title }}</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn
            v-if="type == 'day'"
            outlined
            class="ma-2"
            @click="backViewDay"
            rounded
            color="primary"
          >
            กลับ
          </v-btn>

          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>

        <v-sheet height="600">
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
      </div>

      <!--@change=""-->
    </v-card>

    <v-dialog v-model="addEventDialog" max-width="500">
      <v-card color="#fce5e5" height="430">
        <v-container>
          <v-form ref="addEventform" @submit.prevent="addEvent">
            <v-text-field
              v-model="eventname"
              type="text"
              label="ชื่อกิจกรรม"
              :rules="checkdata"
            ></v-text-field>
            <v-text-field
              v-model="eventdetails"
              type="text"
              label="รายละเอียด"
              :rules="checkdata"
            ></v-text-field>
            <v-text-field
              v-model="eventstart"
              type="datetime-local"
              label="วันและเวลาเริ่มต้น"
            ></v-text-field>
            <v-text-field
              v-model="eventend"
              type="datetime-local"
              label="วันและเวลาสุดท้าย"
            ></v-text-field>
            <p
              style="font-size: 15px; color: red"
              v-if="eventstart >= eventend"
            >
              **วันและเวลาสุดท้ายต้องมากกว่าเริ่มต้น
            </p>
            <v-text-field
              v-model="eventcolor"
              type="color"
              label="เลือกสีสำหรับกิจกรรมของคุณ"
              :rules="checkdata"
            ></v-text-field>
            <v-row justify="end">
              <v-btn type="submit" color="primay" class="mr-4"
                >สร้างกิจกรรมใหม่</v-btn
              >
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- clickevent -->
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
    >
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar :color="selectedEvent.color" dark>
          <v-btn icon @click="deleteEvent(selectedEvent)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form v-if="currentlyEditing !== selectedEvent.id">
            {{ selectedEvent.details }}
          </v-form>

          <v-form v-else>
            <v-text-field
              v-model="selectedEvent.name"
              type="text"
              label="name"
            ></v-text-field>
            <textarea
              v-model="selectedEvent.details"
              type="text"
              style="width: 100%"
              :min-height="100"
              placeholder="add note"
            >
            </textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            text
            v-if="currentlyEditing !== selectedEvent.id"
            @click.prevent="editEvent(selectedEvent)"
            >แก้ไขกิจกรรม</v-btn
          >
          <v-btn text v-else @click.prevent="updateEvent(selectedEvent)"
            >บันทึก</v-btn
          >
          <v-btn
            text
            color="secondary"
            @click="
              (selectedOpen = false),
                (currentlyEditing = null),
                (selectedEvent.name = pre_eventname),
                (selectedEvent.details = pre_eventdetails)
            "
            >ปิด</v-btn
          >
        </v-card-actions>

        <!--บัคนิดหน่อย 
        เอาส่วนนี้ออกเพราะเกิดบัค
        (pre_eventname = null),
        (pre_eventdetails = null)-->
      </v-card>
    </v-menu>

    <!--- v card -->

    <!-- snack bar -->
    <v-dialog v-model="snackbar" max-width="400">
      <v-card dark color="white">
        <v-toolbar color="primary">
          <v-row>
            <v-col cols="1">
              <v-icon color="accent">mdi-alert</v-icon>
            </v-col>
            <v-col cols="5">
              แจ้งเตือน
            </v-col>
          </v-row> </v-toolbar
        ><br />
        <v-card-text>
          <p style="color:gray">
            ไม่สามารถเพิ่มได้ เนื่องจากเวลาของกิจกรรมซ้ำกับกิจกรรมอื่น
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  name: "UserTable",
  data() {
    return {
      type: "month",
      pre_type: "month",
      types: ["month", "week"],
      mode: "stack",
      value: new Date().toISOString().substr(0, 10),
      today: new Date().toISOString().substr(0, 10),
      events: [],
      start: null,
      end: null,

      //////////////////// event
      userDocid: null,
      eventname: null,
      eventstart: new Date().toISOString().substr(0, 16),
      eventdetails: null,
      eventcolor: null,
      eventend: new Date().toISOString().substr(0, 16),
      addEventDialog: false,

      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      currentlyEditing: null,

      pre_eventname: null,
      pre_eventdetails: null,

      ////////////////// rule
      checkdata: [
        (val) => !!val || (val || "").length > 0 || "โปรดกรอกฟิลด์นี้",
      ],
      snackbar: false,
    };
  },
  methods: {
    async getEvents() {
      this.fetchEvent();
      //let user = firebase.auth().currentUser;
      let user = this.$store.getters["userData"].data;
      let uid = user.uid;
      let db = firebase.firestore();
      let tableRef = db.collection("Table");
      let userData = await tableRef.where("uid", "==", uid).get();

      userData.forEach((doc) => {
        this.userDocid = doc.id;
        //console.log(doc.id, '=>', doc.data());
      });

      let userEvent = await tableRef
        .doc(this.userDocid)
        .collection("Event")
        .get();

      userEvent.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        if (JSON.stringify(doc.data()) != "{}") {
          let EventData = doc.data();
          EventData.id = doc.id;
          this.events.push(EventData);
        }
      });
    },
    async isCollision(newEvent_start, newEvent_end) {
      this.fetchEvent();
      //let user = firebase.auth().currentUser;
      let user = this.$store.getters["userData"].data;
      let uid = user.uid;
      let db = firebase.firestore();
      let tableRef = db.collection("Table");
      let userData = await tableRef.where("uid", "==", uid).get();

      userData.forEach((doc) => {
        this.userDocid = doc.id;
        //console.log(doc.id, '=>', doc.data());
      });

      let userEvent = await tableRef
        .doc(this.userDocid)
        .collection("Event")
        .get();
      let allEvent = [];
      userEvent.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        if (JSON.stringify(doc.data()) != "{}") {
          let EventData = doc.data();
          EventData.id = doc.id;
          allEvent.push(EventData);
        }
      });

      console.log(
        "newStart :",
        newEvent_start,
        "new Event end :",
        newEvent_end
      );
      console.log(
        "%c In loop check collide! ",
        "background: #222; color: #bada55"
      );
      for (const oldEvent of allEvent) {
        console.log("Old = > start : ", oldEvent.start, "End :", oldEvent.end);
        if (
          (newEvent_start >= oldEvent.start &&
            newEvent_start <= oldEvent.end) ||
          (newEvent_end >= oldEvent.start && newEvent_end <= oldEvent.end) ||
          (oldEvent.start >= newEvent_start &&
            oldEvent.start <= newEvent_end) ||
          (oldEvent.end >= newEvent_start && oldEvent.end <= newEvent_end)
        ) {
          console.log("%c Collide", "background: #222 ;color: #bada55");
          return true;
        }
      }
      return false;
    },

    async addEvent() {
      ///// บัค start กี่โมงก็ได้แต่ end เที่ยงคืน = ไม่ขึ้น

      if (
        this.$refs.addEventform.validate() &&
        this.eventstart < this.eventend
      ) {
        let db = firebase.firestore();
        let tableRef = db.collection("Table");
        var Creator = "Owner";
        let st = this.eventstart;
        let ed = this.eventend;

        if (
          this.eventstart.substr(11, 16) == "00:00" &&
          this.eventend.substr(11, 16) == "00:00" &&
          this.eventstart.substr(11, 16) == this.eventend.substr(11, 16)
        ) {
          st =
            this.eventstart.substr(11, 16) != "00:00"
              ? this.eventstart
              : this.eventstart.substr(0, 10);
          ed =
            this.eventend.substr(11, 16) != "00:00"
              ? this.eventend
              : this.eventend.substr(0, 10);
        } else if (this.eventend.substr(11, 16) == "00:00") {
          ed = this.eventend.substr(0, 15) + "1";
        }

        var collision = await this.isCollision(this.eventstart, this.eventend);
        console.log("It is >>>>> " + collision);

        if (!collision) {
          tableRef
            .doc(this.userDocid)
            .collection("Event")
            .add({
              name: this.eventname,
              start: st,
              end: ed,
              details: this.eventdetails,
              color: this.eventcolor,
              creator: Creator,
            });

          this.addEventDialog = false;

          this.eventname = null;
          //this.eventstart = new Date().toISOString().substr(0, 16);
          this.eventdetails = null;
          //this.eventend  = new Date().toISOString().substr(0, 16);
          this.eventcolor = null;
          /*
            this.events.push({
              name: this.eventname,
              start: this.eventstart,
              end: this.eventend,
              color: this.eventcolor,
            })
            */
        } else {
          //  Notication to user
          // nice ! ! !
          this.snackbar = true;
          console.log("%c Get collision", "background: #222 ;color: #bada55");
        }

        this.getEvents();

        console.log(this.events);
      } else {
        console.log("มีบางอย่างไม่ถูกต้อง...");
      }
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        this.pre_eventname = event.name;
        this.pre_eventdetails = event.details;
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

    editEvent(ev) {
      this.currentlyEditing = ev.id;
      this.pre_eventname = ev.name;
      this.pre_eventdetails = ev.details;
      console.log(this.pre_eventname);
    },

    async updateEvent(ev) {
      let db = firebase.firestore();
      let tableRef = db.collection("Table");

      await tableRef
        .doc(this.userDocid)
        .collection("Event")
        .doc(ev.id)
        .update({
          details: ev.details,
          name: ev.name,
        });
      this.selectedOpen = false;
      this.currentlyEditing = null;

      this.getEvents();

      console.log(ev.id, "updateEvent successfully");
    },
    async deleteEvent(ev) {
      let db = firebase.firestore();
      let tableRef = db.collection("Table");

      await tableRef
        .doc(this.userDocid)
        .collection("Event")
        .doc(ev.id)
        .delete();
      this.selectedOpen = false;

      this.getEvents();
      console.log(ev.id, "delete successfully");
    },
    fetchEvent() {
      this.events = [];
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
      this.type = "month";
    },
    setToday() {
      this.value = this.today;
      this.pre_type = this.type;
      this.type = "day";
      this.eventstart = new Date(this.today).toISOString().substr(0, 16);
      this.eventend = new Date(this.today).toISOString().substr(0, 16);
    },

    updateRange({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },

    callname() {
      let user = this.$store.getters["userData"];
      //let displayname

      // if (user != null) {
      //     displayname = user.displayName
      return user.data.fullName;
      // }
    },
    back() {
      let previous = this.$store.state.previous.pre;
      this.$router.push(previous);
    },
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
  mounted() {
    this.getEvents();
    this.$refs.calendar.checkChange();
  },
};

/* Comment 
getEvents ({ start, end }) {
        const events = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: first,
            end: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          })
        }

        this.events = events
        console.log(this.events)
      },*/
</script>

<style scoped>
.bigbox {
  background-color: rgb(255, 255, 255);
  text-align: center;
  padding: 2% 2% 2% 2%;
  width: 100%;
  height: 100%;
  border: 2px solid rgb(198, 66, 66);
  border-radius: 10px;
}
</style>
