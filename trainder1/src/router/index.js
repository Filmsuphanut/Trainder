import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import Register from '../views/register.vue'
//import Login from '../views/login.vue'
import TrainerHome from '../views/TrainerHome.vue'
import UserHome from '../views/UserHome.vue'
import Trainerregister from '../views/Trainerregister.vue'
import TrainerSignIn from '../views/TrainerSignIn.vue'
import FindTrainer from '../views/MainFindTrainer.vue'
import MainExPeople from '../views/MainExPeople.vue'
import MainCreateRoom from '../views/MainCreateRoom.vue'
import ProfileSetting from '../views/Setting.vue'
import VDOC from '../views/VdoCall.vue'
import CVDOC from '../views/customCall.vue'
import UserTable from '../views/UserTable.vue'
import register2 from '../views/register2.vue'
import store from "../store/index"

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/Trainerregister',
        name: 'Trainerregister',
        component: Trainerregister
    },
    {
        path: '/register/auth',
        name: 'register2',
        component: register2

    },
    {
        path: '/vdoc',
        name: 'videocall',
        component: VDOC
    },
    {
        path: '/custom-vdoc/:id',
        name: 'link-videocall',
        component: CVDOC
    },
    {
        path: '/User',
        name: 'UserHome',
        component: UserHome
    },
    {
        path: '/TrainerHome',
        name: 'TrainerHome',
        component: TrainerHome
    },
    {
        path: '/TrainerSignIn',
        name: 'TrainerSignIn',
        component: TrainerSignIn
    },
    {
        path: '/User/FindTrainer',
        name: 'FindTrainer',
        component: FindTrainer
    },
    {
        path: '/Excercise',
        name: 'Excercise',
        component: MainExPeople
    },
    {
        path: '/CreateRoom',
        name: 'CreateRoom',
        component: MainCreateRoom
    },
    {
        path: '/ProfileSetting',
        name: 'ProfileSetting',
        component: ProfileSetting
    },
    {
        path: '/Table',
        name: 'UserTable',
        component: UserTable
    },
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    // // if logged in no access to index page
    // // console.log(firebase.auth().currentUser)
    if (store.getters["userData"]) {
        if (to.path == "/") return
        next()
    } else {
        if (to.path != "/")
            next("/")
        else
            next()
    }
    // next()
});

export default router