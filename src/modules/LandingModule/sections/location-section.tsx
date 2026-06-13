import * as React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Camera } from "lucide-react";

export function LocationSection() {
  return (
    <section className="bg-cornsilk-100 dark:bg-neutral-1000 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Map Side */}
          <div className="bg-cornsilk-200 dark:bg-neutral-900 border-cornsilk-300 dark:border-neutral-800 relative h-[350px] w-full overflow-hidden rounded-2xl border shadow-sm md:h-[480px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2!2d106.83!3d-6.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec1a1e9d1c8f%3A0x0!2sKukusan%2C+Beji%2C+Depok!5e0!3m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Fiorisce Floristry Location"
            ></iframe>
          </div>

          {/* Info Side */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-2 font-bold">
                Where To Find Us
              </h2>
              <div className="h-[2px] w-16 bg-camel-500 mt-4" />
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-camel-200 dark:bg-camel-900 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <MapPin className="h-5 w-5 text-camel-700 dark:text-camel-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-fraunces text-b3 text-neutral-900 dark:text-cornsilk-100 font-semibold">
                    Fiorisce Floristry
                  </h3>
                  <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mt-1">
                    Kukusan, Depok
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="bg-camel-200 dark:bg-camel-900 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Clock className="h-5 w-5 text-camel-700 dark:text-camel-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-fraunces text-b3 text-neutral-900 dark:text-cornsilk-100 font-semibold">
                    Opening Hours
                  </h3>
                  <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mt-1">
                    Mon – Sat, 10.00 – 20.00
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-start gap-4">
                <div className="bg-camel-200 dark:bg-camel-900 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                  <Camera className="h-5 w-5 text-camel-700 dark:text-camel-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-fraunces text-b3 text-neutral-900 dark:text-cornsilk-100 font-semibold">
                    Connect With Us
                  </h3>
                  <div className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mt-1 space-y-1">
                    <p>
                      <a
                        href="https://instagram.com/fiorisce_id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blush-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 rounded-sm"
                      >
                        Instagram: @fiorisce_id
                      </a>
                    </p>
                    <p>
                      <a
                        href="https://tiktok.com/@fiorisce_id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blush-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 rounded-sm"
                      >
                        TikTok: @fiorisce_id
                      </a>
                    </p>
                    <p>
                      <a
                        href="https://api.whatsapp.com/send/?phone=6287726120040&text&type=phone_number&app_absent=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blush-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 rounded-sm"
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
                className="bg-camel-500 text-cornsilk-100 hover:bg-camel-600 border-none w-full px-8 uppercase tracking-widest transition-colors sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2"
                asChild
              >
                <a
                  href="https://maps.app.goo.gl/TgvK8yTR1HRFDocs5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
