export const calculateFuelEfficiency = ({ distance = 0, fuel = 1 }) => {
  if (!fuel) return 0;
  return Number((Number(distance) / Number(fuel)).toFixed(2));
};
