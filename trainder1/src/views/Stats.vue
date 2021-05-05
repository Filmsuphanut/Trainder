<template>
  <div class="Stat">
    <v-container>
      <v-row class="d-flex">
        <v-col cols="6">
          <!-- Current Stats -->
          <v-card class="ma-5 pa-6" rounded="xl" dark color="primary">
            <v-row class="ma-2 mt-1">
              <h2>
                <v-avatar color="white" class="mr-2"
                  ><v-icon color="accent">mdi-account-heart</v-icon></v-avatar
                >สถานะล่าสุด
              </h2>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog_status" width="400">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="secondary"
                    class="mt-1"
                    rounded
                    v-bind="attrs"
                    v-on="on"
                  >
                    แก้ไข
                    <v-icon>mdi-update</v-icon>
                  </v-btn>
                </template>
                <v-card rounded="xl">
                  <v-card-title class="headline grey lighten-2">
                    แก้ไขน้ำหนักและส่วนสูงของคุณ
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            label="น้ำหนัก"
                            required
                            v-model="temp_weight"
                          ></v-text-field>
                          <v-text-field
                            label="ส่วนสูง"
                            required
                            v-model="temp_height"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog_status = false">
                      ยกเลิก
                    </v-btn>
                    <v-btn color="primary" text @click="update_status()">
                      ยืนยัน
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
            <v-row>
              <v-col
                v-for="(stat, index) in current_status"
                :key="stat.id"
                xl="3"
                lg="6"
                md="6"
                sm="12"
                xs="12"
                class="d-flex flex-column"
              >
                <v-card
                  rounded="xl"
                  dark
                  :color="stat.color"
                  class="pa-3 text-center elevation-5 flex d-flex flex-column"
                >
                  <span>
                    <v-icon large>{{ stat.icon }}</v-icon>
                    {{ stat.title }}
                  </span>
                  <!-- display current value here -->
                  <h3>{{ current_value[index] }} {{ stat.measure }}</h3>
                </v-card>
              </v-col>
            </v-row>
          </v-card>

          <!-- Eating History && Update Eating -->
          <v-card class="ma-5 pa-6" rounded="xl" color="primary" dark>
            <v-row class="ma-2 mt-1">
              <h2>
                <v-avatar color="white" class="mr-2"
                  ><v-icon color="accent">mdi-rice</v-icon></v-avatar
                >ประวัติการรับประทานอาหาร
              </h2>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog_status1" width="400">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="secondary"
                    class="mt-1"
                    rounded
                    v-bind="attrs"
                    v-on="on"
                    @click="eating_history_range()"
                  >
                    เพิ่มข้อมูล
                    <v-icon>mdi-update</v-icon>
                  </v-btn>
                </template>
                <v-card rounded="xl">
                  <v-card-title class="headline grey lighten-2">
                    โปรดใส่ข้อมูลการกินของคุณ
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row justify="center">
                        <v-col cols="12">
                          <v-date-picker
                            v-model="temp_date"
                            class="mt-4"
                            :min="eating_history_range()[0]"
                            :max="eating_history_range()[1]"
                          ></v-date-picker>
                          <v-select
                            :items="meals"
                            label="อาหารมื้อไหน?"
                            outlined
                            v-model="temp_meal"
                          ></v-select>
                          <v-text-field
                            label="แคลอรี่"
                            required
                            v-model="temp_cal"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog_status1 = false">
                      ยกเลิก
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="update_eating_history()"
                    >
                      บันทึกข้อมูล
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
            <v-row>
              <v-col cols="12" class="flex-column">
                <v-card rounded="xl" light class="pa-2 text-center elevation-5">
                  <GChart
                    type="ColumnChart"
                    :data="this.eatingHistoryC"
                    :options="eatingChartOptions"
                  ></GChart>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="6">
          <!-- Next Goal -->
          <v-card class="ma-5 pa-6" rounded="xl" color="primary" dark>
            <v-row class="ma-2 mt-1">
              <h2>
                <v-avatar color="white" class="mr-2"
                  ><v-icon color="accent">mdi-bullseye-arrow</v-icon></v-avatar
                >เป้าหมาย
              </h2>
            </v-row>
            <v-row>
              <v-col
                v-for="goal in goalsC"
                :key="goal.id"
                cols="4"
                lg="12"
                class="d-flex flex-column"
              >
                <v-card
                  rounded="xl"
                  dark
                  color="secondary"
                  class="pa-3 text-center elevation-5 flex d-flex flex-column"
                >
                  <v-row class="pa-3" justify="center">
                    <v-icon>{{ goal.icon }}</v-icon>
                    <h3>{{ goal.title }}</h3>
                    <v-spacer></v-spacer>
                    <h4>: {{ goal.value }} {{ goal.measure }}</h4>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>

          <!-- Exercise History && Update Exercise -->
          <v-card class="ma-5 pa-6" rounded="xl" color="primary" dark>
            <v-row class="ma-2 mt-1">
              <h2>
                <v-avatar color="white" class="mr-2"
                  ><v-icon color="accent">mdi-weight-lifter</v-icon></v-avatar
                >ประวัติการออกกำลังกาย
              </h2>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog_status2" width="400">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="secondary"
                    class="mt-1"
                    rounded
                    v-bind="attrs"
                    v-on="on"
                  >
                    เพิ่มข้อมูลด้วยตนเอง
                    <v-icon>mdi-update</v-icon>
                  </v-btn>
                </template>
                <v-card rounded="xl">
                  <v-card-title class="headline grey lighten-2">
                    โปรดกรอกข้อมูลการออกกำลังกายภายนอกแอพของคุณ
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row justify="center">
                        <v-col cols="12">
                          <v-date-picker
                            v-model="temp_date"
                            class="mt-4"
                            :min="eating_history_range()[0]"
                            :max="eating_history_range()[1]"
                          ></v-date-picker>
                          <v-select
                            :items="sports"
                            label="ประเภทกีฬา?"
                            outlined
                            v-model="temp_sport_type"
                          ></v-select>
                          <v-text-field
                            label="ระยะเวลา? (นาที)"
                            required
                            v-model="temp_exercise_time"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog_status2 = false">
                      ยกเลิก
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="update_exercise_history()"
                    >
                      บันทึก
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
            <v-row>
              <v-col cols="12" class="flex-column">
                <v-card rounded="xl" light class="pa-2 text-center elevation-5">
                  <GChart
                    type="ColumnChart"
                    :data="calBurnedC"
                    :options="exerciseChartOptions"
                  ></GChart>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
