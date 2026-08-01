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
    setBuyingPrice(draftItem.price);
    setSelling(draftItem.profit);
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

  useEffect(() => {
    setSelling(
      getSellingPrice({
        stockType,
        profitMode,
        buyingPrice,
        packQuantity,
      }),
    );
  }, [stockType, profitMode, buyingPrice, packQuantity]);

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

    const cleanExpiryDate = expiryDate.trim();
    if (cleanExpiryDate && !isValidDateInput(cleanExpiryDate)) {
      alert("Use expiry date format YYYY-MM-DD");
      return;
    }

    await BatchRepo.updateDraftItem(draftItem.id, {
      quantity,
      expiry: cleanExpiryDate || undefined,
      price:
        stockType === "PACKET" && profitMode === "UNIT"
          ? unitPrice
          : buyingPrice,
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
