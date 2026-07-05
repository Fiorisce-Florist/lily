"use client";

import * as React from "react";

import {
  LANGUAGE_CONFIG,
  getLanguageDictionary,
  getStoredLanguage,
  subscribeToLanguageChange,
} from "@/config/language";

export function useLanguage() {
  const language = React.useSyncExternalStore(
    subscribeToLanguageChange,
    getStoredLanguage,
    () => LANGUAGE_CONFIG.defaultLanguage
  );

  return {
    language,
    dictionary: getLanguageDictionary(language),
  };
}
