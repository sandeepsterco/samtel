"use client";

import { useEffect, useState } from "react";

const IDENTIFIER = "57116a0c-2b65-4fe7-a1d4-04fc00c14f87";
const DOMAIN = "https://samtel.keka.com/careers/";
const SCRIPT_SRC = `https://samtel.keka.com/careers/api/embedjobs/js/${IDENTIFIER}`;
const FALLBACK_TIMEOUT_MS = 10000;

type KekaWindow = Window & {
  khConfig?: {
    identifier: string;
    domain: string;
    targetContainer: string;
  };
};

export default function KekaJobs() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const win = window as KekaWindow;
    setLoading(true);

    // Config must exist BEFORE the Keka script runs
    win.khConfig = {
      identifier: IDENTIFIER,
      domain: DOMAIN,
      targetContainer: "#khembedjobs",
    };

    const container = document.getElementById("khembedjobs");

    const hasContent = () =>
      !!container &&
      Array.from(container.children).some(
        (el) => !el.classList.contains("kh-container-fluid")
      );

    let observer: MutationObserver | undefined;
    if (container) {
      observer = new MutationObserver(() => {
        if (hasContent()) {
          setLoading(false);
          observer?.disconnect();
        }
      });
      observer.observe(container, { childList: true, subtree: true });
    }

    const timeout = setTimeout(() => setLoading(false), FALLBACK_TIMEOUT_MS);

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.defer = true;
    script.async = true;
    script.onerror = () => setLoading(false);
    document.body.appendChild(script);

    return () => {
      clearTimeout(timeout);
      observer?.disconnect();
      script.remove();
      if (container) container.innerHTML = "";
      delete win.khConfig;
    };
  }, []);

  return (
    <>
      {loading && <div className="keka-loading">Loading openings...</div>}

      <div id="khembedjobs"></div>

      <style>{`
        .kh-container-fluid { display: none !important; }
        .keka-loading { padding: 40px 0; text-align: center; }
      `}</style>
    </>
  );
}