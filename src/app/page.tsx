import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Categories } from "@/components/sections/Categories";
import { FeaturedDesigns } from "@/components/sections/FeaturedDesigns";
import { WhyUs } from "@/components/sections/WhyUs";
import { Stats } from "@/components/sections/Stats";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedDesigns />
      <Categories />
      <WhyUs />
      <Stats />
      <CTA />
    </>
  );
}
