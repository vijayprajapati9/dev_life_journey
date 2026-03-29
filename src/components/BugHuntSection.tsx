import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import chapterImg from "@/assets/chapter2-bug-hunt.jpg";

gsap.registerPlugin(ScrollTrigger);

const bugs = [
  { id: 1, name: "TypeError: Cannot read properties of undefined (reading 'length')", severity: "critical", emoji: "🔥", solution: "You mapped over null again, didn't you?" },
  { id: 2, name: "Uncaught ReferenceError: x is not defined (but it's RIGHT THERE)", severity: "high", emoji: "😡", solution: "Did you actually save the file?" },
  { id: 3, name: "Fatal: Maximum call stack size exceeded", severity: "legendary", emoji: "💥", solution: "Base case? What base case?" },
  { id: 4, name: "CORS: Request blocked by CORS policy", severity: "critical", emoji: "🚫", solution: "Just proxy it. Or cry." },
  { id: 5, name: "Error: connect ECONNREFUSED 127.0.0.1:5432", severity: "high", emoji: "🐘", solution: "Did you actually start the database?" },
  { id: 6, name: "It works on my machine™", severity: "legendary", emoji: "🤷", solution: "Ship your laptop to production" },
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
  const [isGlitching, setIsGlitching] = useState(false);
  const [errorSpawns, setErrorSpawns] = useState<{id: number, x: string, y: string, text: string}[]>([]);
  const { playSound } = useSoundEffect();

  const squashBug = (id: number) => {
    playSound('success');
    setSquashedBugs((prev) => new Set([...prev, id]));
    setShowSolution(id);
    setTimeout(() => setShowSolution(null), 2000);
  };

  const triggerChaos = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    playSound('error');

    let chaosCount = 0;
    const chaosAudioInterval = setInterval(() => {
      playSound('glitch');
      chaosCount++;
      if (chaosCount > 20) clearInterval(chaosAudioInterval);
    }, 100);
    
    // Spawn chaotic error popups
    const chaosErrors = ["ERROR 404", "FATAL EXCEPTION", "UNDEFINED IS NOT RECOGNIZED", "MEMORY LEAK DETECTED", "SEGMENTATION FAULT", "STACK OVERFLOW", "NETWORK DISCONNECTED"];
    const spawns = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 80 + 5}%`,
      y: `${Math.random() * 80 + 10}%`,
      text: chaosErrors[Math.floor(Math.random() * chaosErrors.length)]
    }));
    setErrorSpawns(spawns);

    gsap.to(sectionRef.current, {
      x: () => gsap.utils.random(-35, 35),
      y: () => gsap.utils.random(-35, 35),
      duration: 0.1,
      yoyo: true,
      repeat: 30,
      onComplete: () => {
        gsap.to(sectionRef.current, { x: 0, y: 0, duration: 0.1 });
        setIsGlitching(false);
        setErrorSpawns([]);
      }
    });

    // Add extra bugs randomly for effect
    const randomBug = Math.floor(Math.random() * bugs.length) + 1;
    if (squashedBugs.has(randomBug)) {
      setSquashedBugs(prev => {
        const next = new Set(prev);
        next.delete(randomBug);
        return next;
      });
    }
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
    <section ref={sectionRef} className={`relative min-h-screen flex flex-col justify-center section-padding overflow-hidden ${isGlitching ? 'glitch-active' : ''}`}>
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

      {/* Chaotic Red Overlay */}
      {isGlitching && (
        <div className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay bg-red-600/40 animate-pulse" />
      )}

      {/* Extreme Chaos Error Texts */}
      {errorSpawns.map(err => (
        <div 
          key={err.id} 
          className="absolute z-[100] font-mono text-xl md:text-4xl font-black text-red-500 opacity-90 drop-shadow-[0_0_15px_rgba(239,68,68,1)] whitespace-nowrap pointer-events-none"
          style={{ left: err.x, top: err.y, animation: 'glitch 0.1s infinite' }}
        >
          {err.text}
        </div>
      ))}

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

        <div className="flex justify-center mb-10 relative z-20">
          <button 
            onClick={triggerChaos}
            className="px-8 py-4 bg-red-600/10 border-2 border-red-500 text-red-500 font-mono text-xl md:text-2xl uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.9)] active:scale-95 text-glow-hover font-bold"
          >
            ! [ / Fix Bug ] !
          </button>
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
