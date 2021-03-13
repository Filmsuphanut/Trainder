<template>
    <v-container>
        <br>
        <div class="bigbox">
        <table class="tab" border="0">
            <tr><td><img src="../images/Logo.png" width="200" height="80"  align="left"></td></tr><br>
            <tr>
                <td>
                    <v-carousel cycle>
                        <v-carousel-item 
                        v-for="(item,i) in items"
                            :key="i"
                            :src="item.src"
                        reverse-transition="fade-transition"
                        transition="fade-transition"
                        width="750px"
                        ></v-carousel-item>
                    </v-carousel>

                </td>
                <td width="2%"></td>

                <td><Login/><br><br>
                
                <div class="box text-center" >
                <div >ยังไม่ได้เข้าร่วมกับ Trainder อีกเหรอ ?</div><br>
                <v-btn to="/register">สมัครสมาชิกเลย</v-btn>
                </div>

                </td>
            </tr>
        </table>
        </div>
    </v-container>
</template>

<script>

import Login from './login'

export default {
     name : 'index',
    components:{
        Login,
    },
    data(){
        return{
            items: [
                    {
                        
                        src: require("../images/Slide1.jpg"),
                    },
                    {
                        src: require('../images/Slide2.jpg'),
                    },
                    {
                        src: require('../images/Slide3.jpg'),
                    },
                    {
                        src: require('../images/Slide4.jpg'),
                    },
                    ],

        }
    },
    methods:{
        onSlideChange(slideNumber) {
            if (slideNumber === 1) {
                this.interval === 20;
            } else if (slideNumber === 2) {
                this.interval === 40;
            } else {
                this.interval === 60;
            }
        }
    },
}
</script>


<style scoped>

.box {
background-color: rgb(255, 255, 255);
    border: 2px solid rgb(205, 205, 253); 
    padding: 25px 20px 25px 20px;
    border-radius: 10px;
    text-align: center;
     width: 300px;
    height: 150px;
      box-shadow:
  0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12);

}
.bigbox{
    background-color: rgb(255, 255, 255);
    text-align: center;
     padding: 2% 2% 2% 2%;
    width:100%;
    height:100%;
    border: 2px solid rgb(152, 152, 255); 
    border-radius: 10px;
      box-shadow:
  0 2.8px 2.2px rgba(0, 0, 0, 0.034),
  0 6.7px 5.3px rgba(0, 0, 0, 0.048),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12);
}

.tab{
  margin-left: auto;
  margin-right: auto;

}
</style>