import { useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useGsapScroll } from "@/hooks/useGsapScroll";
import chapterImg from "@/assets/chapter-imposter.png";

gsap.registerPlugin(ScrollTrigger);

const thoughts = [
  "Am I cut out for this?",
  "They'll realize I'm a fraud.",
  "Everyone else writes cleaner code.",
  "I don't belong here.",
  "Why did I think this was easy?",
  "I'll never understand this architecture.",
  "Just google it... again."
];

const ImposterSyndromeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useGsapScroll();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Memoize random positions so they don't recalculate on every hover state re-render
  const bubblePositions = useMemo(() => {
    return thoughts.map((_, index) => ({
      left: 10 + (index * 12) + (Math.random() * 10 - 5),
      top: 10 + (Math.random() * 60)
    }));
  }, []);

  useGSAP(() => {
    // Background parallax
    gsap.to(imageRef.current, {
      y: -100,
      scale: 1.05,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    // Floating bubbles animation
    gsap.to(".thought-bubble", {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      rotation: "random(-5, 5)",
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      duration: "random(2, 4)",
      stagger: 0.2,
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center section-padding overflow-hidden">
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={chapterImg}
          alt="Developer looking overwhelmed at a desk"
          loading="lazy"
          className="w-full h-full object-cover opacity-20"
          style={{
            maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
          }}
        />
      </div>

      <div ref={scrollRef} className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="mb-4 font-mono text-sm text-muted-foreground gsap-fade-up">
          <span className="text-secondary">03</span> // chapter three — the doubt
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4 gsap-fade-up">
          Imputer <span className="text-muted-foreground/50 line-through">Syndrome</span> <br/>
          <span className="text-secondary">Imposter</span> Syndrome
        </h2>

        <div className="max-w-2xl mb-12 gsap-fade-up">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            You've built things. You've fixed bugs. But sitting in the dimly lit room, staring at the PR comments,
            a creeping feeling washes over you.
          </p>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            The screen glows, and the inner voice gets loud. It's the rite of passage every developer goes through. 
            The realization that the more you know, the more you realize you <i>don't</i> know.
          </p>
        </div>

        <div className="relative h-64 md:h-80 w-full mt-10">
          {thoughts.map((thought, index) => {
            const { left, top } = bubblePositions[index];

            return (
              <div
                key={index}
                className={`thought-bubble absolute p-4 rounded-xl glass-card transition-all duration-500 cursor-pointer text-sm font-mono gsap-fade-up ${
                  hoveredIndex === index ? 'opacity-0 scale-150 blur-sm' : 'opacity-80'
                }`}
                style={{
                  left: `${Math.min(left, 80)}%`,
                  top: `${top}%`,
                  zIndex: hoveredIndex === index ? 0 : 10,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                "{thought}"
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12 text-sm text-muted-foreground font-mono gsap-fade-up">
          <p>Hover over the doubts to dispel them.</p>
          <p className="mt-2 text-primary">spoiler: you belong here.</p>
        </div>
      </div>
    </section>
  );
};

export default ImposterSyndromeSection;
