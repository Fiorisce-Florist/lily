"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Camera } from "lucide-react";
import { useLanguage } from "@/config/use-language";

export function LocationSection() {
  const { dictionary } = useLanguage();

  return (
    <section className="bg-cornsilk-100 dark:bg-neutral-1000 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Map Side */}
          <div className="relative h-87.5 w-full overflow-hidden rounded-3xl border border-white/60 shadow-xl dark:border-neutral-800 md:h-125">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d991.3007481797332!2d106.81883851751343!3d-6.367770700534074!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eda8e6f40f4b%3A0x27307b87b0e1fdee!2sFiorisce%20Floristry!5e0!3m2!1sen!2sus!4v1781419077036!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={dictionary.landing.location.mapTitle}
              className="h-full w-full border-0 opacity-90 grayscale-50 transition-all duration-700 hover:opacity-100 hover:grayscale-0 dark:invert dark:hue-rotate-180 dark:grayscale-20 dark:contrast-75"
            ></iframe>
            {/* Inner shadow overlay for depth */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-black/5 dark:shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] dark:ring-white/10" />
          </div>

          {/* Info Side */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-2 font-bold">
                {dictionary.landing.location.title}
              </h2>
              <div className="h-0.5 w-16 bg-camel-500 mt-4" />
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-camel-200 dark:bg-camel-900 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <MapPin
                    className="h-5 w-5 text-camel-700 dark:text-camel-300"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-fraunces text-b3 text-neutral-900 dark:text-cornsilk-100 font-semibold">
                    {dictionary.landing.location.placeName}
                  </h3>
                  <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mt-1">
                    {dictionary.landing.location.address}
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="bg-camel-200 dark:bg-camel-900 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Clock
                    className="h-5 w-5 text-camel-700 dark:text-camel-300"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-fraunces text-b3 text-neutral-900 dark:text-cornsilk-100 font-semibold">
                    {dictionary.landing.location.openingHours}
                  </h3>
                  <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mt-1">
                    {dictionary.landing.location.hours}
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-start gap-4">
                <div className="bg-camel-200 dark:bg-camel-900 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Camera
                    className="h-5 w-5 text-camel-700 dark:text-camel-300"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-fraunces text-b3 text-neutral-900 dark:text-cornsilk-100 font-semibold">
                    {dictionary.landing.location.connect}
                  </h3>
                  <div className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mt-1 space-y-1">
                    <p>
                      <a
                        href="https://instagram.com/fiorisce_id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blush-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 rounded-sm"
                      >
                        Instagram: @fiorisce_id
                      </a>
                    </p>
                    <p>
                      <a
                        href="https://tiktok.com/@fiorisce_id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blush-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 rounded-sm"
                      >
                        TikTok: @fiorisce_id
                      </a>
                    </p>
                    <p>
                      <a
                        href="https://wa.me/6287726120040"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blush-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 rounded-sm"
                      >
                        WhatsApp: +62 877-2612-0040
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                className="bg-camel-500 text-cornsilk-100 hover:bg-camel-600 border-none w-full px-8 uppercase tracking-widest transition-colors sm:w-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 focus-visible:ring-offset-2"
                asChild
              >
                <a
                  href="https://maps.app.goo.gl/TgvK8yTR1HRFDocs5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dictionary.landing.location.directions}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
