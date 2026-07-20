"use client";

import { useEffect } from "react";
import { adfSwiperModule } from "@/lib/cms/adfSwiper";
import { heroSliderModule } from "@/lib/cms/heroSlider";
import type { SliderModule } from "@/lib/cms/types";

const SLIDER_MODULES: SliderModule[] = [
  adfSwiperModule,
  heroSliderModule,
  // otherSliderModule,
];

export default function CmsEnhancer({ containerId }: { containerId: string }) {
  useEffect(() => {
    let cancelled = false;
    const allInstances: { module: SliderModule; instances: unknown[] }[] = [];

    async function init() {
      const root = document.getElementById(containerId);
      if (!root) return;

      for (const mod of SLIDER_MODULES) {
        const instances = await mod.init(root);
        if (cancelled) {
          mod.destroy(instances);
          continue;
        }
        if (instances.length) allInstances.push({ module: mod, instances });
      }
    }

    init();

    return () => {
      cancelled = true;
      allInstances.forEach(({ module, instances }) => module.destroy(instances));
      allInstances.length = 0;
    };
  }, [containerId]);

  return null;
}