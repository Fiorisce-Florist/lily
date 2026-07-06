-- CreateTable
CREATE TABLE "checkout_logs" (
    "id" TEXT NOT NULL,
    "order_number" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "http_status" INTEGER,
    "message" TEXT,
    "request_body" JSONB,
    "raw_response" JSONB,
    "user_id" TEXT,
    "amount" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkout_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "checkout_logs_order_number_idx" ON "checkout_logs"("order_number");

-- CreateIndex
CREATE INDEX "checkout_logs_created_at_idx" ON "checkout_logs"("created_at");
