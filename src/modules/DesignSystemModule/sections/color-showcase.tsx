import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ColorShowcase() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  const palettes = [
    {
      name: "Blush",
      description: "Primary brand, CTAs, accents",
      classes: {
        100: "bg-blush-100", 200: "bg-blush-200", 300: "bg-blush-300", 400: "bg-blush-400", 500: "bg-blush-500",
        600: "bg-blush-600", 700: "bg-blush-700", 800: "bg-blush-800", 900: "bg-blush-900", 1000: "bg-blush-1000",
      }
    },
    {
      name: "Camel",
      description: "Warm neutrals, backgrounds",
      classes: {
        100: "bg-camel-100", 200: "bg-camel-200", 300: "bg-camel-300", 400: "bg-camel-400", 500: "bg-camel-500",
        600: "bg-camel-600", 700: "bg-camel-700", 800: "bg-camel-800", 900: "bg-camel-900", 1000: "bg-camel-1000",
      }
    },
    {
      name: "Cornsilk",
      description: "Soft backgrounds, cards, surfaces",
      classes: {
        100: "bg-cornsilk-100", 200: "bg-cornsilk-200", 300: "bg-cornsilk-300", 400: "bg-cornsilk-400", 500: "bg-cornsilk-500",
        600: "bg-cornsilk-600", 700: "bg-cornsilk-700", 800: "bg-cornsilk-800", 900: "bg-cornsilk-900", 1000: "bg-cornsilk-1000",
      }
    },
    {
      name: "Olive",
      description: "Success states, secondary actions",
      classes: {
        100: "bg-olive-100", 200: "bg-olive-200", 300: "bg-olive-300", 400: "bg-olive-400", 500: "bg-olive-500",
        600: "bg-olive-600", 700: "bg-olive-700", 800: "bg-olive-800", 900: "bg-olive-900", 1000: "bg-olive-1000",
      }
    },
    {
      name: "Neutral",
      description: "Text, borders, dividers",
      classes: {
        100: "bg-neutral-100", 200: "bg-neutral-200", 300: "bg-neutral-300", 400: "bg-neutral-400", 500: "bg-neutral-500",
        600: "bg-neutral-600", 700: "bg-neutral-700", 800: "bg-neutral-800", 900: "bg-neutral-900", 1000: "bg-neutral-1000",
      }
    },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h2 font-fraunces">
          Colors
        </h2>
        <p className="text-b4 text-neutral-500">
          The Lily design system uses semantic color palettes.
          Each palette has 10 steps (100 to 1000).
        </p>
      </div>

      <div className="space-y-12">
        {palettes.map((palette) => (
          <div key={palette.name} className="space-y-4">
            <div>
              <h3 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
                {palette.name}
              </h3>

              <p className="text-b5 text-neutral-500">
                {palette.description}
              </p>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {steps.map((step) => {
                const className = palette.classes[step as keyof typeof palette.classes];

                return (
                  <div key={step}>
                    <div
                      className={cn(
                        "h-16 rounded-lg border border-neutral-200/20 flex items-center justify-center font-jetbrains text-m3 font-medium",
                        className,
                        step > 600
                          ? "text-white"
                          : "text-neutral-900"
                      )}
                    >
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}