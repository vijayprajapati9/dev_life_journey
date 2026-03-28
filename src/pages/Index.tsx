import { useState, useCallback, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/HeroSection";
import HelloWorldSection from "@/components/HelloWorldSection";
import BugHuntSection from "@/components/BugHuntSection";
import ImposterSyndromeSection from "@/components/ImposterSyndromeSection";
import DeadlineSection from "@/components/DeadlineSection";
import CoffeeSection from "@/components/CoffeeSection";
import DeploymentSection from "@/components/DeploymentSection";
import DevLifeSection from "@/components/DevLifeSection";
import ScrollNav from "@/components/ScrollNav";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      {/* Global Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_hsl(var(--primary)/0.5)]" 
          style={{ width: `${scrollProgress}%` }} 
        />
      </div>

      <div
        className={`transition-opacity duration-700 ${loading ? "opacity-0" : "opacity-100"}`}
      >
        <ScrollNav />
        <div id="hero">
          <HeroSection />
        </div>
        <div id="hello">
          <HelloWorldSection />
        </div>
        <div id="bugs">
          <BugHuntSection />
        </div>
        <div id="imposter">
          <ImposterSyndromeSection />
        </div>
        <div id="deadline">
          <DeadlineSection />
        </div>
        <div id="coffee">
          <CoffeeSection />
        </div>
        <div id="deployment">
          <DeploymentSection />
        </div>
        <div id="devlife">
          <DevLifeSection />
        </div>
      </div>
    </>
  );
};

export default Index;
