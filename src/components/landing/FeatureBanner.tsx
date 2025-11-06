import { Link } from "react-router-dom";

interface FeatureBannerProps {
  backgroundImage: string;
  topLabel?: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink?: string;
}

export function FeatureBanner({
  backgroundImage,
  topLabel,
  title,
  subtitle,
  buttonText,
  buttonLink = "/login",
}: FeatureBannerProps) {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 sm:px-8 md:px-12 lg:px-16">
        {topLabel && (
          <p className="text-white text-xs md:text-sm uppercase tracking-wider mb-2">
            {topLabel}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white text-sm md:text-base mb-6 opacity-90 max-w-2xl">
            {subtitle}
          </p>
        )}
        {buttonLink ? (
          <Link
            to={buttonLink}
            className="inline-block bg-white text-gray-900 px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-blue-200"
          >
            {buttonText}
          </Link>
        ) : (
          <button className="bg-white text-gray-900 px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-blue-200">
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
}
