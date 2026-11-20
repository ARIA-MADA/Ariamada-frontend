import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

/* Desktop : vidéo paysage — Mobile : vidéo verticale, chaque image remplit le cadre sans recadrage */
const VIDEO_DESKTOP = "/hero/hero-back.mp4";
const POSTER_DESKTOP = "/hero/hero-back-poster.jpg";
const VIDEO_MOBILE = "/hero/hero.mp4";
const POSTER_MOBILE = "/hero/hero-poster.jpg";

/* État par défaut du hero : affiché si la vidéo et l'image sont indisponibles */
const DEFAULT_BACKGROUND =
  "bg-[radial-gradient(120%_85%_at_50%_0%,rgba(249,115,22,0.38),rgba(249,115,22,0.06)_45%,transparent_70%),linear-gradient(180deg,#24201d_0%,#151312_55%,#100e0d_100%)]";

interface MediaProps {
  video: string;
  poster: string;
  /** Classes de visibilité : mobile (`md:hidden`) ou desktop (`hidden md:block`) */
  visibility: string;
  failed: boolean;
  onFailed: () => void;
}

/** Couche média : image de repli + vidéo, superposées à l'état par défaut */
function HeroMedia({ video, poster, visibility, failed, onFailed }: MediaProps) {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayback = (element: HTMLVideoElement) => {
    if (element.paused) {
      void element.play();
    } else {
      element.pause();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLVideoElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePlayback(event.currentTarget);
    }
  };

  return (
    <>
      <div className={`absolute inset-0 bg-[#100e0d]/25 ${visibility}`} aria-hidden />
      <img
        src={poster}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-fill ${visibility}`}
        fetchPriority="high"
      />
      {!failed && (
        <video
          className={`absolute inset-0 h-full w-full object-fill ${visibility}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          role="button"
          tabIndex={0}
          aria-label={isPlaying ? t("hero.videoPause") : t("hero.videoPlay")}
          onClick={(event) => togglePlayback(event.currentTarget)}
          onKeyDown={handleKeyDown}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={onFailed}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
    </>
  );
}

export default function Hero() {
  const { t } = useI18n();
  const [desktopFailed, setDesktopFailed] = useState(false);
  const [mobileFailed, setMobileFailed] = useState(false);

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-end overflow-hidden bg-background"
    >
      <h1 className="sr-only">{t("hero.title")}</h1>

      {/* Média : remplit toute la section, dès le bas de la navbar (aucun espace vide en haut) */}
      <div className="absolute inset-0 overflow-hidden bg-navy">
        {/* État par défaut (aucune vidéo / aucune image) */}
        <div className={`absolute inset-0 ${DEFAULT_BACKGROUND}`} aria-hidden />

        {/* Mobile : vidéo verticale /hero/hero.mp4 */}
        <HeroMedia
          video={VIDEO_MOBILE}
          poster={POSTER_MOBILE}
          visibility="md:hidden"
          failed={mobileFailed}
          onFailed={() => setMobileFailed(true)}
        />

        {/* Desktop : vidéo paysage /hero/hero-back.mp4 */}
        <HeroMedia
          video={VIDEO_DESKTOP}
          poster={POSTER_DESKTOP}
          visibility="hidden md:block"
          failed={desktopFailed}
          onFailed={() => setDesktopFailed(true)}
        />
      </div>

      {/* CTA tout en bas de la vidéo — le bouton de chat flottant est juste au-dessus */}
      <div className="container-site relative z-10 flex justify-center py-6 sm:py-8 md:justify-start md:pb-8">
        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <Link
            to="/realisations"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/35 bg-black/55 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-colors hover:border-white/60 hover:bg-black/70 md:min-h-12 md:px-6 md:text-base"
          >
            {t("hero.ctaSecondary")}
          </Link>
          <Link to="/devis" className="btn-primary md:min-h-12 md:px-6 md:py-3 md:text-base shadow-[0_8px_30px_rgba(0,0,0,0.4)] ring-1 ring-white/25">
            {t("hero.ctaPrimary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
