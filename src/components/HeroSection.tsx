import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import heroEpic from "@/assets/hero-epic.jpg";

gsap.registerPlugin(ScrollTrigger);

const MatrixRain = () => {
  const chars = "01{}[]<>/;:=+-%$#@!&*()_アイウエオカキクケコ";
  const columns = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${(i / 40) * 100}%`,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 6,
    char: chars[Math.floor(Math.random() * chars.length)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
      {columns.map((col) => (
        <span
          key={col.id}
          className="absolute font-mono text-primary text-xs"
          style={{
            left: col.left,
            animation: `matrix-rain ${col.duration}s linear ${col.delay}s infinite`,
          }}
        >
          {col.char}
        </span>
      ))}
    </div>
  );
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSoundEffect();

  const [typedText, setTypedText] = useState("");
  const fullText = "Developer";

  useEffect(() => {
    // Start typing after the Title reveals (delay 0.5s + duration ~0.5s)
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i + 1));
        playSound('typing');
        i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 150);
      return () => clearInterval(interval);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [playSound]);

  useGSAP(() => {
    gsap.fromTo(sectionRef.current, { backgroundColor: "#000" }, { backgroundColor: "transparent", duration: 2, ease: "power2.inOut" });

    gsap.from(titleRef.current, { y: 100, opacity: 0, duration: 1.2, delay: 0.5, ease: "power4.out" });
    gsap.from(subtitleRef.current, { y: 60, opacity: 0, duration: 1, delay: 1.5, ease: "power3.out" });
    gsap.from(storyRef.current, { y: 40, opacity: 0, duration: 1, delay: 2.5, ease: "power3.out" });
    gsap.from(terminalRef.current, { y: 80, opacity: 0, scale: 0.9, duration: 1, delay: 3.5, ease: "power3.out" });
    gsap.from(imageRef.current, { scale: 1.2, opacity: 0, duration: 3, ease: "power2.out" });

    // Unified parallax scroll for all text so they don't crash into each other
    gsap.to(contentRef.current, {
      y: -150, opacity: 0,
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
    });

    gsap.to(imageRef.current, {
      y: -100, scale: 1.1,
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 2 },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      <MatrixRain />

      {/* Full-screen background image */}
      <div ref={imageRef} className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <img
          src={heroEpic}
          alt="Developer workspace at night with city skyline"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay fixed gradient to ensure text remains 100% visible against any image background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      <div ref={contentRef} className="relative z-10 text-center max-w-5xl mx-auto px-6 py-16">
        <p className="font-mono text-primary text-sm md:text-base mb-6 tracking-widest uppercase bg-background/40 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-primary/20">
          // an interactive journey through code
        </p>
        <h1
          ref={titleRef}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-6 leading-[1.1] md:leading-[0.9]"
        >
          The Life of a{" "}
          <span className="neon-text block sm:inline drop-shadow-md text-glow-hover typing-cursor">{typedText}</span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-sm font-medium"
        >
          From the magic of your first <span className="font-mono text-primary bg-background/40 px-2 rounded">&lt;h1&gt;</span> to the existential crisis
          at 3 AM — this is the story every coder knows by heart.
        </p>

        {/* Story intro */}
        <div ref={storyRef} className="max-w-xl mx-auto mb-10">
          <p className="text-foreground text-sm md:text-base italic leading-relaxed bg-background/50 p-4 rounded-xl border border-white/5 backdrop-blur-md shadow-lg">
            "It all started with curiosity. A blank screen. A blinking cursor.
            And the wild, naive thought: <span className="text-primary font-mono not-italic">'How hard can it be?'</span>"
          </p>
        </div>

        <div ref={terminalRef} className="terminal-window max-w-lg mx-auto text-left backdrop-blur-lg bg-background/80 shadow-[0_0_40px_rgba(0,0,0,0.8)] border-white/10">
          <div className="terminal-header">
            <div className="terminal-dot bg-destructive" />
            <div className="terminal-dot bg-accent" />
            <div className="terminal-dot bg-primary" />
            <span className="text-muted-foreground text-xs font-mono ml-2">origin_story.js</span>
          </div>
          <div className="p-4 md:p-6 font-mono text-sm leading-loose">
            <p><span className="text-secondary">const</span> <span className="text-foreground font-semibold">journey</span> <span className="text-muted-foreground">=</span> <span className="text-primary">{"{"}</span></p>
            <div className="ml-4 border-l border-white/10 pl-3">
              <p><span className="text-accent">start</span><span className="text-muted-foreground">:</span> <span className="text-primary">"Hello World"</span>,</p>
              <p><span className="text-accent">fuel</span><span className="text-muted-foreground">:</span> <span className="text-coffee">coffee</span> <span className="text-muted-foreground">×</span> <span className="text-primary">∞</span>,</p>
              <p><span className="text-accent">bugs</span><span className="text-muted-foreground">:</span> <span className="text-bug-red">bugs + 1</span>,</p>
              <p><span className="text-accent">motto</span><span className="text-muted-foreground">:</span> <span className="text-primary">"Ship it."</span>,</p>
            </div>
            <p><span className="text-primary">{"}"}</span>;</p>
          </div>
        </div>

        <div className="mt-12 md:mt-16 relative z-20">
          <div className="animate-bounce inline-flex flex-col items-center gap-2">
            <span className="font-mono text-primary text-sm font-semibold bg-background/40 px-2 rounded backdrop-blur-sm">↓ scroll.begin()</span>
            <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent drop-shadow-[0_0_5px_hsl(var(--primary))]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
