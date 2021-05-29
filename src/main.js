import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

new Vue({
  beforeCreate: function () {
    Vue.prototype.$hostname = 'https://fambask-server.herokuapp.com'; // Sets this as a global variable
    //Vue.prototype.$hostname = 'http://localhost:3000'; // When hosting locally
    //console.log(this.$hostname)
  },
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
