import { memo, useMemo } from "react";

interface ReceiptData {
  customerName: string;
  orderList: Array<{
    id: string;
    name: string;
    shippingCost: number;
    packagingCost: number;
    shippingCompany?: string;
    receiver?: string;
    province?: string;
  }>;
}

interface ReceiptTemplateProps {
  receiptData: ReceiptData;
}

// ฟังก์ชันสำหรับดึงและอัพเดทเลขที่ใบเสร็จด้วย localStorage
function getNextReceiptNumber(): { receiptNumber: string; counter: number } {
  const currentDate = new Date();
  const dateKey = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  // ดึงข้อมูลจาก localStorage
  const stored = localStorage.getItem("receiptCounter");
  let receiptStorage: { date: string; counter: number } = stored
    ? JSON.parse(stored)
    : { date: "", counter: 0 };

  // ถ้าเป็นวันใหม่ ให้ reset counter
  if (receiptStorage.date !== dateKey) {
    receiptStorage = {
      date: dateKey,
      counter: 1,
    };
  } else {
    // ถ้าเป็นวันเดียวกัน ให้เพิ่ม counter
    receiptStorage.counter += 1;
  }

  // บันทึกกลับไป localStorage
  localStorage.setItem("receiptCounter", JSON.stringify(receiptStorage));

  // สร้างเลขที่ใบเสร็จในรูปแบบ S36_YYYYMMDD_XXX
  const receiptNumber = `S36_${currentDate.getFullYear()}${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}${String(currentDate.getDate()).padStart(2, "0")}_${String(
    receiptStorage.counter
  ).padStart(2, "0")}`;

  return { receiptNumber, counter: receiptStorage.counter };
}

function ReceiptTemplate({ receiptData }: ReceiptTemplateProps) {
  // คำนวณยอดรวมแต่ละรายการ (ราคาสินค้า + ค่าขนส่ง + ค่าบรรจุภัณฑ์)
  const calculateItemTotal = (item: (typeof receiptData.orderList)[0]) => {
    return item.shippingCost + item.packagingCost;
  };

  // ใช้ useMemo เพื่อ cache การคำนวณ - จะคำนวณใหม่ก็ต่อเมื่อ orderList เปลี่ยน
  const totals = useMemo(() => {
    const productTotal = receiptData.orderList.reduce((sum) => sum, 0);

    const totalShipping = receiptData.orderList.reduce(
      (sum, item) => sum + item.shippingCost,
      0
    );

    const totalPackaging = receiptData.orderList.reduce(
      (sum, item) => sum + item.packagingCost,
      0
    );

    const grandTotal = receiptData.orderList.reduce(
      (sum, item) => sum + calculateItemTotal(item),
      0
    );

    return { productTotal, totalShipping, totalPackaging, grandTotal };
  }, [receiptData.orderList]);

  // สร้างเลขที่ใบเสร็จและวันที่ - เรียกใช้ครั้งเดียวตอน mount
  const dateInfo = useMemo(() => {
    const currentDate = new Date();
    const { receiptNumber, counter } = getNextReceiptNumber();

    const formattedDate = currentDate.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const formattedTime = currentDate.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { receiptNumber, formattedDate, formattedTime, counter };
  }, []); // Empty dependency = คำนวณครั้งเดียว

  const { grandTotal } = totals;
  const { receiptNumber, formattedDate, formattedTime } = dateInfo;

  return (
    <div className="w-[80mm] h-fit mx-auto border px-4 py-6 space-y-2">
      <img
        src="/S36_logo.svg"
        alt="S36 post shop"
        className="size-20 mx-auto"
      />
      <h1 className="font-bold w-full text-center">ใบเสร็จชำระเงิน</h1>
      <div className="flex justify-between text-sm">
        <p>
          Print Time: {formattedDate} {formattedTime}
        </p>
        <p>เลขที่ {receiptNumber}</p>
      </div>
      <h3>โทร.083-044-5659</h3>
      <h3>
        ลูกค้า:{" "}
        {receiptData.customerName || (
          <span className="text-gray-400">(ไม่ระบุ)</span>
        )}
      </h3>

      {/* Order List */}
      {receiptData.orderList.length > 0 && (
        <div className="border-t pt-2 space-y-2">
          <h3 className="font-semibold">รายการสินค้า:</h3>
          {receiptData.orderList.map((item, index) => (
            <div key={item.id} className="pb-2 border-b last:border-b-0">
              <div className="flex justify-between text-sm font-medium">
                <span>
                  {index + 1}. {item.name}
                </span>
              </div>
              <div className="text-xs space-y-0.5 mt-1 ml-4">
                <div className="flex justify-between">
                  <span>ค่าขนส่ง</span>
                  <span>{item.shippingCost.toFixed(2)} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าบรรจุภัณฑ์</span>
                  <span>{item.packagingCost.toFixed(2)} บาท</span>
                </div>
                <div className="pt-1 space-y-0.5">
                  <div>
                    <span>ขนส่ง: </span>
                    {item.shippingCompany || (
                      <span className="text-gray-400">(ไม่ระบุ)</span>
                    )}
                  </div>
                  <div>
                    <span>ผู้รับ: </span>
                    {item.receiver || (
                      <span className="text-gray-400">(ไม่ระบุ)</span>
                    )}
                  </div>
                  <div>
                    <span>จังหวัด: </span>
                    {item.province || (
                      <span className="text-gray-400">(ไม่ระบุ)</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between font-semibold text-sm pt-1 border-t">
                  <span>ราคาสุทธิ:</span>
                  <span>{calculateItemTotal(item).toFixed(2)} บาท</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t-2 pt-2 space-y-1">
        <h3>จำนวนพัสดุ: {receiptData.orderList.length} รายการ</h3>
        <h3 className="font-bold text-lg">
          ยอดรวมทั้งหมด: {grandTotal.toFixed(2)} บาท
        </h3>
      </div>
    </div>
  );
}

// ใช้ memo เพื่อป้องกัน re-render ที่ไม่จำเป็น
export default memo(ReceiptTemplate);
