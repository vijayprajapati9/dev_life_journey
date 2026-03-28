import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import chapterImg from "@/assets/chapter3-deadline.jpg";

gsap.registerPlugin(ScrollTrigger);

const DeadlineSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 0, seconds: 0 });
  const [panic, setPanic] = useState(false);
  const [commits, setCommits] = useState([
    "fix: final fix",
    "fix: actual final fix",
    "fix: final fix v2 (for real this time)",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        if (hours === 0 && minutes < 30) setPanic(true);
        return { hours, minutes, seconds };
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    gsap.from(clockRef.current, {
      scale: 0.5, opacity: 0, duration: 1, ease: "elastic.out(1, 0.5)",
      scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
    });
    gsap.from(".deadline-story", {
      y: 80, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".deadline-story", start: "top 85%" },
    });
    gsap.from(".commit-log", {
      x: -60, opacity: 0, stagger: 0.2, duration: 0.5,
      scrollTrigger: { trigger: ".commits-area", start: "top 80%" },
    });
    gsap.to(imageRef.current, {
      y: -120, scale: 1.08,
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
    });
  }, { scope: sectionRef });

  const addPanicCommit = () => {
    const panicCommits = [
      "fix: please work", "fix: I'm begging you",
      "chore: update README (pretend to be productive)", "fix: undo undo undo",
      "feat: mass refactor at 11pm", "fix: WHY",
      "fix: stackoverflow said this would work", "fix: works on my machine",
    ];
    const newCommit = panicCommits[Math.floor(Math.random() * panicCommits.length)];
    setCommits((prev) => [newCommit, ...prev].slice(0, 8));
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center section-padding overflow-hidden">
      {panic && (
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <div className="absolute inset-0" style={{
            background: `radial-gradient(circle at center, hsl(var(--bug-red) / 0.08) 0%, transparent 70%)`,
            animation: "pulse 1s ease-in-out infinite",
          }} />
        </div>
      )}

      {/* Full background */}
      <div ref={imageRef} className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={chapterImg}
          alt="Stressed developer with melting clocks"
          loading="lazy"
          width={1024}
          height={768}
          className="w-full h-full object-cover opacity-20"
          style={{
            maskImage: "linear-gradient(to left, black 0%, transparent 60%), linear-gradient(to top, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 60%), linear-gradient(to top, transparent 0%, black 40%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="mb-4 font-mono text-sm text-muted-foreground">
          <span className="text-primary">03</span> // chapter three — the reckoning
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
          Deadline <span className="text-deadline-orange">Doom</span>
        </h2>

        {/* Story narrative */}
        <div className="deadline-story max-w-2xl mb-12">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            "How long will this take?" your manager asks. You do the mental math:
            3 days of actual work, plus 2 days for unexpected bugs, plus 1 day for that library update
            that'll break everything. <span className="text-primary font-mono">"About two weeks,"</span> you say.
          </p>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
            Three months later, you're still at it. The clock is ticking. The Jira board is a graveyard
            of abandoned sprints. Your git history reads like a
            <span className="text-deadline-orange"> descent into madness</span>.
            The standup meeting is in 6 hours. You haven't stood up in 12.
          </p>
          <p className="text-muted-foreground/70 text-sm font-mono italic">
            // fun fact: "two weeks" in developer time equals approximately 3 months in human time
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            ref={clockRef}
            className={`terminal-window p-8 text-center transition-all duration-300 ${panic ? "border-bug-red/50" : ""}`}
          >
            <p className="font-mono text-sm text-muted-foreground mb-4">TIME_UNTIL_DEPLOY</p>
            <div
              className={`font-mono text-5xl md:text-6xl font-bold tracking-wider ${panic ? "text-bug-red" : "text-foreground"}`}
              style={panic ? { animation: "glitch 0.3s infinite" } : undefined}
            >
              {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-4">
              {panic ? "🔥 PANIC MODE ACTIVATED 🔥" : "⏰ tick tock..."}
            </p>
            <button
              onClick={addPanicCommit}
              className="mt-6 px-6 py-2 rounded-md bg-muted text-foreground font-mono text-sm
                         transition-all duration-200 hover:bg-primary hover:text-primary-foreground
                         hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] active:scale-95"
            >
              git commit -m "panic fix"
            </button>
          </div>

          <div className="commits-area">
            <h3 className="font-mono text-sm text-muted-foreground mb-4">$ git log --oneline</h3>
            <div className="space-y-2">
              {commits.map((commit, i) => (
                <div
                  key={`${commit}-${i}`}
                  className="commit-log flex items-center gap-3 glass-card rounded-md p-3 transition-all duration-300 hover:neon-border"
                >
                  <span className="font-mono text-xs text-primary">{Math.random().toString(16).slice(2, 9)}</span>
                  <span className="font-mono text-sm text-foreground">{commit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeadlineSection;
