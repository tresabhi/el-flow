export function linspace(a: number, b: number, N: number) {
  const step = (b - a) / (N - 1);
  return Array.from({ length: N }, (_, i) => a + step * i);
}
