import React from "react";
import HeroSection from "@/app/components/HeroSection";
import BenefitsSection from "@/app/components/BenefitsSection";
import CallToAction from "@/app/components/CallToAction";
import HowItWorksSection from "@/app/components/HowItWorksSection";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <CallToAction />
    </main>
  );
}
