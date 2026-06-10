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
        <h1 className="text-h1 font-fraunces dark:text-cornsilk-100 font-bold tracking-tight text-neutral-900">
          Lily Design System
        </h1>
        <p className="text-b3 mt-4 max-w-3xl text-neutral-600 dark:text-neutral-400">
          A comprehensive showcase of all typography, color tokens, and 32 UI
          components built for Fiorisce.
        </p>
      </div>

      <div className="flex flex-col items-start gap-12 lg:flex-row">
        {/* Sidebar Navigation */}
        <aside className="border-cornsilk-300 bg-cornsilk-200/50 sticky top-24 hidden w-64 shrink-0 rounded-xl border p-6 lg:block dark:border-neutral-800 dark:bg-neutral-900/50">
          <h3 className="text-h6 font-inter dark:text-cornsilk-100 mb-4 font-semibold tracking-wider text-neutral-900 uppercase">
            Contents
          </h3>
          <nav className="flex flex-col space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-b4 font-inter rounded-lg px-3 py-2 text-left transition-colors ${
                  activeSection === section.id
                    ? "bg-blush-100 dark:bg-blush-900/40 text-blush-800 dark:text-blush-300 font-medium"
                    : "hover:bg-cornsilk-300 dark:hover:text-cornsilk-100 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Navigation (Dropdown could be here, but simple scroll list works) */}
        <div className="hide-scrollbar border-cornsilk-300 bg-cornsilk-100/90 sticky top-16 z-40 -mx-4 flex w-full snap-x gap-2 overflow-x-auto border-b px-4 py-2 pb-4 backdrop-blur lg:hidden dark:border-neutral-800 dark:bg-neutral-950/90">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`text-b5 font-inter shrink-0 snap-start rounded-full px-4 py-2 whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? "bg-blush-500 text-cornsilk-100 font-medium"
                  : "bg-cornsilk-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Main Content Areas */}
        <div className="w-full flex-1 space-y-24">
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
