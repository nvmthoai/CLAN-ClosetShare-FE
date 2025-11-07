import type { ReactNode } from "react";

interface HeroSectionProps {
  subtitle?: string;
  buttonText?: string;
  heroImage?: string;
  scrollToId?: string;
  description?: string;
  actions?: ReactNode;
}

export function HeroSection({
  buttonText,
  heroImage = "/landingpage_1.png",
  scrollToId,
  description,
  actions,
}: HeroSectionProps) {
  const handleClick = () => {
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const features = [
    "AI gợi ý phong cách thông minh",
    "Tủ đồ ảo và quản lý outfit cá nhân",
    "Cộng đồng thời trang năng động",
    "Marketplace thông minh",
  ];

  return (
    <section className="relative w-full bg-black">
      {/* Hero Banner Image with Content Overlay */}
      <div className="w-full relative">
        <img
          src={heroImage}
          alt="ClosetShare Hero"
          className="w-full h-auto object-contain"
        />
        
        {/* Content Overlay - Positioned on the dark part of the image */}
        <div className="absolute bottom-0 left-0 right-0 w-full pb-8 md:pb-12 lg:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 md:space-y-3">
              {/* Main Heading */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Nền tảng thời trang
              </h2>
              
              {/* Description */}
              {description ? (
                <p className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
                  {description}
                </p>
              ) : (
                <p className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
                  Khám phá, chia sẻ và mua sắm thời trang thông minh với AI. Tạo tủ đồ ảo, kết nối với cộng đồng và tìm kiếm phong cách phù hợp với bạn.
                </p>
              )}
              
              {/* Features List - Horizontal Layout */}
              <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-3 lg:gap-x-8 lg:gap-y-4 pt-2 md:pt-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-white text-xs md:text-sm lg:text-base whitespace-nowrap">
                    <span className="text-white font-bold text-base md:text-lg flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Call to Action Button */}
              <div className="pt-4 md:pt-6">
                {actions ? (
                  actions
                ) : buttonText ? (
                  <button
                    onClick={handleClick}
                    className="bg-gray-900 text-white px-6 py-3 md:px-8 md:py-4 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-xl hover:shadow-blue-200/50"
                  >
                    {buttonText}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
