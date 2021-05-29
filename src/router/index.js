import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import axios from 'axios';

axios.defaults.withCredentials = true

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue')
  },
  {
    path: '/login',
    name: 'Log in',
    component: () => import('../views/Login.vue')
  },
  /*
  {
    path: '/logout',
    name: 'Log out',
    component: Logout
  },*/

]

const router = new VueRouter({
  routes
})

export default router
