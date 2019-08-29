import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/ShoptracMain'),
    meta: {
      requireLogin: true
    }
  }
]

const router = new VueRouter({ routes })
export default router