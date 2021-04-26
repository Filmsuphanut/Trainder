<template>
  <v-container>

    <div class="bigbox">
        <v-row justify="start">
            <v-btn @click="back"><v-icon center>arrow_back_ios</v-icon></v-btn>
        </v-row>
        <br>


      <table class="tab" border="0">
        <tr>
          <td width="700" height="700px">
            <div class="box">
                <br>
                <h2 align="left">สร้างคอร์สออกกำลังกายของคุณ</h2>


                <v-form ref="Courseform">
                    <v-text-field v-model="eventname" type="text" label="ชื่อ Course" :rules="checkdata"></v-text-field>
                    <v-text-field v-model="eventdetails" type="text" label="รายละเอียด Course" :rules="checkdata"></v-text-field>
                    <v-text-field v-model="eventstart" type="datetime-local" label="วันเริ่ม Course" ></v-text-field>
                    <v-text-field v-model="eventend" type="datetime-local" label="วันจบ Course" ></v-text-field>
                    <v-btn @click="Table_dia=true">สร้างตาราง</v-btn>
                    <v-btn type="submit" color="primay" class="mr-4" >สร้างคอร์ส</v-btn>
                </v-form>

            </div>
          </td>
        </tr>
      </table>

<v-dialog v-model="Table_dia" width="1000" height="1000"><v-card>

<table class="tab" border="0"><tr><td width="1400" ><div class="diabox">

<v-btn @click="addEventDialog=true">เพิ่มกิจกรรม</v-btn>

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
        @change="getEvents"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
      ></v-calendar>
    </v-sheet> 
    
 </div></td></tr></table>
</v-card></v-dialog>

<v-dialog v-model="addEventDialog" max-width="500">
  <v-card>
    <v-container>
      <v-form ref="addEventform" @submit.prevent="addEvent">
        <v-text-field v-model="eventname" type="text" label="ชื่อกิจกรรม" :rules="checkdata"></v-text-field>
        <v-text-field v-model="eventdetails" type="text" label="รายละเอียด" :rules="checkdata"></v-text-field>
        <v-text-field v-model="eventstart" type="datetime-local" label="วันและเวลาเริ่มต้น" ></v-text-field>
        <v-text-field v-model="eventend" type="datetime-local" label="วันและเวลาสุดท้าย" ></v-text-field>
        <p style="font-size:15px;color:red;" v-if="eventstart >= eventend">**วันและเวลาสุดท้ายต้องมากกว่าเริ่มต้น</p>
        <v-text-field v-model="eventcolor" type="color" label="เลือกสีสำหรับกิจกรรมของคุณ" :rules="checkdata"></v-text-field>
        <v-btn type="submit" color="primay" class="mr-4" >สร้างกิจกรรมใหม่</v-btn>
      </v-form>
    </v-container>
  </v-card>
</v-dialog>

    </div>
  </v-container>
</template>

<script>
export default {
    name:"CreateCourse",
    data(){
        return{
            CourseData:{id:null,name:null,},
            Table_dia:false,
            type: 'month',
            types: ['month', 'week', 'day', '4day'],
            mode: 'stack',
            modes: ['stack', 'column'],
            weekday: [0, 1, 2, 3, 4, 5, 6],
            weekdays: [
                { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
                { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
                { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
                { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
            ],
            value: '',
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
            addEventDialog:false,
        }
    },
    methods:{
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
      },
      getEventColor (event) {
        return event.color
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },



















        back() {
            let previous = this.$store.state.previous.pre;
            this.$router.push(previous);
        },
        makeid(length) {
                let result = [];
                let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let charactersLength = characters.length;
                for ( let i = 0; i < length; i++ ) {
                result.push(characters.charAt(Math.floor(Math.random() * 
                charactersLength)));
            }
        return result.join('');
        },
    },
    mounted(){
        //console.log(this.makeid(20));
    }

}
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
.diabox {
  background-color: rgb(255, 255, 255);
  border: 2px solid rgb(205, 205, 253);
  padding: 1% 1% 1% 1%;
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