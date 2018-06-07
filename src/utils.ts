export function range(start: number, count: number): number[] {
  const arr = [];
  for (let i = 0; i < count; i += 1) {
    arr.push(i + start);
  }
  return arr;
}
