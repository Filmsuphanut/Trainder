<template>
  <v-container>

<div class="bigbox">
    <v-row justify="start">
        <v-btn @click="back"><v-icon center>arrow_back_ios</v-icon></v-btn>
    </v-row>

    <br><br>
    <h3 align="left">ตารางออกกำลังกายของคุณ {{callname()}} </h3><br>

  <div>
    <v-sheet
      tile
      height="54"
      class="d-flex"
    >
      <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-btn         
        outlined
        class="ma-2"
        @click="addEvent">
        เพิ่มกิจกรรมใหม่
      </v-btn>

      <v-btn         
        outlined
        class="ma-2"
        @click="setToday">
        ดูกิจกรรมวันนี้
      </v-btn>

      <v-toolbar-title outlined
        class="ma-3">{{ title }}</v-toolbar-title>

      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      ></v-select>

      <v-spacer></v-spacer>
      <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.next()"
      >
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
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @change="updateRange"
      ></v-calendar>
    </v-sheet>
  </div>

<!--@change=""-->
</div>
  </v-container>
</template>



<script>

import firebase from "firebase";

  export default {
    name:"UserTable",
    data(){
        return{
            type: 'month',
            types: ['month', 'week', 'day'],
            value: new Date().toISOString().substr(0, 10),
            today: new Date().toISOString().substr(0, 10),
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
            start: null,
            end: null,
        }
    },
    methods: {

      async addEvent(){

        let user = firebase.auth().currentUser;
        let uid = user.uid;
        let db = firebase.firestore();
        let tableRef = db.collection("Table");
        let userData = await tableRef.where("uid", "==", uid).get();

        let docid = null;

        userData.forEach(doc => {
          docid = doc.id;
          console.log(doc.id, '=>', doc.data());
        });

        let userEvent = await tableRef.doc(docid).collection("Event").get();

        userEvent.forEach(doc => {
            console.log(doc.id, " => ", doc.data());
            this.events.push(doc.data());
        });


        //console.log(userEvent)

      },


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
      },
      getEventColor (event) {
        return event.color
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },


      setToday () {
        this.value = this.today;
        this.type = 'day';
      },
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },


    callname(){
        let user = firebase.auth().currentUser
        let displayname

        if (user != null) {
            displayname = user.displayName
        return displayname
        }
    },
    back() {
        let previous = this.$store.state.previous.pre;
        this.$router.push(previous);
    },

    },
    computed: {
      title () {

        const { start, end } = this
        if (!start || !end) {
          
          return ''
        }
      
        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day //+ this.nth(start.day)
        const endDay = end.day //+ this.nth(end.day)

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
            if((this.monthFormatter(start)==this.monthFormatter(end)) && (start.year==end.year)){
              return `${startDay} - ${endDay} ${startMonth}  ${startYear}`
            }else if((this.monthFormatter(start)!=this.monthFormatter(end)) && (start.year==end.year)){
              return `${startDay} ${startMonth} ${startYear} - ${endDay} ${suffixMonth} ${startYear}` 
            }else{
              return `${startDay} ${startMonth} ${startYear} - ${endDay} ${suffixMonth} ${suffixYear}`
            }

            //return `${startDay} ${startMonth}  ${startYear} - ${endDay} ${suffixMonth} ${suffixYear}`

            
          case 'day':
            return `${startDay} ${startMonth}  ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },

  }
</script>

<style scoped>

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

</style>