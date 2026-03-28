import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: "hero", label: "00", name: "Init" },
  { id: "hello", label: "01", name: "Hello World" },
  { id: "bugs", label: "02", name: "Bug Hunt" },
  { id: "imposter", label: "03", name: "The Doubt" },
  { id: "deadline", label: "04", name: "Deadlines" },
  { id: "coffee", label: "05", name: "Refreshment" },
  { id: "deployment", label: "06", name: "Deployment" },
  { id: "devlife", label: "07", name: "Dev Life" },
];

const ScrollNav = () => {
  const [activeSection, setActiveSection] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(i),
        onEnterBack: () => setActiveSection(i),
      });
    });
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3"
    >
      {sections.map((section, i) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          className="group flex items-center gap-3 justify-end"
          title={section.name}
        >
          <span
            className={`font-mono text-xs transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              activeSection === i ? "text-primary opacity-100" : "text-muted-foreground"
            }`}
          >
            {section.name}
          </span>
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === i
                ? "bg-primary scale-150 shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                : "bg-muted-foreground/30 hover:bg-muted-foreground"
            }`}
          />
        </button>
      ))}
    </nav>
  );
};

export default ScrollNav;
