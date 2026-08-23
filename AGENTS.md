<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:mixpanel-analytics-rules -->

# Mixpanel Analytics

Fiorisce uses Mixpanel to measure whether the website creates meaningful ordering demand compared
with the previous WhatsApp-centered florist ordering flow.

## Setup

- Platform: Next.js web app.
- SDK: `mixpanel-browser`.
- Token env var: `NEXT_PUBLIC_MIXPANEL_TOKEN`.
- Current local fallback token: `edafba7c24db460ea89740489095eaea`.
- CDP/warehouse: none.
- Consent gate: not required for the current stated audience because EU/CA users were confirmed out
  of scope on 2026-08-23.
- Analytics wrapper: `src/lib/analytics.ts`.
- Global page and identity wiring: `src/components/elements/analytics-provider.tsx`.
- Mixpanel SDK-recognized pageview/autocapture is enabled for connection detection and behavioral
  context. Input autocapture and text-content capture are disabled to avoid collecting checkout PII.

## Business Measurement

The primary Value Moment is `checkout_started`, because it measures when a shopper moves from
browsing/cart activity into web ordering intent. Use `order_created` and `payment_redirect_started`
to measure deeper purchase intent, and `whatsapp_contact_clicked` to measure fallback/manual contact
demand.

Key questions the tracking should answer:

- How much web demand reaches checkout?
- What cart value do users have before checkout?
- Which products and categories create checkout intent?
- How much website demand converts to order/payment handoff?
- How often do users still choose WhatsApp contact instead of the website order flow?

## Current Event Plan

| Event | Trigger | Key properties |
| --- | --- | --- |
| `page_viewed` | Route changes | `path`, `url`, `referrer`, `page_title` |
| `analytics_initialized` | Browser analytics provider mounts | `path`, `url` |
| `product_viewed` | Product detail page opens | `product_id`, `product_slug`, `product_name`, `category`, `price`, `in_stock` |
| `product_variant_selected` | Product variant/size selected | `product_id`, `variant_id`, `variant_name`, `stems_quantity`, `price` |
| `product_quantity_changed` | Product detail quantity stepper changes | `product_id`, `quantity`, `action` |
| `cart_item_added` | Product successfully added to cart | `product_id`, `variant_id`, `quantity`, `price`, `cart_add_value`, `source` |
| `cart_item_quantity_updated` | Cart quantity changes | `product_id`, `quantity`, `previous_quantity`, `item_value`, `action` |
| `cart_item_removed` | Cart item removed | `product_id`, `quantity`, `item_value` |
| `cart_cleared` | Cart cleared | `item_count`, `cart_subtotal` |
| `checkout_started` | Checkout page reached or checkout CTA clicked | `source`, `selected_item_count`, `item_count`, `cart_subtotal`, `category_mix` |
| `checkout_delivery_method_selected` | Delivery method selected | `delivery_method`, `cart_subtotal`, `item_count` |
| `checkout_delivery_date_selected` | Delivery date selected | `delivery_date`, `delivery_method` |
| `checkout_delivery_time_selected` | Delivery time selected | `delivery_time`, `delivery_method` |
| `checkout_paper_bag_toggled` | Paper bag option changed | `include_paper_bag`, `cart_subtotal`, `item_count` |
| `checkout_submitted` | User submits checkout form before terms modal | `delivery_method`, `cart_subtotal`, `item_count`, `category_mix` |
| `checkout_validation_failed` | Client checkout validation blocks submit | `reason`, `delivery_method`, `cart_subtotal`, `item_count` |
| `order_created` | Order and payment session are created | `order_number`, `delivery_method`, `cart_subtotal`, `item_count`, `payment_provider` |
| `order_create_failed` | Order creation fails | `reason`, `delivery_method`, `cart_subtotal`, `item_count` |
| `payment_redirect_started` | Browser redirects to DOKU payment | `order_number`, `payment_provider`, `cart_subtotal`, `item_count` |
| `whatsapp_contact_clicked` | Floating WhatsApp contact clicked | `source`, `path` |
| `sign_up_completed` | Email registration succeeds | `sign_up_method`, `platform` |
| `login_completed` | Email login succeeds | `login_method`, `platform` |
| `logout_completed` | User logs out | none |

## Identity

- Call `identify(user.id)` after login/signup and on app re-open when a session exists.
- Use database user ID, never email, as Mixpanel identity.
- Call `reset()` before logout completes.
- Anonymous browsing and guest carts exist, so keep client-side Mixpanel initialized before login to
  preserve anonymous-to-authenticated behavior.

## Rules For Future Tracking

- Use `snake_case` event and property names.
- Do not create dynamic event names.
- Do not send `null`, `undefined`, or empty placeholder properties.
- Keep revenue/cart values numeric, not formatted strings.
- Prefer adding properties to the existing funnel events before creating new events.
- Track WhatsApp contact separately from web checkout so the business can compare assisted ordering
  demand against website self-serve ordering demand.

<!-- END:mixpanel-analytics-rules -->
