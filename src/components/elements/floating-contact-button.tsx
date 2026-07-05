"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  LANGUAGE_CONFIG,
  getLanguageDictionary,
  getStoredLanguage,
  subscribeToLanguageChange,
} from "@/config/language";

function getWhatsAppUrl(message: string) {
  return `https://api.whatsapp.com/send?phone=6287726120040&text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function FloatingContactButton() {
  const pathname = usePathname();
  const language = React.useSyncExternalStore(
    subscribeToLanguageChange,
    getStoredLanguage,
    () => LANGUAGE_CONFIG.defaultLanguage
  );
  const dictionary = getLanguageDictionary(language);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-5 z-50 flex items-end gap-3 sm:right-6 sm:bottom-6">
      <div className="max-w-48 rounded-2xl rounded-br-md border border-cornsilk-200 bg-white px-4 py-3 text-right shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <p className="font-inter text-b6 font-semibold leading-snug text-neutral-900 dark:text-cornsilk-100">
          {dictionary.floatingContact.question}
        </p>
        <p className="font-inter text-b6 text-neutral-500 dark:text-neutral-400">
          {dictionary.floatingContact.cta}
        </p>
      </div>
      <Link
        href={getWhatsAppUrl(dictionary.floatingContact.message)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
        aria-label={dictionary.floatingContact.ariaLabel}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </Link>
    </div>
  );
}
