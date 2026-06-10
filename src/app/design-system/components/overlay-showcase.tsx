"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, User, CreditCard, LogOut, ChevronRight } from "lucide-react"

export function OverlayShowcase() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h3 font-fraunces font-bold text-neutral-900 border-b border-cornsilk-300 pb-2 mb-6">
          Overlays & Menus
        </h2>
        <p className="text-b4 text-neutral-600 mb-8 max-w-2xl">
          Interactive components that float above the main content like Dialogs, Dropdowns, and Sheets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Dialog */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Dialog
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300 flex items-center justify-center min-h-[150px]">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="text-b4 text-neutral-700">Form content would go here...</div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Alert Dialog */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Alert Dialog
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300 flex items-center justify-center min-h-[150px]">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Sheet */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Sheet (Drawer)
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300 flex flex-wrap gap-4 items-center justify-center min-h-[150px]">
            {["top", "right", "bottom", "left"].map((side) => (
              <Sheet key={side}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="capitalize">
                    {side}
                  </Button>
                </SheetTrigger>
                <SheetContent side={side as "top" | "right" | "bottom" | "left"}>
                  <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </div>

        {/* Popover */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Popover
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300 flex items-center justify-center min-h-[150px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none text-b4">Dimensions</h4>
                    <p className="text-b5 text-neutral-500">
                      Set the dimensions for the layer.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Tooltip */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Tooltip
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300 flex items-center justify-center min-h-[150px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Application Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Dropdown Menu
          </h3>
          <div className="bg-white p-6 rounded-xl border border-cornsilk-300 flex items-center justify-center min-h-[150px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User />
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    <span>Billing</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <User />
                      <span>Invite users</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <span>Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span>Message</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <LogOut />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  )
}
