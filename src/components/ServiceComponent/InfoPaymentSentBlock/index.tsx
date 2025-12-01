import {
	mappingLabelPaymentForm,
	mappingLabelPaymentMethod,
	mappingLabelServiceType,
} from "@/constants";
import {
	IResponseBackendService,
	IResponseBackendServiceBooking,
} from "@/interface/Client/Service";
import { EnumPaymentForm, EnumPaymentMethod } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";

interface IProps {
	service: IResponseBackendServiceBooking;
}

const InfoPaymentSentBlock = ({ service }: IProps) => {
	if (!service.payment.submittedAt) return null;

	const { label: labelPaymentMethod, icon: iconPaymentMethod = "" } =
		mappingLabelPaymentMethod?.[
			service?.payment?.paymentMethod || EnumPaymentMethod.NOT_FOUND
		] || {
			label: "Phương thức không xác định",
		};

	const { label: labelPaymentForm, icon: iconPaymentForm = "" } =
		mappingLabelPaymentForm?.[
			service?.payment?.paymentForm || EnumPaymentForm.NOT_FOUND
		] || {
			label: "Hình thức không xác định",
			icon: "",
		};

	return (
		<div className="relative space-y-4">
			<div className="flex justify-between items-center bg-gray-200 rounded-lg p-4 border border-gray-300">
				<div className="font-bold">Phương thức thanh toán</div>
				<div className="flex items-center gap-2 bg-gray-400 px-2 py-1 rounded-lg">
					{iconPaymentMethod ? (
						<div className="w-8 h-8 relative">
							<Image
								src={iconPaymentMethod}
								alt={labelPaymentMethod}
								fill
								objectFit="contain"
								draggable={false}
								className={`${
									iconPaymentMethod ? "" : "sr-only"
								}`}
							/>
						</div>
					) : null}
					<span className="text-sm font-bold">
						{labelPaymentMethod}
					</span>
				</div>
			</div>
			<div className="flex justify-between items-center bg-gray-200 rounded-lg p-4 border border-gray-300">
				<div className="font-bold">Hình thức thanh toán</div>
				<div className="flex items-center gap-2">
					<span className="p-2 rounded-lg bg-red-400 text-white font-bold text-xs">
						{labelPaymentForm}
					</span>
					<span className="text-sm font-bold">
						{formatCurrency(service?.payment?.paidAmount)}
					</span>
				</div>
			</div>
			{/* Donation */}
			{service?.donation ? (
				<div className="flex justify-between items-center bg-gray-200 rounded-lg p-4 border border-gray-300">
					<div className="font-bold">Ủng hộ</div>
					<div className="flex items-center gap-2">
						<span className="bg-red-400 rounded-lg p-2 text-xs text-white font-bold">
							{service?.donation?.donationPercentage * 100}%
						</span>
						<span className="text-sm font-bold">
							{formatCurrency(service?.donation?.donationAmount)}
						</span>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default InfoPaymentSentBlock;
