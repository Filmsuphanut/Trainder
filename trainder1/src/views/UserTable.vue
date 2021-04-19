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
        @click="addEventDialog=true">
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






      <v-spacer></v-spacer>

      <!-- <v-select v-if="type!='day'"
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="ตัวเลือกการดู"
      ></v-select> -->

      <v-btn v-if="type=='day'"
        outlined
        class="ma-2"
        @click="backViewDay">
        กลับ
      </v-btn>

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
</div>

<v-dialog v-model="addEventDialog" max-width="500">
  <v-card>
    <v-container>
      <v-form ref="addEventform" @submit.prevent="addEvent">
        <v-text-field v-model="eventname" type="text" label="ชื่อกิจกรรม" :rules="checkdata"></v-text-field>
        <v-text-field v-model="eventdetails" type="text" label="รายละเอียด" :rules="checkdata"></v-text-field>
        <v-text-field v-model="eventstart" type="datetime-local" label="วันและเวลาเริ่มต้น" ></v-text-field>
        <v-text-field v-model="eventend" type="datetime-local" label="วันและเวลาสุดท้าย" ></v-text-field>
        <p style="font-size:20%;color:red;" v-if="eventstart >= eventend">**วันและเวลาสุดท้ายต้องมากกว่าเริ่มต้น</p>
        <v-text-field v-model="eventcolor" type="color" label="เลือกสีสำหรับกิจกรรมของคุณ" :rules="checkdata"></v-text-field>
        <v-btn type="submit" color="primay" class="mr-4" >สร้างกิจกรรมใหม่</v-btn>
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
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >

          <v-toolbar :color="selectedEvent.color" dark>
            <v-btn icon @click="deleteEvent(selectedEvent)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        <v-card-text>
          <v-form v-if="currentlyEditing !== selectedEvent.id">
             {{selectedEvent.details}}
          </v-form>

          <v-form v-else> 
            <v-text-field v-model="selectedEvent.name" type="text" label="name"></v-text-field>
            <textarea 
              v-model="selectedEvent.details" type="text" style="width: 100%" :min-height="100" placeholder="add note">
            </textarea>
          </v-form>

        </v-card-text>

            
        <v-card-actions>
          <v-btn text v-if="currentlyEditing !== selectedEvent.id" @click.prevent="editEvent(selectedEvent)">แก้ไขกิจกรรม</v-btn>
          <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">บันทึก</v-btn>
          <v-btn text color="secondary" @click="selectedOpen = false,currentlyEditing= null ">ปิด</v-btn>
        </v-card-actions>


          </v-card>
        </v-menu>


<!--- v card -->

  </v-container>
</template>



<script>

