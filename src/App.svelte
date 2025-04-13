<script>
  import { onMount } from "svelte";
  import Control from "./lib/Control.svelte";
  import Playground from "./lib/Playground.svelte";
  import { Renderer } from "./utils/renderer";

  const renderer = new Renderer();

  onMount(() => {
    renderer.init();
    renderer.loop();
  });
</script>

<div id="app">
  <Control {renderer} />
  <Playground />
</div>

<style>
  #app {
    display: flex;
    width: 100vw;
    height: 100vh;
  }
</style>
