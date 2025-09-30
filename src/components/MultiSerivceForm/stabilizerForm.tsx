import {
	serviceFormText,
	tempStabilizerMountTypeOptions,
	tempStabilizerOptions,
	tempStabilizerStatusOptions,
	tempStabilizerTypeOptions,
} from "@/constants";
import { EnumServiceType, EnumUploadStatus } from "@/interface/interface";
import React, { useMemo, useEffect, useRef, useCallback } from "react";
import useServices, {
	IStabilizerFormItem,
	useServiceAction,
} from "@/zustand/useServices";
import CheckboxWithPrice from "../InputComponents/CheckboxWithPrice";
import SearchableSelect, { IOptionSelection } from "../SelectComp";
import SimpleTextField from "../InputComponents/SimpleTextField";
import UploadImage from "../InputComponents/UploadImage";
import InputWrapperLegend from "../InputComponents/WrapperLegend";
import useServiceTaskQuery from "@/react-query/services/useServiceTaskQueries";
import { mapServiceTasksToOptions } from "@/utils/Data";
import useSelectedOption from "@/hook/useSelectedOption";
import StabilizerSelection from "./StabilizerSelection";

interface IProps {
	serviceType: EnumServiceType;
	itemId: string;
	value: IStabilizerFormItem;
}

// Use stabilizer options from constants
const defaultStabilizerTypeOptions = tempStabilizerTypeOptions;
const defaultStabilizerMountTypeOptions = tempStabilizerMountTypeOptions;
const defaultStabilizerOptions = tempStabilizerOptions;
const defaultStabilizerStatusOptions = tempStabilizerStatusOptions;

