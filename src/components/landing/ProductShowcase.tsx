import { ChevronRight } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  sizes: string[];
  isNew?: boolean;
}

interface ProductShowcaseProps {
  title: string;
  products: Product[];
}

export function ProductShowcase({ title, products }: ProductShowcaseProps) {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-black uppercase mb-8 md:mb-12 tracking-tight">
          {title}
        </h2>

        <div className="relative">
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer bg-white"
              >
                <div className="relative mb-3 overflow-hidden bg-gray-100 aspect-square">
                  {product.isNew && (
                    <div className="absolute top-2 left-2 z-10 bg-black text-white text-xs px-2 py-1 uppercase tracking-wide">
                      NEW
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm md:text-base font-medium text-black mb-1">
                  {product.name}
                </h3>
                <p className="text-sm md:text-base text-black mb-2 font-medium">
                  {product.price}
                </p>
                <div className="flex flex-wrap gap-1 text-xs text-gray-600">
                  {product.sizes.map((size, idx) => (
                    <span key={idx}>{size}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Arrow (optional, for carousel indication) */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4">
            <button className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

