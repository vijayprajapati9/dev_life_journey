import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import chapterImg from "@/assets/chapter4-coffee.jpg";

gsap.registerPlugin(ScrollTrigger);

const CoffeeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cupRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [coffeeLevel, setCoffeeLevel] = useState(0);
  const [totalCups, setTotalCups] = useState(0);
  const { playSound } = useSoundEffect();

  const fillCoffee = () => {
    if (coffeeLevel >= 100) return;
    playSound('success');
    let fillAmount = 25;
    
    setCoffeeLevel((prev) => {
      const newLevel = Math.min(prev + fillAmount, 100);
      if (newLevel === 100) setTotalCups(c => c + 1);
      return newLevel;
    });

    if (cupRef.current) {
      gsap.fromTo(cupRef.current, { x: -3, y: 3 }, {
        x: 3, y: -3, duration: 0.05, repeat: 5, yoyo: true, ease: "power1.inOut",
        onComplete: () => { gsap.to(cupRef.current, { x: 0, y: 0, duration: 0.1 }); },
      });
    }
  };

  const drinkCoffee = () => {
    if (coffeeLevel <= 0) return;
    playSound('click');
    setCoffeeLevel((prev) => Math.max(prev - 25, 0));
    
    if (cupRef.current) {
      gsap.fromTo(cupRef.current, { rotation: -3 }, {
        rotation: 3, duration: 0.1, repeat: 3, yoyo: true, ease: "power1.inOut",
        onComplete: () => { gsap.to(cupRef.current, { rotation: 0, duration: 0.1 }); },
      });
    }
  };

  useGSAP(() => {
    gsap.from(".coffee-title", {
      y: 80, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
    });
    gsap.from(".coffee-story", {
      y: 60, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".coffee-story", start: "top 85%" },
    });
    gsap.from(".coffee-actions", {
      y: 40, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power3.out",
      scrollTrigger: { trigger: ".coffee-actions", start: "top 80%" },
    });
    gsap.to(".steam", {
      y: -100, opacity: 0,
      scrollTrigger: { trigger: sectionRef.current, start: "top center", end: "bottom center", scrub: 2 },
    });
    gsap.to(imageRef.current, {
      y: -90, scale: 1.05,
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 2 },
    });
  }, { scope: sectionRef });

  const getStatusMessage = () => {
    if (coffeeLevel === 0) return "// developer.status = 'zombie'";
    if (coffeeLevel < 50) return "// developer.status = 'waking up'";
    if (coffeeLevel < 100) return "// developer.status = 'focused'";
    return "// developer.status = 'CAFFEINATED' ⚡";
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center section-padding overflow-hidden">
      {/* Full background */}
      <div ref={imageRef} className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={chapterImg}
          alt="Developer looking at coffee mug"
          loading="lazy"
          className="w-full h-full object-cover opacity-20"
          style={{
            maskImage: "radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="mb-4 font-mono text-sm text-muted-foreground">
          <span className="text-coffee">04</span> // chapter four — the refuel
        </div>
        <h2 className="coffee-title font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
          Refreshment <span className="text-coffee">Break</span>
        </h2>

        {/* Story narrative */}
        <div className="coffee-story max-w-2xl mb-12">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            Code isn't just written with hands. It's written with fuel. You step away from the glowing rectangles
            to find the real magic: the dark, hot liquid that somehow transforms
            exhaustion into an elegant algorithm.
          </p>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
            You hold the ceramic mug like a talisman. It's warm. The screen is waiting for you, but
            for this brief moment, nothing matters except the refill.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center">
            
            <div className="relative flex justify-center w-full max-w-xs mt-8">
              {/* Mug Handle */}
              <div className="absolute top-10 right-10 md:right-16 w-16 h-28 border-[12px] border-muted-foreground/30 rounded-r-full -z-10 translate-x-12" />
              
              {/* Custom CSS Mug Body */}
              <div ref={cupRef} className="relative w-48 h-56 border-8 border-t-0 border-muted-foreground/30 rounded-b-[2.5rem] bg-background/50 backdrop-blur-sm overflow-hidden shadow-[inset_0_-20px_40px_rgba(0,0,0,0.8)]">
                
                {/* Steam */}
                <div className="steam absolute -top-8 left-1/2 -translate-x-1/2 flex gap-3 text-2xl opacity-60">
                  {coffeeLevel >= 25 && <span className="floating text-white" style={{ animationDelay: "0s" }}>~</span>}
                  {coffeeLevel >= 50 && <span className="floating text-white" style={{ animationDelay: "1s" }}>~</span>}
                  {coffeeLevel >= 100 && <span className="floating text-white" style={{ animationDelay: "2s" }}>~</span>}
                </div>
                
                {/* Coffee Liquid Fill */}
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  style={{ 
                    height: `${coffeeLevel}%`, 
                    background: `linear-gradient(180deg, hsl(25 80% 25%) 0%, hsl(25 90% 10%) 100%)`,
                    borderTop: coffeeLevel > 0 ? "4px solid hsl(25 60% 35%)" : "none",
                    boxShadow: "0 -5px 15px rgba(0,0,0,0.5)"
                  }}
                >
                  {/* Floating Bubbles inside coffee */}
                  {coffeeLevel > 0 && (
                    <div className="absolute top-2 w-full flex justify-around opacity-30">
                      <div className="w-1 h-1 rounded-full bg-orange-200 animate-ping"></div>
                      <div className="w-2 h-2 rounded-full bg-orange-200 animate-pulse delay-75"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-200 animate-ping delay-150"></div>
                    </div>
                  )}
                </div>
                
                {/* Percentage Text overlaid (optional, but requested by user usually) */}
               <div className="absolute inset-0 flex items-center justify-center mix-blend-difference pointer-events-none">
                  <span className="font-mono text-3xl font-bold text-white z-10 drop-shadow-[0_0_10px_black]">{coffeeLevel}%</span>
                </div>
              </div>
            </div>

            <p className="font-mono text-sm text-coffee font-semibold mt-10">{getStatusMessage()}</p>
            <p className="font-mono text-xs text-muted-foreground mt-2">Mugs finished today: {totalCups}</p>
          </div>

          <div className="coffee-actions space-y-6 max-w-sm w-full mx-auto">
            <button
              onClick={fillCoffee}
              disabled={coffeeLevel >= 100}
              className={`w-full py-6 rounded-2xl font-display font-bold text-2xl md:text-3xl tracking-wide transition-all duration-300 shadow-xl ${
                coffeeLevel >= 100 
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-coffee text-white hover:bg-orange-600 hover:scale-105 active:scale-95 shadow-[0_0_30px_hsl(var(--coffee)/0.4)] hover:shadow-[0_0_40px_hsl(var(--coffee)/0.6)]"
              }`}
            >
              FILL COFFEE
            </button>
            <button
              onClick={drinkCoffee}
              disabled={coffeeLevel <= 0}
              className={`w-full py-4 rounded-xl font-mono text-sm transition-all duration-200 border-2 ${
                coffeeLevel <= 0
                  ? "border-muted text-muted-foreground cursor-not-allowed"
                  : "border-muted-foreground text-foreground hover:bg-muted active:scale-95"
              }`}
            >
              &gt; Drink_Coffee()
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoffeeSection;
