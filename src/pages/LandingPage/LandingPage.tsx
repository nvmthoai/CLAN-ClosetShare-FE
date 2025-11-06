import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { ShowcaseSection, type ShowcaseItem } from "@/components/landing/ShowcaseSection";
import { FeatureBanner } from "@/components/landing/FeatureBanner";
import { Footer } from "@/components/landing/Footer";

function LandingPage() {
  // Portfolio/Showcase items
  const showcaseItems: ShowcaseItem[] = [
    {
      id: "1",
      title: "AI Outfit Companion",
      description: "Khám phá sức mạnh của công nghệ với tính năng AI Gợi Ý Phong Cách – nơi bạn chỉ cần chọn vài món đồ trong tủ, hệ thống sẽ tự động phối hợp thành những outfit hoàn chỉnh phù hợp với cá tính, vóc dáng và xu hướng thời trang hiện tại.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Personal Wardrobe Profile",
      description: "Biến tủ đồ của bạn thành không gian số. Mỗi người dùng có thể đăng tải, quản lý và trưng bày outfit cá nhân, tạo thành một hồ sơ phong cách riêng biệt – nơi mỗi bộ trang phục thể hiện cá tính và câu chuyện của chính bạn.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "Social Fashion Hub",
      description: "Không chỉ là nơi mua sắm – đây là cộng đồng thời trang năng động dành cho Gen Z. Người dùng có thể đăng bài viết, chia sẻ cảm hứng, bình luận và thảo luận về xu hướng mới, outfit yêu thích, hay những bộ sưu tập độc quyền.",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&auto=format&fit=crop",
    },
    {
      id: "4",
      title: "Smart Marketplace",
      description: "Mở cửa hàng của riêng bạn chỉ với vài thao tác. Người bán có thể tạo shop, đăng sản phẩm, kết nối với người mua và theo dõi đơn hàng, trong khi người mua dễ dàng tìm kiếm sản phẩm theo phong cách hoặc theo gợi ý từ AI.",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&auto=format&fit=crop",
    },
    {
      id: "5",
      title: "Outfit Collab & Tagging",
      description: "Tính năng gắn thẻ outfit cho phép người dùng kết hợp các món đồ của nhiều thương hiệu hoặc từ nhiều người dùng khác nhau, tạo ra những bộ outfit độc đáo và chia sẻ trực tiếp lên profile – mang đến trải nghiệm phối đồ cộng đồng sáng tạo và sống động.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop",
    },
    {
      id: "6",
      title: "Fashion Discovery Feed",
      description: "Hệ thống sẽ học thói quen của bạn để gợi ý nhiều outfit, shop và người dùng phù hợp với gu riêng — giúp bạn luôn dẫn đầu xu hướng, không cần phải tìm kiếm quá nhiều.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop",
    },
  ];


  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section id="home">
        <HeroSection
          subtitle="WELCOME TO CLOSETSHARE"
          buttonText="Khám phá ngay"
          heroImage="/landingpage_1.png"
          scrollToId="showcase"
        />
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Về Thương Hiệu Của Chúng Tôi
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Chúng tôi là nền tảng thời trang thế hệ mới — nơi công nghệ gặp gỡ phong cách.
          Sứ mệnh của chúng tôi là giúp mọi người thể hiện cá tính qua gợi ý outfit bằng AI, tủ đồ cá nhân, và cộng đồng thời trang sáng tạo.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
          Tại đây, bạn có thể khám phá, chia sẻ và kết nối để biến mỗi bộ trang phục thành một tuyên ngôn phong cách riêng.
          </p>
        </div>
      </section>

      {/* Showcase Section */}
      <ShowcaseSection
        title="Những tính năng độc đáo của chúng tôi"
        items={showcaseItems}
      />

      {/* Feature Banner - Collaboration */}
      <FeatureBanner
        backgroundImage="/coverpage.png"
        topLabel="CỘNG TÁC"
        title="Đối tác sáng tạo"
        subtitle="Tham gia mạng lưới chuyên gia sáng tạo của chúng tôi và giới thiệu tác phẩm của bạn đến khán giả toàn cầu."
        buttonText="Bắt đầu ngay"
        buttonLink="/login"
      />

      {/* Stats/Highlights Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-white via-blue-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Con số ấn tượng
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hàng nghìn người dùng đang tin tưởng và sử dụng ClosetShare mỗi ngày
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 - Active Users */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
              </div>
                <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-3 group-hover:text-blue-500 transition-colors">
                  10K+
            </div>
                <div className="text-lg font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Người dùng tích cực
              </div>
                <div className="text-sm text-gray-500">
                  Cộng đồng đang phát triển mỗi ngày
            </div>
          </div>
        </div>

            {/* Card 2 - Fashion Items */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                    </div>
                <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-3 group-hover:text-blue-500 transition-colors">
                  50K+
                  </div>
                <div className="text-lg font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Sản phẩm thời trang
                    </div>
                <div className="text-sm text-gray-500">
                  Đa dạng từ áo quần đến phụ kiện
                  </div>
          </div>
        </div>

            {/* Card 3 - Partner Brands */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-3 group-hover:text-blue-500 transition-colors">
                  100+
                </div>
                <div className="text-lg font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Đối tác thương hiệu
                    </div>
                    <div className="text-sm text-gray-500">
                  Kết nối với các thương hiệu hàng đầu
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Thông tin liên hệ
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Chúng tôi rất hân hạnh khi bạn sử dụng dịch vụ của chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@yourbrand.com"
              className="inline-block bg-gray-900 text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-blue-200"
            >
              Contact Us
            </a>
            <a
              href="/login"
              className="inline-block bg-white border-2 border-gray-900 text-gray-900 px-8 py-3 text-sm font-medium uppercase tracking-wider hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              Join Platform
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
