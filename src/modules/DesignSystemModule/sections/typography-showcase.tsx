export function TypographyShowcase() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h3 font-fraunces dark:text-cornsilk-100 border-cornsilk-300 mb-6 border-b pb-2 font-bold text-neutral-900 dark:border-neutral-800">
          Typography
        </h2>
        <p className="text-b4 mb-8 max-w-2xl text-neutral-600 dark:text-neutral-400">
          The Lily design system uses three typefaces: Fraunces (display), Inter (body), and
          JetBrains Mono (monospace).
        </p>
      </div>

      <div className="space-y-12">
        {/* Headings */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Headings (Fraunces)
          </h3>
          <div className="border-cornsilk-300 space-y-6 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-h1 (39px)</span>
              <h1 className="text-h1 font-fraunces dark:text-cornsilk-100 font-bold text-neutral-900">
                The quick brown fox jumps over the lazy dog.
              </h1>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-h2 (31px)</span>
              <h2 className="text-h2 font-fraunces dark:text-cornsilk-100 font-bold text-neutral-900">
                The quick brown fox jumps over the lazy dog.
              </h2>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-h3 (25px)</span>
              <h3 className="text-h3 font-fraunces dark:text-cornsilk-100 font-bold text-neutral-900">
                The quick brown fox jumps over the lazy dog.
              </h3>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-h4 (20px)</span>
              <h4 className="text-h4 font-fraunces dark:text-cornsilk-100 font-semibold text-neutral-900">
                The quick brown fox jumps over the lazy dog.
              </h4>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-h5 (16px)</span>
              <h5 className="text-h5 font-fraunces dark:text-cornsilk-100 font-semibold text-neutral-900">
                The quick brown fox jumps over the lazy dog.
              </h5>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-h6 (13px)</span>
              <h6 className="text-h6 font-fraunces dark:text-cornsilk-100 font-semibold text-neutral-900">
                The quick brown fox jumps over the lazy dog.
              </h6>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-h7 (10px)</span>
              <div className="text-h7 font-fraunces dark:text-cornsilk-100 font-semibold tracking-widest text-neutral-900 uppercase">
                The quick brown fox jumps over the lazy dog.
              </div>
            </div>
          </div>
        </div>

        {/* Body Text */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Body (Inter)
          </h3>
          <div className="border-cornsilk-300 space-y-6 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-b1 (31px)</span>
              <p className="text-b1 font-inter text-neutral-700 dark:text-neutral-300">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-b2 (25px)</span>
              <p className="text-b2 font-inter text-neutral-700 dark:text-neutral-300">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-b3 (20px)</span>
              <p className="text-b3 font-inter text-neutral-700 dark:text-neutral-300">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-b4 (16px)</span>
              <p className="text-b4 font-inter text-neutral-700 dark:text-neutral-300">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-b5 (13px)</span>
              <p className="text-b5 font-inter text-neutral-700 dark:text-neutral-300">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-jetbrains text-neutral-400">text-b6 (10px)</span>
              <p className="text-b6 font-inter text-neutral-700 dark:text-neutral-300">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </div>

        {/* Monospace */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Monospace (JetBrains Mono)
          </h3>
          <div className="border-cornsilk-300 space-y-6 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-inter text-neutral-400">text-m1 (16px)</span>
              <p className="text-m1 font-jetbrains text-neutral-700 dark:text-neutral-300">ROSE</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-inter text-neutral-400">text-m2 (13px)</span>
              <p className="text-m2 font-jetbrains text-neutral-700 dark:text-neutral-300">ROSE</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-b5 font-inter text-neutral-400">text-m3 (10px)</span>
              <p className="text-m3 font-jetbrains text-neutral-700 dark:text-neutral-300">ROSE</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
