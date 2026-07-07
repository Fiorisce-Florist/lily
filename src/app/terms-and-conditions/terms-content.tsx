"use client";

import { useLanguage } from "@/config/use-language";

export function TermsContent() {
  const { dictionary } = useLanguage();
  const t = dictionary.termsAndConditions;

  return (
    <div className="bg-cornsilk-100 dark:bg-neutral-950 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h1 className="font-fraunces text-h2 md:text-h1 font-bold tracking-tight text-olive-900 dark:text-cornsilk-100">
            {t.title}
          </h1>
          <p className="font-inter text-b4 md:text-b3 text-olive-600 dark:text-olive-400 max-w-2xl mx-auto uppercase tracking-wider font-semibold">
            {t.mustRead}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 shadow-2xl shadow-olive-900/5 dark:shadow-none rounded-3xl p-6 md:p-12 border border-cornsilk-300 dark:border-neutral-800">
          <div className="space-y-6 md:space-y-8">
            {t.rules.map((rule, index) => (
              <div key={index} className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-0.5 md:mt-1">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-olive-100 dark:bg-olive-900/30 text-olive-800 dark:text-olive-300 flex items-center justify-center font-fraunces font-bold text-b4 md:text-b3">
                    {index + 1}
                  </div>
                </div>
                <p className="font-inter text-b4 md:text-b3 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-cornsilk-300 dark:border-neutral-800 text-center">
            <h3 className="font-fraunces text-h4 md:text-h3 font-bold text-olive-900 dark:text-cornsilk-100 mb-4 md:mb-6">
              {t.closingTitle}
            </h3>
            <p className="whitespace-pre-line font-inter text-b4 md:text-b3 italic text-neutral-500 dark:text-neutral-400">
              {t.closingBody}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
