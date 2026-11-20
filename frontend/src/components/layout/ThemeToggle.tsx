import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n";
import { useTheme } from "@/lib/theme";

/** Bascule entre le mode clair et le mode sombre */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const isDark = theme === "dark";
  const label = isDark ? t("theme.switchToLight") : t("theme.switchToDark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={!isDark}
      className="group relative inline-flex h-9 w-14 shrink-0 items-center rounded-full border border-line bg-surface-2 p-1 shadow-inner transition-all duration-300 hover:border-blue/50 hover:bg-blue/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Moon
        className="absolute left-[7px] size-3.5 text-muted-foreground transition-colors group-hover:text-blue"
        aria-hidden
      />
      <Sun
        className="absolute right-[7px] size-3.5 text-muted-foreground transition-colors group-hover:text-blue"
        aria-hidden
      />
      <span
        className={`relative z-10 grid size-6 place-items-center rounded-full bg-background text-blue shadow-md ring-1 ring-foreground/10 transition-transform duration-300 ease-out ${
          isDark ? "translate-x-0" : "translate-x-6"
        }`}
        aria-hidden
      >
        {isDark ? (
          <Moon className="size-3.5 transition-transform duration-300" />
        ) : (
          <Sun className="size-3.5 transition-transform duration-300" />
        )}
      </span>
    </button>
  );
}
