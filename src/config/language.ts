import en from "./locales/en.json";
import id from "./locales/id.json";

export const LANGUAGE_CONFIG = {
  storageKey: "fiorisce_language",
  defaultLanguage: "EN",
  options: [
    { code: "EN", label: "English" },
    { code: "ID", label: "Indonesia" },
  ],
  dictionaries: {
    EN: en,
    ID: id,
  },
} as const;

export type LanguageCode = (typeof LANGUAGE_CONFIG.options)[number]["code"];
export type LanguageDictionary = (typeof LANGUAGE_CONFIG.dictionaries)[LanguageCode];

export function getLanguageDictionary(language: LanguageCode): LanguageDictionary {
  return LANGUAGE_CONFIG.dictionaries[language];
}

export function getStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return LANGUAGE_CONFIG.defaultLanguage;

  const stored = window.localStorage.getItem(LANGUAGE_CONFIG.storageKey);
  const match = LANGUAGE_CONFIG.options.find((option) => option.code === stored);

  return match?.code ?? LANGUAGE_CONFIG.defaultLanguage;
}

export function setStoredLanguage(language: LanguageCode) {
  window.localStorage.setItem(LANGUAGE_CONFIG.storageKey, language);
  window.dispatchEvent(new Event("fiorisce-language-change"));
}

export function subscribeToLanguageChange(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("fiorisce-language-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("fiorisce-language-change", onStoreChange);
  };
}
