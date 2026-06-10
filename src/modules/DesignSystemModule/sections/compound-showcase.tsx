import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Terminal, Info, CheckCircle2 } from "lucide-react"

export function CompoundShowcase() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h3 font-fraunces dark:text-cornsilk-100 border-cornsilk-300 mb-6 border-b pb-2 font-bold text-neutral-900 dark:border-neutral-800">
          Compound Components
        </h2>
        <p className="text-b4 mb-8 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Components constructed from multiple smaller elements, like Cards,
          Accordions, and Alerts.
        </p>
      </div>

      <div className="space-y-12">
        {/* Avatar */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Avatar
          </h3>
          <div className="border-cornsilk-300 flex gap-4 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
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
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Card
          </h3>
          <div className="border-cornsilk-300 max-w-md rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <Card>
              <CardHeader>
                <CardTitle>Flower Subscription</CardTitle>
                <CardDescription>
                  Get fresh blooms delivered to your door every month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-b4 text-neutral-700">
                  Our seasonal bouquets are carefully curated and arranged by
                  expert florists using the freshest blooms available.
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
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Alerts
          </h3>
          <div className="border-cornsilk-300 space-y-4 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>
                You can add components and dependencies to your app using the
                cli.
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
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Accordion
          </h3>
          <div className="border-cornsilk-300 max-w-xl rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How often are flowers delivered?
                </AccordionTrigger>
                <AccordionContent>
                  Depending on your subscription plan, we deliver either weekly,
                  bi-weekly, or monthly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Can I pause my subscription?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you can pause your subscription at any time from your
                  account settings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  What types of flowers do you use?
                </AccordionTrigger>
                <AccordionContent>
                  We focus on seasonal, locally sourced flowers to ensure
                  maximum freshness and sustainability.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Progress & Slider */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
              Progress
            </h3>
            <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <Progress value={60} className="w-[80%]" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
              Slider
            </h3>
            <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                className="w-[80%]"
              />
            </div>
          </div>
        </div>

        {/* Scroll Area */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Scroll Area
          </h3>
          <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <ScrollArea className="border-cornsilk-400 h-72 w-48 rounded-md border dark:border-neutral-800">
              <div className="p-4">
                <h4 className="text-b4 font-inter mb-4 leading-none font-medium">
                  Tags
                </h4>
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="text-b5 text-neutral-700 dark:text-neutral-300"
                  >
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
