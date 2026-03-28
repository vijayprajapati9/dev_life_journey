import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import chapterImg from "@/assets/chapter2-bug-hunt.jpg";

gsap.registerPlugin(ScrollTrigger);

const bugs = [
  { id: 1, name: "TypeError: undefined is not a function", severity: "critical", emoji: "🔥", solution: "You forgot to import the function..." },
  { id: 2, name: "CSS: Why is this div 10000px tall?", severity: "high", emoji: "📏", solution: "height: 100% on everything. Classic." },
  { id: 3, name: "It works on my machine™", severity: "legendary", emoji: "🤷", solution: "Ship your laptop to production" },
  { id: 4, name: "Off by one error in loop", severity: "medium", emoji: "🔁", solution: "Use <= instead of <... or was it the other way?" },
  { id: 5, name: "CORS: Access denied", severity: "critical", emoji: "🚫", solution: "Add a proxy. Or just cry." },
  { id: 6, name: "Forgot to save the file", severity: "embarrassing", emoji: "💾", solution: "Ctrl+S is your best friend" },
];

const severityColors: Record<string, string> = {
  critical: "text-bug-red",
  high: "text-deadline-orange",
  legendary: "text-secondary",
  medium: "text-accent",
  embarrassing: "text-muted-foreground",
};

const BugHuntSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [squashedBugs, setSquashedBugs] = useState<Set<number>>(new Set());
  const [showSolution, setShowSolution] = useState<number | null>(null);
  const { playSound } = useSoundEffect();

  const squashBug = (id: number) => {
    playSound('success');
    setSquashedBugs((prev) => new Set([...prev, id]));
    setShowSolution(id);
    setTimeout(() => setShowSolution(null), 2000);
  };

  useGSAP(() => {
    gsap.fromTo(".bug-card", 
      { x: (i) => (i % 2 === 0 ? -80 : 80), opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: ".bugs-container", start: "top 75%" } }
    );

    gsap.fromTo(".bug-story", 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".bug-story", start: "top 85%" } }
    );

    gsap.to(imageRef.current, {
      y: -100, scale: 1.05,
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 2 },
    });
  }, { scope: sectionRef });

  const progress = (squashedBugs.size / bugs.length) * 100;

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center section-padding overflow-hidden">
      {/* Full background */}
      <div ref={imageRef} className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={chapterImg}
          alt="Developer hunting bugs with magnifying glass"
          loading="lazy"
          width={1024}
          height={768}
          className="w-full h-full object-cover opacity-20"
          style={{
            maskImage: "radial-gradient(ellipse 80% 80% at 70% 50%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 70% 50%, black 20%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="mb-4 font-mono text-sm text-muted-foreground">
          <span className="text-primary">02</span> // chapter two — the first battle
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
          The <span className="text-bug-red">Bug</span> Hunt
        </h2>

        {/* Story narrative */}
        <div className="bug-story max-w-2xl mb-12">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            The honeymoon phase doesn't last. One day your code works perfectly.
            The next morning — <span className="text-bug-red font-mono">TypeError: undefined is not a function</span>.
            You didn't change anything. The code changed itself. You're sure of it.
          </p>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
            Welcome to the Bug Hunt — where you'll spend <span className="text-primary">80% of your time</span> fixing things
            you didn't know were broken, and <span className="text-accent">20% creating new bugs</span> in the process.
            It's not a phase. It's a lifestyle.
          </p>
          <p className="text-muted-foreground/70 text-sm font-mono italic">
            // 99 little bugs in the code. Take one down, patch it around... 127 little bugs in the code.
          </p>
        </div>

        <div className="max-w-md mb-8">
          <div className="flex justify-between text-sm font-mono mb-2">
            <span className="text-muted-foreground">bugs.squashed</span>
            <span className="text-primary">{squashedBugs.size}/{bugs.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bugs-container grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bugs.map((bug) => (
            <div
              key={bug.id}
              className={`bug-card h-full flex flex-col glass-card rounded-lg p-5 cursor-pointer transition-all duration-500 ${
                squashedBugs.has(bug.id) ? "opacity-50 scale-95" : "hover:scale-[1.03] hover:neon-border"
              }`}
              onClick={() => !squashedBugs.has(bug.id) && squashBug(bug.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{squashedBugs.has(bug.id) ? "✅" : bug.emoji}</span>
                <span className={`text-xs font-mono uppercase ${severityColors[bug.severity]}`}>{bug.severity}</span>
              </div>
              <h3 className={`font-mono text-sm mb-4 ${squashedBugs.has(bug.id) ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {bug.name}
              </h3>
              
              <div className="mt-auto pt-2">
                {showSolution === bug.id && (
                  <p className="text-xs text-primary font-mono animate-fade-in">→ {bug.solution}</p>
                )}
                {!squashedBugs.has(bug.id) && (
                  <p className="text-xs text-muted-foreground">Click to squash 🐛</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {squashedBugs.size === bugs.length && (
          <div className="mt-12 text-center font-mono">
            <p className="text-primary text-lg neon-text">🎉 All bugs squashed! ...for now.</p>
            <p className="text-muted-foreground text-sm mt-2">
              git commit -m "fixed all bugs" <span className="text-muted-foreground/50">// narrator: they weren't all fixed</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BugHuntSection;
