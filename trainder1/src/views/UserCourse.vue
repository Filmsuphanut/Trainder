<template>
  <v-container>

    <v-row>
      <v-col cols="12">
        <v-card class="ma-5 pa-6" rounded="xl" dark color="primary">
          <v-row class="ma-2">
            
            <h2>
              <v-avatar color="white"><v-icon color="accent" x-large>mdi-dumbbell</v-icon></v-avatar>
              คอร์สของฉัน
            </h2>
          </v-row>
        
          <!-- Grid title -->

          <v-row class="my-3">
            <v-col
              v-for="(t, index) in title"
              :key="index"
              :cols="column[index]"
            >
              <v-card rounded="xl" class="text-center pa-2" color="accent">
                {{ t }}
              </v-card>
            </v-col>
          </v-row>

          <v-row v-for="course in courses" :key="course" class="mb-2">
            <v-col cols="12">
              <v-card rounded="xl" color="secondary">
                <v-row>
                  <v-col cols="2" class="pl-6">
                    {{ course.name }}
                  </v-col>
                  <v-col cols="4" class="pl-6">
                    {{ course.description }}
                  </v-col>
                  <v-col cols="1" class="text-center">
                    {{ course.start }}
                  </v-col>
                  <v-col cols="1" class="text-center">
                    {{ course.end }}
                  </v-col>
                  <v-col cols="1" class="pl-6">
                    {{ course.purpose }}
                  </v-col>
                  <v-col cols="1" class="pl-6">
                    {{ course.genre }}
                  </v-col>
                  <v-col cols="1" class="text-center">
                    <v-btn fab small dark color="lime" @click="Router_EditCourse(course.id)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="1" class="text-center">
                    <v-btn fab small dark color="red" @click="snackdelete=true,del_id = course.id">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
    name:"UserCourse",
    data(){
        return{


        }
    },
    methods:{
        callname(){
            let user = this.$store.getters["userData"];
            return user.data.fullName;
        },
        back() {
            let previous = this.$store.state.previous.pre;
            this.$router.push(previous);
        },
        Router_CreCourse(){
            this.setPrevious();
            this.$router.push("/CreateCourse")
        },
        setPrevious(){
            if(this.$store.state.previous.pre !== "/Course"){
                this.$store.commit("setPreviousPage","/Course");
            }
        },
    },
  async mounted() {
      this.$store.commit("setPreviousPage","/TrainerHome");
  },
}
</script>

<style>

</style>