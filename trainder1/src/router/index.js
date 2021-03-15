import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import Register from '../views/register.vue'
//import Login from '../views/login.vue'
import TrainerHome from '../views/TrainerHome.vue'
import UserHome from '../views/UserHome.vue'
import Trainerregister from '../views/Trainerregister.vue'

Vue.use(VueRouter)

const routes = [
  {
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
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: Login

  // },
  {
    path: '/UserHome',
    name: 'UserHome',
    component: UserHome
  },
  {
    path: '/TrainerHome',
    name: 'TrainerHome',
    component: TrainerHome
  }
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

export default router
