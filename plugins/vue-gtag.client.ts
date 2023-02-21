// 集成谷歌统计
// 传送门：https://v3.nuxtjs.org/guide/directory-structure/plugins
// https://developers.google.com/analytics/devguides/collection/gtagjs
import VueGtag from "vue-gtag-next";

const splitHost = window.location.host.split(".");
const lang = splitHost.length > 2 ? splitHost[0] : "en";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: lang === "en" ? "UA-228105478-1" : "UA-228472356-1",
    },
  });
});
