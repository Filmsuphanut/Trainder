import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@mdi/font/css/materialdesignicons.css'
import colors from 'vuetify/lib/util/colors'
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
    theme: {
        themes: {
            light: {
                primary: '#c64242',
                secondary: '#ff7474',
                accent: '#541616',
                warning: '#FF3535'
            },
            dark: {
                primary: colors.blue.lighten3,
            },
        },
    },
});
// theme: { dark: false },