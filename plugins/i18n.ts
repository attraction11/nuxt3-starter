import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import th from "../locales/th.json";

const splitHost = window.location.host.split(".");
const lang = splitHost.length > 2 ? splitHost[0] : "en";

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: lang,
    messages: {
      en,
      th,
    },
  });

  vueApp.use(i18n);
});
