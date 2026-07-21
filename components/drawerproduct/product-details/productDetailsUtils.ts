export type StockType = "UNITS" | "PACKET";
export type ProfitMode = "UNIT" | "PACK";

export const calculatePacketUnitPrice = (
  buyingPrice: number,
  packQuantity: number,
) => {
  if (packQuantity <= 0) return 0;
  const buying = Math.ceil(buyingPrice / packQuantity);
  return Number.isNaN(buying) ? 0 : buying;
};

export const calculateTaxAmount = (
  buyingPrice: number,
  quantity: number,
  rate: number,
) => {
  const amount = (buyingPrice * quantity * rate) / 100;
  return Number.isFinite(amount) ? Number(amount.toFixed(2)) : 0;
};

export const getSellingPrice = ({
  stockType,
  profitMode,
  buyingPrice,
  packQuantity,
}: {
  stockType: StockType;
  profitMode: ProfitMode;
  buyingPrice: number;
  packQuantity: number;
}) => {
  if (stockType !== "PACKET") return buyingPrice;
  if (packQuantity <= 0) return 0;
  if (profitMode === "PACK") return buyingPrice;
  return calculatePacketUnitPrice(buyingPrice, packQuantity);
};

export const isValidDateInput = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00`);
  return !Number.isNaN(timestamp);
};
