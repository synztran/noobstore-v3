import { useAuth } from "@/context/Auth";
import { Button } from "@/components/ReUIComponent/Button";
import { Plus } from "lucide-react";
import React from "react";

const Addresses: React.FC = () => {
  const auth = useAuth();
  const { user } = auth || {};
  const addresses = user?.shippingAt || [];

  console.log("address", addresses);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-400 pb-2">
        <h2 className="font-bold text-xl">Sổ địa chỉ</h2>
        <Button
          disabled
          size="default"
          variant="default"
          className="bg-blue-600 text-white"
        >
          <Plus className="stroke-white !stroke-2 mr-2" size={18} />
          <span className="font-bold text-white text-sm">Thêm mới</span>
        </Button>
      </div>
      {addresses.length === 0 ? (
        <div className="text-gray-500">Không có địa chỉ nào.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {addresses.map((addr, idx) => (
            <div
              key={idx}
              className="border rounded p-4 bg-white shadow space-y-1 relative w-full"
            >
              <div className="flex gap-2 items-center justify-between">
                {addr.isDefault && (
                  <span className="font-bold px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded">
                    Mặc định
                  </span>
                )}
                <Button
                  variant="outline"
                  className="ml-auto"
                  size="sm"
                  disabled
                >
                  Thay đổi
                </Button>
              </div>
              <div className="pl-2">
                <div className="font-semibold capitalize">
                  {addr.firstName} {addr.lastName}
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-700 text-sm">
                    <span className="bg-sky-500 px-1 rounded-lg text-white font-bold text-sm mr-1">
                      +84
                    </span>
                    {addr.phoneNumber}
                  </div>
                  <span className="text-sm text-gray-700">
                    {addr.address} {addr.city} Việt Nam
                  </span>
                  {addr.companyName && (
                    <span className="text-gray-700 text-sm">
                      {addr.companyName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
