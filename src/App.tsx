import { useState, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import ReceiptTemplate from "@/components/receiptTemplate";

export interface OrderItem {
  id: string;
  name: string;
  shippingCost: number;
  packagingCost: number;
  receiver: string;
  shippingCompany: string;
  province: string;
}

export interface ReceiptData {
  customerName: string;
  orderList: OrderItem[];
}

function App() {
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    customerName: "",
    orderList: [],
  });

  // ใช้ useCallback เพื่อให้ function reference เหมือนเดิม ลด re-render
  const updateReceiptData = useCallback(
    (field: keyof ReceiptData, value: any) => {
      setReceiptData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  return (
    <div className="flex flex-row-reverse">
      <Sidebar
        receiptData={receiptData}
        updateReceiptData={updateReceiptData}
      />
      <div className="container pr-80">
        <ReceiptTemplate receiptData={receiptData} />
      </div>
    </div>
  );
}

export default App;
