// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import constants from './server/constants'
import axios from 'axios'

axios.defaults.baseURL = constants.httpPath.API_URL;

Vue.use(ElementUI)

FastClick.attach(document.body)


axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    //  暂时不处理error
    // if (error.response) {
    //   switch (error.response.status) {
    //     case 302:
    //     case 401:
    //       // 返回 401 清除token信息并跳转到登录页面
    //       cookieUtil.util.deleteUserToken();
    //       cookieUtil.util.deleteByName(constants.cookiesNames.userInfo);
    //       router.replace({
    //         path: 'login',
    //         query: { redirect: router.currentRoute.fullPath }
    //       })
    //   }
    // }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
