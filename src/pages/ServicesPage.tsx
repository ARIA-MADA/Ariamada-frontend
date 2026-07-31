// ServicesPage.tsx
import React from "react";
import ServiceSection from "@/components/Services/ServiceSection";

const ServicesPage = () => {
  return (
    <div className="services-page">
      <section id="services" className="scroll-mt-20">
        <ServiceSection />
      </section>
    </div>
  );
};

export default ServicesPage;
