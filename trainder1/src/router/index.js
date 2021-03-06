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
import Stats from "../views/Stats.vue"
import Course from '../views/Course.vue'
import CreateCourse from '../views/CreateCourse.vue'
import EditCoures from '../views/EditCourse.vue'
import UserCourse from '../views/UserCourse.vue'

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
    {
        path: '/Stats',
        name: 'Stats',
        component: Stats
    },
    {
        path: '/Course',
        name: 'Course',
        component: Course
    },
    {
        path: '/Course/CreateCourse',
        name: 'CreateCourse',
        component: CreateCourse
    },
    {
        path: '/Course/EditCourse',
        name: 'EditCoures',
        component: EditCoures
    },
    {
        path: '/User/Course',
        name: 'UserCourse',
        component: UserCourse
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
    const auth = ["/", "/register", "/Trainerregister"]
    if (store.getters["userData"].data) {
        const redirect = store.getters["userRole"] == 'trainer' ? "/TrainerHome" : "/user"
        if (to.path == "/") return next(redirect)
        next()
    } else {
        if (!auth.includes(to.path))
            next("/")
        else
            next()
    }
    // next()
});

export default router