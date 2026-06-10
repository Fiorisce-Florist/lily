import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"

export function PrimitiveShowcase() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h3 font-fraunces dark:text-cornsilk-100 border-cornsilk-300 mb-6 border-b pb-2 font-bold text-neutral-900 dark:border-neutral-800">
          Primitives
        </h2>
        <p className="text-b4 mb-8 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Core UI building blocks like Buttons, Inputs, Badges, and Skeletons.
        </p>
      </div>

      <div className="space-y-12">
        {/* Buttons */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Buttons
          </h3>
          <div className="border-cornsilk-300 flex flex-col gap-6 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Search />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button disabled>Disabled Primary</Button>
              <Button variant="outline" disabled>
                Disabled Outline
              </Button>
            </div>
          </div>
        </div>

        {/* Inputs & Textarea */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Inputs & Textarea
          </h3>
          <div className="border-cornsilk-300 grid grid-cols-1 gap-8 rounded-xl border bg-white p-6 md:grid-cols-2 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="hello@fiorisce.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-input">Disabled Input</Label>
                <Input id="disabled-input" disabled placeholder="Not allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="h-32"
              />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Badges
          </h3>
          <div className="border-cornsilk-300 flex flex-wrap items-center gap-4 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <Badge variant="default">DEFAULT</Badge>
            <Badge variant="secondary">SECONDARY</Badge>
            <Badge variant="outline">OUTLINE</Badge>
            <Badge variant="success">SUCCESS</Badge>
          </div>
        </div>

        {/* Skeletons */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Skeleton
          </h3>
          <div className="border-cornsilk-300 flex items-center space-x-4 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-62.5" />
              <Skeleton className="h-4 w-50" />
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Separator
          </h3>
          <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="space-y-1">
              <h4 className="text-b4 font-inter dark:text-cornsilk-100 font-medium text-neutral-900">
                Radix Primitives
              </h4>
              <p className="text-b5 text-neutral-500">
                Accessible unstyled UI components.
              </p>
            </div>
            <Separator className="my-4" />
            <div className="text-b5 flex h-5 items-center space-x-4 text-neutral-700 dark:text-neutral-300">
              <div>Blog</div>
              <Separator orientation="vertical" />
              <div>Docs</div>
              <Separator orientation="vertical" />
              <div>Source</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
