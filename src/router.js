import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/ShoptracMain')
  },
  {
    path: '/settings',
    component: () => import('@/views/Settings')
  },
  {
    path: '/statistics',
    component: () => import('@/views/Statistics')
  }
]

const router = new VueRouter({ routes })
export default router