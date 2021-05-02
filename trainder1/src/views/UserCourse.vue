<template>
  <v-container>
    <v-btn @click="back"><v-icon center>arrow_back_ios</v-icon></v-btn>
    <h1>hello world welcome to Course detail</h1>
    <p1>{{callname()}}</p1>
    <v-btn @click="Router_CreCourse">Create Course</v-btn>

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