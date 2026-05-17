import React, { useEffect, useState } from "react";
import "./autoBannerSlider.css";

const banners = [
  {
    desktop: "/assets/images/slider/banner-01.webp",
    mobile: "/assets/images/slider/mobile-banner-01.webp",
    alt: "كل خدماتك الرقمية في مكان واحد - أمد باي",
  },
  {
    desktop: "/assets/images/slider/banner-02.webp",
    mobile: "/assets/images/slider/mobile-banner-02.webp",
    alt: "اشحن ألعابك فوراً - أمد باي",
  },
  {
    desktop: "/assets/images/slider/banner-03.webp",
    mobile: "/assets/images/slider/mobile-banner-03.webp",
    alt: "غذ حسابك بسهولة وأمان - أمد باي",
  },
  {
    desktop: "/assets/images/slider/banner-04.webp",
    mobile: "/assets/images/slider/mobile-banner-04.webp",
    alt: "بطاقات رقمية فورية - أمد باي",
  },
  {
    desktop: "/assets/images/slider/banner-05.webp",
    mobile: "/assets/images/slider/mobile-banner-05.webp",
    alt: "سرعة أمان خدمات متكاملة - أمد باي",
  },
];

export default function AutoBannerSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="amd-slider-section" dir="rtl">
      <div className="amd-slider-shell">
        <div className="amd-slider-track">
          {banners.map((banner, index) => (
            <picture key={banner.desktop} className={`amd-slider-slide ${index === active ? "active" : ""}`}>
              <source media="(max-width: 640px)" srcSet={banner.mobile} />
              <img src={banner.desktop} alt={banner.alt} loading={index === 0 ? "eager" : "lazy"} />
            </picture>
          ))}
        </div>

        <div className="amd-slider-dots" aria-label="بنرات أمد باي">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === active ? "active" : ""}
              onClick={() => setActive(index)}
              aria-label={`عرض البنر ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
