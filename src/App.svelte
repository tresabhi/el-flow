<script lang="ts">
  import { onMount } from "svelte";
  import { Renderer } from "./bare-bones/renderer";
  import Playground from "./lib/Playground.svelte";
  import code from "./shaders/shader.wgsl?raw";

  const renderer = new Renderer(code);

  onMount(async () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    await renderer.init(canvas);
    renderer.startFrameLoop();
  });
</script>

<div id="app">
  <!-- <Control {renderer} /> -->
  <Playground />
</div>

<style>
  #app {
    display: flex;
    width: 100vw;
    height: 100vh;
  }
</style>
