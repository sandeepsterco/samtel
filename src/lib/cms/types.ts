// lib/cms-sliders/types.ts
export interface SliderModule<TInstance = unknown> {
    init(root: HTMLElement): Promise<TInstance[]>;
    destroy(instances: TInstance[]): void;
  }