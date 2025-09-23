import useServicePage from "@/hook/useServicePage";
import useServicePlanQuery from "@/react-query/services/useServicePlanQueries";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices, {
	useServiceAction,
	IServicePlan,
} from "@/zustand/useServices";
import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
} from "@material-ui/core";
import React, { useEffect } from "react";

interface IProps {
	options?: IServicePlan[];
}
const GroupSelectServiceDate = (props: IProps) => {
	const { selectedPlan, selectedOpt } = useServices();
	const { selectPlan } = useServiceAction();
	const { data: planOptions, isPending } = useServicePlanQuery();

	const currentSelection =
		selectedPlan || selectedOpt || (planOptions?.[0] as IServicePlan);

	useEffect(() => {
		if (planOptions) {
			selectPlan(planOptions?.[0] as IServicePlan);
		}
	}, [planOptions]);

	if (isPending) {
		return (
			<div className="w-full grid grid-cols-2 gap-2">
				{Array.from({ length: 2 }).map((_, idx) => (
					<div
						key={idx}
						className="h-40 bg-white rounded-md p-4 flex flex-col justify-between shadow relative">
						<div>
							<div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded mb-2" />
							<div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded mb-4" />
						</div>
						<div>
							<div className="h-5 w-1/4 bg-gray-200 animate-pulse rounded mb-1" />
							<div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
						</div>
						<div className="absolute top-4 right-4">
							<div className="w-6 h-6 border-2 border-gray-300 rounded-full animate-pulse" />
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={`w-full relative`} id="service-plan-selection">
			<FormControl
				className={`grid grid-cols-${planOptions?.length} gap-2`}>
				{planOptions?.map((option, index) => (
					<RadioGroup
						key={index}
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue={planOptions?.[0]?.planId}
						defaultChecked={
							option.planId === currentSelection?.planId
						}
						name="radio-buttons-group">
						<Wrapper
							option={option as unknown as IServicePlan}
							key={index}>
							<FormControlLabel
								checked={
									option.planId === currentSelection?.planId
								}
								value={option.planId}
								control={<Radio className="p-0" />}
								label=""
								classes={{
									root: "mr-0",
								}}
								onChange={() => {
									selectPlan(
										option as unknown as IServicePlan
									);
								}}
							/>
						</Wrapper>
					</RadioGroup>
				))}
			</FormControl>
		</div>
	);
};

export default GroupSelectServiceDate;

const Wrapper = ({
	children,
	option,
	onClick,
}: {
	children: React.ReactNode;
	option: IServicePlan;
	onClick?: () => void;
}) => {
	const { selectedPlan, selectedOpt } = useServices();
	const { selectPlan } = useServiceAction();
	const { calculateExpectedPlan } = useServicePage();

	// Use new selectedPlan or fallback to legacy selectedOpt
	const currentSelection = selectedPlan || selectedOpt;

	return (
		<div
			className={`w-full min-h-[160px] rounded-xl p-4 border-2 shadow-lg bg-gray-100 flex flex-col justify-between cursor-pointer hover:border-blue-500 hover:shadow-lg ${
				option.planId === currentSelection?.planId
					? "border-blue-700"
					: ""
			}`}
			onClick={() => selectPlan(option)}>
			<div className="flex justify-between items-center">
				<span className="text-lg font-bold">{option.name}</span>
				{children}
			</div>
			<div className="text-sm">{option.description}</div>
			<div className="flex justify-between items-end mt-auto">
				<div className="flex flex-col">
					<strong>Dự kiến</strong>
					{/* <span className="font-bold">
						{calculateExpectedPlan(option.min, option.max).minDate}{" "}
						~{" "}
						{calculateExpectedPlan(option.min, option.max).maxDate}
					</span> */}
					<span>
						Từ {option.min} ~ {option.max} ngày làm việc
					</span>
				</div>
				<span className="font-bold text-[24px]">
					{option.price > 0 ? formatCurrency(option.price) : ""}
				</span>
			</div>
		</div>
	);
};
