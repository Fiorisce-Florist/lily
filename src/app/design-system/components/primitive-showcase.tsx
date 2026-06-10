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
        <h2 className="text-h3 font-fraunces font-bold text-neutral-900 border-b border-cornsilk-300 pb-2 mb-6">
          Primitives
        </h2>
        <p className="text-b4 text-neutral-600 mb-8 max-w-2xl">
          Core UI building blocks like Buttons, Inputs, Badges, and Skeletons.
        </p>
      </div>

      <div className="space-y-12">
        {/* Buttons */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Buttons
          </h3>
          <div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-cornsilk-300">
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Search /></Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button disabled>Disabled Primary</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </div>
        </div>

        {/* Inputs & Textarea */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Inputs & Textarea
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl border border-cornsilk-300">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="hello@fiorisce.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-input">Disabled Input</Label>
                <Input id="disabled-input" disabled placeholder="Not allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Type your message here..." className="h-32" />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Badges
          </h3>
          <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-xl border border-cornsilk-300">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Success</Badge>
          </div>
        </div>

        {/* Skeletons */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Skeleton
          </h3>
          <div className="flex items-center space-x-4 bg-white p-6 rounded-xl border border-cornsilk-300">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Separator
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300">
            <div className="space-y-1">
              <h4 className="text-b4 font-inter font-medium text-neutral-900">Radix Primitives</h4>
              <p className="text-b5 text-neutral-500">Accessible unstyled UI components.</p>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center space-x-4 text-b5 text-neutral-700">
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
