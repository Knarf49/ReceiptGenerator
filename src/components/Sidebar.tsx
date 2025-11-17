import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {type ReceiptData,type OrderItem } from "@/App";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  receiptData: ReceiptData;
  updateReceiptData: (field: keyof ReceiptData, value: any) => void;
}

export function Sidebar({ receiptData, updateReceiptData }: SidebarProps) {
  const [newItem, setNewItem] = useState({
    name: "",
    shippingCost: 0,
    packagingCost: 0,
    receiver: "",
    shippingCompany: "",
    province: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const addOrderItem = () => {
    if (!newItem.name) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (editingId) {
      // Update existing item
      updateReceiptData(
        "orderList",
        receiptData.orderList.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: newItem.name,
                shippingCost: newItem.shippingCost,
                packagingCost: newItem.packagingCost,
                receiver: newItem.receiver,
                shippingCompany: newItem.shippingCompany,
                province: newItem.province,
              }
            : item
        )
      );
      setEditingId(null);
    } else {
      // Add new item
      const orderItem: OrderItem = {
        id: Date.now().toString(),
        name: newItem.name,
        shippingCost: newItem.shippingCost,
        packagingCost: newItem.packagingCost,
        receiver: newItem.receiver,
        shippingCompany: newItem.shippingCompany,
        province: newItem.province,
      };
      updateReceiptData("orderList", [...receiptData.orderList, orderItem]);
    }

    setNewItem({
      name: "",
      shippingCost: 0,
      packagingCost: 0,
      receiver: "",
      shippingCompany: "",
      province: "",
    });
  };

  const removeOrderItem = (id: string) => {
    updateReceiptData(
      "orderList",
      receiptData.orderList.filter((item) => item.id !== id)
    );
  };

  const editOrderItem = (item: OrderItem) => {
    setNewItem({
      name: item.name,
      shippingCost: item.shippingCost,
      packagingCost: item.packagingCost,
      receiver: item.receiver,
      shippingCompany: item.shippingCompany,
      province: item.province,
    });
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setNewItem({
      name: "",
      shippingCost: 0,
      packagingCost: 0,
      receiver: "",
      shippingCompany: "",
      province: "",
    });
    setEditingId(null);
  };

  return (
    <aside className="w-80 border-l h-full bg-background p-6 space-y-6 overflow-y-auto">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">ข้อมูลใบเสร็จ</h2>
      </div>

      <div className="space-y-4">
        {/* ชื่อลูกค้า */}
        <div className="space-y-2">
          <Label htmlFor="customer-name">ชื่อลูกค้า</Label>
          <Input
            id="customer-name"
            type="text"
            placeholder="ชื่อลูกค้า"
            value={receiptData.customerName}
            onChange={(e) => updateReceiptData("customerName", e.target.value)}
          />
        </div>

        {/* รายการสินค้า */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-md font-semibold">รายการสินค้า</h3>

          {/* Form เพิ่ม/แก้ไขสินค้า */}
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            {editingId && (
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-sm font-medium text-blue-600">
                  กำลังแก้ไขรายการ
                </span>
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
                  ยกเลิก
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="item-name">ชื่อสินค้า</Label>
              <Input
                id="item-name"
                type="text"
                placeholder="ชื่อสินค้า"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="item-shipping">ค่าขนส่ง (บาท)</Label>
                <Input
                  id="item-shipping"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={newItem.shippingCost || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      shippingCost: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-packaging">ค่าบรรจุภัณฑ์ (บาท)</Label>
                <Input
                  id="item-packaging"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={newItem.packagingCost || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      packagingCost: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* บริษัทขนส่ง */}
            <div className="space-y-2">
              <Label htmlFor="item-shipping-company">บริษัทขนส่ง</Label>
              <Select
                value={newItem.shippingCompany}
                onValueChange={(value) =>
                  setNewItem({ ...newItem, shippingCompany: value })
                }
              >
                <SelectTrigger id="item-shipping-company">
                  <SelectValue placeholder="เลือกบริษัทขนส่ง" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="ไปรษณีย์ไทย">ไปรษณีย์ไทย</SelectItem>
                  <SelectItem value="Flash Express">Flash Express</SelectItem>
                  <SelectItem value="Kerry Express">Kerry Express</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ผู้รับและจังหวัด */}
            <div className="space-y-2">
              <Label htmlFor="item-receiver">ผู้รับ</Label>
              <Input
                id="item-receiver"
                type="text"
                placeholder="ชื่อผู้รับ"
                value={newItem.receiver}
                onChange={(e) =>
                  setNewItem({ ...newItem, receiver: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-province">จังหวัด</Label>
              <Select
                value={newItem.province}
                onValueChange={(value) =>
                  setNewItem({ ...newItem, province: value })
                }
              >
                <SelectTrigger id="item-province">
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60">
                  <SelectItem value="กรุงเทพมหานคร">กรุงเทพมหานคร</SelectItem>
                  <SelectItem value="กระบี่">กระบี่</SelectItem>
                  <SelectItem value="กาญจนบุรี">กาญจนบุรี</SelectItem>
                  <SelectItem value="กาฬสินธุ์">กาฬสินธุ์</SelectItem>
                  <SelectItem value="กำแพงเพชร">กำแพงเพชร</SelectItem>
                  <SelectItem value="ขอนแก่น">ขอนแก่น</SelectItem>
                  <SelectItem value="จันทบุรี">จันทบุรี</SelectItem>
                  <SelectItem value="ฉะเชิงเทรา">ฉะเชิงเทรา</SelectItem>
                  <SelectItem value="ชลบุรี">ชลบุรี</SelectItem>
                  <SelectItem value="ชัยนาท">ชัยนาท</SelectItem>
                  <SelectItem value="ชัยภูมิ">ชัยภูมิ</SelectItem>
                  <SelectItem value="ชุมพร">ชุมพร</SelectItem>
                  <SelectItem value="เชียงราย">เชียงราย</SelectItem>
                  <SelectItem value="เชียงใหม่">เชียงใหม่</SelectItem>
                  <SelectItem value="ตรัง">ตรัง</SelectItem>
                  <SelectItem value="ตราด">ตราด</SelectItem>
                  <SelectItem value="ตาก">ตาก</SelectItem>
                  <SelectItem value="นครนายก">นครนายก</SelectItem>
                  <SelectItem value="นครปฐม">นครปฐม</SelectItem>
                  <SelectItem value="นครพนม">นครพนม</SelectItem>
                  <SelectItem value="นครราชสีมา">นครราชสีมา</SelectItem>
                  <SelectItem value="นครศรีธรรมราช">นครศรีธรรมราช</SelectItem>
                  <SelectItem value="นครสวรรค์">นครสวรรค์</SelectItem>
                  <SelectItem value="นนทบุรี">นนทบุรี</SelectItem>
                  <SelectItem value="นราธิวาส">นราธิวาส</SelectItem>
                  <SelectItem value="น่าน">น่าน</SelectItem>
                  <SelectItem value="บึงกาฬ">บึงกาฬ</SelectItem>
                  <SelectItem value="บุรีรัมย์">บุรีรัมย์</SelectItem>
                  <SelectItem value="ปทุมธานี">ปทุมธานี</SelectItem>
                  <SelectItem value="ประจวบคีรีขันธ์">
                    ประจวบคีรีขันธ์
                  </SelectItem>
                  <SelectItem value="ปราจีนบุรี">ปราจีนบุรี</SelectItem>
                  <SelectItem value="ปัตตานี">ปัตตานี</SelectItem>
                  <SelectItem value="พระนครศรีอยุธยา">
                    พระนครศรีอยุธยา
                  </SelectItem>
                  <SelectItem value="พังงา">พังงา</SelectItem>
                  <SelectItem value="พัทลุง">พัทลุง</SelectItem>
                  <SelectItem value="พิจิตร">พิจิตร</SelectItem>
                  <SelectItem value="พิษณุโลก">พิษณุโลก</SelectItem>
                  <SelectItem value="เพชรบุรี">เพชรบุรี</SelectItem>
                  <SelectItem value="เพชรบูรณ์">เพชรบูรณ์</SelectItem>
                  <SelectItem value="แพร่">แพร่</SelectItem>
                  <SelectItem value="พะเยา">พะเยา</SelectItem>
                  <SelectItem value="ภูเก็ต">ภูเก็ต</SelectItem>
                  <SelectItem value="มหาสารคาม">มหาสารคาม</SelectItem>
                  <SelectItem value="มุกดาหาร">มุกดาหาร</SelectItem>
                  <SelectItem value="แม่ฮ่องสอน">แม่ฮ่องสอน</SelectItem>
                  <SelectItem value="ยะลา">ยะลา</SelectItem>
                  <SelectItem value="ยโสธร">ยโสธร</SelectItem>
                  <SelectItem value="ร้อยเอ็ด">ร้อยเอ็ด</SelectItem>
                  <SelectItem value="ระนอง">ระนอง</SelectItem>
                  <SelectItem value="ระยอง">ระยอง</SelectItem>
                  <SelectItem value="ราชบุรี">ราชบุรี</SelectItem>
                  <SelectItem value="ลพบุรี">ลพบุรี</SelectItem>
                  <SelectItem value="ลำปาง">ลำปาง</SelectItem>
                  <SelectItem value="ลำพูน">ลำพูน</SelectItem>
                  <SelectItem value="เลย">เลย</SelectItem>
                  <SelectItem value="ศรีสะเกษ">ศรีสะเกษ</SelectItem>
                  <SelectItem value="สกลนคร">สกลนคร</SelectItem>
                  <SelectItem value="สงขลา">สงขลา</SelectItem>
                  <SelectItem value="สตูล">สตูล</SelectItem>
                  <SelectItem value="สมุทรปราการ">สมุทรปราการ</SelectItem>
                  <SelectItem value="สมุทรสงคราม">สมุทรสงคราม</SelectItem>
                  <SelectItem value="สมุทรสาคร">สมุทรสาคร</SelectItem>
                  <SelectItem value="สระแก้ว">สระแก้ว</SelectItem>
                  <SelectItem value="สระบุรี">สระบุรี</SelectItem>
                  <SelectItem value="สิงห์บุรี">สิงห์บุรี</SelectItem>
                  <SelectItem value="สุโขทัย">สุโขทัย</SelectItem>
                  <SelectItem value="สุพรรณบุรี">สุพรรณบุรี</SelectItem>
                  <SelectItem value="สุราษฎร์ธานี">สุราษฎร์ธานี</SelectItem>
                  <SelectItem value="สุรินทร์">สุรินทร์</SelectItem>
                  <SelectItem value="หนองคาย">หนองคาย</SelectItem>
                  <SelectItem value="หนองบัวลำภู">หนองบัวลำภู</SelectItem>
                  <SelectItem value="อ่างทอง">อ่างทอง</SelectItem>
                  <SelectItem value="อำนาจเจริญ">อำนาจเจริญ</SelectItem>
                  <SelectItem value="อุดรธานี">อุดรธานี</SelectItem>
                  <SelectItem value="อุตรดิตถ์">อุตรดิตถ์</SelectItem>
                  <SelectItem value="อุทัยธานี">อุทัยธานี</SelectItem>
                  <SelectItem value="อุบลราชธานี">อุบลราชธานี</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addOrderItem} className="w-full">
              {editingId ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
            </Button>
          </div>

          {/* รายการสินค้าที่เพิ่มแล้ว */}
          {receiptData.orderList.length > 0 && (
            <div className="space-y-2">
              <Label>สินค้าในรายการ ({receiptData.orderList.length})</Label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {receiptData.orderList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border rounded space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <div className="text-xs text-gray-600 space-y-0.5 mt-1">
                          <p>ค่าขนส่ง: {item.shippingCost.toFixed(2)} บาท</p>
                          <p>
                            ค่าบรรจุภัณฑ์: {item.packagingCost.toFixed(2)} บาท
                          </p>
                          <p className="font-semibold text-gray-800">
                            รวม:{" "}
                            {(item.shippingCost + item.packagingCost).toFixed(
                              2
                            )}{" "}
                            บาท
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => editOrderItem(item)}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => removeOrderItem(item.id)}
                      >
                        ลบ
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
