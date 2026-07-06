"use client";

import * as React from "react";
import Link from "next/link";
import { CreditCard, ExternalLink } from "lucide-react";

import type { adminGetCheckoutLogs } from "@/app/actions/admin";
import { formatPrice } from "@/lib/formatters";

type CheckoutLogsData = Awaited<ReturnType<typeof adminGetCheckoutLogs>>;

function formatJson(value: unknown) {
  if (value === null || value === undefined) return "null";
  return JSON.stringify(value, null, 2);
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-neutral-950 p-3 font-mono text-xs leading-relaxed text-cornsilk-100">
      {formatJson(value)}
    </pre>
  );
}

export function PaymentLogsView({ data }: { data: CheckoutLogsData }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          <CreditCard className="h-6 w-6 text-blush-500" />
          Payment Logs
        </h1>
        <p className="mt-1 text-sm font-inter text-neutral-500">
          Recent payment-provider checkout responses, including failed attempts without orders.
        </p>
      </div>

      <div className="space-y-4">
        {data.logs.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
            No payment logs yet.
          </div>
        ) : (
          data.logs.map((log) => (
            <article
              key={log.id}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        log.status === "SUCCESS"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="font-mono text-sm text-neutral-900 dark:text-cornsilk-100">
                      {log.orderNumber}
                    </span>
                    {log.httpStatus && (
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        HTTP {log.httpStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {log.message ?? "No message"}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {new Date(log.createdAt).toLocaleString()} · {log.provider}
                    {log.amount !== null ? ` · ${formatPrice(log.amount)}` : ""}
                  </p>
                </div>

                {log.orderId && (
                  <Link
                    href={`/admin/orders/${log.orderId}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blush-600 hover:text-blush-700"
                  >
                    Open order
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Request body
                </summary>
                <JsonBlock value={log.requestBody} />
              </details>

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Provider response
                </summary>
                <JsonBlock value={log.rawResponse} />
              </details>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
