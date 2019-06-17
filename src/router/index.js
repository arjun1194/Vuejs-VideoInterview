import Vue from 'vue'
import Router from 'vue-router'
import parent from "@/components/parent_main";
import candidate from "@/components/candidate"
import videoInterview from "@/components/videoInterview"

import face from "@/components/face"
Vue.use(Router);

export default new Router({
  routes: [

    {
      path: '/vin',
      name: 'videoInterview',
      component: videoInterview
    },
    {

      path: '/',
      name: 'parent_main',
      component: parent
    },
    {
      path:'/candidate',
      name:'candidate',
      component: candidate,
    },
    {
      path:'/face',
      name:'face',
      component: face,
    },



  ],
  mode: 'history',
})
