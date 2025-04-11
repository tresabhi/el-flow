<script lang="ts">
  import { onMount } from "svelte";
  import { Renderer } from "../utils/renderer";

  onMount(() => {
    const renderer = new Renderer();

    renderer.render();
  });
</script>

<div id="container">
  <canvas id="canvas"></canvas>
</div>

<style>
  #container {
    flex: 1;
    position: relative;
  }

  #canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: green;
  }
</style>
