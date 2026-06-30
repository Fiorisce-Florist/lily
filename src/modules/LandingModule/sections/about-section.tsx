import * as React from "react";

export function AboutSection() {
  return (
    <section className="bg-cornsilk-200 dark:bg-olive-900 py-24 text-olive-900 dark:text-cornsilk-100 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-fraunces text-h2 font-bold text-olive-900 dark:text-cornsilk-100">
            About Fiorisce
          </h2>
          <p className="font-fraunces text-h4 text-olive-700 dark:text-camel-300 mb-10 italic tracking-wide">
            &ldquo;Where Every Bloom Tells A Story&rdquo;
          </p>

          <div className="space-y-8">
            <div className="bg-cornsilk-100/60 dark:bg-olive-1000/60 backdrop-blur-sm border border-olive-200 dark:border-olive-700 p-8 md:p-12 rounded-2xl shadow-sm dark:shadow-none transition-colors duration-300">
              <p className="font-inter text-b3 max-md:text-b5 leading-relaxed text-olive-800 dark:text-cornsilk-200">
                At Fiorisce Floristry, we believe flowers do more than look beautiful. They carry
                feelings, mark special moments, and say things words sometimes cannot. Every
                arrangement is carefully made by hand, with flowers chosen to feel personal, warm,
                and meaningful. Whether it is a celebration, a quiet moment, or a simple gesture of
                care, we are here to help you share it beautifully.
              </p>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-camel-600 dark:bg-camel-400" />
              <div className="h-2 w-2 rounded-full bg-camel-600 dark:bg-camel-400" />
              <div className="h-px w-12 bg-camel-600 dark:bg-camel-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
