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
                    <v-textarea v-model="CourseData.details" type="text" label="รายละเอียดคอร์ส" ></v-textarea>

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
                    <v-btn type="submit" color="primay" class="mr-4" :disabled="events.length == 0" :loading="loading" >สร้างคอร์ส</v-btn>
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

      <v-btn v-if="type!='day'"
        outlined
        class="ma-2"
        @click="events=[]">
        ล้างกิจกรรมทั้งหมด
      </v-btn>

      <v-toolbar-title outlined
        class="ma-3">{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

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


    <v-snackbar v-model="snackbar" :timeout="2000">ไม่สามารถเพิ่มได้ เนื่องจากเวลาของกิจกรรมซ้ำกับกิจกรรมอื่น
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="snacksuccess" :timeout="2000">เพิ่มคอร์สใหม่เรียบร้อย กรุณาตรวจสอบที่หน้าคอร์สของท่าน
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script>
import firebase from 'firebase';


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
          snackbar:false,
          snacksuccess:false,
          loading:false

        }
    },
    methods:{
/////////////////////////////////////////// table

      async addEvent(){

          if (this.$refs.addEventform.validate() && (this.eventstart < this.eventend) 
          && (this.CourseData.start <= this.eventstart) && (this.eventstart <  this.CourseData.end)
          && (this.CourseData.start < this.eventend) && (this.eventend <  this.CourseData.end)
          ) {//+"T00:00"

            
            let st = this.eventstart;
            let ed = this.eventend;

            if( (this.eventstart.substr(11, 16) == "00:00") && (this.eventend.substr(11, 16) == "00:00") && (this.eventstart.substr(11, 16) == this.eventend.substr(11, 16)) ) {
              st = this.eventstart.substr(11, 16)!="00:00"? this.eventstart:this.eventstart.substr(0, 10);
              ed = this.eventend.substr(11, 16)!="00:00"? this.eventend:this.eventend.substr(0, 10);
            }else if((this.eventend.substr(11, 16) == "00:00")){
              ed = this.eventend.substr(0, 15) + "1";
            }
            

            var collision = await this.isCollision(this.eventstart,this.eventend);

            if(!collision){
              this.addEventDialog = false
              let eventObj = {id:this.makeid(20),name:this.eventname,start:st,end:ed,details:this.eventdetails,color:this.eventcolor};
              this.events.push(eventObj);
            }else{
              console.log("is collide ! ! !");
              this.snackbar = true;
            }

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

      async isCollision(newEvent_start , newEvent_end){

        let allEvent = this.events;

        for (const oldEvent of allEvent){
          
          console.log('Old = > start : ',oldEvent.start , 'End :', oldEvent.end)
          if((newEvent_start >= oldEvent.start  && newEvent_start <= oldEvent.end)
          || (newEvent_end >=oldEvent.start && newEvent_end <= oldEvent.end)
          || (oldEvent.start >=newEvent_start&& oldEvent.start <= newEvent_end )
          || (oldEvent.end >= newEvent_start && oldEvent.end <= newEvent_end)){
            console.log('%c Collide', 'background: #222 ;color: #bada55')
            return true
          }
        }
        return false

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
        this.loading = true;

        if(this.$refs.Courseform.validate()){
            console.log("create course function");

            let user = this.$store.getters["userData"].data;
            let db = firebase.firestore();
            let courseRef = db.collection("Course");

            let course_docid; 
            this.CourseData.id = this.makeid(20);

            courseRef.add({
              creator:user.uid,
              description:this.CourseData.details,
              genre:this.CourseData.genre,
              id: this.CourseData.id,
              name: this.CourseData.name,
              purpose: this.CourseData.purpose,
              start:this.CourseData.start,
              end:this.CourseData.end,
              member:[""],
            })
              
              let courseData = await courseRef.where("id","==",this.CourseData.id).get();

              courseData.forEach(doc => {
                course_docid = doc.id;
              });

              let eventRef = courseRef.doc(course_docid).collection("Event");

              eventRef.add({}).then(() => {

                for(let key in this.events){
                  eventRef.add({
                    name: this.events[key].name,
                    start:this.events[key].start,
                    end:this.events[key].end,
                    details: this.events[key].details,       
                    color: this.events[key].color,
                    creator : user.uid,
                  });
                }

              this.snacksuccess = true;
              //this.back();
              this.ClearEvent();
              this.loading = false;
              })


        }else{
          this.loading = false;
        }
        

      },
      ClearEvent(){
        this.events = [];
        this.CourseData = {id:null,name:null,details:null,purpose:null,genre:null
                          ,start:new Date().toISOString().substr(0, 10)
                          ,end:new Date().toISOString().substr(0, 10)};

        this.eventstart= new Date().toISOString().substr(0, 16);
        this.eventdetails= null;
        this.eventcolor=null;
        this.eventend= new Date().toISOString().substr(0, 16);
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