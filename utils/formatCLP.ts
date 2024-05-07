// utils/formatCLP.js
export const formatCLP = (number: number) => {
  if (number !== null && !isNaN(number)) {
    const rounded = Math.round(number);
    const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formatted} CLP`;
  }
  return "";
};
