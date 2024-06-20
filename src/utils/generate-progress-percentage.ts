export function generateProgressPercentage(
  total: number,
  completed: number
): number {
  return Math.round((completed / total) * 100);
}
