-- CreateTable
CREATE TABLE "pickup_availability" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "is_open" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pickup_availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pickup_availability_date_key" ON "pickup_availability"("date");

-- CreateIndex
CREATE INDEX "pickup_availability_date_idx" ON "pickup_availability"("date");
