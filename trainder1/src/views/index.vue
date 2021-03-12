<template>
    <v-container>
        <h1>{{ dataA }}</h1>
        <v-btn to="/register">คลิกที่นี่ เพื่อสมัครสมาชิก</v-btn>
        <div class='red--text'>หรือ</div>
        <v-btn to="/login">เข้าสู่ระบบ</v-btn>
    </v-container>
</template>

<script>
export default {
     name : 'index',
    data(){
        return{
            dataA:'ยังไม่มี id เหรอ สมัครสิ',
        }
    },
    methods:{

    },

}
</script>