import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 text-center">
      <style>{`
        @keyframes wilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }

        .flower-wilt {
          animation: wilt 6s ease-in-out infinite;
          transform-origin: 50% 97%;
        }

        @media (prefers-reduced-motion: reduce) {
          .flower-wilt {
            animation: none;
          }
        }
      `}</style>

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-8">
        {/* Botanical SVG */}
        <svg viewBox="0 0 100 155" aria-hidden="true" className="flower-wilt h-44 w-auto sm:h-52">
          <ellipse
            cx="12"
            cy="151"
            rx="9"
            ry="3.5"
            opacity="0.55"
            transform="rotate(-15 12 151)"
            className="fill-blush-200 dark:fill-blush-800"
          />

          <ellipse
            cx="78"
            cy="149"
            rx="7.5"
            ry="3"
            opacity="0.45"
            transform="rotate(22 78 149)"
            className="fill-blush-200 dark:fill-blush-800"
          />

          <ellipse
            cx="90"
            cy="153"
            rx="5.5"
            ry="2.5"
            opacity="0.35"
            transform="rotate(-8 90 153)"
            className="fill-camel-200 dark:fill-camel-800"
          />

          <path
            d="M50 150 C50 124 56 104 52 79 C48 57 37 42 28 18"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="fill-none stroke-olive-600 dark:stroke-olive-500"
          />

          <path
            d="M51.5 103 C42 94 30 92 31 83 C40 88 50.5 96 51.5 103Z"
            opacity="0.75"
            className="fill-olive-500 dark:fill-olive-600"
          />

          <path
            d="M50.5 79 C57.5 71 67.5 70 65.5 62 C58.5 68 50.5 74 50.5 79Z"
            opacity="0.6"
            className="fill-olive-400 dark:fill-olive-700"
          />

          <ellipse
            cx="21"
            cy="11"
            rx="7.5"
            ry="3.5"
            transform="rotate(-50 21 11)"
            className="fill-blush-200 dark:fill-blush-700"
          />

          <ellipse
            cx="28"
            cy="7"
            rx="7"
            ry="3.5"
            transform="rotate(-5 28 7)"
            className="fill-blush-300 dark:fill-blush-600"
          />

          <ellipse
            cx="36"
            cy="10"
            rx="7.5"
            ry="3.5"
            transform="rotate(45 36 10)"
            className="fill-blush-200 dark:fill-blush-700"
          />

          <ellipse
            cx="39"
            cy="23"
            rx="7.5"
            ry="3.5"
            transform="rotate(75 39 23)"
            className="fill-blush-300 dark:fill-blush-600"
          />

          <ellipse
            cx="33"
            cy="31"
            rx="7"
            ry="3"
            transform="rotate(40 33 31)"
            className="fill-blush-200 dark:fill-blush-700"
          />

          <ellipse
            cx="22"
            cy="31"
            rx="7"
            ry="3"
            transform="rotate(-40 22 31)"
            className="fill-blush-200 dark:fill-blush-700"
          />

          <ellipse
            cx="16"
            cy="20"
            rx="7.5"
            ry="3.5"
            transform="rotate(-75 16 20)"
            className="fill-blush-300 dark:fill-blush-600"
          />

          <circle cx="28" cy="19" r="5" className="fill-camel-200 dark:fill-camel-700" />

          <circle cx="28" cy="19" r="2.5" className="fill-camel-400 dark:fill-camel-500" />
        </svg>

        {/* Error Label */}
        <p className="font-inter text-xs uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500">
          Error 404
        </p>

        {/* Content */}
        <div className="space-y-5">
          <h1 className="font-fraunces text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-900 dark:text-cornsilk-100 sm:text-6xl lg:text-7xl">
            This bloom
            <br />
            has withered.
          </h1>

          <p className="mx-auto max-w-md font-inter text-base leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-lg">
            The page you&apos;re looking for has been moved, removed, or simply never existed in our
            garden.
          </p>
        </div>

        {/* Divider */}
        <div className="flex w-full max-w-55 items-center gap-4 opacity-40">
          <div className="h-px flex-1 bg-neutral-500" />
          <span aria-hidden="true" className="text-sm leading-none text-neutral-500">
            ✿
          </span>
          <div className="h-px flex-1 bg-neutral-500" />
        </div>

        {/* CTA */}
        <Button
          asChild
          size="lg"
          className="h-12 rounded-full bg-blush-500 px-10 text-sm font-medium text-cornsilk-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blush-600 hover:shadow-xl"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
