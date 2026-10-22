"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type {
  PointerEvent as ReactPointerEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { refreshScrollTriggers } from "@/hooks/useScrollTriggerRefresh";
import { BASE_URL } from "@/config/config";
import "./technology.css";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_QUERY = "(min-width: 1024px)";
const MOBILE_QUERY = "(max-width: 992px)";
const SWIPE_THRESHOLD = 50;

// stacked-figure positions (yPercent): start -> end of the scroll
const START_Y = [-40, -15, 15, 40, 65];
const END_Y = [-60, -20, 25, 60, 95];
const startY = (i: number) =>
  START_Y[i] ?? START_Y[START_Y.length - 1] + 25 * (i - (START_Y.length - 1));
const endY = (i: number) =>
  END_Y[i] ?? END_Y[END_Y.length - 1] + 35 * (i - (END_Y.length - 1));

interface TechnologyImage {
  image: string;
}

interface TechnologyInfo {
  title: string;
  id: string;
  description: string;
  label?: string;
  slug?: string;
}

interface TechnologyPropsInterface {
  // pass the `technology` object from the home page API
  data: {
    title: string;
    subtitle: string;
    desc?: string;
    images?: TechnologyImage[];
    heading?: string;
    info?: TechnologyInfo[];
    mobileimage?: string;
    buttonlink?: string;
  };
}

