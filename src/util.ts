export const toPercentage = (
  count: number | undefined,
  total: number | undefined
): string | undefined => {
  return typeof count === "number" && typeof total === "number" && total > 0  
  ? ((100 * count) / total).toFixed(2) + "%"
    : undefined;
};
