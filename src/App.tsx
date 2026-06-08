import { useState, useCallback, useRef } from "react";
import { Sidebar, type TemplateType } from "@/components/Sidebar";
import ReceiptTemplate from "@/components/receiptTemplate";
import ReceiptTemplateNoodle from "@/components/receiptTemplateNoodle";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import "./app.css";
export interface OrderItem {
  id: string;
  name: string;
  shippingCost: number;
  receiver: string;
  shippingCompany: string;
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

  const [template, setTemplate] = useState<TemplateType>("postshop");

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
        template={template}
        setTemplate={setTemplate}
      />
      <div className="container pr-80">
        <div ref={contentRef}>
          {template === "postshop" ? (
            <ReceiptTemplate receiptData={receiptData} />
          ) : (
            <ReceiptTemplateNoodle
              receiptData={{
                customerName: receiptData.customerName,
                orderList: receiptData.orderList.map((item) => ({
                  id: item.id,
                  name: item.name,
                  price: item.shippingCost,
                })),
              }}
            />
          )}
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
