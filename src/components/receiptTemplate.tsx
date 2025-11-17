import { memo, useMemo } from "react";
import { type ReceiptData } from "@/App";

interface ReceiptTemplateProps {
  receiptData: ReceiptData;
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

  // สร้างเลขที่ใบเสร็จและวันที่ - คำนวณครั้งเดียวตอน mount
  const dateInfo = useMemo(() => {
    const currentDate = new Date();
    const receiptNumber = `S36_${currentDate.getFullYear()}${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}${String(currentDate.getDate()).padStart(2, "0")}`;

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
  }, []); // Empty dependency = คำนวณครั้งเดียว

  const { productTotal, totalShipping, totalPackaging, grandTotal } = totals;
  const { receiptNumber, formattedDate, formattedTime } = dateInfo;
  return (
    <div className="w-[80mm] h-fit mx-auto border px-4 py-6 space-y-2">
      <h1 className="font-bold w-full text-center py-4">ใบเสร็จชำระเงิน</h1>
      <h1 className="font-bold w-full text-center">ร้าน S36 โพสต์ ช็อป</h1>
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
                  <span>รวมรายการนี้:</span>
                  <span>{calculateItemTotal(item).toFixed(2)} บาท</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t-2 pt-2 space-y-1 mt-2">
        <div className="flex justify-between text-sm">
          <span>รวมค่าสินค้า:</span>
          <span>{productTotal.toFixed(2)} บาท</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>รวมค่าขนส่ง:</span>
          <span>{totalShipping.toFixed(2)} บาท</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>รวมค่าบรรจุภัณฑ์:</span>
          <span>{totalPackaging.toFixed(2)} บาท</span>
        </div>
      </div>

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
