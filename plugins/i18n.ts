import { createI18n } from "vue-i18n";
import zh from "../locales/zh.json";
import en from "../locales/en.json";
import th from "../locales/th.json";

const lang = process.env?.NUXT_PUBLIC_LANG || "en";
console.log("lang:***** ", lang);

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: lang,
    messages: {
      zh,
      en,
      th,
    },
  });

  vueApp.use(i18n);
});
