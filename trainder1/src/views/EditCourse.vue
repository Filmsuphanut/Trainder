<template>
  <v-container>
    <v-btn @click="back"><v-icon center>arrow_back_ios</v-icon></v-btn>
      <h1>hello world welcome to Edit Course</h1>
        <p>{{CourseData.name}}</p>
  </v-container>
</template>

<script>
import firebase from 'firebase'

export default {
    name:"EditCourse",
    data(){
        return{
            CourseData:[],
        }
    },
    methods:{
        back() {
            let previous = this.$store.state.previous.pre;
            this.$router.push(previous);
        },
        async CallCourse(id){

            let user = this.$store.getters["userData"].data; 
            let db = firebase.firestore()
            let courseRef = db.collection("Course");
            let trainerCourse = await courseRef.where("uid","==",user.uid).get();
            let CourseDocid;

            trainerCourse.forEach(doc => {
                CourseDocid = doc.id;
            })

            let Course = await courseRef.doc(CourseDocid).collection("List").where("id","==",id).get();


            Course.forEach(doc => {
                console.log(doc.data());
                this.CourseData = doc.data();
                console.log("asdasdas",this.CourseData)
            })


        },

    },
    mounted(){
        let id = this.$route.query.id;
        this.CallCourse(id);


    }
}
</script>

<style>

</style>