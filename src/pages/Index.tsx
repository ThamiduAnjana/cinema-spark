import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { NowShowingSection } from "@/components/NowShowingSection";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSlider />
        <NowShowingSection />
        <ComingSoonSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
