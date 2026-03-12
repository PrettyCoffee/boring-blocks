export const createRange = (props: { start: number; end: number } | number) => {
  const { start, end } =
    typeof props !== "number" ? props : { start: 0, end: props - 1 };

  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
};
