BEGIN;

ALTER TABLE "projects"
  ADD COLUMN "caseStudyExcerpt" TEXT,
  ADD COLUMN "caseStudyChallenge" TEXT,
  ADD COLUMN "caseStudyApproach" TEXT,
  ADD COLUMN "caseStudyResults" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "caseStudyServices" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Preserve each study on its matching project when the slugs agree.
UPDATE "projects" AS project
SET
  "caseStudyExcerpt" = NULLIF(study."excerpt", ''),
  "caseStudyChallenge" = NULLIF(study."challenge", ''),
  "caseStudyApproach" = NULLIF(study."approach", ''),
  "caseStudyResults" = study."results",
  "caseStudyServices" = study."services",
  "image" = COALESCE(project."image", study."image"),
  "published" = project."published" OR study."published",
  "updatedAt" = GREATEST(project."updatedAt", study."updatedAt")
FROM "case_studies" AS study
WHERE project."slug" = study."slug";

-- Keep unmatched studies as standalone realizations so no published content disappears.
INSERT INTO "projects" (
  "id", "slug", "title", "description", "fullDescription", "objective",
  "client", "duration", "status", "url", "technologies", "goals", "solutions",
  "caseStudyExcerpt", "caseStudyChallenge", "caseStudyApproach",
  "caseStudyResults", "caseStudyServices", "image", "published", "order",
  "createdAt", "updatedAt"
)
SELECT
  'case-study-' || study."id",
  study."slug",
  study."title",
  COALESCE(NULLIF(study."excerpt", ''), NULLIF(study."challenge", ''), study."title"),
  NULL,
  NULL,
  NULL,
  NULL,
  CASE WHEN study."published" THEN 'COMPLETED'::"ProjectStatus" ELSE 'PENDING'::"ProjectStatus" END,
  NULL,
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  NULLIF(study."excerpt", ''),
  NULLIF(study."challenge", ''),
  NULLIF(study."approach", ''),
  study."results",
  study."services",
  study."image",
  study."published",
  study."order",
  study."createdAt",
  study."updatedAt"
FROM "case_studies" AS study
WHERE NOT EXISTS (
  SELECT 1 FROM "projects" AS project WHERE project."slug" = study."slug"
);

COMMIT;
