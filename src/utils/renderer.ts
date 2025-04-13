import type { Vector2UV, Vector4Tuple } from "./math";

export class Renderer {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  image?: ImageData;
  frame = 0;

  camera = { x: 0, y: 0, zoom: 2 ** -2 };
  width = 0;
  height = 0;
  pixelRatio = 2 ** -2;
  dither = 2;

  init() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.updateDimensions();
  }

  updateDimensions() {
    this.width = Math.round(
      this.pixelRatio * this.canvas!.clientWidth * window.devicePixelRatio
    );
    this.height = Math.round(
      this.pixelRatio * this.canvas!.clientHeight * window.devicePixelRatio
    );
    this.canvas!.width = this.width;
    this.canvas!.height = this.height;

    this.image = this.ctx!.createImageData(
      this.canvas!.width,
      this.canvas!.height
    );
  }

  render() {
    const { data } = this.image!;
    const du = 1 / this.width;
    const dv = 1 / this.height;

    for (let y = 0; y < this.height; y++) {
      const v = y / (this.height - 1);

      if (y % this.dither !== this.frame % this.dither) continue;

      for (let x = 0; x < this.width; x++) {
        const u = x / (this.width - 1);
        const index = (y * this.width + x) * 4;
        const [r, g, b, a = 1] = this.fragment({ u, v }, { u: du, v: dv });

        data[index] = 255 * r;
        data[index + 1] = 255 * g;
        data[index + 2] = 255 * b;
        data[index + 3] = 255 * a;
      }
    }

    this.ctx!.putImageData(this.image!, 0, 0);
    this.frame++;
  }

  loopLogic() {}

  fragment(P: Vector2UV, dP: Vector2UV): Vector4Tuple {
    const x = (P.u - 0.5) / this.camera.zoom + this.camera.x;
    const y = (0.5 - P.v) / this.camera.zoom + this.camera.y;

    // const color = psi(x, y);
    // return [-color, color, 0, 1];

    const dx = dP.u / this.camera.zoom;
    const dy = dP.v / this.camera.zoom;
    const ddx = dx / 2;
    const ddy = dy / 2;

    const z0 = psi(x - ddx, y - ddy);
    const z1 = psi(x + ddx, y - ddy);
    const z2 = psi(x + ddx, y + ddy);
    const z3 = psi(x - ddx, y + ddy);
    const zMin = Math.min(z0, z1, z2, z3);
    const zMax = Math.max(z0, z1, z2, z3);

    const satisfied = cs.current.some((c) => {
      const d = c / 9;
      return zMin < d && zMax > d;
    });

    return satisfied ? WHITE : BLACK;
  }

  loop() {
    this.loopLogic();
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }
}

const WHITE: Vector4Tuple = [1, 1, 1, 1];
const BLACK: Vector4Tuple = [0, 0, 0, 1];

const SCALE = 1;

export const cs = { current: [] as number[] };

const Lambda = 1;
const Gamma = 1;

// stream
function psi(x: number, y: number) {
  const R = 1.5;
  const t = Date.now() / 10000;
  const xBar1 = R * Math.cos(t);
  const yBar1 = R * Math.sin(t);

  return psiVortex(x, y) + psiVortex(x - 1 - xBar1, y - 1.5 - yBar1);

  return (
    psiSource(x - 1 - xBar1, y - yBar1) -
    psiSource(x + 1.5, y + 1) -
    psiSource(x + 1, y - 1) +
    psiVortex(x, y)
  );
}

function psiSource(x: number, y: number) {
  const theta = Math.atan2(y, x);
  return (Lambda * theta) / (2 * Math.PI);
}

function phiSource(x: number, y: number) {
  const r = Math.sqrt(x ** 2 + y ** 2);
  return (Lambda * Math.log(r)) / (2 * Math.PI);
}

// potential
function phi(x: number, y: number) {
  return -phiVortex(x, y) + phiSource(x - 1, y - 1) + phiSource(x + 1, y);
}

function psiVortex(x: number, y: number) {
  const r = Math.sqrt(x ** 2 + y ** 2);
  return (Gamma * Math.log(r)) / (2 * Math.PI);
}

function phiVortex(x: number, y: number) {
  const theta = Math.atan2(y, x);
  return (Gamma * theta) / (2 * Math.PI);
}
