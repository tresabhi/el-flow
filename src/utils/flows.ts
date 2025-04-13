import type { Vector2 } from "./math";

export enum FlowType {
  Uniform,
  Source,
}

export type Flow = (
  | {
      type: FlowType.Uniform;
      V: number;
      theta: number;
    }
  | {
      type: FlowType.Source;
      lambda: number;
    }
) & {
  position: Vector2;
};

export const flows: Flow[] = [];

flows.push({
  type: FlowType.Uniform,
  V: 1,
  position: { x: 0, y: 0 },
  theta: Math.PI / 4,
});
