import Vue from "vue";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faTimes, 
  faShareAlt,
  faHeart,
  faReply,
  faBars,
  faRandom,
  faRedoAlt,
  faRetweet
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueEllipseProgress from 'vue-ellipse-progress';


library.add(faPlay, faPause, faStepForward, faStepBackward, faTimes, faShareAlt, faHeart, faReply, faBars, faRandom, faRedoAlt, faRetweet, faGithub);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(VueEllipseProgress);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
