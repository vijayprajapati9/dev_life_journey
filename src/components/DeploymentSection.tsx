import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useGsapScroll } from "@/hooks/useGsapScroll";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import chapterImg from "@/assets/chapter-deployment.png";

gsap.registerPlugin(ScrollTrigger);

const terminalLogs = [
  "[SYSTEM] Initiating deployment sequence...",
  "[INFO] Compiling assets...",
  "[INFO] Building production bundle...",
  "[WARN] Found 142 unused dependencies. Ignoring.",
  "[INFO] Uploading to server instances: eu-west-1, us-east-1...",
  "[OK] Upload complete. Switching symlinks...",
  "[WARN] High server load detected.",
  "[ERROR] Unhandled exception in legacy handler.",
  "[INFO] Reloading daemon...",
  "[OK] Daemon active.",
  "[SYSTEM] DEPLOYMENT SUCCESSFUL."
];

const DeploymentSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useGsapScroll();

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [deployed, setDeployed] = useState(false);
  const { playSound } = useSoundEffect();

  useGSAP(() => {
    gsap.to(imageRef.current, {
      y: -100,
      scale: 1.1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });
  }, { scope: sectionRef });

  const handleDeployStart = () => {
    if (deployed) return;
    setIsDeploying(true);
    setLogs([]);
    setDeployProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDeployed(true);
        setIsDeploying(false);
        playSound('success');
      }
      setDeployProgress(progress);
    }, 300);

    terminalLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (log.includes("[ERROR]") || log.includes("[WARN]")) {
           playSound('error');
        } else {
           playSound('click');
        }
      }, 500 + index * 400);
    });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center section-padding overflow-hidden">
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={chapterImg}
          alt="Dramatic server room deployment button"
          loading="lazy"
          className="w-full h-full object-cover opacity-30"
          style={{
            maskImage: "linear-gradient(to top, black 20%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 90%)",
          }}
        />
      </div>

      <div ref={scrollRef} className="max-w-6xl mx-auto relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
        
        <div className="gsap-fade-left">
          <div className="mb-4 font-mono text-sm text-muted-foreground">
            <span className="text-bug-red">04</span> // chapter four — the leap of faith
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4 text-bug-red drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            Friday <br/> Deployment
          </h2>

          <div className="max-w-2xl mb-8">
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
              It’s 4:55 PM on a Friday. Your colleagues are packing up. You tested the changes locally. They worked. 
              The staging environment is happy. 
            </p>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed border-l-2 border-bug-red pl-4">
              "Never deploy on a Friday," the elders say. You smile. You are bold. You are reckless.
            </p>
          </div>

          <button 
            onClick={handleDeployStart}
            disabled={isDeploying || deployed}
            className={`
              relative overflow-hidden w-full md:w-auto px-8 py-4 font-display font-bold text-lg md:text-xl uppercase tracking-widest rounded-xl transition-all duration-300
              ${deployed ? 'bg-primary text-black cursor-not-allowed shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 
                isDeploying ? 'bg-deadline-orange text-white cursor-wait animate-pulse' : 
                'bg-bug-red text-white hover:bg-red-500 hover:scale-[1.05] shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95'
              }
            `}
          >
            {deployed ? 'DEPLOYMENT SUCCESSFUL' : isDeploying ? 'DEPLOYING...' : 'DEPLOY TO PRODUCTION'}
            
            {isDeploying && (
              <div 
                className="absolute inset-0 bg-white/20 transition-all duration-300 pointer-events-none" 
                style={{ width: `${deployProgress}%` }}
              />
            )}
          </button>
        </div>

        {/* Terminal Window */}
        <div className="terminal-window h-[400px] flex flex-col gsap-fade-right">
          <div className="terminal-header shrink-0">
            <div className="terminal-dot bg-destructive" />
            <div className="terminal-dot bg-accent" />
            <div className="terminal-dot bg-primary" />
            <span className="text-muted-foreground text-xs font-mono ml-2">production-server.log</span>
          </div>
          <div className="p-4 md:p-6 font-mono text-xs md:text-sm flex-1 overflow-y-auto w-full flex flex-col justify-end">
            <div className="space-y-2">
              {logs.map((log, index) => {
                let colorClass = "text-foreground";
                if (log.includes("[ERROR]")) colorClass = "text-bug-red font-bold";
                if (log.includes("[WARN]")) colorClass = "text-deadline-orange";
                if (log.includes("[OK]") || log.includes("[SUCCESSFUL]")) colorClass = "text-primary";
                if (log.includes("[SYSTEM]")) colorClass = "text-accent";

                return (
                  <div key={index} className={`animate-fade-in ${colorClass}`}>
                    <span className="text-muted-foreground mr-3">{String(index + 1).padStart(2, '0')}</span> 
                    {log}
                  </div>
                );
              })}
              {(isDeploying || deployed) && (
                <div className="flex gap-4 py-0.5 animate-fade-in">
                  <span className="text-muted-foreground select-none w-6 text-right">{logs.length + 1}</span>
                  <span className="typing-cursor" />
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DeploymentSection;
