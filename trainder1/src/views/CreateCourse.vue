<template>
  <v-container>
    <v-btn @click="back"><v-icon center>arrow_back_ios</v-icon></v-btn>
      <h1>hello world welcome to Create Course</h1>


  </v-container>
</template>

<script>
export default {
    name:"CreateCourse",
    data(){
        return{
            CourseData:{id:null,name:null,},

        }
    },
    methods:{
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
    mounted(){
        console.log(this.makeid(20));
    }

}
</script>

<style>

</style>