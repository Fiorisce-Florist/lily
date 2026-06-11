"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
];

export function FormShowcase() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h3 font-fraunces dark:text-cornsilk-100 border-cornsilk-300 mb-6 border-b pb-2 font-bold text-neutral-900 dark:border-neutral-800">
          Forms & Navigation
        </h2>
        <p className="text-b4 mb-8 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Input mechanisms, structural navigation elements, and data presentation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Select */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Select
          </h3>
          <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
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
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Checkbox
          </h3>
          <div className="border-cornsilk-300 space-y-4 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-b4 font-normal">
                Accept terms and conditions
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="disabled" disabled />
              <Label htmlFor="disabled" className="text-b4 font-normal opacity-50">
                Disabled option
              </Label>
            </div>
          </div>
        </div>

        {/* Radio Group */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Radio Group
          </h3>
          <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <RadioGroup defaultValue="standard">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="r1" />
                <Label htmlFor="r1" className="text-b4 font-normal">
                  Standard Delivery
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="express" id="r2" />
                <Label htmlFor="r2" className="text-b4 font-normal">
                  Express Delivery
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="same-day" id="r3" />
                <Label htmlFor="r3" className="text-b4 font-normal">
                  Same Day Delivery
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Tabs
          </h3>
          <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <Tabs defaultValue="account" className="w-100">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="bg-cornsilk-100 mt-2 rounded-lg p-4">
                <p className="text-b4 text-neutral-700 dark:text-neutral-300">
                  Make changes to your account here.
                </p>
              </TabsContent>
              <TabsContent value="password" className="bg-cornsilk-100 mt-2 rounded-lg p-4">
                <p className="text-b4 text-neutral-700 dark:text-neutral-300">
                  Change your password here.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Pagination */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Pagination
          </h3>
          <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
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
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Table
          </h3>
          <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
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
  );
}
