import * as React from "react";
import { Truck, Flower2, PenTool, Gift } from "lucide-react";

const features = [
  {
    title: "Same-Day Delivery",
    description: "Available in Jakarta & Bali for orders placed before 2 PM.",
    icon: Truck,
  },
  {
    title: "Farm-Fresh Flowers",
    description: "Sourced directly from the best local and international growers.",
    icon: Flower2,
  },
  {
    title: "Bespoke Arrangements",
    description: "Customized designs crafted by our expert florists.",
    icon: PenTool,
  },
  {
    title: "Gift-Ready Packaging",
    description: "Every order arrives beautifully wrapped with a personalized note.",
    icon: Gift,
  },
];

export function UspSection() {
  return (
    <section className="bg-camel-100 dark:bg-neutral-950 border-camel-200 dark:border-neutral-900 border-y py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-4 font-bold">
            Why Choose Fiorisce
          </h2>
          <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mx-auto max-w-2xl">
            We are dedicated to providing you with the freshest flowers, exquisite designs, and
            reliable service to make every occasion memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-cornsilk-100 dark:bg-neutral-900 border-camel-200 dark:border-neutral-800 flex flex-col items-center rounded-2xl border p-8 text-center shadow-sm"
              >
                <div className="bg-blush-100 text-blush-700 dark:bg-blush-900/30 dark:text-blush-400 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-fraunces text-h4 text-neutral-900 dark:text-cornsilk-100 mb-3 font-semibold">
                  {feature.title}
                </h3>
                <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
