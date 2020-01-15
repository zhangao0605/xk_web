import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./global";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/style/elementVariables.scss";
import global from "./assets/style/global.scss";
import "./assets/global_style.css";
import utils from "./utils/common";
Vue.config.productionTip = false;
let lang = localStorage.lang;
if (lang && lang !== "zh_CN") {
  import(`element-ui/lib/locale/lang/${lang}`).then(item => {
    let locale = item.default;
    Vue.use(ElementUI, {
      locale
    });
  });
} else {
  Vue.use(ElementUI);
}
Vue.use(utils);
new Vue({
  router,
  store,
  global,
  render: h => h(App)
}).$mount("#app");
