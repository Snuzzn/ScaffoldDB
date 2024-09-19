export const calculateSize = (
  label: string,
  baseSize: number,
  maxSize: number,
) => {
  const incrementPerChar = 3;
  const newSize = Math.min(baseSize + label.length * incrementPerChar, maxSize);
  return newSize;
};