export default function Technology({ data }: TechnologyPropsInterface) {
  // left-side figures come only from `images[]`
  const images = (data?.images ?? []).filter((img) => img?.image);
  const slides = data?.info ?? [];

  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ---------- mobile (drag / prev-next slider) ---------- */
  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, moved: false });

  /* desktop (>= 1024px): pin section, scroll moves the stacked figures
     and syncs the active tab. Clicking a tab only changes tab/content. */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || slides.length === 0) return;

    const media = gsap.matchMedia();

    media.add(DESKTOP_QUERY, () => {
      const figures = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".tech_figureitem .techfigure"),
      );

      figures.forEach((figure, i) => gsap.set(figure, { yPercent: startY(i) }));

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "center center",
          end: "+=1200",
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              slides.length - 1,
              Math.floor(self.progress * slides.length),
            );
            setActiveIndex((prev) => (prev === index ? prev : index));
          },
        },
      });

      figures.forEach((figure, i) => {
        timeline.to(figure, { yPercent: endY(i) }, 0);
      });
    });

    const handleLoad = () => refreshScrollTriggers();
    window.addEventListener("load", handleLoad);
    refreshScrollTriggers();

    return () => {
      window.removeEventListener("load", handleLoad);
      media.revert();
    };
  }, [slides.length, images.length]);

  /* track the mobile breakpoint */
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const goToMobile = useCallback(
    (index: number) => {
      setMobileIndex(Math.max(0, Math.min(index, slides.length - 1)));
    },
    [slides.length],
  );

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    dragRef.current = { startX: e.clientX, moved: false };
    setIsDragging(true);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    let delta = e.clientX - dragRef.current.startX;
    const atStart = mobileIndex === 0 && delta > 0;
    const atEnd = mobileIndex === slides.length - 1 && delta < 0;
    if (atStart || atEnd) delta *= 0.3; // resistance at the edges
    if (Math.abs(delta) > 5) dragRef.current.moved = true;
    setDragOffset(delta);
  };

  const endDrag = () => {
    if (!isDragging) return;
    if (dragOffset <= -SWIPE_THRESHOLD) goToMobile(mobileIndex + 1);
    else if (dragOffset >= SWIPE_THRESHOLD) goToMobile(mobileIndex - 1);
    setDragOffset(0);
    setIsDragging(false);
  };

  // a swipe must not trigger the arrow link underneath the finger
  const handleClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  };

  const wrapperStyle = isMobile
    ? {
        transform: `translateX(calc(${-mobileIndex * 100}% + ${dragOffset}px))`,
        transition: isDragging ? "none" : "transform 0.4s ease",
      }
    : undefined;

  return (
    <>
      <section className="journey-sec">
        <div className="container">
          <div className="col-lg-10 mx-auto">
            <div
              className="journey-txt fade-up"
              data-delay="0.3"
              data-duration="1.6"
            >
              {data?.title && (
                <h4 dangerouslySetInnerHTML={{ __html: data.title }} />
              )}

              {data?.subtitle && (
                <h3
                  className="font45"
                  dangerouslySetInnerHTML={{ __html: data.subtitle }}
                />
              )}

              {data?.desc && <p dangerouslySetInnerHTML={{ __html: data.desc }} />}

              {data?.buttonlink && (
                <Link href={`${BASE_URL}${data.buttonlink}`} className="more_btn">
                  <Image
                    src="/assets/icons/right-arrow-white.svg"
                    alt="arrow"
                    className="img-fluid"
                    width={64}
                    height={64}
                    loading="lazy"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="technology_sec" ref={sectionRef}>
        <div className="container-fluid">
          <div className="techno_grid">
            <div className="techno_left">
              <div className="tech_figureitem">
                {images.map((img, index) => (
                  <figure
                    key={index}
                    className={`techfigure techno0${index + 1}`}
                  >
                    <Image
                      src={img.image}
                      alt={slides[index]?.title || "Technology"}
                      width={437}
                      height={237}
                      className="img-fluid w-100"
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>

              <div className="techtab">
                {slides.map((item, index) => (
                  <button
                    key={item.id || index}
                    type="button"
                    className={`techtab_btn${activeIndex === index ? " active" : ""}`}
                    data-tabid={item.id}
                    aria-pressed={activeIndex === index}
                    onClick={() => setActiveIndex(index)}
                  >
                    {item.label || String(index + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            <div className="techno_right">
              {data?.heading && (
                <h4 dangerouslySetInnerHTML={{ __html: data.heading }} />
              )}

              {data?.mobileimage && (
                <div className="techno_mobile for_mobile">
                  <figure className="techfigure techno01">
                    <Image
                      src={data.mobileimage}
                      alt={data.heading || "Technology"}
                      width={437}
                      height={237}
                      className="img-fluid w-100"
                      loading="lazy"
                    />
                  </figure>
                </div>
              )}

              <div className="techno_slider">
                <div
                  className={`techno_tabwrapper${isDragging ? " dragging" : ""}`}
                  style={wrapperStyle}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onPointerLeave={endDrag}
                  onClickCapture={handleClickCapture}
                >
                  {slides.map((item, index) => (
                    <div
                      key={item.id || index}
                      className={`techno_tabdata${activeIndex === index ? " show" : ""}`}
                      data-target={item.id}
                    >
                      {item.title && <h5>{item.title}</h5>}
                      {item.description && <p>{item.description}</p>}
                      {item.slug && (
                        <a href={`${BASE_URL}${item.slug}`} className="more_btn">
                          <img
                            src="/assets/icons/right-arrow-white.svg"
                            alt="arrow"
                            className="img-fluid"
                          />
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {slides.length > 1 && (
                  <div className="techno_mobile_nav">
                    <button
                      type="button"
                      className="techno_prev"
                      aria-label="Previous"
                      disabled={mobileIndex === 0}
                      onClick={() => goToMobile(mobileIndex - 1)}
                    >
                      <img
                        src="/assets/icons/red-left-btn.svg"
                        alt="arrow"
                        className="img-fluid"
                      />
                    </button>
                    <button
                      type="button"
                      className="techno_next"
                      aria-label="Next"
                      disabled={mobileIndex === slides.length - 1}
                      onClick={() => goToMobile(mobileIndex + 1)}
                    >
                      <img
                        src="/assets/icons/red-right-btn.svg"
                        alt="arrow"
                        className="img-fluid"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}