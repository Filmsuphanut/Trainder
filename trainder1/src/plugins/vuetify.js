import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
    theme: {
        // dark: true,
        themes: {
            light: {
                primary: '#c64242',
                secondary: '#ff7474',
                accent: '#541616',
                warning: '#FF3535',
                trainer: "#1d0f43"
            },
            dark: {
                primary: '#c64242',
                secondary: '#ff7474',
                accent: '#541616',
                warning: '#FF3535'
            }
        }
    }
});
// theme: { dark: false },