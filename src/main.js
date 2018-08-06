// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '../static/common/app_base.js';
import api from  './server/getData.js';
Vue.config.productionTip = false;

/* eslint-disable no-new */
Vue.use(iView);
Vue.prototype.$http = api;
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
