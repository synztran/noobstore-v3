import { formatCurrency } from "@/utils/FormatNumber";
import { Divider } from "@material-ui/core";
import { useFormikContext } from "formik";
import React from "react";

const BillInformation: React.FC<{
	orderInfo?: {
		totalPrice: number;
		fees: {
			shipping: number;
		};
	};
}> = ({ orderInfo }) => {
	const finalPrice =
		(orderInfo?.totalPrice || 0) + (orderInfo?.fees?.shipping || 0) - 0;
	return (
		<div className="flex flex-col gap-2 mt-4">
			<Divider />
			<div className="flex flex-col gap-2 py-2">
				<div className="flex justify-between text-sm">
					<span>Tạm tính</span>
					<span className="text-base font-semibold">
						{formatCurrency(orderInfo?.totalPrice || 0)}
					</span>
				</div>
				<div className="flex justify-between text-sm">
					<span>Phí vận chuyển</span>
					<span className="text-base font-semibold">
						{(orderInfo?.fees?.shipping || 0) > 0
							? formatCurrency(orderInfo?.fees?.shipping || 0)
							: "Miễn phí"}
					</span>
				</div>
				{false ? (
					<div className="flex justify-between">
						<span>Giảm giá</span>
						<span>{formatCurrency(0)}</span>
					</div>
				) : null}
			</div>
			<Divider />
			<div className="flex justify-between py-2">
				<span className="text-base font-bold">Tổng cộng</span>
				<span className="text-lg font-bold">
					{formatCurrency(finalPrice || 0)}
				</span>
			</div>
		</div>
	);
};

export default BillInformation;
