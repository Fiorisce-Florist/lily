import { cn } from "@/lib/utils"

export function ColorShowcase() {
  const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
  
  const palettes = [
    {
      name: "Blush",
      prefix: "bg-blush",
      description: "Primary brand, CTAs, accents"
    },
    {
      name: "Camel",
      prefix: "bg-camel",
      description: "Warm neutrals, backgrounds"
    },
    {
      name: "Cornsilk",
      prefix: "bg-cornsilk",
      description: "Soft backgrounds, cards, surfaces"
    },
    {
      name: "Olive",
      prefix: "bg-olive",
      description: "Success states, secondary actions"
    },
    {
      name: "Neutral",
      prefix: "bg-neutral",
      description: "Text, borders, dividers"
    }
  ]

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h3 font-fraunces font-bold text-neutral-900 border-b border-cornsilk-300 pb-2 mb-6">
          Colors
        </h2>
        <p className="text-b4 text-neutral-600 max-w-2xl">
          The Lily design system uses semantic color palettes. Each palette has 10 steps (100 to 1000).
        </p>
      </div>

      <div className="space-y-12">
        {palettes.map((palette) => (
          <div key={palette.name} className="space-y-4">
            <div>
              <h3 className="text-h4 font-fraunces font-semibold text-neutral-900">{palette.name}</h3>
              <p className="text-b5 text-neutral-500">{palette.description}</p>
            </div>
            
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {steps.map((step) => {
                const className = `${palette.prefix}-${step}`
                // Calculate text color to ensure contrast
                const textColor = step > 500 ? "text-white" : "text-neutral-900"
                
                return (
                  <div key={step} className="flex flex-col gap-2">
                    <div 
                      className={cn(
                        "h-16 w-full rounded-lg shadow-sm border border-neutral-200/20 flex items-center justify-center font-jetbrains text-m3 font-medium",
                        className,
                        textColor
                      )}
                    >
                      {step}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
