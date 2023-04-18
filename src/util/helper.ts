export function unreachable(): never {
  throw new Error("This code path should not be reached under any conditions.");
}
