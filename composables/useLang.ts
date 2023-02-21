import { useI18n } from "vue-i18n";

const splitHost = window.location.host.split(".");
const lang = splitHost.length > 2 ? splitHost[0] : "en"
const ossImg =  'https://media.homingday.com/marketing/lottery'

export const useLang = () => {
  const { t } = useI18n();
  return {
    t,
    lang,
    ossImg,
    loadBgImg: (image: string) => {
      return `background-image: url(${ossImg}${image})`;
    },
    activityId: lang === "en" ? 1 : 2,
    link: window.location.origin,
  };
};
