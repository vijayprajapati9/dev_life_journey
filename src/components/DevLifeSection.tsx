import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import chapterImg from "@/assets/chapter5-finale.jpg";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Cups of Coffee", value: 3742, suffix: "+", icon: "☕" },
  { label: "Bugs Created", value: 9001, suffix: "", icon: "🐛" },
  { label: "Stack Overflow Visits", value: 12480, suffix: "+", icon: "📚" },
  { label: "Hours of Sleep Lost", value: 2190, suffix: "", icon: "😴" },
];

const truths = [
  "It's not a bug, it's a feature.",
  "The code works. Don't touch it.",
  "// TODO: fix this later (written 2 years ago)",
  "Works on localhost, ship it.",
  "Ctrl+Z is the real MVP.",
  "The documentation lied.",
];

const DevLifeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [currentTruth, setCurrentTruth] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTruth((prev) => (prev + 1) % truths.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ".stats-grid",
      start: "top 75%",
      once: true,
      onEnter: () => {
        stats.forEach((stat, i) => {
          gsap.to({}, {
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              const progress = this.progress();
              setAnimatedStats((prev) => {
                const next = [...prev];
                next[i] = Math.floor(stat.value * progress);
                return next;
              });
            },
          });
        });
      },
    });

    gsap.from(".stat-card", {
      y: 50, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".stats-grid", start: "top 80%" },
    });

    gsap.from(".finale-story", {
      y: 60, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".finale-story", start: "top 85%" },
    });

    gsap.from(".final-message", {
      y: 60, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".final-message", start: "top 85%" },
    });

    gsap.to(imageRef.current, {
      y: -150, scale: 1.1,
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center section-padding overflow-hidden">
      {/* Epic background image */}
      <div ref={imageRef} className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={chapterImg}
          alt="Developer standing triumphant on mountain of code"
          loading="lazy"
          width={1024}
          height={768}
          className="w-full h-full object-cover opacity-25"
          style={{
            maskImage: "linear-gradient(to top, black 20%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 80%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="mb-4 font-mono text-sm text-muted-foreground">
          <span className="text-primary">05</span> // the finale — full circle
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
          The <span className="gradient-text">Dev Life</span>
        </h2>

        {/* Story narrative */}
        <div className="finale-story max-w-2xl mb-12">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            You've written your first line. You've battled bugs at 2 AM. You've survived impossible deadlines
            fueled by nothing but caffeine and stubbornness. You've questioned everything —
            your code, your career, your sanity.
          </p>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
            But here you are. Still coding. Still creating. Because beneath the frustration and the memes,
            there's something <span className="text-primary">magical</span> about turning thoughts into reality
            with nothing but a keyboard. Every developer knows this truth:
            <span className="text-accent italic"> we wouldn't trade it for anything.</span>
          </p>
          <p className="text-muted-foreground/70 text-sm font-mono italic">
            // okay maybe for more sleep. definitely for more sleep.
          </p>
        </div>

        <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-card h-full flex flex-col justify-between glass-card rounded-lg p-6 text-center transition-all duration-300 hover:neon-border hover:scale-[1.03]"
            >
              <div>
                <span className="text-3xl mb-3 block">{stat.icon}</span>
                <p className="font-mono text-2xl md:text-3xl font-bold text-primary leading-none">
                  {animatedStats[i].toLocaleString()}{stat.suffix}
                </p>
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-4 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-16">
          <div className="terminal-window max-w-xl mx-auto p-8">
            <p className="font-mono text-xs text-muted-foreground mb-2">universal_truths[{currentTruth}]</p>
            <p
              key={currentTruth}
              className="font-mono text-lg md:text-xl text-primary neon-text"
              style={{ animation: "fade-in 0.5s ease-out" }}
            >
              "{truths[currentTruth]}"
            </p>
          </div>
        </div>

        <div className="final-message text-center max-w-2xl mx-auto">
          <h3 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Keep <span className="neon-text">Coding</span>,<br />
            Keep <span className="text-accent">Creating</span>.
          </h3>
          <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
            Every line of code is a small act of creation.
            Every bug fixed is a lesson learned. Every cup of coffee is... well, necessary.
            This is your story. And it's far from over.
          </p>

          <div className="terminal-window max-w-sm mx-auto p-6">
            <p className="font-mono text-sm text-muted-foreground">
              <span className="text-secondary">while</span>(<span className="text-primary">alive</span>) {"{"}
            </p>
            <p className="font-mono text-sm text-foreground ml-4">eat();</p>
            <p className="font-mono text-sm text-foreground ml-4">
              sleep(); <span className="text-muted-foreground">// optional</span>
            </p>
            <p className="font-mono text-sm text-primary ml-4 neon-text">code();</p>
            <p className="font-mono text-sm text-foreground ml-4">repeat();</p>
            <p className="font-mono text-sm text-muted-foreground">{"}"}</p>
          </div>

          <p className="font-mono text-sm text-muted-foreground mt-12">
            // end of story. now go build something amazing. ❤️
          </p>
          <p className="font-mono text-xs text-muted-foreground/50 mt-4">
            © {new Date().getFullYear()} — Built with ☕ and questionable CSS
          </p>
        </div>
      </div>
    </section>
  );
};

export default DevLifeSection;
