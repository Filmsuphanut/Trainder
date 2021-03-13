import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
    // vuetify: {
    //     theme: {
    //       dark: true,
    //       themes: {
    //         dark: {
    //           primary: '#4caf50',
    //           secondary: '#ff8c00',
    //           accent: '#9c27b0'
    //         }
    //       }
    //     }
    //   },

});
    // theme: { dark: false },