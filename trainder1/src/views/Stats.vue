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
                :key="stat"
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
                            v-model="date"
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
                    :data="eatingData"
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
                v-for="goal in goals"
                :key="goal"
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
                            v-model="date"
                            class="mt-4"
                            :min="eating_history_range()[0]"
                            :max="eating_history_range()[1]"
                          ></v-date-picker>
                          <v-select
                            :items="sports"
                            label="ประเภทกีฬา?"
                            outlined
                            v-model="temp_meal"
                          ></v-select>
                          <v-text-field
                            label="ระยะเวลา?"
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
                    :data="exerciseDataexerciseData"
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
        },
        {
          title: "ส่วนสูง",
          icon: "mdi-human-male-height-variant",
          measure: "เซนติเมตร",
          color: "#F98C8C",
        },
        { title: "ค่าดัชนีมวลกาย", icon: "mdi-tab-minus", measure: "", color: "#F98C8C" },
        {
          title: "ตอนนี้คุณ",
          icon: "mdi-heart-multiple",
          measure: "",
          color: "#F98C8C",
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
        },
        {
          icon: "mdi-run", //exercise time display
          title: "คุณออกกำลังกายไป",
          value: 0,
          measure: 'นาที',
        },
        {
          icon: "mdi-barley", //cal eaten display
          title: "วันนี้คุณรับประทานไป",
          value: 0,
          measure: "แคลอรี่",
        },
      ],
      eatingData: [
        ["วัน", "มื้อเช้า", "มื้อกลางวัน", "มื้อเย็น"],
        ['day1', 0, 0, 0], //first day
        ['day2', 0, 0, 0],
        ['day3', 0, 0, 0],
        ['day4', 0, 0, 0],
        ['day5', 0, 0, 0],
        ['day6', 0, 0, 0],
        ['day7', 0, 0, 0], //today
      ],
      eatingChartOptions: {
        chart: {
          title: "กราฟการรับประทานอาหาร",
          subtitle: "แสดงแคลอรี่ที่รับประทานเข้าไป วันนี้และย้อนหลัง6วัน",
        },
        colors: ["#1b9e77", "#d95f02", "#7570b3"],
        height: 400,
      },
      meals: ["มื้อเช้า", "กลางวัน", "เย็น"],
      temp_data: null,
      temp_meal: null,
      temp_cal: null,
      exerciseData: [
        ["วันที่", "แคลอรี่ที่เผาพลาญ"],
        ['day1', 0],
        ['day2', 0],
        ['day3', 0],
        ['day4', 0],
        ['day5', 0],
        ['day6', 0],
        ['day7', 0],
      ],
      exerciseChartOptions: {
        chart: {
          title: "กราฟแสดงการออกกำลังกาย",
          subtitle: "แสดงแคลอรี่ที่เผาผลาญจากการออกกำลังกาย วันนี้และย้อนหลัง6วัน",
        },
        colors: ["#1b9e77", "#d95f02", "#7570b3"],
        height: 300,
      },
      sports: ["กีฬาบาสเก็ตบอล","เวทเทรนนิ่ง","วิ่ง"],
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


    }
  }, // end of data ====================================================
  methods: {
    update_status() { //need fix here //update database
      this.weight = this.temp_weight;
      this.height = this.temp_height;
      this.dialog_status = false;
    },
    update_eating_history() { //need fix here //update database
      this.dialog_status1 = false;
    },
    update_exercise_history() { //need fix here //update database
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
      let d = inDate;
      inDate.setDate(inDate.getDate()-goBack);
      let year = d.getFullYear();
      let month = d.getMonth()+1;
      month = (month<10)?'0'+month:month;
      let date = d.getDate();
      date = (date<10)?'0'+date:date;
      let myDate = `${year}-${month}-${date}`;
      return myDate;
    },

    //////////////////////////////// firebase methods

    async fetch_all(){
      //init
      this.historyDate = new Array(); //store date 0000-00-00
      this.historyDataByDate = new Array(); //store data()
      this.cal_eaten = new Array(); //map of cal_eaten (morning,noon,evening)
      this.cal_burned = new Array(); // cal_burned that day
      this.exercise_Time = new Array(); // time exercised that day in minutes
      //prepare to check if exist below
      let uid = this.$store.getters["userData"].data.uid;
      let today = getStatDate();
      const db = fb.firestore();
      myQuery = db.collection("userStats").doc(uid);
      let myData = await myQuery.get();
      //check if that user data exist for real
      if (!myData.exists) { //create not exists
        await myQuery.set({ //5 of fundamental data
          dummy:"dummy",
          height:0,
          weight:0,
          weight_start:0,
          calories_limit:0
        });
      } else { //exists
        if(myData.data().dummy != "dummy") { //but from timerAPI
          await myQuery.set({ //5 of fundamental data
            dummy:"dummy",
            height:0,
            weight:0,
            weight_start:0,
            calories_limit:0
          });
        }
      }
      myData = await myQuery.get();
      let myStat = myData.data();
      this.weight = myStat.weight;
      this.weight_start = myStat.weight_start;
      this.height = myStat.height;
      this.calories_limit = myStat.calories_limit;
      myQuery = db.collection("userStats").doc(uid).collection("history").doc(today);
      myData = await myQuery.get();
      if (!myData.exists) {
        await myQuery.set({
          cal_burned :0,
          cal_eaten :{
            evening : 0,
            morning : 0,
            noon : 0
          },
          date : today,
          exercise_time : 0
        });
      }

      // created & ready

      //history
      myQuery = db.collection("userStats").doc(uid).collection('history');

      let temptoday = new Date();
      for (let i = 6 ; i >=0 ; i--) { //get year-month-day (0000-00-00)
        this.historyDate.push(getStatDate(inDate = temptoday, goBack = i))
      }

      //check exist if not then create
      historyDate.forEach(async iDate => { //loop
      //check exist here
        let myData = myQuery.doc(iDate);
        let tempDoc = await myData.get(); // recieve doc
        let toPush;
        if (!tempDoc.exist) { //not exist
          //create
          let data = {
            cal_burned : 0,
            cal_eaten : {
              morning : 0,
              noon : 0,
              evening : 0
            },
            date : iDate,
            exercise_time : 0
          }
          await docRef.set(data);
          toPush = '';
        } else { //exist
          toPush = tempDoc.data()
        }
        this.historyDataByDate.push(toPush); //get doc from each date to check exist
      });


      let count = 0;
      this.historyDataByDate.forEach(async data => { //replace '' with real data
        if (data == ''){
          this.historyDataByDate[count] = await historyRef.doc(this.historyDate[count]).get().data();
        }
        count = count+1;
      })


      //data to all history
      this.historyDataByDate.forEach(data => {
        //cal_eaten
        this.cal_eaten.push(data.cal_eaten);
        //cal_burned
        this.cal_burned.push(data.cal_burned);
        //exercise_time
        this.exercise_time.push(data.exercise_time);
      })
      //assign data to charts
      this.goals[0].title = this.weightGainStatus;
      this.goals[0].value = this.weightGainAbs;
      this.goals[1].value = this.exerciseTime;
      this.goals[1].measure = this.exTimeUnit;
      this.goals[2].value = this.calEaten;

      for (let i=1 ; i<8 ; i++) {
        eatingData[i] = [this.historyDate[i-1], this.cal_eaten[i-1].morning, this.cal_eaten[i-1].noon, this.cal_eaten[i-1].evening];
        exerciseData[i] = [this.historyDate[i-1], this.cal_burned[i-1]];
      } 


    },
    call_stat() {
      if (this.firstVisit) {
        this.fetch_all();
        //this.firstVisit = false;
      }
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
    calculate_calories(){
      return 0;
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
      let result = 'นาที';
      if (this.exercise_time[6]>60) {
        result = 'ชั่วโมง';
      }
      return result;
    },
    exerciseTime(){
      let result = this.exercise_time[6];
      if (this.exTimeUnit === 'ชั่วโมง') {
        result = Math.round(result/6)/10; //result in hour with 1 digit of decimal place
      }
      return result;
    },
    calEaten() {
      return this.cal_eaten[6];
    },
    eatingDataC() {

    },
  },


  mounted(){

    this.call_stat();




  }
};
</script>