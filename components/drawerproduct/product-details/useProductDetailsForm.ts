import { BatchRepo, DraftItem, TaxType,} from "@/databases/repositories/BatchRepo";
import { useEffect, useState } from "react";
import {
  calculatePacketUnitPrice,
  calculateTaxAmount,
  getSellingPrice,
  isValidDateInput,
  ProfitMode,
  StockType,
} from "./productDetailsUtils";

export const useProductDetailsForm = (
  draftItem?: DraftItem | null,
  onSaved?: () => void | Promise<void>,
) => {
  const [stockType, setStockType] = useState<StockType>("UNITS");
  const [buyingPrice, setBuyingPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [packQuantity, setPackQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [selling, setSelling] = useState(0);
  const [profitMode, setProfitMode] = useState<ProfitMode>("UNIT");
  const [expiryDate, setExpiryDate] = useState("");
  const [taxTypes, setTaxTypes] = useState<TaxType[]>([]);
  const [selectedTaxTypeId, setSelectedTaxTypeId] = useState<string>();
  const [taxAmount, setTaxAmount] = useState(0);

  useEffect(() => {
    if (!draftItem) return;

    setQuantity(draftItem.quantity);
    setStockType(draftItem.purchase_unit === "PACKET" ? "PACKET" : "UNITS");
    setBuyingPrice(
      draftItem.unit_cost > 0 ? draftItem.unit_cost : draftItem.price,
    );
    setPackQuantity(draftItem.units_per_pack > 1 ? draftItem.units_per_pack : 0);
    setSelling(draftItem.unit_selling_price ?? draftItem.profit);
    setProfitMode(draftItem.profit_scope === "PACK" ? "PACK" : "UNIT");
    setExpiryDate(draftItem.expiry ?? "");
    setSelectedTaxTypeId(draftItem.tax_type_id);
    setTaxAmount(draftItem.vat ?? 0);
  }, [draftItem]);

  useEffect(() => {
    const loadTaxTypes = async () => {
      const nextTaxTypes = await BatchRepo.listTaxTypes();
      setTaxTypes(nextTaxTypes);
      setSelectedTaxTypeId((currentTaxTypeId) =>
        currentTaxTypeId ?? draftItem?.tax_type_id ?? nextTaxTypes[0]?.id,
      );
    };

    loadTaxTypes();
  }, [draftItem?.tax_type_id]);

  useEffect(() => {
    setUnitPrice(calculatePacketUnitPrice(buyingPrice, packQuantity));
  }, [buyingPrice, packQuantity]);

  const handleSelectTaxType = (taxType: TaxType) => {
    setSelectedTaxTypeId(taxType.id);
    setTaxAmount(calculateTaxAmount(buyingPrice, quantity, taxType.rate));
  };

  const handleSave = async () => {
    if (!draftItem) {
      alert("Select a product before adding details");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than zero");
      return;
    }

    if (stockType === "PACKET" && packQuantity <= 0) {
      alert("Quantity per packet must be greater than zero");
      return;
    }

    const cleanExpiryDate = expiryDate.trim();
    if (cleanExpiryDate && !isValidDateInput(cleanExpiryDate)) {
      alert("Use expiry date format YYYY-MM-DD");
      return;
    }

    await BatchRepo.updateDraftItem(draftItem.id, {
      quantity,
      purchase_unit: stockType === "PACKET" ? "PACKET" : "UNIT",
      units_per_pack: stockType === "PACKET" ? Math.max(1, packQuantity) : 1,
      unit_cost: buyingPrice,
      unit_selling_price: selling,
      profit_amount: selling,
      profit_scope: profitMode,
      expiry: cleanExpiryDate || undefined,
      // `price` is the purchase price used to calculate the batch total. Keep
      // it as the configured buying price even when a packet's unit price is
      // displayed or used for selling.
      price: buyingPrice,
      vat: taxAmount,
      tax_type_id: selectedTaxTypeId,
      profit: selling,
      updated_at: new Date().toISOString(),
    });
    await onSaved?.();
    alert("Draft product details saved");
  };

  return {
    stockType,
    setStockType,
    buyingPrice,
    setBuyingPrice,
    quantity,
    setQuantity,
    packQuantity,
    setPackQuantity,
    unitPrice,
    selling,
    setSelling,
    profitMode,
    setProfitMode,
    expiryDate,
    setExpiryDate,
    taxTypes,
    selectedTaxTypeId,
    taxAmount,
    setTaxAmount,
    handleSelectTaxType,
    handleSave,
  };
};
