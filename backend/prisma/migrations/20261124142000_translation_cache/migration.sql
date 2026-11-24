CREATE TABLE "translation_cache" (
  "id" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "sourceHash" TEXT NOT NULL,
  "sourceText" TEXT NOT NULL,
  "translatedText" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "translation_cache_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "translation_cache_locale_model_sourceHash_key"
  ON "translation_cache"("locale", "model", "sourceHash");

CREATE INDEX "translation_cache_updatedAt_idx"
  ON "translation_cache"("updatedAt");
