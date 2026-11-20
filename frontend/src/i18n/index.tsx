/* ============================================================
   Contexte i18n — FR / EN
   Stocké dans localStorage, `<html lang>` mis à jour automatiquement
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fr, type TranslationKey } from "./fr";
import { translateTexts } from "@/lib/api";

export type Locale = "fr" | "en";

const STORAGE_KEY = "aria-locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  /** Traduit une clé ; la valeur FR sert de repli */
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") return stored;
  } catch {
    /* localStorage indisponible — on garde fr */
  }
  return "fr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);
  const [automaticEnglish, setAutomaticEnglish] = useState<Partial<Record<TranslationKey, string>>>({});

  useEffect(() => {
    document.documentElement.lang = locale;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content =
        locale === "en"
          ? automaticEnglish["hero.description"] ?? fr["hero.description"]
          : fr["hero.description"];
    }
  }, [locale, automaticEnglish]);

  useEffect(() => {
    if (locale !== "en") return;
    let active = true;
    const keys = Object.keys(fr) as TranslationKey[];
    void translateTexts(keys.map((key) => fr[key]), "en")
      .then((translated) => {
        if (!active) return;
        setAutomaticEnglish(
          Object.fromEntries(keys.map((key, index) => [key, translated[index]])) as Partial<Record<TranslationKey, string>>,
        );
      })
      .catch(() => {
        /* Le français source reste disponible si le service est indisponible. */
      });
    return () => {
      active = false;
    };
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* silencieux */
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "fr" ? "en" : "fr");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: TranslationKey) =>
      locale === "en"
        ? automaticEnglish[key] ?? fr[key] ?? key
        : fr[key] ?? key,
    [locale, automaticEnglish],
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n doit être utilisé dans <I18nProvider>");
  return ctx;
}
