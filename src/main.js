import Vue from "vue";
import App from "./App.vue";

import SogCalecdar from "../src/plugins/index";
Vue.use(SogCalecdar);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
