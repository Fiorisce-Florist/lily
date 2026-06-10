"use client"

import * as React from "react"
import { TypographyShowcase } from "./sections/typography-showcase"
import { ColorShowcase } from "./sections/color-showcase"
import { PrimitiveShowcase } from "./sections/primitive-showcase"
import { CompoundShowcase } from "./sections/compound-showcase"
import { OverlayShowcase } from "./sections/overlay-showcase"
import { FormShowcase } from "./sections/form-showcase"
import { ComplexShowcase } from "./sections/complex-showcase"

const sections = [
  { id: "typography", label: "Typography", component: TypographyShowcase },
  { id: "colors", label: "Colors", component: ColorShowcase },
  { id: "primitives", label: "Primitives", component: PrimitiveShowcase },
  { id: "compounds", label: "Compounds", component: CompoundShowcase },
  { id: "overlays", label: "Overlays & Menus", component: OverlayShowcase },
  { id: "forms", label: "Forms & Nav", component: FormShowcase },
  { id: "complex", label: "Complex Features", component: ComplexShowcase },
]

export default function DesignSystemModule() {
  const [activeSection, setActiveSection] = React.useState("typography")

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      // Adjust scroll position for the fixed header
      const y = element.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Optional: Intersection observer to update active section on scroll
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -80% 0px" } // trigger when near top of viewport
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-h1 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100 tracking-tight">
          Lily Design System
        </h1>
        <p className="mt-4 text-b3 text-neutral-600 dark:text-neutral-400 max-w-3xl">
          A comprehensive showcase of all typography, color tokens, and 32 UI components built for Fiorisce.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar Navigation */}
        <aside className="sticky top-24 hidden lg:block w-64 shrink-0 rounded-xl border border-cornsilk-300 dark:border-neutral-800 bg-cornsilk-200/50 dark:bg-neutral-900/50 p-6">
          <h3 className="text-h6 font-inter font-semibold text-neutral-900 dark:text-cornsilk-100 uppercase tracking-wider mb-4">
            Contents
          </h3>
          <nav className="flex flex-col space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-left px-3 py-2 rounded-lg text-b4 font-inter transition-colors ${
                  activeSection === section.id
                    ? "bg-blush-100 dark:bg-blush-900/40 text-blush-800 dark:text-blush-300 font-medium"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-cornsilk-300 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-cornsilk-100"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Navigation (Dropdown could be here, but simple scroll list works) */}
        <div className="lg:hidden flex overflow-x-auto w-full pb-4 gap-2 snap-x hide-scrollbar border-b border-cornsilk-300 dark:border-neutral-800 sticky top-16 bg-cornsilk-100/90 dark:bg-neutral-950/90 backdrop-blur z-40 py-2 -mx-4 px-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-b5 font-inter transition-colors shrink-0 snap-start ${
                activeSection === section.id
                  ? "bg-blush-500 text-cornsilk-100 font-medium"
                  : "bg-cornsilk-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Main Content Areas */}
        <div className="flex-1 space-y-24 w-full">
          {sections.map((section) => {
            const Component = section.component
            return (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <Component />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
