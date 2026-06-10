import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Terminal, Info, CheckCircle2 } from "lucide-react"

export function CompoundShowcase() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h3 font-fraunces font-bold text-neutral-900 border-b border-cornsilk-300 pb-2 mb-6">
          Compound Components
        </h2>
        <p className="text-b4 text-neutral-600 mb-8 max-w-2xl">
          Components constructed from multiple smaller elements, like Cards, Accordions, and Alerts.
        </p>
      </div>

      <div className="space-y-12">
        {/* Avatar */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Avatar
          </h3>
          <div className="flex gap-4 bg-white p-6 rounded-xl border border-cornsilk-300">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Card */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Card
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300 max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Flower Subscription</CardTitle>
                <CardDescription>Get fresh blooms delivered to your door every month.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-b4 text-neutral-700">
                  Our seasonal bouquets are carefully curated and arranged by expert florists using the freshest blooms available.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Subscribe</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Alerts
          </h3>
          <div className="space-y-4 bg-white p-6 rounded-xl border border-cornsilk-300">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>
                You can add components and dependencies to your app using the cli.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Alert</AlertTitle>
              <AlertDescription>
                Your session has expired. Please log in again.
              </AlertDescription>
            </Alert>
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your order has been successfully placed.
              </AlertDescription>
            </Alert>
            <Alert variant="warning">
              <Info className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Your subscription is about to expire in 3 days.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Accordion
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300 max-w-xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How often are flowers delivered?</AccordionTrigger>
                <AccordionContent>
                  Depending on your subscription plan, we deliver either weekly, bi-weekly, or monthly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I pause my subscription?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can pause your subscription at any time from your account settings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What types of flowers do you use?</AccordionTrigger>
                <AccordionContent>
                  We focus on seasonal, locally sourced flowers to ensure maximum freshness and sustainability.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Progress & Slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
              Progress
            </h3>
            <div className="bg-white p-6 rounded-xl border border-cornsilk-300">
              <Progress value={60} className="w-[80%]" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
              Slider
            </h3>
            <div className="bg-white p-6 rounded-xl border border-cornsilk-300">
              <Slider defaultValue={[50]} max={100} step={1} className="w-[80%]" />
            </div>
          </div>
        </div>

        {/* Scroll Area */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Scroll Area
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300">
            <ScrollArea className="h-72 w-48 rounded-md border border-cornsilk-400">
              <div className="p-4">
                <h4 className="mb-4 text-b4 font-inter font-medium leading-none">Tags</h4>
                {Array.from({ length: 50 }).map((_, i, a) => (
                  <div key={i} className="text-b5 text-neutral-700">
                    Flower Tag {i + 1}
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </section>
  )
}
