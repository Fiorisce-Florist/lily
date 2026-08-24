CREATE TABLE "site_settings" (
    "key" VARCHAR(100) NOT NULL,
    "boolean_value" BOOLEAN,
    "string_value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key")
);

INSERT INTO "site_settings" ("key", "boolean_value")
VALUES ('ai_concierge_enabled', true)
ON CONFLICT ("key") DO NOTHING;
