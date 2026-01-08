import Image from "next/image";
import { formatCurrency } from "@/utils/FormatNumber";
import { I3D_CREDIT_CARD } from "@/constants/Images";
import { format } from "path";
import { Divider } from "@mui/material";

interface IProps {
  title: string;
  paymentDescription: string;
  firstDueDate: string;
  installmentAmount?: number;
  installments?: number;
  arp: number;
  total: number;
  paymentIcon?: string;
  onFinanceClick?: () => void;
}

const FinancingCard = ({
  title,
  paymentDescription,
  firstDueDate,
  installmentAmount,
  installments,
  arp,
  total,
  paymentIcon,
  onFinanceClick,
}: IProps) => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 p-4 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-2">
      {/* Header with title and icon */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 font-semibold text-xs">
            {paymentDescription}
          </p>
        </div>
        {paymentIcon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-16 h-10 relative">
              <Image
                src={I3D_CREDIT_CARD}
                alt="Payment method"
                fill
                className="object-contain scale-150"
              />
            </div>
          </div>
        )}
      </div>
      <Divider />

      {/* Details Section */}
      <div className="space-y-2 border-b border-gray-200 pb-2">
        {/* First Due Date */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Ngày thanh toán</span>
          <span className="text-gray-800 font-semibold">{firstDueDate}</span>
        </div>

        {/* Installment Amount */}
        {/* <div className="flex justify-between items-center">
					<span className="text-gray-600 font-medium">
						Installment amount
					</span>
					<span className="text-gray-800 font-semibold">
						{formatCurrency(installmentAmount)}
					</span>
				</div> */}

        {/* Number of Installments */}
        {/* <div className="flex justify-between items-center">
					<span className="text-gray-600 font-medium">
						Installments
					</span>
					<span className="text-gray-800 font-semibold">
						{installments}
					</span>
				</div> */}

        {/* ARP */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Tỉ lệ thanh toán</span>
          <span className="text-gray-800 font-semibold">100%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Vận chuyển</span>
          <span className="text-gray-800 font-semibold">Miễn phí</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Ủng hộ Maker</span>
          <span className="text-gray-800 font-semibold">
            {formatCurrency(total - Math.floor(total))}
          </span>
        </div>
      </div>

      {/* Total Section */}
      <div className="mb-6">
        <p className="text-gray-600 font-medium text-sm">
          Tổng tiền thanh toán
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">
            {formatCurrency(Math.floor(total))}
          </span>
        </div>
      </div>

      {/* Finance Button */}
      <button
        onClick={onFinanceClick}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg text-lg"
      >
        Thanh toán
      </button>
    </div>
  );
};

export default FinancingCard;
