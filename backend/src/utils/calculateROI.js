export const calculateROI = ({ revenue = 0, fuel = 0, maintenance = 0, acquisitionCost = 1 }) => {
  const profit = Number(revenue) - Number(fuel) - Number(maintenance);
  return Number(((profit / Number(acquisitionCost)) * 100).toFixed(2));
};
