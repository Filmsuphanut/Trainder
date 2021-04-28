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
                <h2 align="left">สร้างคอร์สออกกำลังกายของคุณ</h2><br><br>

                <v-form ref="Courseform" @submit.prevent="CourseCreate">  
                    <v-text-field v-model="CourseData.name" type="text" label="ชื่อคอร์ส" :rules="checkdata"></v-text-field>
                    <v-textarea v-model="CourseData.details" type="text" label="รายละเอียดคอร์ส" :rules="checkdata"></v-textarea>

                    <v-select
                      v-model="CourseData.purpose"
                      :items="[
                        'ลดน้ำหนัก',
                        'เพิ่มกล้ามเนื้อ',
                        'หุ่นที่ดี',
                        'เพื่อสุขภาพ',]"
                      label="เป้าหมายของคอร์ส"
                      :rules="checkdata"
                    ></v-select>

                    <v-select
                      v-model="CourseData.genre"
                      :items="[
                        'เวทเทรนนิ่ง',
                        'แอโรบิค',
                        'ออกกำลังกายทั่วไป',
                        'โยคะ',
                        'คาร์ดิโอ',
                        'อื่นๆ']"
                      label="ประเภทของคอร์ส"
                      :rules="checkdata"
                    ></v-select>


                    <v-text-field v-model="CourseData.start" type="date" label="วันเริ่มคอร์ส" :disabled="events.length != 0"></v-text-field>
                    <v-text-field v-model="CourseData.end" type="date" label="วันจบคอร์ส" :disabled="events.length != 0"></v-text-field>
                    <p align="left" style="font-size:15px;color:red;" v-if="CourseData.start >= CourseData.end">**วันเริ่มคอร์สต้องน้อยกว่าวันจบคอร์ส</p>
                    <v-text-field label="สร้างตารางออกกำลังกายที่นี่" readonly prepend-inner-icon="mdi-calendar" 
                    :disabled="CourseData.start >= CourseData.end" @click="Table_dia=true"
                    :value="events.length == 0? '':'กดที่นี่เพื่อแก้ไขตารางกิจกรรม'"
                    ></v-text-field>

                    <p align="left" style="font-size:12px;color:gray;">**หากต้องการแก้ไขวันเริ่มและจบคอร์ส กรุณาล้างตารางเดิมก่อน</p>
                    <br><br>
                    <v-row justify="end">
                    <v-btn type="submit" color="primay" class="mr-4" :disabled="events.length == 0" >สร้างคอร์ส</v-btn>
                    </v-row>
                    
                </v-form>

            </div>
          </td>
        </tr>
      </table>


<!-- table dialog -->


<v-dialog v-model="Table_dia" width="1000" height="1000"><v-card>
<table class="tab" border="0"><tr><td width="1400" ><div class="diabox">
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
    <!-- $store.state.events -->
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
        <p style="font-size:15px;color:red;" v-if="!((CourseData.start <= this.eventstart) && (eventstart <  this.CourseData.end)
        && (CourseData.start < this.eventend) && (eventend <  this.CourseData.end))"
        >**กิจกรรมต้องอยู่ในช่วงเวลาของคอร์สเท่านั้น</p>
      </v-form>
    </v-container>
  </v-card>
</v-dialog>



<!-- clickevent -->
        <v-dialog
          v-model="selectedOpen"
          max-width="500"
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
          <br>
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
          <!-- <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">บันทึก</v-btn> -->
          <v-btn text color="secondary" @click="selectedOpen = false,currentlyEditing= null">ปิด</v-btn>
        </v-card-actions>

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
            CourseData:{id:null,name:null,details:null,purpose:null,genre:null
            ,start:new Date().toISOString().substr(0, 10)
            ,end:new Date().toISOString().substr(0, 10)},
            
            ////dialog 
            Table_dia:false,
            addEventDialog:false,

            ///////////////table
            type: 'month',
            pre_type:'month',
            types: ['month', 'week'],
            mode: 'stack',
            value: new Date().toISOString().substr(0, 10),
            today: new Date().toISOString().substr(0, 10),
            events: [],
            start:null,
            end:null,


            ////////// event
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

            pre_eventname:null,
            pre_eventdetails:null,

////////////////// rule
          checkdata: [(val) => !!val ||(val || "").length > 0 || "โปรดกรอกฟิลด์นี้"],

        }
    },
    methods:{
/////////////////////////////////////////// table

      addEvent(){///// อย่าลืมมาเพิ่มโค้ดเช็คชนด้วย

          if (this.$refs.addEventform.validate() && (this.eventstart < this.eventend) 
          && (this.CourseData.start <= this.eventstart) && (this.eventstart <  this.CourseData.end)
          && (this.CourseData.start < this.eventend) && (this.eventend <  this.CourseData.end)
          ) {//+"T00:00"

            this.addEventDialog = false
            let st = this.eventstart;
            let ed = this.eventend;

            if( (this.eventstart.substr(11, 16) == "00:00") && (this.eventend.substr(11, 16) == "00:00") && (this.eventstart.substr(11, 16) == this.eventend.substr(11, 16)) ) {
              st = this.eventstart.substr(11, 16)!="00:00"? this.eventstart:this.eventstart.substr(0, 10);
              ed = this.eventend.substr(11, 16)!="00:00"? this.eventend:this.eventend.substr(0, 10);
            }else if((this.eventend.substr(11, 16) == "00:00")){
              ed = this.eventend.substr(0, 15) + "1";
            }
            
            let eventObj = {id:this.makeid(20),name:this.eventname,start:st,end:ed,details:this.eventdetails,color:this.eventcolor};

            this.events.push(eventObj);

            this.eventname = null;
            //this.eventstart = new Date().toISOString().substr(0, 16);
            this.eventdetails = null;
            //this.eventend  = new Date().toISOString().substr(0, 16);
            this.eventcolor = null;

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

      deleteEvent(ev){
        
        for (let key in this.events){
          if(this.events[key].id == ev.id){
            console.log("hello")
            this.events.splice(key, 1);
            break;
          }
        }


        this.selectedOpen = false;

        console.log('delete successfully');
      },


      fetchEvent(){
        this.events = [];
      },

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

      updateRange ({ start, end }) {
        this.start = start
        this.end = end
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },

      /////////////////// course create



      async CourseCreate(){

        console.log("create course function");

      },


///////////////////////////// default method
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




    ///////////////////////// When create
    mounted(){
        //console.log(this.makeid(20));
        //this.$refs.calendar.checkChange()

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