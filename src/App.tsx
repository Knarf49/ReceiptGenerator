import { useState, useCallback, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import ReceiptTemplate from "@/components/receiptTemplate";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import "./app.css";
export interface OrderItem {
  id: string;
  name: string;
  shippingCost: number;
  packagingCost: number;
  receiver: string;
  shippingCompany: string;
  province: string;
  otherCost?: number;
  discount?: number;
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

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrint = useReactToPrint({ contentRef });

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
        <div ref={contentRef}>
          <ReceiptTemplate receiptData={receiptData} />
        </div>
      </div>
      <Button
        variant="default"
        onClick={reactToPrint}
        className="fixed cursor-pointer rounded-full bottom-4 right-[25%] w-fit px-24"
      >
        Print
      </Button>
    </div>
  );
}

export default App;
