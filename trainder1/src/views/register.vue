<template>
    <v-container>
        <h1>สมัครสมาชิก</h1>
        
        <form id="userdata" @submit="submit">
            <v-text-field label="ชื่อผู้ใช้" v-model="userdata.name"></v-text-field>
            <v-text-field label="รหัสผ่าน" type="password" v-model="userdata.pass"></v-text-field>
            <v-btn type="submit">Submit</v-btn>
        </form>
        
    </v-container>
</template>

<script>
export default {
     name : 'register',
    data(){
        return{
            userdata:{name: null,pass:null},
        }
    },
    methods:{
        submit(e){
            console.log(this.userdata)
            e.preventDefault();
        }
    },

}
</script>