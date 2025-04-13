struct Screen {
  size: vec2<f32>,
};

@group(0) @binding(0)
var<uniform> screen: Screen;

@vertex
fn vertex(@builtin(vertex_index) i: u32) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 6>(
    vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
    vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0)
  );
  return vec4(pos[i], 0.0, 1.0);
}

@fragment
fn fragment(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = pos.xy / screen.size;
  return vec4(uv.x, uv.y, 1.0 - 0.5 * uv.x - uv.y, 1.0);
}