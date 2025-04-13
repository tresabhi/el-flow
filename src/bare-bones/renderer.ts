export class Renderer {
  canvas?: HTMLCanvasElement;
  device?: GPUDevice;
  context?: GPUCanvasContext;
  pipeline?: GPURenderPipeline;
  bindGroup?: GPUBindGroup;

  private animationFrame?: number;

  clearValue: GPUColor = { r: 0, g: 0, b: 0, a: 1 };

  constructor(public code: string) {}

  async init(canvas: HTMLCanvasElement) {
    const adapter = await navigator.gpu.requestAdapter();

    if (adapter === null) throw new Error("No adapter found");

    this.canvas = canvas;
    this.device = await adapter.requestDevice();
    this.context = this.canvas.getContext("webgpu") ?? undefined;

    if (this.context === undefined) throw new Error("No context found");

    const format = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({
      device: this.device,
      format,
      alphaMode: "opaque",
    });

    const module = this.device.createShaderModule({ code: this.code });
    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" },
        },
      ],
    });
    const screenSizeBuffer = this.device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.device.queue.writeBuffer(
      screenSizeBuffer,
      0,
      new Float32Array([canvas.width, canvas.height])
    );
    this.bindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: screenSizeBuffer } }],
    });

    const layout = this.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });

    this.pipeline = await this.device.createRenderPipelineAsync({
      layout,
      vertex: { module, entryPoint: "vertex" },
      fragment: { module, entryPoint: "fragment", targets: [{ format }] },
      primitive: { topology: "triangle-list" },
    });
  }

  frame() {
    this.assertDevice();
    this.assertContext();
    this.assertPipeline();
    this.assertBindGroup();

    const encoder = this.device.createCommandEncoder();
    const view = this.context.getCurrentTexture().createView();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view,
          clearValue: this.clearValue,
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    });

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(6);
    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }

  startFrameLoop() {
    if (this.animationFrame !== undefined) return;

    this.frame();
    this.animationFrame = requestAnimationFrame(this.frame.bind(this));
  }

  stopFrameLoop() {
    if (this.animationFrame === undefined) return;

    cancelAnimationFrame(this.animationFrame);
  }

  assertCanvas(): asserts this is { canvas: HTMLCanvasElement } {
    if (this.canvas === undefined) throw new Error("Canvas not initialized");
  }

  assertDevice(): asserts this is { device: GPUDevice } {
    if (this.device === undefined) throw new Error("Device not initialized");
  }

  assertContext(): asserts this is { context: GPUCanvasContext } {
    if (this.context === undefined) throw new Error("Context not initialized");
  }

  assertPipeline(): asserts this is { pipeline: GPURenderPipeline } {
    if (this.pipeline === undefined)
      throw new Error("Pipeline not initialized");
  }

  assertBindGroup(): asserts this is { bindGroup: GPUBindGroup } {
    if (this.bindGroup === undefined)
      throw new Error("Bind group not initialized");
  }
}
