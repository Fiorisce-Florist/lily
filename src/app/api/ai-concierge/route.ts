import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3.7-flash";
const MAX_MESSAGES = 8;
const MAX_PRODUCTS = 48;

type ConciergeMessage = {
  role: "user" | "assistant";
  content: string;
};

type ConciergeRequest = {
  messages?: ConciergeMessage[];
  language?: "EN" | "ID";
};

type CatalogProduct = {
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

function sanitizeMessages(messages: ConciergeRequest["messages"]) {
  return (messages ?? [])
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1200),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_MESSAGES);
}

function extractJsonObject(content: string) {
  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    throw new Error("No JSON object found");
  }

  return JSON.parse(content.slice(firstBrace, lastBrace + 1)) as {
    reply?: unknown;
    recommendations?: unknown;
  };
}

function fallbackReply(language: "EN" | "ID") {
  if (language === "ID") {
    return "Aku belum bisa memproses rekomendasi sekarang. Coba sebutkan momen, budget, warna favorit, dan apakah bunganya untuk pickup atau delivery.";
  }

  return "I could not prepare a recommendation right now. Tell me the occasion, budget, preferred colors, and whether this is for pickup or delivery.";
}

async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      isAvailable: true,
    },
    orderBy: [{ createdAt: "desc" }],
    take: MAX_PRODUCTS,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      images: {
        orderBy: {
          isPrimary: "desc",
        },
        take: 1,
        select: {
          imageUrl: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
              type: true,
            },
          },
        },
      },
      variants: {
        where: {
          isAvailable: true,
        },
        select: {
          id: true,
          variantName: true,
          additionalPrice: true,
          stemsQuantity: true,
        },
      },
    },
  });

  return products.map((product) => {
    const basePrice = Number(product.price);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.images[0]?.imageUrl ?? null,
      price:
        basePrice > 0 || product.variants.length === 0
          ? basePrice
          : Math.min(...product.variants.map((variant) => Number(variant.additionalPrice))),
      category: product.category.name,
      tags: product.tags.map(({ tag }) => `${tag.type}:${tag.name}`),
      variants: product.variants.map((variant) => ({
        id: variant.id,
        name: variant.variantName,
        price: basePrice + Number(variant.additionalPrice),
        stemsQuantity: variant.stemsQuantity,
      })),
    };
  });
}

function buildPrompt(language: "EN" | "ID", products: CatalogProduct[]) {
  const responseLanguage =
    language === "ID" ? "Bahasa Indonesia with warm florist tone" : "natural English";

  return [
    "You are MinFio, Fiorisce florist's AI concierge.",
    `Respond in ${responseLanguage}.`,
    "Help customers choose suitable flowers based on occasion, recipient, budget, colors, timing, and pickup/delivery context.",
    "Recommend only products in the provided catalog. Never invent product names, prices, stock, or delivery promises.",
    "If the customer's needs are unclear, ask one concise follow-up question, but still suggest 1-2 safe options when possible.",
    "Keep replies short, practical, and sales-helpful. Mention why each recommended item fits.",
    "Return only a JSON object with this shape:",
    '{"reply":"string","recommendations":[{"id":"catalog product id","reason":"short reason"}]}',
    "Use at most 3 recommendations.",
    "",
    "Catalog:",
    JSON.stringify(products),
  ].join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "AI concierge is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as ConciergeRequest;
  const language = body.language === "ID" ? "ID" : "EN";
  const messages = sanitizeMessages(body.messages);

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "A customer message is required." }, { status: 400 });
  }

  const products = await getCatalogProducts();
  const productById = new Map(products.map((product) => [product.id, product]));

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://fiorisce.vercel.app",
        "X-Title": "Fiorisce AI Concierge",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
        temperature: 0.45,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: buildPrompt(language, products),
          },
          ...messages,
        ],
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const providerBody = await response.text();
      console.error("OpenRouter concierge error", {
        status: response.status,
        body: providerBody.slice(0, 2000),
      });
      throw new Error("OpenRouter request failed");
    }

    const providerPayload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = providerPayload.choices?.[0]?.message?.content ?? "";
    const parsed = extractJsonObject(content);
    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const candidate = item as { id?: unknown; reason?: unknown };
            if (typeof candidate.id !== "string") return null;
            const product = productById.get(candidate.id);
            if (!product) return null;

            return {
              product,
              reason: typeof candidate.reason === "string" ? candidate.reason.slice(0, 180) : "",
            };
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .slice(0, 3)
      : [];

    return NextResponse.json({
      reply: typeof parsed.reply === "string" ? parsed.reply : fallbackReply(language),
      recommendations,
    });
  } catch (error) {
    console.error("AI concierge failed", error);

    return NextResponse.json(
      {
        reply: fallbackReply(language),
        recommendations: [],
      },
      { status: 200 }
    );
  }
}
