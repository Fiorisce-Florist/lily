"use client";

import * as React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

const galleryImages = [
  { id: 1, src: "/images/landing/gallery-1.png", alt: "Floral arrangement 1" },
  { id: 2, src: "/images/landing/gallery-2.png", alt: "Floral arrangement 2" },
  { id: 3, src: "/images/landing/gallery-3.png", alt: "Floral arrangement 3" },
  { id: 4, src: "/images/landing/gallery-4.png", alt: "Floral arrangement 4" },
  { id: 5, src: "/images/landing/gallery-5.png", alt: "Floral arrangement 5" },
  { id: 6, src: "/images/landing/gallery-6.png", alt: "Floral arrangement 6" },
  { id: 7, src: "/images/landing/gallery-7.png", alt: "Floral arrangement 7" },
  { id: 8, src: "/images/landing/gallery-8.png", alt: "Floral arrangement 8" },
];

export function GallerySection() {
  return (
    <section className="bg-cornsilk-100 dark:bg-neutral-950 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-2 font-bold">
            Follow Our Journey
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter text-b4 text-blush-600 hover:text-blush-700 dark:text-blush-400 mb-6 font-medium transition-colors"
          >
            @fiorisce.floristry
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          {galleryImages.map((image) => (
            <a
              key={image.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900/0 transition-colors duration-300 group-hover:bg-neutral-900/40">
                <Camera className="text-cornsilk-100 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Camera className="h-4 w-4" />
              Follow Us on Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
