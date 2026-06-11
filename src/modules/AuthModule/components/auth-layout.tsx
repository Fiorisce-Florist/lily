import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-neutral-950">
      {/* Left pane - Image */}
      <div className="relative hidden w-1/2 lg:block border-r border-cornsilk-200 dark:border-neutral-800">
        <Image
          src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1500&auto=format&fit=crop"
          alt="Fiorisce Blooms"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-12">
          <Link href="/">
            <h2 className="text-h2 font-fraunces text-white hover:text-blush-200 transition-colors">Fiorisce</h2>
          </Link>
          <p className="text-b4 font-inter text-cornsilk-100 mt-2 max-w-sm">
            Curated, fresh, and beautifully arranged blooms delivered to your door.
          </p>
        </div>
      </div>

      {/* Right pane - Form */}
      <div className="flex w-full flex-col lg:w-1/2 relative bg-cornsilk-50/30 dark:bg-neutral-900/50">
        <Link 
          href="/" 
          className="absolute left-6 top-6 sm:left-8 sm:top-8 flex items-center gap-2 text-b5 font-inter text-neutral-500 dark:text-neutral-400 hover:text-blush-600 dark:hover:text-blush-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <div className="flex flex-1 flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-32 py-12">
          <div className="mx-auto w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
