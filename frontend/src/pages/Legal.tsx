import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import { Eyebrow, Section } from "@/components/ui";
import { ARIA_CONTACT } from "@/components/layout/Footer";
import type { TranslationKey } from "@/i18n/fr";
import { translateTexts } from "@/lib/api";

type PageKey = "mentions" | "privacy" | "terms";

const CONTENT: Record<
  PageKey,
  { titleKey: TranslationKey; eyebrow: string; sections: { h: string; p: string }[] }
> = {
  mentions: {
    titleKey: "footer.mentions",
    eyebrow: "Légal",
    sections: [
      {
        h: "Éditeur du site",
        p: `ARIA — Accompagnement Digital\nSite : https://www.aria-mg.com/\nEmail : ${ARIA_CONTACT.email}\nTéléphone : ${ARIA_CONTACT.phones.join(" · ")}\nAdresse : ${ARIA_CONTACT.address}`,
      },
      {
        h: "Hébergement",
        p: "Le site est hébergé par un prestataire d'infogérance. Pour toute question relative à l'hébergement, contactez-nous à l'adresse indiquée ci-dessus.",
      },
      {
        h: "Propriété intellectuelle",
        p: "L'ensemble des contenus de ce site (textes, logos, images, graphismes, vidéos) est la propriété exclusive d'ARIA ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.",
      },
      {
        h: "Responsabilité",
        p: "ARIA s'efforce d'assurer l'exactitude des informations publiées sur ce site, sans pouvoir garantir l'absence d'erreurs ou d'omissions. Les informations sont fournies à titre indicatif et ne constituent pas un engagement contractuel.",
      },
    ],
  },
  privacy: {
    titleKey: "footer.privacy",
    eyebrow: "Légal",
    sections: [
      {
        h: "Données collectées",
        p: "Nous collectons uniquement les données que vous nous transmettez volontairement via les formulaires de contact et de devis : nom, entreprise, email, téléphone, pays, ainsi que le contenu de votre message.",
      },
      {
        h: "Utilisation des données",
        p: "Ces données sont utilisées exclusivement pour répondre à votre demande, préparer un devis et assurer le suivi de la relation commerciale. Elles ne sont ni vendues ni transmises à des tiers à des fins de prospection.",
      },
      {
        h: "Conservation",
        p: "Les données sont conservées pendant la durée nécessaire au traitement de votre demande, puis archivées conformément aux obligations légales en vigueur.",
      },
      {
        h: "Vos droits",
        p: `Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, écrivez-nous à ${ARIA_CONTACT.email}.`,
      },
      {
        h: "Cookies",
        p: "Ce site n'utilise que des cookies techniques nécessaires à son fonctionnement (préférences d'affichage, langue). Aucun cookie de publicité ou de suivi tiers n'est déposé sans votre consentement.",
      },
    ],
  },
  terms: {
    titleKey: "footer.terms",
    eyebrow: "Légal",
    sections: [
      {
        h: "Objet",
        p: "Les présentes conditions régissent l'utilisation du site aria-mg.com et les prestations proposées par ARIA. Toute commande implique l'acceptation sans réserve des présentes conditions.",
      },
      {
        h: "Prestations et tarifs",
        p: "Les prestations sont décrites dans nos offres de service. Les tarifs sont établis sur devis, en fonction du périmètre, du volume et des délais convenus. Un devis détaillé est remis avant tout démarrage de projet.",
      },
      {
        h: "Délais de livraison",
        p: "Les délais indiqués sont donnés à titre estimatif et courent à compter de la validation du devis et de la réception des éléments nécessaires au projet (contenu, accès, validations).",
      },
      {
        h: "Propriété intellectuelle",
        p: "Les droits de propriété intellectuelle des livrables sont transférés au client après paiement intégral. ARIA se réserve le droit de présenter le projet dans son portfolio, sauf clause contraire.",
      },
      {
        h: "Limitation de responsabilité",
        p: "ARIA ne saurait être tenue responsable des dommages indirects résultant de l'utilisation du site ou des livrables, notamment en cas de interruption de service imputable à un tiers.",
      },
    ],
  },
};

export default function Legal({ page }: { page: PageKey }) {
  const { t, locale } = useI18n();
  const content = CONTENT[page];
  const [translatedContent, setTranslatedContent] = useState<typeof content | null>(null);
  const [translatedContact, setTranslatedContact] = useState<[string, string] | null>(null);

  useEffect(() => {
    let active = true;
    if (locale === "fr") {
      setTranslatedContent(null);
      setTranslatedContact(null);
      return;
    }

    const texts = [content.eyebrow, ...content.sections.flatMap((section) => [section.h, section.p])];
    void Promise.all([
      translateTexts(texts, locale),
      translateTexts(["Une question sur ces informations ?", "Contactez-nous"], locale),
    ])
      .then(([translated, contact]) => {
        if (!active) return;
        let cursor = 1;
        setTranslatedContent({
          ...content,
          eyebrow: translated[0],
          sections: content.sections.map(() => ({
            h: translated[cursor++],
            p: translated[cursor++],
          })),
        });
        setTranslatedContact([contact[0], contact[1]]);
      })
      .catch(() => {
        if (active) {
          setTranslatedContent(null);
          setTranslatedContact(null);
        }
      });
    return () => {
      active = false;
    };
  }, [content, locale]);

  const visibleContent = locale === "en" ? translatedContent ?? content : content;

  return (
    <PageShell>
      <PageTitle>{`${t(content.titleKey)} — ARIA`}</PageTitle>

      <section className="section-wash-blue border-b border-line pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="container-site">
          <div className="animate-rise max-w-3xl">
            <Eyebrow>{visibleContent.eyebrow}</Eyebrow>
            <h1 className="title-page">{t(content.titleKey)}</h1>
          </div>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl space-y-8">
          {visibleContent.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-heading text-lg font-bold text-foreground">{s.h}</h2>
              <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {s.p}
              </p>
            </section>
          ))}

          <div className="rounded-xl border border-line bg-card p-6">
            <p className="text-sm text-muted-foreground">
              {(locale === "en" ? translatedContact?.[0] : undefined) ?? "Une question sur ces informations ?"}{" "}
              <Link to="/contact" className="font-semibold text-blue hover:underline">
                {(locale === "en" ? translatedContact?.[1] : undefined) ?? "Contactez-nous"}
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
