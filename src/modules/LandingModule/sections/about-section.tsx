import * as React from "react";

export function AboutSection() {
  return (
    <section className="bg-olive-900 py-24 text-cornsilk-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-fraunces text-h2 mb-4 font-bold text-cornsilk-100">About Fiorisce</h2>
          <p className="font-fraunces text-h4 text-camel-300 mb-16 italic tracking-wide">
            &ldquo;Where Every Bloom Tells A Story&rdquo;
          </p>

          <div className="space-y-8">
            <div className="bg-olive-1000/60 backdrop-blur-sm border border-olive-700 p-8 md:p-12 rounded-2xl">
              <p className="font-inter text-b3 leading-relaxed text-cornsilk-200">
                At Fiorisce Floristry, we believe flowers do more than look beautiful. They carry
                feelings, mark special moments, and say things words sometimes cannot. Every
                arrangement is carefully made by hand, with flowers chosen to feel personal, warm,
                and meaningful. Whether it is a celebration, a quiet moment, or a simple gesture of
                care, we are here to help you share it beautifully.
              </p>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-camel-400" />
              <div className="h-2 w-2 rounded-full bg-camel-400" />
              <div className="h-px w-12 bg-camel-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
