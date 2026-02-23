import { Button } from '@/components/ReUIComponent/Button'
import { useAuth } from '@/context/Auth'
import { Plus } from 'lucide-react'
import React from 'react'

const Addresses: React.FC = () => {
  const auth = useAuth()
  const { user } = auth || {}
  const addresses = user?.shippingAt || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-400 pb-2">
        <h2 className="font-bold text-xl">Sổ địa chỉ</h2>
        <Button disabled className="bg-blue-600 text-white">
          <Plus className="stroke-white stroke-2! mr-2" size={18} />
          <span className="font-bold text-white text-sm">Thêm mới</span>
        </Button>
      </div>
      {addresses.length === 0 ? (
        <div className="text-gray-500">Không có địa chỉ nào.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {addresses.map((addr, idx) => (
            <div key={idx} className="border-2 border-dashed rounded p-4 bg-white space-y-1 relative w-full">
              <div className="flex gap-2 items-center justify-between">
                {addr.isDefault && <span className="font-bold px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded">Mặc định</span>}
                <Button className="ml-auto" disabled>
                  Thay đổi
                </Button>
              </div>
              <div className="pl-2">
                <div className="font-semibold capitalize">
                  {addr.firstName} {addr.lastName}
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-700 text-sm">
                    +84&nbsp;
                    {addr.phoneNumber}
                  </div>
                  <span className="text-sm text-gray-700">
                    {addr.address} {addr.city} Việt Nam
                  </span>
                  {addr.companyName && <span className="text-gray-700 text-sm">{addr.companyName}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Addresses
