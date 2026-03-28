import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");

  useEffect(() => {
    const messages = [
      "Initializing...",
      "Loading dependencies...",
      "Brewing coffee...",
      "Fixing one last bug...",
      "Almost there...",
      "Ready!",
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15 + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        const msgIndex = Math.min(
          Math.floor((next / 100) * messages.length),
          messages.length - 1
        );
        setLoadingText(messages[msgIndex]);
        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="font-mono text-primary text-sm mb-6">{loadingText}</div>
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="font-mono text-xs text-muted-foreground mt-3">
          {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
