// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.css'
import {peer} from '../src/js/peer';


import fetchIntercept from 'fetch-intercept'


Vue.use(fetchIntercept)

const unregister = fetchIntercept.register({

  request: function (url, config) {

    console.log(url);
    const withDefaults = Object.assign({}, config);
    withDefaults.headers = new Headers({
      'Auth': window.localStorage.getItem("token")
    });
    return [url, withDefaults];
  },

  requestError: function (error) {
// Called when an error occured during another 'request' interceptor call
    return Promise.reject(error);
  },

  response: function (response) {
// Modify the reponse object
    return response;
  },

  responseError: function (error) {
// Handle an fetch error
    return Promise.reject(error);
  }
});

const http = Vue.http;
export default http


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,

  components: { App },
    template: '<App/>'
})
