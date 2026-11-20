import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <PageShell>
      <PageTitle>{`${t("common.error404")} — ARIA`}</PageTitle>
      <div className="grid min-h-[80vh] place-items-center px-6 pt-16 text-center">
        <div className="animate-rise">
          <p className="font-heading text-[clamp(5rem,18vw,10rem)] font-extrabold leading-none tracking-tight text-blue">
            404
          </p>
          <h1 className="mt-2 font-heading text-xl font-bold text-foreground">
            {t("common.error404")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {t("common.error404Text")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary">
              <ArrowLeft className="size-4" aria-hidden />
              {t("common.backHome")}
            </Link>
            <Link to="/contact" className="btn-outline">
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
