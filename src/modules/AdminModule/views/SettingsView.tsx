"use client";

import * as React from "react";
import { Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { adminSetAiConciergeEnabled } from "@/app/actions/admin";
import { Switch } from "@/components/ui/switch";

interface SettingsViewProps {
  settings: {
    aiConciergeEnabled: boolean;
  };
}

export function SettingsView({ settings }: SettingsViewProps) {
  const [aiConciergeEnabled, setAiConciergeEnabled] = React.useState(
    settings.aiConciergeEnabled
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const handleAiConciergeChange = async (enabled: boolean) => {
    if (isSaving) return;

    const previousValue = aiConciergeEnabled;
    setAiConciergeEnabled(enabled);
    setIsSaving(true);

    const result = await adminSetAiConciergeEnabled(enabled);
    setIsSaving(false);

    if (result.error) {
      setAiConciergeEnabled(previousValue);
      toast.error(result.error);
      return;
    }

    toast.success(`AI Concierge is now ${enabled ? "enabled" : "disabled"}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-semibold text-neutral-900 dark:text-cornsilk-100">
          Settings
        </h1>
        <p className="mt-1 font-inter text-sm text-neutral-500">
          Manage customer-facing website features.
        </p>
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blush-100 text-blush-600 dark:bg-blush-900/30 dark:text-blush-300">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-fraunces text-lg font-medium text-neutral-900 dark:text-cornsilk-100">
                AI Concierge
              </h2>
              <p className="mt-1 max-w-xl font-inter text-sm text-neutral-500 dark:text-neutral-400">
                Show or hide the MinFio AI flower recommendation chat for customers. When disabled,
                the chat API is also blocked.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-neutral-400" /> : null}
            <span className="font-inter text-sm text-neutral-500">
              {aiConciergeEnabled ? "Enabled" : "Disabled"}
            </span>
            <Switch
              checked={aiConciergeEnabled}
              disabled={isSaving}
              onCheckedChange={handleAiConciergeChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
