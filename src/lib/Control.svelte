<script lang="ts">
  import { linspace } from "../utils/linspace";
  import { cs, type Renderer } from "../utils/renderer";

  export let renderer: Renderer;

  let cMin = -5;
  let cMax = 5;
  let NC = 21;

  $: {
    cs.current = linspace(cMin, cMax, NC);
  }
</script>

<div id="container">
  <span>pixel ratio</span>
  <input
    type="range"
    min="0"
    max="4"
    step={Number.EPSILON}
    on:input={(event) => {
      renderer.pixelRatio =
        2 ** -(event.target as HTMLInputElement).valueAsNumber;
      renderer.updateDimensions();
    }}
  />
  <break></break>

  <span>dither</span>
  <input type="range" min="1" max="32" step="1" bind:value={renderer.dither} />
  <break></break>

  <span>zoom</span>
  <input
    type="range"
    min={Number.EPSILON}
    max="1"
    step={Number.EPSILON}
    bind:value={renderer.camera.zoom}
  />
  <break></break>

  <span>c_min</span>
  <input type="number" bind:value={cMin} />
  <break></break>

  <span>c_max</span>
  <input type="number" bind:value={cMax} />
  <break></break>

  <span>N_c</span>
  <input type="number" bind:value={NC} />
  <break></break>
</div>

<style>
  #container {
    display: flex;
    flex-direction: column;
    width: 24rem;
    background-color: gray;
    padding: 1rem;
    box-sizing: border-box;
  }

  break {
    height: 1rem;
  }
</style>
