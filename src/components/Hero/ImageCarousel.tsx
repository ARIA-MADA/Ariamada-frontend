import React from "react";

const ImageCarousel = React.memo(() => {
  const images = [
    { src: "/images/bureau.jpg", alt: "Bureau Aria" },
    { src: "/images/teamwork.jpg", alt: "Travail d'équipe" },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Cadre du carousel avec ratio fixe */}
      <div className="carousel-gsap relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
        {images.map((image, index) => (
          <div key={index} className="absolute inset-0">
            <img
              src={image.src}
              alt={image.alt}
              className="carousel-image absolute inset-0 w-full h-full object-cover"
              style={{ 
                objectPosition: "center",
                opacity: index === 0 ? 1 : 0 
              }}
              loading="eager"
            />
            
            {/* Overlay de gradient pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        ))}
        
        {/* Effet de bordure */}
        <div className="absolute inset-0 border-2 border-white/10 rounded-3xl pointer-events-none"></div>
      </div>

    </div>
  );
});

ImageCarousel.displayName = "ImageCarousel";
export default ImageCarousel;