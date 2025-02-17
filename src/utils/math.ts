export const roundUp = (value: number, step: number) => {
  return Math.ceil(value / step) * step;
};
