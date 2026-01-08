import React from "react";
import { Divider } from "@mui/material";
import { formatCurrency } from "@/utils/FormatNumber";
import { IResponseBackendServiceBooking } from "@/interface/Client/Service";
import useServices from "@/zustand/useServices";

const SummaryServicePayment: React.FC<{
  service: IResponseBackendServiceBooking;
}> = ({ service }) => {
  const { donation } = service || {};
  console.log("donation", donation);
  console.log("service", service);

  const totalFees = service.fees.reduce((acc, fee) => acc + fee.feeAmount, 0);
  const servicePrice = service?.subTotalPrice - totalFees;

  return (
    <div className="space-y-2">
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-600 font-semibold">
          Chi tiết thanh toán
        </div>
        <div className="flex flex-col gap-1 ml-2">
          <div className="flex justify-between items-center">
            <span className="text-[15px]">Tổng tiền dịch vụ</span>
            <span className="font-bold">{formatCurrency(servicePrice)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[15px]">Phí dịch vụ</span>
            <span className="font-bold">{formatCurrency(totalFees)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Tạm tính</span>
            <span className="font-bold">
              {formatCurrency(service.subTotalPrice)}
            </span>
          </div>
          {donation && donation?.donationAmount ? (
            <div className="flex justify-between items-center">
              <div className="space-x-1">
                <span>Ủng hộ</span>
                <span className="border border-gray-300 shadow-sm rounded-lg px-1 py-0.5 text-xs bg-zinc-100 text-red-400 font-bold">
                  {(donation?.donationPercentage || 0) * 100}%
                </span>
              </div>
              <span className="font-bold">
                {formatCurrency(donation.donationAmount ?? 0)}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between items-center">
            <div className="space-x-1">
              <span>Giảm giá</span>
              {service?.discounts?.map((d, idx) => (
                <span
                  key={idx}
                  className="border border-gray-300 shadow-sm rounded-lg px-1 py-0.5 text-xs bg-zinc-100 text-red-400 font-bold"
                >
                  {d.discountCode}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold">
                -{formatCurrency(service?.totalDiscount ?? 0)}
              </span>
            </div>
          </div>
        </div>

        <Divider />
        <div className="flex justify-between items-center">
          <span>Tổng tiền</span>
          <span className="font-bold">
            {formatCurrency(
              service.totalPrice + (donation?.donationAmount ?? 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryServicePayment;
