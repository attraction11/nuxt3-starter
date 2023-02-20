// 集成谷歌统计
// 传送门：https://v3.nuxtjs.org/guide/directory-structure/plugins
import VueGtag from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: 'GA_MEASUREMENT_ID'
    }
  })
})
