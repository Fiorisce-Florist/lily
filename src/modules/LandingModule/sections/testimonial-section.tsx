"use client";

import * as React from "react";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Amanda Sari",
    role: "Loyal Customer",
    content: "The flowers I ordered for my mother's birthday were absolutely stunning. They arrived fresh and on time. The packaging was so elegant. Will definitely order again!",
    rating: 5,
  },
  {
    id: 2,
    name: "Kevin Wijaya",
    role: "First-time Buyer",
    content: "Needed a last-minute anniversary gift and Fiorisce saved the day with their same-day delivery. The arrangement was beautiful and exactly as pictured.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah T.",
    role: "Bride",
    content: "They did the floral arrangements for my intimate wedding. Everything was beyond perfect. The florists truly understood my vision and brought it to life beautifully.",
    rating: 5,
  },
  {
    id: 4,
    name: "Budi Santoso",
    role: "Regular Customer",
    content: "Always reliable and the quality of the roses is unmatched. The customer service team is also very responsive and helpful.",
    rating: 4,
  },
];

export function TestimonialSection() {
  return (
    <section className="bg-olive-900 py-24 text-cornsilk-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-fraunces text-h2 mb-4 font-bold text-cornsilk-100">
            What Our Customers Say
          </h2>
          <p className="font-inter text-b4 mx-auto max-w-2xl text-olive-200">
            Don&apos;t just take our word for it. Hear from those who have experienced the magic of our
            floral arrangements.
          </p>
        </div>

        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="mx-auto w-full max-w-5xl"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/2 lg:pl-6">
                <div className="bg-olive-800/50 border-olive-700 flex h-full flex-col justify-between rounded-2xl border p-8 backdrop-blur-sm">
                  <div>
                    <div className="mb-6 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "fill-camel-400 text-camel-400"
                              : "text-olive-600"
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="font-inter text-b3 mb-8 italic leading-relaxed text-cornsilk-200">
                      &quot;{testimonial.content}&quot;
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-camel-200 flex h-12 w-12 items-center justify-center rounded-full text-camel-900 font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-fraunces text-b4 font-semibold text-cornsilk-100">
                        {testimonial.name}
                      </h4>
                      <p className="font-inter text-b5 text-olive-300">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-12 flex justify-center gap-4">
            <CarouselPrevious className="bg-olive-800 hover:bg-olive-700 hover:text-cornsilk-100 border-olive-700 static translate-y-0 text-cornsilk-100" />
            <CarouselNext className="bg-olive-800 hover:bg-olive-700 hover:text-cornsilk-100 border-olive-700 static translate-y-0 text-cornsilk-100" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