import firebase from "firebase";
  export default {
    name:"UserTable",
    data(){
        return{
            type: 'month',
            pre_type:'month',
            types: ['month', 'week'],
            mode: 'stack',
            value: new Date().toISOString().substr(0, 10),
            today: new Date().toISOString().substr(0, 10),
            events: [],
            start:null,
            end:null,
            
//////////////////// event
            userDocid:null,
            eventname: null,
            eventstart: new Date().toISOString().substr(0, 16),
            eventdetails: null,
            eventcolor:null,
            eventend: new Date().toISOString().substr(0, 16),
            addEventDialog:false,

            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            currentlyEditing: null,
////////////////// rule
          checkdata: [(val) => !!val ||(val || "").length > 0 || "โปรดกรอกฟิลด์นี้"],

        }
    },
    methods: {
      async getEvents(){

        this.fetchEvent();
        let user = firebase.auth().currentUser;
        let uid = user.uid;
        let db = firebase.firestore();
        let tableRef = db.collection("Table");
        let userData = await tableRef.where("uid", "==", uid).get();

        userData.forEach(doc => {
          this.userDocid = doc.id;
          //console.log(doc.id, '=>', doc.data());
        });

        let userEvent = await tableRef.doc(this.userDocid).collection("Event").get();

        userEvent.forEach(doc => {
            console.log(doc.id, " => ", doc.data());
            if(JSON.stringify(doc.data()) != "{}"){

              let EventData = doc.data()
              EventData.id = doc.id
              this.events.push(EventData);
            }
        });

      },

      async addEvent(){///// บัค start กี่โมงก็ได้แต่ end เที่ยงคืน = ไม่ขึ้น

          if (this.$refs.addEventform.validate() && (this.eventstart < this.eventend)) {
            this.addEventDialog = false
            
            let db = firebase.firestore();
            let tableRef = db.collection("Table");

            let st = this.eventstart;
            let ed = this.eventend;

            if( (this.eventstart.substr(11, 16) == "00:00") && (this.eventend.substr(11, 16) == "00:00") && (this.eventstart.substr(11, 16) == this.eventend.substr(11, 16)) ) {
              st = this.eventstart.substr(11, 16)!="00:00"? this.eventstart:this.eventstart.substr(0, 10);
              ed = this.eventend.substr(11, 16)!="00:00"? this.eventend:this.eventend.substr(0, 10);
            }

            tableRef.doc(this.userDocid).collection("Event").add({
              name: this.eventname,
              start:st,
              end:ed,
              details: this.eventdetails,       
              color: this.eventcolor,
            });
            
            this.getEvents()

            this.eventname = null;
            //this.eventstart = new Date().toISOString().substr(0, 16);
            this.eventdetails = null;
            //this.eventend  = new Date().toISOString().substr(0, 16);
            this.eventcolor = null;
            // this.events.push({
            //   name: this.eventname,
            //   start: this.eventstart,
            //   end: this.eventend,
            //   color: this.eventcolor,
            // })

            console.log(this.events);
          }else{

            console.log("มีบางอย่างไม่ถูกต้อง...");
          }
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event;
          this.selectedElement = nativeEvent.target;
          setTimeout(() => this.selectedOpen = true, 10)
        }
        
        if (this.selectedOpen) {
          this.selectedOpen = false;
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },

      editEvent(ev){
        this.currentlyEditing = ev.id;
      },

      async updateEvent(ev){
        let db = firebase.firestore();
        let tableRef = db.collection("Table");

        await tableRef.doc(this.userDocid).collection("Event").doc(ev.id).update({
             details: ev.details,
             name: ev.name,
        });
        this.selectedOpen = false;
        this.currentlyEditing = null;


        this.getEvents();

      console.log(ev.id,"updateEvent successfully")
      },
      async deleteEvent(ev){

        let db = firebase.firestore();
        let tableRef = db.collection("Table");

        await tableRef.doc(this.userDocid).collection("Event").doc(ev.id).delete();
        this.selectedOpen = false;

        this.getEvents();
        console.log(ev.id,'delete successfully');

      },
      fetchEvent(){
        this.events = [];
      },
      // getEvents ({ start, end }) {
      //   const events = []

      //   const min = new Date(`${start.date}T00:00:00`)
      //   const max = new Date(`${end.date}T23:59:59`)
      //   const days = (max.getTime() - min.getTime()) / 86400000
      //   const eventCount = this.rnd(days, days + 20)

      //   for (let i = 0; i < eventCount; i++) {
      //     const allDay = this.rnd(0, 3) === 0
      //     const firstTimestamp = this.rnd(min.getTime(), max.getTime())
      //     const first = new Date(firstTimestamp - (firstTimestamp % 900000))
      //     const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
      //     const second = new Date(first.getTime() + secondTimestamp)

      //     events.push({
      //       name: this.names[this.rnd(0, this.names.length - 1)],
      //       start: first,
      //       end: second,
      //       color: this.colors[this.rnd(0, this.colors.length - 1)],
      //       timed: !allDay,
      //     })
      //   }

      //   this.events = events
      //   console.log(this.events)
      // },
      getEventColor (event) {
        return event.color
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
      viewDay ({ date }) {
        this.value = date;
        this.pre_type = this.type;
        this.type = 'day';
        this.eventstart = new Date(date).toISOString().substr(0, 16);
        this.eventend = new Date(date).toISOString().substr(0, 16)

      },
      backViewDay(){
        this.value = this.today;
        this.type = this.pre_type;
      },
      setToday () {
        this.value = this.today;
        this.pre_type = this.type;
        this.type = 'day';
        this.eventstart = new Date(this.today).toISOString().substr(0, 16);
        this.eventend = new Date(this.today).toISOString().substr(0, 16)
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
      this.getEvents()
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