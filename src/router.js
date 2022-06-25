import Vue from 'vue'
import VueRouter from 'vue-router'
import Session from '@/utils/Session'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/ShoptracMain'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/settings',
    component: () => import('@/views/Settings'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/statistics',
    component: () => import('@/views/Statistics'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/profile',
    component: () => import('@/views/Profile'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login')
  }
]
const router = new VueRouter({ routes })

router.beforeEach((to, _from, next) => {
  if (typeof to.meta.requireLogin === 'boolean' && to.meta.requireLogin
      && !Session.isLoggedIn()) {
    next('/login')
    return
  }
  next()
})

// router.afterEach((to, _from) => {
//   if (typeof to.meta.requireLogin === 'boolean' && to.meta.requireLogin
//       && !Session.isLoggedIn()) {
//     router.push('/login')
//   }
// })

export default router