import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

i18n.use(initReactI18next).init({
  debug: false,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n; // add
