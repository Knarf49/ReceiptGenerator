import { memo, useMemo } from "react";

interface ReceiptData {
  customerName: string;
  orderList: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

interface ReceiptTemplateProps {
  receiptData: ReceiptData;
}

function getNextReceiptNumber(): { receiptNumber: string; counter: number } {
  const currentDate = new Date();
  const dateKey = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const stored = localStorage.getItem("receiptCounterNoodle");
  let receiptStorage: { date: string; counter: number } = stored
    ? JSON.parse(stored)
    : { date: "", counter: 0 };

  if (receiptStorage.date !== dateKey) {
    receiptStorage = { date: dateKey, counter: 1 };
  } else {
    receiptStorage.counter += 1;
  }

  localStorage.setItem("receiptCounterNoodle", JSON.stringify(receiptStorage));

  const receiptNumber = `F${Date.now()}`;

  return { receiptNumber, counter: receiptStorage.counter };
}

function ReceiptTemplateNoodle({ receiptData }: ReceiptTemplateProps) {
  const totals = useMemo(() => {
    const grandTotal = receiptData.orderList.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return { grandTotal };
  }, [receiptData.orderList]);

  const dateInfo = useMemo(() => {
    const currentDate = new Date();
    const { receiptNumber } = getNextReceiptNumber();

    const formattedDate = currentDate.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const formattedTime = currentDate.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { receiptNumber, formattedDate, formattedTime };
  }, []);

  const { grandTotal } = totals;
  const { receiptNumber, formattedDate, formattedTime } = dateInfo;

  return (
    <div className="w-[80mm] h-fit mx-auto border px-4 py-6 space-y-2">
      <div className="flex justify-center">
        <img src="/noodles.png" alt="ร้านก๋วยเตี๋ยวเรือ มุมอร่อย" className="h-20 object-contain" />
      </div>
      <h1 className="font-bold w-full text-center">ใบเสร็จชำระเงิน</h1>
      <h1 className="w-full text-center">ร้านก๋วยเตี๋ยวเรือ มุมอร่อย (คลองสาม)</h1>
      <div className="flex justify-between text-sm">
        <p>
          Print Time: {formattedDate} {formattedTime}
        </p>
        <p>เลขที่ {receiptNumber}</p>
      </div>
      <h3>โทร 083-044-5659</h3>

      {/* Order List */}
      {receiptData.orderList.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">รายการสินค้า</h3>
          {receiptData.orderList.map((item, index) => (
            <div key={item.id} className="pb-2 border-b last:border-b-0">
              <div className="flex justify-between text-sm font-medium">
                <span>
                  {index + 1}. {item.name}
                </span>
                <span>{item.price.toFixed(2)} บาท</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t-2 pt-2 space-y-1">
        <h3 className="font-bold text-lg">
          รวมเงิน {grandTotal.toFixed(2)} บาท
        </h3>
      </div>

      <div className="text-center pt-4">
        <p className="font-bold">ขอบคุณที่มาอุดหนุนค่ะ</p>
      </div>
    </div>
  );
}

export default memo(ReceiptTemplateNoodle);
