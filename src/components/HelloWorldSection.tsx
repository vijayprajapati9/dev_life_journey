import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import chapterImg from "@/assets/chapter1-first-code.jpg";

gsap.registerPlugin(ScrollTrigger);

const codeLines = [
  { text: '<!DOCTYPE html>', delay: 0 },
  { text: '<html>', delay: 0.1 },
  { text: '  <head>', delay: 0.2 },
  { text: '    <title>My First Page</title>', delay: 0.3 },
  { text: '  </head>', delay: 0.4 },
  { text: '  <body>', delay: 0.5 },
  { text: '    <h1>Hello World!</h1>', delay: 0.6, highlight: true },
  { text: '    <p>I am a developer now 🎉</p>', delay: 0.7, highlight: true },
  { text: '  </body>', delay: 0.8 },
  { text: '</html>', delay: 0.9 },
];

const milestones = [
  { emoji: "📝", title: "The Sacred First File", desc: "index.html — trembling hands, limitless dreams" },
  { emoji: "🎨", title: "CSS Discovery", desc: "Everything turned red. On purpose? Maybe." },
  { emoji: "💥", title: "JavaScript Awakening", desc: "alert('I am a hacker now') — true power" },
  { emoji: "🤯", title: "The React Rabbit Hole", desc: "Virtual DOM? State? Props? Help." },
];

const HelloWorldSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      onEnter: () => {
        const interval = setInterval(() => {
          setVisibleLines((prev) => {
            if (prev >= codeLines.length) { clearInterval(interval); return prev; }
            return prev + 1;
          });
        }, 200);
      },
      once: true,
    });

    gsap.fromTo(".milestone-card", 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".milestones-grid", start: "top 80%" } }
    );

    gsap.fromTo(storyRef.current, 
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: storyRef.current, start: "top 85%" } }
    );

    gsap.to(imageRef.current, {
      y: -80,
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center section-padding overflow-hidden">
      {/* Full background image */}
      <div ref={imageRef} className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={chapterImg}
          alt="Young developer writing first code"
          loading="lazy"
          width={1024}
          height={768}
          className="w-full h-full object-cover opacity-25"
          style={{
            maskImage: "linear-gradient(to right, black 0%, transparent 60%), linear-gradient(to top, transparent 0%, black 30%)",
            WebkitMaskImage: "linear-gradient(to right, black 0%, transparent 60%), linear-gradient(to top, transparent 0%, black 30%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="mb-4 font-mono text-sm text-muted-foreground">
          <span className="text-primary">01</span> // chapter one — the beginning
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
          <span className="neon-text">Hello</span>, World!
        </h2>

        {/* Story narrative */}
        <div ref={storyRef} className="max-w-2xl mb-12">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            Every developer remembers the moment. You open Notepad, type those sacred characters,
            save as <span className="font-mono text-primary">index.html</span>, and double-click.
            The browser opens. Two words stare back at you.
          </p>
          <p className="text-foreground text-lg md:text-xl font-display italic mb-4">
            "Hello, World!"
          </p>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            In that moment, you aren't just writing code — you're speaking to the machine for the first time.
            And it <span className="text-primary">listened</span>.
            That rush? That's the feeling that turns curious minds into developers. The feeling that says:
            <span className="text-accent italic"> "I can create anything."</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div ref={codeRef} className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot bg-destructive" />
              <div className="terminal-dot bg-accent" />
              <div className="terminal-dot bg-primary" />
              <span className="text-muted-foreground text-xs font-mono ml-2">index.html — the first spell</span>
            </div>
            <div className="p-4 md:p-6 font-mono text-xs md:text-sm min-h-[280px]">
              {codeLines.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  className={`flex gap-4 py-0.5 transition-all duration-300 ${line.highlight ? "bg-primary/5 -mx-2 px-2 rounded" : ""}`}
                >
                  <span className="text-muted-foreground select-none w-6 text-right">{i + 1}</span>
                  <span className={line.highlight ? "text-primary" : "text-foreground"}>{line.text}</span>
                </div>
              ))}
              {visibleLines < codeLines.length && (
                <div className="flex gap-4 py-0.5">
                  <span className="text-muted-foreground select-none w-6 text-right">{visibleLines + 1}</span>
                  <span className="typing-cursor" />
                </div>
              )}
            </div>
          </div>

          <div className="milestones-grid space-y-4">
            <p className="font-mono text-xs text-muted-foreground mb-2">// milestones.map()</p>
            {milestones.map((m, i) => (
              <div
                key={i}
                className="milestone-card glass-card rounded-lg p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                onMouseEnter={() => setHoveredMilestone(i)}
                onMouseLeave={() => setHoveredMilestone(null)}
                style={{
                  borderColor: hoveredMilestone === i ? "hsl(var(--primary) / 0.5)" : undefined,
                  boxShadow: hoveredMilestone === i ? "0 0 30px hsl(var(--primary) / 0.1)" : undefined,
                }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{m.emoji}</span>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{m.title}</h3>
                    <p className="text-muted-foreground text-sm font-mono">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelloWorldSection;
