"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
]

export function FormShowcase() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h3 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100 border-b border-cornsilk-300 dark:border-neutral-800 pb-2 mb-6">
          Forms & Navigation
        </h2>
        <p className="text-b4 text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl">
          Input mechanisms, structural navigation elements, and data presentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Select */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Select
          </h3>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-cornsilk-300 dark:border-neutral-800">
            <Select>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Select a flower" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Spring</SelectLabel>
                  <SelectItem value="tulip">Tulip</SelectItem>
                  <SelectItem value="daffodil">Daffodil</SelectItem>
                  <SelectItem value="hyacinth">Hyacinth</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Summer</SelectLabel>
                  <SelectItem value="peony">Peony</SelectItem>
                  <SelectItem value="sunflower">Sunflower</SelectItem>
                  <SelectItem value="rose">Rose</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Checkbox */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Checkbox
          </h3>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-cornsilk-300 dark:border-neutral-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="font-normal text-b4">Accept terms and conditions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="disabled" disabled />
              <Label htmlFor="disabled" className="font-normal text-b4 opacity-50">Disabled option</Label>
            </div>
          </div>
        </div>

        {/* Radio Group */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Radio Group
          </h3>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-cornsilk-300 dark:border-neutral-800">
            <RadioGroup defaultValue="standard">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="r1" />
                <Label htmlFor="r1" className="font-normal text-b4">Standard Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="express" id="r2" />
                <Label htmlFor="r2" className="font-normal text-b4">Express Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="same-day" id="r3" />
                <Label htmlFor="r3" className="font-normal text-b4">Same Day Delivery</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Tabs
          </h3>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-cornsilk-300 dark:border-neutral-800">
            <Tabs defaultValue="account" className="w-100">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="p-4 bg-cornsilk-100 rounded-lg mt-2">
                <p className="text-b4 text-neutral-700 dark:text-neutral-300">Make changes to your account here.</p>
              </TabsContent>
              <TabsContent value="password" className="p-4 bg-cornsilk-100 rounded-lg mt-2">
                <p className="text-b4 text-neutral-700 dark:text-neutral-300">Change your password here.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Pagination */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Pagination
          </h3>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-cornsilk-300 dark:border-neutral-800">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>

        {/* Table */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Table
          </h3>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-cornsilk-300 dark:border-neutral-800">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">{invoice.invoice}</TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}
