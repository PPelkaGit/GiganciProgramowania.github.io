import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import pl from './pl';
import en from './en';
import es from './es';
import de from './de';

const deviceLang = Localization.getLocales()[0]?.languageCode ?? 'pl';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pl: { translation: pl },
      en: { translation: en },
      es: { translation: es },
      de: { translation: de },
    },
    lng: ['pl', 'en', 'es', 'de'].includes(deviceLang) ? deviceLang : 'pl',
    fallbackLng: 'pl',
    interpolation: { escapeValue: false },
  });

export default i18n;
export const LANGUAGES = [
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];
