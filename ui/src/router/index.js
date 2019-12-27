import Vue from 'vue'
import Router from 'vue-router'
import Vote from '@/components/Vote'
import Admin from '@/components/Admin'
import Results from '@/components/Results'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Vote',
      component: Vote
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/results',
      name: 'Results',
      component: Results
    }
  ]
})
