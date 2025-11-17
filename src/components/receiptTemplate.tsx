export default function receiptTemplate() {
  return (
    <div className="w-[80mm]">
      <h1>ใบเสร็จรับเงิน</h1>
      <div className="flex">
        <p>Print Time: (current date)</p>
        <p>เลขที่ S36_Date</p>
      </div>

      <h3>ลูกค้า (customer name)</h3>
      <div className="flex flex-row">{/* map order list */}</div>

      <h3>ขนส่ง: (from select ขนส่ง)</h3>
      <h3>ผู้รับ: (from input ผู้รับ)</h3>
      <h3>จังหวัด: (from input จังหวัด)</h3>

      <h3>ค่าขนส่ง: (from input ค่าขนส่ง)</h3>
      <h3>ค่าบรรจุภัณฑ์: (from input ค่าบรรจุภัณฑ์)</h3>
      <h3>ราคาสุทธิ: (from ค่าขนส่ง + ค่าบรรจุภัณฑ์)</h3>

      <h3>จำนวนพัสดุ: (from orderlist.length)</h3>
      <h3>ยอดรวมทั้งหมด: (ราคาสุทธิแต่ละอันใน orderlist รวมกัน)</h3>

    </div>
  );
}
