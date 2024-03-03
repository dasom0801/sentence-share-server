export const calculateSkip = (page, limit) => {
  return Math.max(Number(page - 1) * Number(limit), 0);
};
