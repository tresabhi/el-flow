import { flows } from "./flows";

export class Renderer {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;

  render() {
    for (const flow of flows) {
      console.log(flow);
    }
  }
}
