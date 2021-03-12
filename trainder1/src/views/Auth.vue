<template>
    <div></div>
</template>
<script>
import axios from 'axios'

export default {
    name:'Auth',
    data() {
        return{
        }
    },
    async created(){
        const response = await axios.get('todos')//user
        if(response.data === null){
            this.$router.push('/')
        }
    },
    methods:{

    },

}
</script>