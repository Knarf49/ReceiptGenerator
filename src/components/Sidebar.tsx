import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ReceiptData, type OrderItem } from "@/App";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";

export type TemplateType = "postshop" | "noodle";

interface SidebarProps {
  receiptData: ReceiptData;
  updateReceiptData: (field: keyof ReceiptData, value: any) => void;
  template: TemplateType;
  setTemplate: (template: TemplateType) => void;
}

export function Sidebar({ receiptData, updateReceiptData, template, setTemplate }: SidebarProps) {
  const [newItem, setNewItem] = useState({
    name: "",
    shippingCost: 0,
    receiver: "",
    shippingCompany: "",
    otherCost: 0,
    discount: 0,
  });
  const [otherChecked, setOtherChecked] = useState(false);
  const [discountChecked, setDiscountChecked] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Noodle template simple inputs
  const [noodleFood, setNoodleFood] = useState(0);
  const [noodleDessert, setNoodleDessert] = useState(0);

  // Sync noodle inputs with orderList
  useEffect(() => {
    if (template === "noodle") {
      const items: OrderItem[] = [];
      if (noodleFood > 0) {
        items.push({
          id: "food",
          name: "ค่าอาหารและเครื่องดื่ม",
          shippingCost: noodleFood,
          receiver: "",
          shippingCompany: "",
        });
      }
      if (noodleDessert > 0) {
        items.push({
          id: "dessert",
          name: "ค่าขนมหวาน",
          shippingCost: noodleDessert,
          receiver: "",
          shippingCompany: "",
        });
      }
      updateReceiptData("orderList", items);
    }
  }, [template, noodleFood, noodleDessert, updateReceiptData]);

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
                receiver: newItem.receiver,
                shippingCompany: newItem.shippingCompany,
                otherCost: otherChecked ? newItem.otherCost : 0,
                discount: discountChecked ? newItem.discount : 0,
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
        receiver: newItem.receiver,
        shippingCompany: newItem.shippingCompany,
        otherCost: otherChecked ? newItem.otherCost : 0,
        discount: discountChecked ? newItem.discount : 0,
      };
      updateReceiptData("orderList", [...receiptData.orderList, orderItem]);
    }

    setNewItem({
      name: "",
      shippingCost: 0,
      receiver: "",
      shippingCompany: "",
      otherCost: 0,
      discount: 0,
    });
    setOtherChecked(false);
    setDiscountChecked(false);
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
      receiver: item.receiver,
      shippingCompany: item.shippingCompany,
      otherCost: item.otherCost || 0,
      discount: item.discount || 0,
    });
    setOtherChecked((item.otherCost || 0) > 0);
    setDiscountChecked((item.discount || 0) > 0);
    setEditingId(item.id);
  };

  const cancelEdit = () => {
    setNewItem({
      name: "",
      shippingCost: 0,
      receiver: "",
      shippingCompany: "",
      otherCost: 0,
      discount: 0,
    });
    setOtherChecked(false);
    setDiscountChecked(false);
    setEditingId(null);
  };

  return (
    <aside className="w-80 border-l h-full bg-background p-6 space-y-6 overflow-y-auto fixed">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">ข้อมูลใบเสร็จ</h2>
      </div>

      {/* Template Selector */}
      <div className="space-y-2">
        <Label htmlFor="template-select">เลือกแบบฟอร์ม</Label>
        <Select value={template} onValueChange={(value) => setTemplate(value as TemplateType)}>
          <SelectTrigger id="template-select">
            <SelectValue placeholder="เลือกแบบฟอร์ม" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="postshop">เอส 36 โพสท์ ช็อป</SelectItem>
            <SelectItem value="noodle">ร้านก๋วยเตี๋ยวเรือ มุมอร่อย</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea>
        <div className="space-y-4">
          {/* ชื่อลูกค้า */}
          <div className="space-y-2">
            <Label htmlFor="customer-name">ชื่อลูกค้า</Label>
            <Input
              id="customer-name"
              type="text"
              placeholder="ชื่อลูกค้า"
              value={receiptData.customerName}
              onChange={(e) =>
                updateReceiptData("customerName", e.target.value)
              }
            />
          </div>

          {/* รายการสินค้า */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-md font-semibold">รายการสินค้า</h3>

            {template === "noodle" ? (
              // Noodle template - simple inputs
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="noodle-food">ค่าอาหารและเครื่องดื่ม (บาท)</Label>
                  <Input
                    id="noodle-food"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={noodleFood || ""}
                    onChange={(e) => setNoodleFood(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noodle-dessert">ค่าขนมหวาน (บาท)</Label>
                  <Input
                    id="noodle-dessert"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={noodleDessert || ""}
                    onChange={(e) => setNoodleDessert(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            ) : (
              // PostShop template - full order list form
              <>
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

                  <div className="space-y-2">
                    <Label htmlFor="item-shipping">ค่าขนส่ง + บรรจุภัณฑ์ (บาท)</Label>
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
                        <SelectItem value="KEX">KEX</SelectItem>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="SPX">SPX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ผู้รับ */}
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

                  <div className="space-x-3 space-y-2">
                    <Label htmlFor="other-cost">ค่าใช้จ่ายอื่นๆ</Label>
                    <div className="flex items-center gap-x-3">
                      <Checkbox
                        className="cursor-pointer border-primary"
                        checked={otherChecked}
                        onClick={() => setOtherChecked(!otherChecked)}
                      />
                      <div
                        className={
                          otherChecked == false
                            ? "cursor-not-allowed opacity-40 bg-primary/20 rounded-md"
                            : ""
                        }
                      >
                        <Input
                          id="other-cost"
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="border-primary"
                          disabled={!otherChecked}
                          value={newItem.otherCost || ""}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              otherCost: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-x-3 space-y-2">
                    <Label htmlFor="discount">ส่วนลด</Label>
                    <div className="flex items-center gap-x-3">
                      <Checkbox
                        className="cursor-pointer border-primary"
                        checked={discountChecked}
                        onClick={() => setDiscountChecked(!discountChecked)}
                      />
                      <div
                        className={
                          discountChecked == false
                            ? "cursor-not-allowed opacity-40 bg-primary/20 rounded-md"
                            : ""
                        }
                      >
                        <Input
                          id="discount"
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="border-primary"
                          disabled={!discountChecked}
                          value={newItem.discount || ""}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              discount: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
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
                                <p className="font-semibold text-gray-800">
                                  ค่าขนส่ง + บรรจุภัณฑ์: {item.shippingCost.toFixed(2)} บาท
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
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
