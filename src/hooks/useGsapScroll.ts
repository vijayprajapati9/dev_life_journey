import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const useGsapScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const fadeUpElements = gsap.utils.toArray('.gsap-fade-up') as HTMLElement[];
    const fadeLeftElements = gsap.utils.toArray('.gsap-fade-left') as HTMLElement[];
    const fadeRightElements = gsap.utils.toArray('.gsap-fade-right') as HTMLElement[];

    if (fadeUpElements.length > 0) {
      gsap.from(fadeUpElements, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    }

    if (fadeLeftElements.length > 0) {
      gsap.from(fadeLeftElements, {
        x: -80,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });
    }

    if (fadeRightElements.length > 0) {
      gsap.from(fadeRightElements, {
        x: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });
    }
  }, { scope: containerRef });

  return containerRef;
};
