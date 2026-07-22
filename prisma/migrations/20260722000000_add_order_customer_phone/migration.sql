-- AlterTable
ALTER TABLE "orders" ADD COLUMN "customer_phone" VARCHAR(20);

-- Backfill existing orders with the most relevant phone already available.
UPDATE "orders"
SET "customer_phone" = COALESCE(
    (
        SELECT "checkout_addresses"."phone"
        FROM "checkout_addresses"
        WHERE "checkout_addresses"."id" = "orders"."address_id"
    ),
    (
        SELECT "users"."phone"
        FROM "users"
        WHERE "users"."id" = "orders"."user_id"
    )
);
