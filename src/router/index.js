import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import Categories from '@/components/products/Categories'
import Goods from '@/components/products/Goods'
import Add from '@/components/products/Add'
Vue.use(Router)

/* eslint-disable */
let router = new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [{
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: Add
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.path === '/login' || localStorage.getItem('token')) {
    next()
  } else {
    next('/login')
  }
})

export default router
