// lib/cms/milestoneTimeline.ts
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SliderModule } from "./types";

interface MilestoneInstance {
  revert: () => void;
}

const PHASE_DATA = [
  { title: "Foundations of Manufacturing Excellence", years: "(1973–2000)" },
  { title: "Aerospace & Defence Transformation", years: "(2001–2020)" },
  { title: "Global Expansion & Future Technologies", years: "(2021–Present)" },
];

async function initMilestoneTimeline(root: HTMLElement): Promise<MilestoneInstance[]> {
  const sections = root.querySelectorAll<HTMLElement>(".milestone-section");
  if (!sections.length) return [];

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  return Array.from(sections, (section) => {
    const media = gsap.matchMedia();

    media.add("(min-width: 768px)", () => {
      const nav = section.querySelector<HTMLElement>(".milestone-nav");
      const stickyWrap = section.querySelector<HTMLElement>(".milestone-nav-wrap");
      const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>(".milestone-tab"));
      const phases = Array.from(section.querySelectorAll<HTMLElement>(".milestone-phase"));
      const stickyTitle = section.querySelector<HTMLElement>(".sticky-phase-title");
      const stickyYears = section.querySelector<HTMLElement>(".sticky-phase-years");
      const progressFill = section.querySelector<HTMLElement>(".milestone-progress-fill");
      const progressDot = section.querySelector<HTMLElement>(".milestone-progress-dot");
      const globalLine = section.querySelector<HTMLElement>(".global-timeline-line");
      const globalLineFill = section.querySelector<HTMLElement>(".global-timeline-line-fill");
      const content = section.querySelector<HTMLElement>(".milestone-content");

      if (!phases.length) return;

      const docEl = document.documentElement;
      let isAutoScrolling = false;
      let scrollTween: gsap.core.Tween | null = null;
      let savedScrollBehavior = "";

      /* ---------------- CURVE SETUP ---------------- */
      section.querySelectorAll<SVGPathElement>(".curve-path").forEach((path) => {
        const svg = path.ownerSVGElement;
        const bounds = path.getBBox();
        if (svg && bounds.width > 0 && bounds.height > 0) {
          svg.setAttribute("viewBox", `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
          svg.setAttribute("preserveAspectRatio", "none");
        }

        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      /* ---------------- ACTIVE PHASE ---------------- */
      let currentPhase = -1;

      const setActivePhase = (index: number) => {
        const data = PHASE_DATA[index];
        if (!data) return;

        tabs.forEach((tab, tabIndex) => tab.classList.toggle("active", tabIndex === index));

        if (index !== currentPhase) {
          currentPhase = index;
          if (stickyTitle && stickyYears) {
            gsap
              .timeline()
              .to([stickyTitle, stickyYears], {
                opacity: 0,
                y: -8,
                duration: 0.18,
                ease: "power2.out",
              })
              .call(() => {
                stickyTitle.textContent = data.title;
                stickyYears.textContent = data.years;
              })
              .to([stickyTitle, stickyYears], {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: "power3.out",
              });
          }
        }

        if (progressDot) {
          gsap.to(progressDot, {
            left: ["16.666%", "50%", "83.333%"][index],
            duration: 0.65,
            ease: "power3.inOut",
            overwrite: true,
          });
        }
        if (progressFill) {
          gsap.to(progressFill, {
            width: ["33.333%", "66.666%", "100%"][index],
            duration: 0.65,
            ease: "power3.inOut",
            overwrite: true,
          });
        }
      };

      setActivePhase(0);

      /* ---------------- GLOBAL VERTICAL LINE ---------------- */
      const updateGlobalLine = () => {
        if (globalLine && content) gsap.set(globalLine, { height: content.offsetHeight });
      };

      updateGlobalLine();

      if (globalLineFill) {
        gsap.fromTo(
          globalLineFill,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 55%",
              end: "bottom 65%",
              scrub: 1.2,
            },
          },
        );
      }

      /* ---------------- PHASE DETECTION (scroll) ---------------- */
      phases.forEach((phase, index) => {
        ScrollTrigger.create({
          trigger: phase,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => {
            if (!isAutoScrolling) setActivePhase(index);
          },
          onEnterBack: () => {
            if (!isAutoScrolling) setActivePhase(index);
          },
        });
      });

      /* ---------------- TIMELINE EVENTS ---------------- */
      section.querySelectorAll<HTMLElement>(".timeline-event").forEach((event) => {
        const curve = event.querySelector<SVGPathElement>(".curve-path");
        const image = event.querySelector<HTMLElement>(".event-image");
        const copy = event.querySelector<HTMLElement>(".event-copy");
        const dot = event.querySelector<HTMLElement>(".event-dot");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: event,
            start: "top 75%",
            end: "top 34%",
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(event, { opacity: 1, duration: 0.12, ease: "none" }, 0);
        if (curve) timeline.to(curve, { strokeDashoffset: 0, duration: 0.55, ease: "none" }, 0.08);
        if (dot) timeline.to(dot, { scale: 1, duration: 0.12, ease: "power2.out" }, 0.58);
        if (image) timeline.to(image, { opacity: 1, scale: 1, duration: 0.22, ease: "power3.out" }, 0.58);
        if (copy) timeline.to(copy, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out" }, 0.72);
      });

      /* ---------------- TAB CLICK ---------------- */
      const stopAutoScroll = () => {
        if (!isAutoScrolling) return;
        isAutoScrolling = false;
        docEl.style.scrollBehavior = savedScrollBehavior;
        document.body.style.scrollBehavior = savedScrollBehavior;
      };

      const tabClickHandlers = tabs.map((tab, index) => {
        const handleClick = (event: MouseEvent) => {
          event.preventDefault();
          const target = phases[index];
          if (!target) return;

          setActivePhase(index);

          const offset = (stickyWrap ?? nav)?.offsetHeight ?? 0;

          // Disable CSS smooth scrolling while GSAP drives the scroll
          if (!isAutoScrolling) {
            savedScrollBehavior = docEl.style.scrollBehavior;
          }
          docEl.style.scrollBehavior = "auto";
          document.body.style.scrollBehavior = "auto";

          isAutoScrolling = true;
          scrollTween?.kill();
          scrollTween = gsap.to(window, {
            duration: 1.2,
            scrollTo: {
              y: target, // element, resolved live by ScrollToPlugin
              offsetY: offset + 30,
              autoKill: false,
            },
            ease: "power3.inOut",
            onComplete: () => {
              stopAutoScroll();
              setActivePhase(index);
              ScrollTrigger.refresh();
            },
            onInterrupt: stopAutoScroll,
          });
        };

        tab.addEventListener("click", handleClick);
        return () => tab.removeEventListener("click", handleClick);
      });

      /* ---------------- REFRESH / RESIZE ---------------- */
      let resizeTimer: ReturnType<typeof setTimeout> | undefined;
      const refreshMilestone = () => {
        updateGlobalLine();
        ScrollTrigger.refresh();
      };
      const handleResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refreshMilestone, 250);
      };
      const resizeObserver = content ? new ResizeObserver(refreshMilestone) : null;

      if (content) resizeObserver?.observe(content);
      window.addEventListener("load", refreshMilestone);
      window.addEventListener("resize", handleResize);

      /* ---------------- CLEANUP ---------------- */
      return () => {
        tabClickHandlers.forEach((removeHandler) => removeHandler());
        scrollTween?.kill();
        stopAutoScroll();
        window.removeEventListener("load", refreshMilestone);
        window.removeEventListener("resize", handleResize);
        resizeObserver?.disconnect();
        if (resizeTimer) clearTimeout(resizeTimer);
      };
    });

    return { revert: () => media.revert() };
  });
}

function destroyMilestoneTimeline(instances: MilestoneInstance[]) {
  instances.forEach(({ revert }) => revert());
}

export const milestoneTimelineModule: SliderModule<MilestoneInstance> = {
  init: initMilestoneTimeline,
  destroy: destroyMilestoneTimeline,
};