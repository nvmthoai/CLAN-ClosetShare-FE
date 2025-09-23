import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function LandingPage() {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Modern Navbar with Glass Effect */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">👗</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ClosetShare
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  How It Works
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Pricing
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#community"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Community
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </a>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <a href="/register">Get Started</a>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200">
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20" id="hero">
        <div className="mx-auto max-w-6xl grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
          <div className="text-center md:text-left">
            <Badge className="mb-6 bg-purple-100 text-purple-800 hover:bg-purple-200 inline-flex items-center">
              🎉 Now Live - Join the Fashion Revolution
            </Badge>

            <h1 className="hero-title">
              Your Virtual Wardrobe.{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shared, Styled, and Smart.
              </span>
            </h1>

            <p className="hero-subtitle">
              ClosetShare is a social fashion platform where individuals
              showcase their outfits, rent or sell items, and brands launch
              their collections with priority exposure. Powered by AI,
              ClosetShare helps you discover, style, and shop fashion in a
              smarter way.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
              <a href="#pricing">
                <Button size="lg" className="btn-primary">
                  Join Now – It's Free
                </Button>
              </a>
              <a href="#features">
                <Button size="lg" variant="outline" className="btn-secondary">
                  For Brands: Get Started
                </Button>
              </a>
            </div>
          </div>

          <div className="relative flex justify-center md:justify-end">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-8 -left-8 w-44 h-44 rounded-full bg-purple-300/40 blur-3xl animate-blob" />
            <div className="pointer-events-none absolute -bottom-6 -right-10 w-56 h-56 rounded-full bg-pink-300/40 blur-3xl animate-blob" />

            {/* Illustration placeholder - replace with real image later */}
            <div className="hero-illustration w-80 h-80 bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
              <img
                src="/vite.svg"
                alt="ClosetShare illustration"
                className="w-56 h-56 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why ClosetShare Section */}
      <section className="px-6 py-16 bg-white" id="features">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Why ClosetShare?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  👥
                </div>
                <CardTitle className="text-purple-900">
                  For Individuals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Build your own virtual closet, mix and match outfits, share
                  your looks, and even rent or sell pieces you no longer use.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-pink-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  🏢
                </div>
                <CardTitle className="text-pink-900">For Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Gain priority visibility in our feed, run targeted ad
                  campaigns, and connect directly with Gen Z fashion-forward
                  users.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  🤖
                </div>
                <CardTitle className="text-indigo-900">For Everyone</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Discover fashion that fits your size, your budget, and your
                  lifestyle — curated by AI recommendations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="px-6 py-16 bg-gray-50" id="how-it-works">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Key Features
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Social Posting & Community
              </h3>
              <p className="text-gray-600">
                Share your outfit-of-the-day with photos, videos, and product
                links. Get likes, comments, and build your following.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Virtual Closet & Outfit Builder
              </h3>
              <p className="text-gray-600">
                Upload your fashion items, organize them by category, and create
                outfits with just a few taps.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛍️</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Buy & Rent Marketplace
              </h3>
              <p className="text-gray-600">
                Browse secondhand gems or brand-new collections. Buy or rent
                items safely through our platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Smart AI Assistant
              </h3>
              <p className="text-gray-600">
                Our stylist AI learns your preferences, analyzes your closet,
                and suggests new outfit combinations or items to complement your
                style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            How It Works
          </h2>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Sign up as an individual or brand.",
                icon: "✨",
              },
              {
                step: 2,
                title: "Upload your closet items or shop collections.",
                icon: "📤",
              },
              {
                step: 3,
                title: "Share posts, outfits, or campaigns.",
                icon: "📸",
              },
              {
                step: 4,
                title: "Discover AI-powered recommendations.",
                icon: "🎯",
              },
              {
                step: 5,
                title: "Buy, rent, or sell with confidence.",
                icon: "💫",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-6 p-6 rounded-lg bg-gray-50"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {item.step}
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-lg text-gray-800">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-900 flex items-center gap-3">
                  <span>👤</span> For Individuals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-purple-600">✓</span>
                  <span>Showcase your unique fashion sense</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-600">✓</span>
                  <span>Trade or rent your items with others</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-600">✓</span>
                  <span>Use AI to generate personalized outfit ideas</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-600">✓</span>
                  <span>
                    Grow your audience and become a fashion influencer
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-pink-900 flex items-center gap-3">
                  <span>🏢</span> For Brands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-pink-600">✓</span>
                  <span>Open your digital shop instantly</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-pink-600">✓</span>
                  <span>
                    Run sponsored campaigns with geo-targeting and interest
                    filters
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-pink-600">✓</span>
                  <span>Reach the right audience with boosted visibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-pink-600">✓</span>
                  <span>
                    Access detailed analytics on impressions, clicks, and
                    conversions
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="px-6 py-16 bg-gray-50" id="pricing">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Plans for Individuals & Brands
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-purple-900">
                  Personal Plans
                </CardTitle>
                <CardDescription className="text-lg">
                  Enhanced features for fashion enthusiasts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-purple-600">✓</span>
                  <span>More closet slots</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-600">✓</span>
                  <span>Advanced AI styling</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-600">✓</span>
                  <span>Ad-free experience</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-pink-900">
                  Brand Plans
                </CardTitle>
                <CardDescription className="text-lg">
                  Professional tools for fashion brands
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-pink-600">✓</span>
                  <span>Priority placement in feeds</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-pink-600">✓</span>
                  <span>Sponsored campaigns</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-pink-600">✓</span>
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-pink-600">✓</span>
                  <span>Moderation priority</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-gray-900">
            Trust & Safety
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-4xl">🛡️</span>
            <span className="text-4xl">✅</span>
            <span className="text-4xl">🔒</span>
          </div>
          <p className="text-xl text-gray-600">
            All posts and products go through moderation to keep our community
            safe from scams, spam, or harmful content. Your safety and trust are
            our top priorities.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Fashion is more fun when it's shared.
          </h2>
          <p className="mb-8 text-xl opacity-90">
            Join ClosetShare today and unlock the future of social fashion.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="btn-primary text-purple-900 bg-white">
              Sign Up Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-secondary text-white border-white bg-transparent"
            >
              Explore Brand Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
