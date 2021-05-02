<template>
  <v-container>

    <v-row justify="center" width="500">
        <v-card class="ma-4 pa-8" rounded="xl" color="secondary" width="100%">
            
            <v-sheet color="white" height="600" width="100%">

                    <v-toolbar rounded="l" color="primary" width="100%" height="100" dark>
                        <h2>
                        <v-avatar color="white" ><v-icon color="accent" x-large>mdi-dumbbell</v-icon></v-avatar>
                        คอร์สของฉัน
                        </h2>
                    </v-toolbar>

                    <br><br>
                    <v-row justify="center">
                    
                        <v-card class="ma-5 pa-6" width="80%">
                            asdasd
                        </v-card>

                    </v-row>











 



            </v-sheet>
            <!-- title -->
            <!-- <v-card class="ma-5 pa-6" rounded="xl" dark color="primary">
                <v-row>
                    <v-toolbar>
                        <h2>
                        <v-avatar color="white"><v-icon color="accent" x-large>mdi-dumbbell</v-icon></v-avatar>
                        คอร์สของฉัน
                        </h2>
                    </v-toolbar>
                </v-row>
                <v-row>
                    asdasd
                </v-row>
            </v-card> -->



            







        
          <!-- Grid title -->

          <!-- <v-row class="my-3">
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
          </v-row> -->
          
        </v-card>


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