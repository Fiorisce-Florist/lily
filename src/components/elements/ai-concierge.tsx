"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bot, Loader2, MessageCircle, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/config/use-language";
import type { LanguageCode } from "@/config/language";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/formatters";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ConciergeMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: ConciergeRecommendation[];
};

type ConciergeRecommendation = {
  product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    price: number;
    category: string;
    tags: string[];
    variants: {
      id: string;
      name: string;
      price: number;
      stemsQuantity: number | null;
    }[];
  };
  reason: string;
};

const CHAT_STORAGE_KEY = "fiorisce_ai_concierge_chat";
const CHAT_TTL_MS = 12 * 60 * 60 * 1000;

const quickPrompts = {
  EN: [
    "I need flowers for a birthday under Rp 300.000",
    "Recommend something elegant for my partner",
    "What is suitable for graduation?",
  ],
  ID: [
    "Aku butuh bunga ulang tahun di bawah Rp 300.000",
    "Rekomendasikan yang elegan untuk pasangan",
    "Apa yang cocok untuk wisuda?",
  ],
} satisfies Record<LanguageCode, string[]>;

function createMessage(role: ConciergeMessage["role"], content: string): ConciergeMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
  };
}

function isConciergeMessage(value: unknown): value is ConciergeMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Partial<ConciergeMessage>;
  return (
    typeof message.id === "string" &&
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string"
  );
}

function getInitialMessages(welcome: string) {
  const fallback = [createMessage("assistant", welcome)];

  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored) as {
      expiresAt?: unknown;
      messages?: unknown;
    };

    if (typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(CHAT_STORAGE_KEY);
      return fallback;
    }

    if (!Array.isArray(parsed.messages)) return fallback;

    const messages = parsed.messages.filter(isConciergeMessage);
    return messages.length > 0 ? messages : fallback;
  } catch {
    window.localStorage.removeItem(CHAT_STORAGE_KEY);
    return fallback;
  }
}

