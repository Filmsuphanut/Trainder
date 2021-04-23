<template>
  <v-container>
    <v-btn @click="back"><v-icon center>arrow_back_ios</v-icon></v-btn>
    <h1>hello world welcome to Course detail</h1>
    <p>{{callname()}}</p>
    <v-btn @click="Router_CreCourse">Create Course</v-btn>
    <br><br>

    <table border="1">
    <tr><td>ชื่อคอร์ส</td><td></td></tr>
    <tr v-for="course in list" :key="course.id" border="1">
        <td>{{course.name}}</td><td><v-btn @click="Router_EditCourse(course.id)">ดูรายละเอียด</v-btn></td>
    </tr>
    </table>


  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
    name:"Course",
    data(){
        return{
            list:[],

        }
    },
    methods:{

        async callCourse(){

            let user = this.$store.getters["userData"].data; 
            let db = firebase.firestore()
            let courseRef = db.collection("Course");
            let trainerCourse = await courseRef.where("uid","==",user.uid).get();
            let CourseDocid;

            trainerCourse.forEach(doc => {
                CourseDocid = doc.id;
            })

            let CourseList = await courseRef.doc(CourseDocid).collection("List").get();
            console.log(CourseList)

            CourseList.forEach(doc => {
               console.log(doc.id," => ",doc.data())
               if(JSON.stringify(doc.data()) != "{}"){
                   this.list.push(doc.data())
               }
            })

        },

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
            this.$router.push("/Course/CreateCourse")
        },
        Router_EditCourse(e){

            this.setPrevious();
            //console.log(e);
            this.$router.push(`/Course/EditCourse?id=${e}`)
        },
        setPrevious(){
            if(this.$store.state.previous.pre !== "/Course"){
                this.$store.commit("setPreviousPage","/Course");
            }
        },

    },
    mounted() {
      this.$store.commit("setPreviousPage","/TrainerHome");
      this.callCourse()
    },
}
</script>

<style>

</style>