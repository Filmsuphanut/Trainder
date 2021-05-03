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
                >Current Status
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
                    Update
                    <v-icon>mdi-update</v-icon>
                  </v-btn>
                </template>
                <v-card rounded="xl">
                  <v-card-title class="headline grey lighten-2">
                    Update Your Weight and Height
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            label="Weight"
                            required
                            v-model="temp_weight"
                          ></v-text-field>
                          <v-text-field
                            label="Height"
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
                      Cancel
                    </v-btn>
                    <v-btn color="primary" text @click="update_status()">
                      Update
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
                >Eating History
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
                    Update
                    <v-icon>mdi-update</v-icon>
                  </v-btn>
                </template>
                <v-card rounded="xl">
                  <v-card-title class="headline grey lighten-2">
                    Update Your Meal and Calories
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
                            label="Which Meal?"
                            outlined
                            v-model="temp_meal"
                          ></v-select>
                          <v-text-field
                            label="Calories"
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
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="update_eating_history()"
                    >
                      Update
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
                >Goals
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
                >Exercise History
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
                    Update
                    <v-icon>mdi-update</v-icon>
                  </v-btn>
                </template>
                <v-card rounded="xl">
                  <v-card-title class="headline grey lighten-2">
                    Update Your Exercise History
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
                            label="Which Sport?"
                            outlined
                            v-model="temp_meal"
                          ></v-select>
                          <v-text-field
                            label="How long?"
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
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="update_exercise_history()"
                    >
                      Update
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
                    :data="exerciseData"
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
import firebase from 'firebase';


export default {
  components: {
    GChart,
  },
  data() {
    return {
      current_status: [
        {
          title: "Weight",
          icon: "mdi-weight-kilogram",
          measure: "kg",
          color: '#F98C8C',
        },
        {
          title: "Height",
          icon: "mdi-human-male-height-variant",
          measure: "Cm",
          color: "#F98C8C",
        },
        { title: "BMI", icon: "mdi-tab-minus", measure: "", color: "#F98C8C" },
        {
          title: "Status",
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
      weight: 65,
      height: 180,
      goals: [
        {
          icon: "mdi-weight",
          title: "Weight Gain lost",
          value: 70,
          measure: "Kg",
        },
        {
          icon: "mdi-run",
          title: "Exercise Time",
          value: 3,
          measure: "Hours",
        },
        {
          icon: "mdi-barley",
          title: "Calories Eaten",
          value: 5000,
          measure: "Cals",
        },
      ],
      eatingData: [
        ["Date", "Breakfast", "Lunch", "Dinner"],
        ["2014", 1000, 400, 200],
        ["2015", 1170, 460, 250],
        ["2016", 660, 1120, 300],
        ["2014", 1000, 400, 200],
        ["2015", 1170, 460, 250],
        ["2016", 660, 1120, 300],
        ["2016", 660, 1120, 300],
      ],
      eatingChartOptions: {
        chart: {
          title: "Kuy",
          subtitle: "Rai I sus",
        },
        colors: ["#1b9e77", "#d95f02", "#7570b3"],
        height: 400,
      },
      meals: ["Breakfast", "Lunch", "Dinner"],
      temp_data: null,
      temp_meal: null,
      temp_cal: null,
      exerciseData: [
        ["Date", "Calories Burned"],
        ["2014", 1000],
        ["2015", 1170],
        ["2016", 660],
        ["2014", 1000],
        ["2015", 1170],
        ["2016", 660],
        ["2016", 660],
      ],
      exerciseChartOptions: {
        chart: {
          title: "Kuy",
          subtitle: "Rai I sus",
        },
        colors: ["#1b9e77", "#d95f02", "#7570b3"],
        height: 300,
      },
      sports: ["Basketball","Weight Training","Running"],
      temp_sport: null,
      temp_exercise_time: null,
    }
  },
  methods: {
    update_status() {
      this.weight = this.temp_weight;
      this.height = this.temp_height;
      this.dialog_status = false;
    },
    update_eating_history() {
      this.dialog_status1 = false;
    },
    update_exercise_history() {
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

//////////////////////////////// firebase methods

    async call_stat(){

      let uid = this.$store.getters["userData"].data.uid;
      let db = firebase.firestore();
      let statRef = db.collection("userStats");
      let statData = await statRef.get();
      let check_stat_data = false;

      statData.forEach(doc => {
        if(doc.id == uid){
          check_stat_data = true;
        }
      });

      if(check_stat_data==true){
        console.log("get data");
        let statData = await statRef.doc(uid).get();
        this.weight = statData.data().weight;
        this.height = statData.data().height;
        this.bmi = statData.data().BMI;
        this.bmi_status = statData.data().BMI_status;


      }else{
        console.log("create data");

        await statRef.doc(uid).set({
          BMI:0,
          BMI_status:"Normal",
          calories_burned_history:{"0/0/0":0},
          calories_eaten_history:{"0/0/0":{noon:0,morning:0,evening:0},calories_limit:0},
          dates:{exercise_first_edited:"0/0/0",exercise_last_edited:"0/0/0",meal_first_edited:"0/0/0",meal_last_edited:"0/0/0",
          weight_first_edited:"0/0/0",weight_last_edited:"0/0/0"},
          exercise_time_history:{"0/0/0":0},
          dummy:"dummy",
          height:0,
          weight:0,
          weight_start:0,
        });

      }



    }




  },
  computed: {
    bmi() {
      return (
        Math.round(
          (this.weight / ((this.height / 100) * (this.height / 100))) * 10
        ) / 10
      );
    },
    bmi_status() {
      if (this.bmi < 18.5) {
        return "Underweight";
      } else if (this.bmi < 25) {
        return "Normal range";
      } else if (this.bmi < 30) {
        return "Overweight";
      } else if (this.bmi < 35) {
        return "Obese class I";
      } else if (this.bmi < 40) {
        return "Obese class II";
      } else {
        return "Obese class III";
      }
    },
    current_value() {
      return [this.weight, this.height, this.bmi, this.bmi_status];
    },
    calculate_calories(){
      return 0
    }
  },


  mounted(){

    this.call_stat();




  }
};
</script>