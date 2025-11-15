export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface ShowcaseSectionProps {
  title: string;
  items: ShowcaseItem[];
}

export function ShowcaseSection({ title, items }: ShowcaseSectionProps) {
  return (
    <section id="showcase" className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-white via-blue-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 uppercase mb-8 md:mb-12 tracking-tight">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer bg-white overflow-hidden"
            >
              <div className="relative mb-4 overflow-hidden bg-gray-100 aspect-square border border-gray-300">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-colors duration-300"></div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

