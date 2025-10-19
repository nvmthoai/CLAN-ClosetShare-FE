import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Menu, X, Apple, Grid2x2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { subscriptionApi } from "@/apis/subscription.api";
import type { Subscription } from "@/models/Subscription";

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: plansData } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => subscriptionApi.getAll(),
    select: (res) =>
      (Array.isArray(res.data)
        ? res.data
        : (res.data as any).data) as Subscription[],
    staleTime: 60_000,
  });

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
                  <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                    <img src="/logobox_512x512.png" alt="ClosetShare" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xl font-bold bg-brand-gradient bg-clip-text text-transparent">
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
                  className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gradient group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  How It Works
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gradient group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Pricing
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gradient group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#community"
                  className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Community
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gradient group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-gray-700 hover:text-primary px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </a>
                <Button className="bg-brand-gradient hover:opacity-90 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <a href="/register">Get Started</a>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors duration-200"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#community"
              className="block text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </a>
            <div className="pt-4 space-y-2">
              <a
                href="/login"
                className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="block text-center bg-brand-gradient hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20" id="hero">
        <div className="mx-auto max-w-6xl grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
          <div className="text-center md:text-left">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center">
              🎉 Now Live - Join the Fashion Revolution
            </Badge>

            <h1 className="hero-title">
              Your Virtual Wardrobe.{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
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
                <Button
                  size="lg"
                  className="bg-brand-gradient text-white hover:opacity-90"
                >
                  Join Now – It's Free
                </Button>
              </a>
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
                >
                  For Brands: Get Started
                </Button>
              </a>
            </div>
          </div>

          <div className="relative flex justify-center md:justify-end">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-8 -left-8 w-44 h-44 rounded-full bg-primary/30 blur-3xl animate-blob" />
            <div className="pointer-events-none absolute -bottom-6 -right-10 w-56 h-56 rounded-full bg-secondary/30 blur-3xl animate-blob" />

            {/* Illustration placeholder - replace with real image later */}
            <div className="hero-illustration w-80 h-80 bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
              <img
                src="/abc.jpg"
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
            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  👥
                </div>
                <CardTitle className="text-primary">For Individuals</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Build your own virtual closet, mix and match outfits, share
                  your looks, and even rent or sell pieces you no longer use.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  🏢
                </div>
                <CardTitle className="text-secondary">For Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Gain priority visibility in our feed, run targeted ad
                  campaigns, and connect directly with Gen Z fashion-forward
                  users.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  🤖
                </div>
                <CardTitle className="text-primary">For Everyone</CardTitle>
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
      <section className="px-6 py-16 bg-gray-50" id="key-features">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Key Features
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
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
              <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
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
              <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
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
              <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
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
      <section className="px-6 py-16 bg-white" id="how-it-works">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            How It Works
          </h2>

          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Get Started",
                desc: "Sign up as an individual or brand.",
              },
              {
                step: "02",
                title: "Upload",
                desc: "Upload your closet items or shop collections.",
              },
              {
                step: "03",
                title: "Share",
                desc: "Share posts, outfits, or campaigns.",
              },
              {
                step: "04",
                title: "Discover",
                desc: "Discover AI-powered recommendations.",
              },
              {
                step: "05",
                title: "Buy / Rent / Sell",
                desc: "Buy, rent, or sell with confidence.",
              },
            ].map((s) => {
              const isFirst = s.step === "01";
              return (
                <div
                  key={s.step}
                  className={`flex items-center gap-4 rounded-lg overflow-hidden border ${
                    isFirst ? "border-primary" : "border-gray-200"
                  } bg-white`}
                >
                  <div className="w-28 shrink-0 h-full">
                    <div
                      className={`h-full w-full font-semibold text-lg tracking-wider flex items-center justify-center py-5 ${
                        isFirst
                          ? "bg-primary text-white"
                          : "bg-white text-primary border-r border-gray-200"
                      }`}
                    >
                      {s.step}
                    </div>
                  </div>
                  <div className="flex-1 px-5 py-4">
                    <div className="font-semibold text-gray-900 mb-1">
                      {s.title}
                    </div>
                    <div className="text-gray-600 text-sm">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="px-6 py-16 bg-brand-gradient">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center gap-3">
                  <span>👤</span> For Individuals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  <span>Showcase your unique fashion sense</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  <span>Trade or rent your items with others</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  <span>Use AI to generate personalized outfit ideas</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">✓</span>
                  <span>
                    Grow your audience and become a fashion influencer
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary flex items-center gap-3">
                  <span>🏢</span> For Brands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-secondary">✓</span>
                  <span>Open your digital shop instantly</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary">✓</span>
                  <span>
                    Run sponsored campaigns with geo-targeting and interest
                    filters
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary">✓</span>
                  <span>Reach the right audience with boosted visibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary">✓</span>
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

          {plansData && plansData.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {plansData.slice(0, 2).map((p, idx) => (
                <Card
                  key={p.id}
                  className={`${
                    idx === 0 ? "border-primary/20" : "border-secondary/20"
                  } hover:shadow-lg transition-shadow`}
                >
                  <CardHeader className="text-center">
                    <CardTitle
                      className={`text-2xl ${
                        idx === 0 ? "text-primary" : "text-secondary"
                      }`}
                    >
                      {p.name}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {p.description || "Subscription plan"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <div className="text-3xl font-extrabold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(p.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {p.duration_days} ngày
                    </div>
                    <a href="/subscriptions">
                      <Button className="w-full">Mua ngay</Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-primary">
                    Personal Plans
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Enhanced features for fashion enthusiasts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>More closet slots</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Advanced AI styling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>Ad-free experience</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-secondary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-secondary">
                    Brand Plans
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Professional tools for fashion brands
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-secondary">✓</span>
                    <span>Priority placement in feeds</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-secondary">✓</span>
                    <span>Sponsored campaigns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-secondary">✓</span>
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-secondary">✓</span>
                    <span>Moderation priority</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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
      <section className="px-6 py-20 bg-[#0a0e27] text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Fashion is more fun when it's shared.
          </h2>
          <p className="mb-8 text-xl opacity-90">
            Join ClosetShare today and unlock the future of social fashion.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-brand-gradient text-white hover:opacity-90"
            >
              Sign Up Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-black border-white hover:bg-white/10"
            >
              Explore Brand Plans
            </Button>
          </div>

          <div className="mt-8">
            <div className="text-sm uppercase tracking-wide text-gray-300 mb-3">
              Download on
            </div>
            <div className="flex items-center justify-center gap-6 text-gray-200">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5" />
                <span>macOS / iOS</span>
              </div>
              <div className="flex items-center gap-2">
                <Grid2x2 className="w-5 h-5" />
                <span>Windows</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0e27] text-white">
        <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">ClosetShare</span>
            </div>
            <p className="text-sm text-gray-300">
              Fashion is more fun when it's shared.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-3">Product</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#key-features" className="hover:text-white">
                  Key Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Resources</div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Status
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Try It Today</div>
            <p className="text-sm text-gray-300 mb-4">
              Join the community and start styling smarter.
            </p>
            <a
              href="/register"
              className="inline-block px-4 py-2 rounded-md bg-white text-[#0a0e27] font-medium"
            >
              Sign up free
            </a>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-gray-400 flex items-center justify-between">
            <div>© 2025 ClosetShare</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white">
                Privacy
              </a>
              <a href="#" className="hover:text-white">
                Terms
              </a>
              <a href="#" className="hover:text-white">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
