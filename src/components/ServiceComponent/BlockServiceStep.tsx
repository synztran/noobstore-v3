import { CircularProgress } from "@mui/material";
import React from "react";

const serviceSteps = [
	{ key: "SAS", label: "Thiết lập dịch vụ", value: 1 },
	{ key: "PAYMENT", label: "Thanh toán", value: 2 },
	{ key: "CHECKING", label: "Kiểm tra", value: 3 },
	{ key: "CONFIRMED", label: "Xác nhận", value: 4 },
];

export const BlockServiceStep: React.FC<{ currentStep: number }> = ({
	currentStep,
}) => {
	return (
		<div className="flex items-center justify-between w-full border border-gray-200 rounded-md px-4 pt-4 pb-8 bg-white shadow-md">
			{serviceSteps.map((step, idx) => (
				<React.Fragment key={step.key}>
					<div className="flex flex-col items-center w-28 relative">
						<div
							className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all
                ${
					step.value < currentStep
						? "bg-green-500 text-white shadow"
						: step.value === currentStep
						? "bg-blue-500 text-white shadow-lg scale-105"
						: "bg-gray-200 text-gray-600"
				}
              `}>
							{step.value < currentStep ? "✓" : step.value}
							{/* {step.value === currentStep ? (
								<CircularProgress
									size={18}
									classes={{
										circle: "!stroke-white",
									}}
								/>
							) : null}
							{step.value > currentStep ? step.value : null} */}
						</div>

						<div
							className={`absolute -bottom-6 text-center text-sm font-semibold ${
								step.value < currentStep
									? "text-green-600"
									: step.value === currentStep
									? "text-blue-700"
									: "text-gray-500"
							}`}>
							{step.label}
						</div>
					</div>

					{idx < serviceSteps.length - 1 && (
						<div
							className={`flex-1 h-1 mx-1 rounded ${
								step.value < currentStep
									? "bg-green-500"
									: "bg-gray-200"
							}`}></div>
					)}
				</React.Fragment>
			))}
		</div>
	);
};

export default BlockServiceStep;
