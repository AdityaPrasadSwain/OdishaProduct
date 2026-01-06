import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import orTranslation from './locales/or.json';

// Configure the resources
const resources = {
    en: {
        translation: enTranslation
    },
    or: {
        translation: orTranslation
    }
};

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languagedetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng: 'en',
        debug: true, // Enable debug for development

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        detection: {
            // order and from where user language should be detected
            order: ['localStorage', 'navigator'],
            // keys or params to lookup language from
            lookupLocalStorage: 'i18nextLng',
            // cache user language on
            caches: ['localStorage'],
        }
    });

export default i18n;