import { fb } from "../firebase";


export default {
  components: {
    GChart,
  },
  data() {
    return {
      current_status: [
        {
          title: "น้ำหนัก",
          icon: "mdi-weight-kilogram",
          measure: "กิโลกรัม",
          color: '#F98C8C',
          id: 0
        },
        {
          title: "ส่วนสูง",
          icon: "mdi-human-male-height-variant",
          measure: "เซนติเมตร",
          color: "#F98C8C",
          id: 1
        },
        { title: "ค่าดัชนีมวลกาย", icon: "mdi-tab-minus", measure: "", color: "#F98C8C" ,id:2},
        {
          title: "ตอนนี้คุณ",
          icon: "mdi-heart-multiple",
          measure: "",
          color: "#F98C8C",
          id:3
        },
      ],
      dialog_status: false,
      dialog_status1: false,
      dialog_status2: false,
      temp_weight: null,
      temp_height: null,
      weight: 60,
      height: 160,
      goals: [
        {
          icon: "mdi-weight", //weight gain display
          title: 'น้ำหนักคุณเพิ่มมา',
          value: 0, //weightGain()
          measure: "กิโลกรัม",
          id :0
        },
        {
          icon: "mdi-run", //exercise time display
          title: "คุณออกกำลังกายไป",
          value: 0,
          measure: 'นาที',
          id :1
        },
        {
          icon: "mdi-barley", //cal eaten display
          title: "วันนี้คุณรับประทานไป",
          value: 0,
          measure: "แคลอรี่",
          id:2
        },
      ],
      eatingData: [
        ["วัน", "มื้อเช้า", "มื้อกลางวัน", "มื้อเย็น"],
        ['day1', 100, 200, 300], //first day
        ['day2', 400, 500, 600],
        ['day3', 100, 200, 300],
        ['day4', 400, 500, 600],
        ['day5', 100, 200, 300],
        ['day6', 400, 500, 600],
        ['day7', 100, 200, 300], //today
      ],
      eatingChartOptions: {
        chart: {
          title: "กราฟการรับประทานอาหาร",
          subtitle: "แสดงแคลอรี่ที่รับประทานเข้าไป วันนี้และย้อนหลัง6วัน",
        },
        colors: ["#1b9e77", "#d95f02", "#7570b3"],
        height: 400,
        scaleBeginAtZero: true
      },
      meals: ["มื้อเช้า", "กลางวัน", "เย็น"],
      temp_data: null,
      temp_meal: null,
      temp_cal: null,
      exerciseData: [
        ["วันที่", "แคลอรี่ที่เผาพลาญ"],
        ['day1', 100],
        ['day2', 200],
        ['day3', 300],
        ['day4', 400],
        ['day5', 500],
        ['day6', 600],
        ['day7', 700],
      ],
      exerciseChartOptions: {
        chart: {
          title: "กราฟแสดงการออกกำลังกาย",
          subtitle: "แสดงแคลอรี่ที่เผาผลาญจากการออกกำลังกาย วันนี้และย้อนหลัง6วัน",
        },
        colors: ["#1b9e77", "#d95f02", "#7570b3"],
        height: 300,
        scaleBeginAtZero: true
      },
      sports: ["กีฬาบาสเก็ตบอล","เวทเทรนนิ่ง","วิ่ง",'จ้อกกิ้ง','ว่ายน้ำ:สบายๆ'],
      temp_sport: null,
      temp_exercise_time: null,
      historyDate : [],
      historyDataByDate : [],
      cal_eaten : [],
      cal_burned : [],
      exercise_Time : [],
      weight_start: 0,
      calories_limit : 0,
      firstVisit : true,
      date:0,
      uid:'',
      db: null,
      temp_sport_type:null,
      temp_date : null,
      ch : true,


    }
  }, // end of data ====================================================
  methods: {
    update_status() { //need fix here //update database
      this.weight = this.temp_weight;
      this.height = this.temp_height;
      this.update_HW(this.height, this.weight, this.uid)
      this.dialog_status = false;
    },
    update_eating_history() { //need fix here //update database this.date = 0000-00-00
      //let d = this.temp_date;
      let tCal = parseInt(this.temp_cal);
      let tMeal = String(this.temp_meal);
      let data;
      let i;
      switch (String(d)){
        case String(this.historyDate[0]):
          i=0;
          break;
        case String(this.historyDate[1]):
          i=1;
          break;
        case String(this.historyDate[2]):
          i=2;
          break;
        case String(this.historyDate[3]):
          i=3;
          break;
        case String(this.historyDate[4]):
          i=4;
          break;
        case String(this.historyDate[5]):
          i=5;
          break;
        case String(this.historyDate[6]):
          i=6;
          break;
      }
      if (i==6){
        this.goals[1].value = tCal;
      }
      i = parseInt(i);
      if(tMeal == this.meals[0]){
        this.cal_eaten[i].morning = tCal;
        data = {
          cal_eaten : {
            morning : tCal
          }
        }
      }else if(tMeal == this.meals[1]) {
        this.cal_eaten[i].noon = tCal;
        data = {
          cal_eaten : {
            noon : tCal
          }
        }
      } else {
        this.cal_eaten[i].evening = tCal;
        data = {
          cal_eaten : {
            evening : tCal
          }
        }
      }
      try {
        this.db.collection('userStats').doc(this.uid).collection('history').doc(this.temp_date).update(data);
      } catch (err) {
        console.log('updateEat'+err);
      }
      this.dialog_status1 = false;
    },
    update_exercise_history() { //need fix here //update database
      this.ch = !this.ch;
      let data;
      let tSport = this.temp_sport_type;
      let tTime = this.temp_exercise_time;
      //let d = this.temp_date;
      let i;
      switch (String(d)){
        case String(this.historyDate[0]):
          i=0;
          break;
        case String(this.historyDate[1]):
          i=1;
          break;
        case String(this.historyDate[2]):
          i=2;
          break;
        case String(this.historyDate[3]):
          i=3;
          break;
        case String(this.historyDate[4]):
          i=4;
          break;
        case String(this.historyDate[5]):
          i=5;
          break;
        case String(this.historyDate[6]):
          i=6;
          break;
      }
      if (i==6){
        this.goals[2].value = totalCal;
      }
      let totalCal = tTime*this.getCalScale(tSport);
      this.cal_burned[i] = this.cal_burned[i] +totalCal;
      data = {
        cal_burned : this.cal_burned[i]
      }
      try {
        this.db.collection('userStats').doc(this.uid).collection('history').doc(this.temp_date).update(data);
      } catch (err) {
        console.log('updateExe'+err);
      }
      this.dialog_status2 = false;
    },
    eating_history_range(){
      const current = new Date();
      let tempDate = current.getDate()-7;
      let tempMonth = current.getMonth()+1;
      let tempYear = current.getFullYear();
      if(current.getDate() < 8){
        tempMonth = current.getMonth();
        tempDate = (new Date(tempYear, tempMonth, 0).getDate()) - (8 - current.getDate());
      }
      if(tempMonth == 0){
        tempYear -= 1;
        tempMonth = 12;
      }
      let zeroone = 0;
      if(current.getMonth() > 9){
        zeroone = 1;
      }
      tempDate += 1;
      const min = tempYear+'-'+zeroone+(tempMonth)+'-'+tempDate;
      const max = current.getFullYear()+'-'+zeroone+(current.getMonth()+1)+'-'+(current.getDate());
      return [min,max];
    },
    getStatDate(inDate = new Date(),goBack = 0) {
      inDate.setDate(inDate.getDate()-goBack);
      let d = inDate;
      let year = d.getFullYear();
      let month = d.getMonth()+1;
      month = (month<10)?'0'+month:month;
      let date = d.getDate();
      date = (date<10)?'0'+date:date;
      let myDate = `${year}-${month}-${date}`;
      return myDate;
    },

    //////////////////////////////// firebase methods

    async fetch_HW(){ //====
      let myQuery = this.db.collection("userStats").doc(this.uid);
      await myQuery.get().then(soData => {
        soData = soData.data();
        this.weight = soData.weight;
        this.weight_start = soData.weight_start;
        this.height = soData.height;
        this.calories_limit = soData.calories_limit;
        //console.log('done set WWHC (second)'); second is ok 1 round
      }).catch(e => {
        console.log('errID2'+e);
      });
    },

    call_stat() { //====
      this.fetch_HW();
      //this.reloadChart();
    },

    async update_HW(H,W,uid) {
      let data;
      this.weight = W;
      this.height = H;
      if (this.weight_start ==0) { //include weight_start in data
        this.weight_start = W;
        data = {
          weight : W,
          height : H,
          weight_start : W
        }
      } else {//dont
        data = {
          weight : W,
          height : H
        }
      }
      try {
        await this.db.collection('userStats').doc(this.uid).update(data);
      } catch (err) {
        console.log('errID6'+err+'atUpdateHW');
      }
    },
    fillEmptyWeek() { //====
      //check exist if not then create
      console.log('start (fillEmptyWeek)')
      this.historyDate.forEach(async (iDate,index) => { //loop
        //check exist here
        let myQuery = this.db.collection("userStats").doc(this.uid).collection('history');
        let myData = myQuery.doc(iDate);
        await myData.get().then(soData => {
          if (!soData.exist) { //not exist
            //create
            myData.set({
              cal_burned : 0,
              cal_eaten : {
                morning : 0,
                noon : 0,
                evening : 0
              },
              date : iDate,
              exercise_time : 0
            });
          }
          console.log('done fill :'+(index+1)+'/7 in fillEmptyWeek');
        }).catch(e => {
          console.log('errID5'+e);
        }); // recieve doc
      });
    },
    async genToday() { //====
      let myQuery = this.db.collection("userStats").doc(this.uid).collection("history").doc(this.getStatDate());
      await myQuery.get().then(soData => {
        if (!soData.exists) {
          myQuery.set({
            cal_burned :0,
            cal_eaten :{
              evening : 0,
              morning : 0,
              noon : 0
            },
            date : this.getStatDate(),
            exercise_time : 0
          });
        }
        console.log('done history today exists (genToday)');
      }).catch(e => {
        console.log('errID1'+e);
      });
    },
    /* reloadChart() { //====
      try {
       this.goals[0].title = this.weightGainStatus;
        this.goals[0].value = this.weightGainAbs;
        this.goals[1].value = this.exerciseTime;
        this.goals[1].measure = this.exTimeUnit;
        this.goals[2].value = this.calEaten;

        
        console.log('done assign data to charts'); 
      } catch (e) {
        console.error('assign data to charts '+e);
      }
    },*/
    async queryStats() { //====
      console.log('start (queryStats)')
      let historyRes = await this.db.collection("userStats").doc(this.uid).collection('history').orderBy('date','desc').limit(7).get();
      historyRes.forEach((doc,index) => { //desc = more recent come first
        this.cal_eaten[6-index] = doc.data().cal_eaten;
        this.cal_burned[6-index] = doc.data().cal_burned;
        this.exercise_time[6-index] = doc.data().exercise_time;
      });
      
    },
    async checkExists(){ //====
      let myQuery = this.db.collection("userStats").doc(this.uid);
      await myQuery.get().then(soData => {
        if (!soData.exists) { //create not exists
          myQuery.set({ //5 of fundamental data
          dummy:"dummy",
            height:0,
            weight:0,
            weight_start:0,
            calories_limit:0
          });
        } else { //exists
          if(soData.data().dummy != "dummy") { //but from timerAPI
            myQuery.set({ //5 of fundamental data
              dummy:"dummy",
              height:0,
              weight:0,
              weight_start:0,
              calories_limit:0
            });
          }
        }
        //console.log('done check first doc exists (first)'); first is ok 1 round
      }).catch(e => {
        console.log('errID4'+e);
      });
    },
    getCalScale(weight=60, sport='jogging') {
      function scaleValue(value, from, to) {
	      var scale = (to[1] - to[0]) / (from[1] - from[0]);
	      var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
	      return ~~(capped * scale + to[0]);
      }
      let scale=0;
      switch(sport) { //cal per 30 minutes
          case 'จ้อกกิ้ง':
              scale = scaleValue(weight,[56,83],[240,336]);
              break;
          case "วิ่งเร็ว":
              scale = scaleValue(weight,[56,83],[375,525]);
              break;
          case "กีฬาบาสเก็ตบอล":
              scale = scaleValue(weight,[56,83],[240,336]);
              break;
          case "เวทเทรนนิ่ง":
              scale = scaleValue(weight,[56,83],[140,200]);
              break;
          case 'ว่ายน้ำ:สบายๆ':
              scale = scaleValue(weight,[56,83],[180,252]);
              break;
          default:
              scale = 240;
          }
          //cal_burned_per_minute
      return scale /30;
    }

  },
  computed: {
    bmi() {
      if (this.height >= 50 && this.height <= 300 && this.height != ''){
        return (
          Math.round(
            (this.weight / ((this.height / 100) * (this.height / 100))) * 10
          ) / 10
        );
      }
      else {
        return (
          0
        );
      }
    },
    bmi_status() {
      if (this.bmi == 0) {
        return "กรุณาตั้งน้ำหนักและส่วนสูงที่เหมาะสม";
      } else if (this.bmi < 18.5) {
        return "น้ำหนักต่ำกว่าเกฑณ์";
      } else if (this.bmi < 25) {
        return "น้ำหนักปกติ";
      } else if (this.bmi < 30) {
        return "น้ำหนักเกินเกฑณ์";
      } else if (this.bmi < 35) {
        return "เป็นโรคอ้วน ระดับ 1";
      } else if (this.bmi < 40) {
        return "เป็นโรคอ้วน ระดับ 2";
      } else {
        return "เป็นโรคอ้วน ระดับ 3";
      }
    },
    current_value() {
      return [this.weight, this.height, this.bmi, this.bmi_status];
    },
    weightGainCal() {
      return this.weight-this.weight_start;
    },
    weightGainStatus() {
      if (this.weightGainCal >= 0) {
        return 'น้ำหนักคุณเพิ่มมา';
      } else if(this.weightGainCal < 0) {
        return 'น้ำหนักคุณลดไป';
      }
      return 'น้ำหนักคุณเพิ่มมา';
    },
    weightGainAbs() {
      return Math.abs(this.weightGainCal);
    },
    exTimeUnit() { //minute or hour
      let index6;
      try {
        index6 = this.exercise_time[6];
        console.log('exTime can read now');
      } catch (e){
        index6 = 0;
        console.log('exTime err'+e);
      }
      let result = 'นาที';
      if (index6>60) {
        result = 'ชั่วโมง';
      }
      return result;
    },
    exerciseTime(){
      let result;
      try {
        result = this.exercise_time[6];
        console.log('exerciseTime can read now');
      }catch(err){
        result = 0;
        console.log('exerciseTime err'+err);
      }
      
      if (this.exTimeUnit === 'ชั่วโมง') {
        result = Math.round(result/6)/10; //result in hour with 1 digit of decimal place
      }
      return result;
    },
    calEaten() {
      return this.cal_eaten[6].morning + this.cal_eaten[6].noon + this.cal_eaten[6].evening;
    },
    eatingHistoryC(){
      return [
        ["วัน", "มื้อเช้า", "มื้อกลางวัน", "มื้อเย็น"],
        [this.historyDate[0], this.cal_eaten[0].morning, this.cal_eaten[0].noon, this.cal_eaten[0].evening], //first day
        [this.historyDate[1], this.cal_eaten[1].morning, this.cal_eaten[1].noon, this.cal_eaten[1].evening],
        [this.historyDate[2], this.cal_eaten[2].morning, this.cal_eaten[2].noon, this.cal_eaten[2].evening],
        [this.historyDate[3], this.cal_eaten[3].morning, this.cal_eaten[3].noon, this.cal_eaten[3].evening],
        [this.historyDate[4], this.cal_eaten[4].morning, this.cal_eaten[4].noon, this.cal_eaten[4].evening],
        [this.historyDate[5], this.cal_eaten[5].morning, this.cal_eaten[5].noon, this.cal_eaten[5].evening],
        [this.historyDate[6], this.cal_eaten[6].morning, this.cal_eaten[6].noon, this.cal_eaten[6].evening], //today
      ]
    },
    calBurnedC() {
      if(this.ch){
        return [
          ["วันที่", "แคลอรี่ที่เผาพลาญ"],
          [this.historyDate[0], parseInt(this.cal_burned[0])],
          [this.historyDate[1], parseInt(this.cal_burned[1])],
          [this.historyDate[2], parseInt(this.cal_burned[2])],
          [this.historyDate[3], parseInt(this.cal_burned[3])],
          [this.historyDate[4], parseInt(this.cal_burned[4])],
          [this.historyDate[5], parseInt(this.cal_burned[5])],
          [this.historyDate[6], parseInt(this.cal_burned[6])],
        ]
      } else {
        return [
        ["วันที่", "แคลอรี่ที่เผาพลาญ"],
        ['day1', 100],
        ['day2', 200],
        ['day3', 300],
        ['day4', 400],
        ['day5', 500],
        ['day6', 600],
        ['day7', 700],
      ]
      }
    },
    goalsC() 
    {
      return [
        {
          icon: "mdi-weight", //weight gain display
          title: this.weightGainStatus,
          value: this.weightGainAbs, //weightGain()
          measure: "กิโลกรัม",
          id :0
        },
        {
          icon: "mdi-run", //exercise time display
          title: "คุณออกกำลังกายไป",
          value: this.exerciseTime,
          measure: this.exTimeUnit,
          id :1
        },
        {
          icon: "mdi-barley", //cal eaten display
          title: "วันนี้คุณรับประทานไป",
          value: this.calEaten,
          measure: "แคลอรี่",
          id:2
        },
      ]
    }
    
  },
  


  mounted(){

    this.call_stat();

  },
  created: function(){
    this.ch = false;
    this.temp_meal = 0;
    this.temp_cal = 0;
    this.temp_date='';
    this.uid = this.$store.getters["userData"].data.uid;
    this.db = fb.firestore();
    console.log('my uid is ' + this.$store.getters["userData"].data.uid);
    for (let i = 6 ; i >=0 ; i--) { //get year-month-day (0000-00-00)
      this.historyDate[6-i] = String(this.getStatDate(new Date(),i));
      console.log(this.historyDate[6-i]);
    }
    this.cal_eaten = [ //preset
      {morning:0,noon:0,evening:0},
      {morning:0,noon:0,evening:0},
      {morning:0,noon:0,evening:0},
      {morning:0,noon:0,evening:0},
      {morning:0,noon:0,evening:0},
      {morning:0,noon:0,evening:0},
      {morning:0,noon:0,evening:0}
    ]
    this.cal_burned = [
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
    this.exercise_time = [
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
    this.checkExists();
    this.genToday(); //do only 1 round
    this.fillEmptyWeek();
    this.fetch_HW();
    this.queryStats();
  }
};
</script>