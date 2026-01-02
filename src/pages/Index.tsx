import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { QuickBookBar } from "@/components/QuickBookBar";
import { NowShowingSection } from "@/components/NowShowingSection";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { TrailersSection } from "@/components/TrailersSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("now-showing");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSlider />
        <QuickBookBar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === "now-showing" && <NowShowingSection />}
        {activeTab === "coming-soon" && <ComingSoonSection />}
        {activeTab === "trailers" && <TrailersSection />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
