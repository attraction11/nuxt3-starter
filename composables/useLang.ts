import { useI18n } from "vue-i18n";

export const useLang = () => {
  const { t, locale } = useI18n();
  return {
    t,
    locale,
  };
};
