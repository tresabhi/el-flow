import { FlowType, type Flow } from "./flows";

export function psi(flow: Flow, x: number, y: number) {
  const dx = x - flow.position.x;
  const dy = y - flow.position.y;

  switch (flow.type) {
    case FlowType.Uniform: {
      return flow.V * (dy * Math.cos(flow.theta) - dx * Math.sin(flow.theta));
    }
  }
}