const ServiceStabilizerForm: React.FC<IProps> = (props) => {
	const { serviceType, itemId } = props;
	const { title, subTitle } = serviceFormText?.[serviceType];
	const { stabilizerItems, selectedPlan } = useServices();
	const { updateStabilizerItem, resetTaskItem } = useServiceAction();
	const { data: serviceDefaultTasks, isPending } = useServiceTaskQuery();

	// Map API data to form options
	const apiOptions = useMemo(() => {
		let currentStabilizerItem: IStabilizerFormItem | undefined = undefined;
		if (itemId && stabilizerItems && stabilizerItems.length > 0) {
			const item = stabilizerItems.find((item) => item.id === itemId);
			currentStabilizerItem = item;
		}
		return mapServiceTasksToOptions({
			serviceTasks: serviceDefaultTasks || [],
			stabilizerItem: currentStabilizerItem,
		});
	}, [serviceDefaultTasks, stabilizerItems, itemId]);

	// Use the enhanced useSelectedOption hook for stabilizer forms
	const {
		stabilizerOptions,
		stabilizerFormSelected,
		handleStabilizerSelect,
		handleStabilizerAddNew,
		handleStabilizerServiceCheck,
		updateStabilizerOptions,
		updateStabilizerServicePrices,
		handleChangeOption,
	} = useSelectedOption({
		initialStabilizerOptions: defaultStabilizerOptions,
		initialStabilizerMountTypeOptions: defaultStabilizerMountTypeOptions,
		initialStabilizerTypeOptions: defaultStabilizerTypeOptions,
		initialStabilizerStatusOptions: defaultStabilizerStatusOptions,
		initialServicePrices: {
			lube: apiOptions.servicePrices["stabilizer"]["lube"] || {
				price: 0,
				name: "",
				description: "",
			},
			film: apiOptions.servicePrices["stabilizer"]["film"] || {
				price: 0,
				name: "",
				description: "",
			},
			cleanStabilizer: apiOptions.servicePrices["stabilizer"][
				"clean"
			] || {
				price: 0,
				name: "",
				description: "",
			},
		},
	});

	// Update options when API data changes
	useEffect(() => {
		updateStabilizerOptions({
			stabilizer: defaultStabilizerOptions,
		});
		updateStabilizerServicePrices({
			handle: apiOptions.servicePrices["stabilizer"]["handle"] || {
				price: 0,
				name: "",
				description: "",
			},
			clean: apiOptions.servicePrices["stabilizer"]["clean"] || {
				price: 0,
				name: "",
				description: "",
			},
		});
	}, [apiOptions]);

	const handleSelect = ({
		name = "",
		option,
	}: {
		name: string;
		option: IOptionSelection | null;
	}) => {
		if (!name) return;

		handleStabilizerSelect({ name, option });

		if (itemId) {
			const payload: any = {
				...props.value,
				[name]: option?.value,
			};

			updateStabilizerItem(itemId, payload);
			// when updateKeyboardItem, we will trigger clean tasks
			console.log("reset task");
			resetTaskItem(itemId, "stabilizerItems");
		}
	};

	const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
	const handleTextChange = useCallback(
		({ name, value }: { name: string; value: string }) => {
			if (debounceRef.current[name]) {
				clearTimeout(debounceRef.current[name]);
			}
			debounceRef.current[name] = setTimeout(() => {
				if (itemId) {
					updateStabilizerItem(itemId, {
						[name]: value,
					} as any);
				}
			}, 300);
		},
		[itemId]
	);

	const handleAddNew = ({
		name = "stabilizer",
		newOption,
	}: {
		name: "stabilizer";
		newOption: IOptionSelection;
	}) => {
		handleStabilizerAddNew({ name, newOption });
	};

	const handleChecked = ({
		name,
		value,
	}: {
		name: "handle" | "clean";
		value: boolean;
	}) => {
		const servicePrice = stabilizerFormSelected.services[name].price;
		const serviceName = stabilizerFormSelected.services[name].name;

		handleStabilizerServiceCheck({ name, value });

		if (itemId) {
			updateStabilizerItem(itemId, {
				services: {
					...props.value.services,
					[name as keyof IStabilizerFormItem["services"]]: {
						isUse: value,
						price: value ? servicePrice : 0,
						name: serviceName,
					},
				},
			});
		}
	};

	console.log("stabilizerItems", stabilizerItems);

	if (isPending) {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex flex-col">
					<div className="text-lg font-bold">{title}</div>
					<small className="text-sm text-gray-600">{subTitle}</small>
				</div>
				<WaitOnSelectComp label="Đang tải dữ liệu..." />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col">
				<div className="text-lg font-bold">{title}</div>
				<small className="text-sm text-gray-600">{subTitle}</small>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex gap-1 items-center">
					<span className="text-base font-bold min-w-max">
						Thông tin
					</span>
					<div className="w-full border-b border-gray-500" />
				</div>
				<div className="flex flex-col gap-4 mt-1">
					<SimpleTextField
						name="name"
						label="Hãng"
						placeholder="Nhập tên hãng stabilizer"
						onChange={handleTextChange}
						value={props.value.name || ""}
					/>
					<div className="flex flex-col">
						<div className="flex gap-4">
							<SearchableSelect
								name="type"
								label="Loại stabilizer"
								options={stabilizerOptions.stabilizerType}
								onAddNew={handleAddNew}
								onSelect={handleSelect}
								placeholder="Tìm và chọn"
								value={props.value.type}
							/>
							<SearchableSelect
								name="mountType"
								label="Loại mount"
								options={stabilizerOptions.stabilizerMountType}
								onAddNew={handleAddNew}
								onSelect={handleSelect}
								placeholder="Tìm và chọn"
								value={props.value.mountType}
							/>
						</div>
					</div>
					<SearchableSelect
						name="status"
						label="Trạng thái"
						options={stabilizerOptions.status}
						onSelect={({
							name,
							option,
						}: {
							name: string;
							option: IOptionSelection;
						}) => {
							handleChangeOption({ name, option });
							if (itemId) {
								updateStabilizerItem(itemId, {
									status: option?.value,
								});
							}
						}}
						placeholder="Tìm, chọn hoặc thêm mới"
						value={props.value.status}
					/>
					{/* <SimpleTextField
						name="quantity"
						label="Số lượng"
						placeholder="Nhập số lượng stabilizer"
						onChange={handleTextChange}
						value={props.value.quantity?.toString() || ""}
						max={50}
						min={1}
					/> */}
					<StabilizerSelection
						selectedPlan={selectedPlan?.planId || ""}
						onChange={() => {}}
					/>
				</div>
				<small className="text-sm text-gray-500 ml-1">
					<strong className="text-gray-600">Lưu ý:</strong> Khi thay
					đổi, cần đăng ký lại dịch vụ
				</small>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex gap-1 items-center">
					<span className="text-base font-bold min-w-max">
						Dịch vụ
					</span>
					<div className="w-full border-b border-gray-500" />
				</div>
				{props.value?.type && props.value.quantity > 0 ? (
					<div className="flex flex-col gap-4">
						<CheckboxWithPrice
							label={
								stabilizerFormSelected.services.handle.name ||
								"Cân chỉnh Stabilizer"
							}
							price={stabilizerFormSelected.services.handle.price}
							value={props.value.services?.handle?.isUse || false}
							onChange={handleChecked}
							name="handle"
							containerClassName="justify-between gap-12"
							subLabel={
								stabilizerFormSelected.services.handle
									.description
							}
						/>
						<CheckboxWithPrice
							label={
								stabilizerFormSelected.services.clean.name ||
								"Vệ sinh Stabilizer"
							}
							price={stabilizerFormSelected.services.clean.price}
							value={props.value.services?.clean?.isUse || false}
							onChange={handleChecked}
							name="clean"
							containerClassName="justify-between gap-12"
							subLabel={
								stabilizerFormSelected.services.clean
									.description
							}
						/>
					</div>
				) : (
					<WaitOnSelectComp label="Vui lòng lựa chọn loại stabilizer và số lượng" />
				)}
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex gap-1 items-center">
					<span className="text-base font-bold min-w-max">
						Đính kèm và ghi chú
					</span>
					<div className="w-full border-b border-gray-500" />
				</div>
				<UploadImage
					label="Tải lên hiện trạng stabilizer"
					subLabel="Bạn có thể tải lên hình ảnh của stabilizer ngay, hoặc shop sẽ liên hệ bạn sau"
					files={props.value.attachments.map((item) => ({
						preview: item.publicUrl || "",
						status: EnumUploadStatus.DONE,
						publicUrl: item.publicUrl || "",
					}))}
					handleSyncData={(
						data: { publicUrl: string; size: number }[]
					) => {
						if (itemId) {
							updateStabilizerItem(itemId, {
								attachments: [
									...props.value.attachments,
									...data,
								],
							});
						}
					}}
					allowMultiple
					max={3}
					isCustomerUpload
				/>
				<InputWrapperLegend label="Ghi chú">
					<SimpleTextField
						name="note"
						label=""
						placeholder="Nhập ghi chú"
						onChange={handleTextChange}
						value={props.value.note}
						className="resize-none"
						note="Tối đa 300 ký tự"
						max={300}
						rows={6}
						multiline
					/>
				</InputWrapperLegend>
			</div>
		</div>
	);
};

export default ServiceStabilizerForm;

const WaitOnSelectComp = ({ label }: { label: string }) => {
	return (
		<div className="w-full h-60 bg-gray-300 animate-pulse relative flex flex-col items-center justify-center rounded-lg overflow-hidden my-auto">
			<label className="mt-4 mb-2 text-base font-semibold z-10">
				{label}
			</label>
		</div>
	);
};
