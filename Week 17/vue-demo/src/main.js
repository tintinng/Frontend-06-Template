import Vue from "vue";
import HelloWorld from "./HelloWorld.vue";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: (h) => h(HelloWorld),
});