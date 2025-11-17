import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Sidebar() {
  return (
    <div className="w-80 border-r h-screen bg-background p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">ข้อมูลการจัดส่ง</h2>
      </div>

      <div className="space-y-4">
        {/* บริษัทที่ขนส่ง */}
        <div className="space-y-2">
          <Label htmlFor="shipping-company">บริษัทที่ขนส่ง</Label>
          <Select>
            <SelectTrigger id="shipping-company">
              <SelectValue placeholder="เลือกบริษัทขนส่ง" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="thailand-post">ไปรษณีย์ไทย</SelectItem>
              <SelectItem value="flash-express">Flash Express</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ค่าจัดส่ง */}
        <div className="space-y-2">
          <Label htmlFor="shipping-cost">ค่าจัดส่ง (บาท)</Label>
          <Input
            id="shipping-cost"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* ราคาซอง */}
        <div className="space-y-2">
          <Label htmlFor="envelope-price">ราคาซอง (บาท)</Label>
          <Input
            id="envelope-price"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* จำนวนพัสดุ */}
        <div className="space-y-2">
          <Label htmlFor="parcel-count">จำนวนพัสดุ</Label>
          <Input
            id="parcel-count"
            type="number"
            placeholder="0"
            min="0"
            step="1"
          />
        </div>
      </div>
    </div>
  );
}