export function AiConcierge() {
  const pathname = usePathname();
  const { language, dictionary } = useLanguage();
  const { addItem } = useCart();
  const [isEnabled, setIsEnabled] = React.useState<boolean | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [addingId, setAddingId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ConciergeMessage[]>(() =>
    getInitialMessages(dictionary.aiConcierge.welcome)
  );
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let isMounted = true;

    fetch("/api/ai-concierge", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { enabled?: unknown }) => {
        if (isMounted) setIsEnabled(data.enabled === true);
      })
      .catch(() => {
        if (isMounted) setIsEnabled(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({
        expiresAt: Date.now() + CHAT_TTL_MS,
        messages,
      })
    );
  }, [messages]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  if (
    !isEnabled ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    return null;
  }

  async function sendMessage(messageText = input) {
    const trimmed = messageText.trim();
    if (!trimmed || isSending) return;

    const userMessage = createMessage("user", trimmed);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    trackEvent("ai_concierge_message_sent", {
      path: pathname,
      language,
      message_length: trimmed.length,
    });

    try {
      const response = await fetch("/api/ai-concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        recommendations?: ConciergeRecommendation[];
      };

      setMessages((current) => [
        ...current,
        {
          ...createMessage("assistant", data.reply || dictionary.aiConcierge.error),
          recommendations: data.recommendations ?? [],
        },
      ]);
      trackEvent("ai_concierge_response_received", {
        path: pathname,
        language,
        recommendation_count: data.recommendations?.length ?? 0,
      });
    } catch {
      setMessages((current) => [...current, createMessage("assistant", dictionary.aiConcierge.error)]);
    } finally {
      setIsSending(false);
    }
  }

  async function handleAddToCart(recommendation: ConciergeRecommendation) {
    const variantId = recommendation.product.variants[0]?.id;

    setAddingId(recommendation.product.id);
    trackEvent("ai_concierge_recommendation_add_to_cart_clicked", {
      product_id: recommendation.product.id,
      product_name: recommendation.product.name,
      variant_id: variantId,
      path: pathname,
    });
    await addItem(recommendation.product.id, 1, variantId);
    setAddingId(null);
  }

  return (
    <div className="fixed right-4 bottom-24 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-24">
      {isOpen ? (
        <section className="w-[calc(100vw-2rem)] max-w-[390px] overflow-hidden rounded-xl border border-cornsilk-300 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
          <header className="flex items-center justify-between border-b border-cornsilk-200 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-500 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-fraunces text-b2 font-semibold text-neutral-900 dark:text-cornsilk-100">
                  {dictionary.aiConcierge.title}
                </h2>
                <p className="font-inter text-b6 text-neutral-500 dark:text-neutral-400">
                  {dictionary.aiConcierge.subtitle}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
              aria-label={dictionary.aiConcierge.close}
            >
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div ref={scrollRef} className="max-h-[50vh] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[86%] rounded-xl px-3 py-2 font-inter text-b5 leading-relaxed",
                    message.role === "user"
                      ? "bg-blush-500 text-white"
                      : "bg-cornsilk-100 text-neutral-800 dark:bg-neutral-900 dark:text-cornsilk-100"
                  )}
                >
                  <p>{message.content}</p>
                  {message.recommendations && message.recommendations.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {message.recommendations.map((recommendation) => (
                        <article
                          key={recommendation.product.id}
                          className="rounded-lg border border-cornsilk-300 bg-white p-2 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-cornsilk-100"
                        >
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/shop/${recommendation.product.slug}`}
                              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-cornsilk-200 dark:bg-neutral-800"
                              onClick={() =>
                                trackEvent("ai_concierge_recommendation_opened", {
                                  product_id: recommendation.product.id,
                                  product_name: recommendation.product.name,
                                  path: pathname,
                                  source: "recommendation_image",
                                })
                              }
                            >
                              {recommendation.product.imageUrl ? (
                                <Image
                                  src={recommendation.product.imageUrl}
                                  alt={recommendation.product.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-neutral-500">
                                  <ShoppingBag className="h-5 w-5" />
                                </span>
                              )}
                            </Link>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/shop/${recommendation.product.slug}`}
                                className="line-clamp-1 font-inter text-b5 font-semibold hover:text-blush-500"
                                onClick={() =>
                                  trackEvent("ai_concierge_recommendation_opened", {
                                    product_id: recommendation.product.id,
                                    product_name: recommendation.product.name,
                                    path: pathname,
                                    source: "recommendation_title",
                                  })
                                }
                              >
                                {recommendation.product.name}
                              </Link>
                              <p className="mt-0.5 font-jetbrains text-[11px] text-neutral-500 dark:text-neutral-400">
                                {formatPrice(recommendation.product.price)}
                              </p>
                              {recommendation.reason ? (
                                <p className="mt-1 line-clamp-2 text-b6 leading-snug text-neutral-600 dark:text-neutral-400">
                                  {recommendation.reason}
                                </p>
                              ) : null}
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              className="h-8 shrink-0 px-2.5"
                              onClick={() => handleAddToCart(recommendation)}
                              disabled={addingId === recommendation.product.id}
                            >
                              {addingId === recommendation.product.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <ShoppingBag className="h-3.5 w-3.5" />
                              )}
                              {dictionary.aiConcierge.add}
                            </Button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {isSending ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-xl bg-cornsilk-100 px-3 py-2 text-b5 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {dictionary.aiConcierge.thinking}
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-cornsilk-200 p-3 dark:border-neutral-800">
            <div className="mb-3 flex gap-2 overflow-x-auto">
              {quickPrompts[language].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isSending}
                  className="shrink-0 rounded-full border border-cornsilk-300 px-3 py-1.5 text-left font-inter text-b6 text-neutral-700 transition hover:border-blush-300 hover:text-blush-600 disabled:opacity-50 dark:border-neutral-800 dark:text-neutral-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form
              className="flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={dictionary.aiConcierge.placeholder}
                className="min-h-11 resize-none rounded-xl text-b5"
                rows={1}
                disabled={isSending}
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 shrink-0"
                disabled={!input.trim() || isSending}
                aria-label={dictionary.aiConcierge.send}
              >
                {isSending ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
            </form>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            trackEvent("ai_concierge_opened", {
              path: pathname,
              language,
            });
          }}
          className="group flex items-center gap-3 rounded-full border border-cornsilk-300 bg-white px-4 py-3 text-neutral-900 shadow-lg transition hover:-translate-y-1 hover:border-blush-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-cornsilk-100"
          aria-label={dictionary.aiConcierge.open}
        >
          <span className="hidden text-right sm:block">
            <span className="block font-inter text-b6 font-semibold">
              {dictionary.aiConcierge.bubbleTitle}
            </span>
            <span className="block font-inter text-b6 text-neutral-500 dark:text-neutral-400">
              {dictionary.aiConcierge.bubbleCta}
            </span>
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blush-500 text-white transition group-hover:bg-blush-600">
            <Sparkles className="h-5 w-5" />
          </span>
          <MessageCircle className="sr-only" />
        </button>
      )}
    </div>
  );
}
