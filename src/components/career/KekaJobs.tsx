"use client";

import { useEffect } from "react";

const IDENTIFIER = "57116a0c-2b65-4fe7-a1d4-04fc00c14f87";
const DOMAIN = "https://samtel.keka.com/careers/";
const SCRIPT_SRC = `https://samtel.keka.com/careers/api/embedjobs/js/${IDENTIFIER}`;

type KekaWindow = Window & {
  khConfig?: {
    identifier: string;
    domain: string;
    targetContainer: string;
  };
};

export default function KekaJobs() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const win = window as KekaWindow;

    // Config must exist BEFORE the Keka script runs
    win.khConfig = {
      identifier: IDENTIFIER,
      domain: DOMAIN,
      targetContainer: "#khembedjobs",
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );

    const script = existingScript ?? document.createElement("script");

    if (!existingScript) {
      script.src = SCRIPT_SRC;
      script.defer = true;
      script.async = true;
      document.body.appendChild(script);
    }

    // Cleanup so the widget reloads correctly on client-side navigation
    return () => {
      if (script.parentNode) {
        script.remove();
      }
      const container = document.getElementById("khembedjobs");
      if (container) container.innerHTML = "";
      delete win.khConfig;
    };
  }, []);

  return (
    <>
      <div id="khembedjobs"></div>
      <style>{`.kh-container-fluid { display: none !important; }`}</style>
    </>
  );
}