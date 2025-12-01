import {
	serviceFormText,
	tempSwitchStatusOptions,
	tempSwitchTypeOptions,
} from "@/constants";
import useSelectedOption from "@/hook/useSelectedOption";
import {
	EnumServiceType,
	EnumSwitchStatus,
	EnumUnitType,
	EnumUploadStatus,
} from "@/interface/interface";
import useServiceTaskQuery from "@/react-query/services/api/useServiceTaskQueries";
import { mapServiceTasksToOptions } from "@/utils/Data";
import useServices, {
	ISwitchFormItem,
	useServiceAction,
} from "@/zustand/useServices";
import React, { useCallback, useEffect, useRef } from "react";
import CheckboxWithPrice from "../InputComponents/CheckboxWithPrice";
import SimpleTextField from "../InputComponents/SimpleTextField";
import UploadImage from "../InputComponents/UploadImage";
import type { IOptionSelection } from "../SelectComp";
import SearchableSelect from "../SelectComp";

interface IProps {
	serviceType: EnumServiceType;
	itemId?: string;
	value: ISwitchFormItem;
}

const ServicesSwitchesForm: React.FC<IProps> = (props: IProps) => {
	const { serviceType, itemId } = props;
	const { title, subTitle } = serviceFormText?.[serviceType];
	const { data: serviceTasks } = useServiceTaskQuery();
	const { switchItems } = useServices();
	const { updateSwitchItem, resetTaskItem } = useServiceAction();

	const apiOptions = React.useMemo(() => {
		let currentSwitchItem: ISwitchFormItem | undefined = undefined;
		if (itemId && switchItems && switchItems.length > 0) {
			const item = switchItems.find((item) => item.id === itemId);
			currentSwitchItem = item;
		}
		return mapServiceTasksToOptions({
			serviceTasks: serviceTasks || [],
			switchItem: currentSwitchItem,
		});
	}, [serviceTasks, switchItems, itemId]);

	const {
		switchOptions,
		serviceOptions,
		updateSwitchServicePrices,
		updateServiceOptions,
	} = useSelectedOption({
		initialSwitchTypeOptions: tempSwitchTypeOptions as IOptionSelection[],
		initialSwitchStatusOptions:
			tempSwitchStatusOptions as IOptionSelection[],
		initialServicePrices: {
			switch: {
				lube: apiOptions.servicePrices["switch"]["lube"] || null,
				film: apiOptions.servicePrices["switch"]["film"] || null,
				spring: apiOptions.servicePrices["switch"]["spring"] || null,
				clean: apiOptions.servicePrices["switch"]["clean"] || null,
				quickClean:
					apiOptions.servicePrices["switch"]["quickClean"] || null,
			},
		},
	});

	useEffect(() => {
		updateSwitchServicePrices({
			lube: apiOptions.servicePrices["switch"]["lube"],
			clean: apiOptions.servicePrices["switch"]["clean"],
			quickClean: apiOptions.servicePrices["switch"]["quickClean"],
			film: apiOptions.servicePrices["switch"]["film"],
			spring: apiOptions.servicePrices["switch"]["spring"],
		});
		updateServiceOptions({
			keyboard: apiOptions.servicePrices?.keyboard,
			switch: apiOptions.servicePrices?.switch,
			stabilizer: apiOptions.servicePrices?.stabilizer,
		});
	}, [apiOptions]);

	console.log("serviceOptions", serviceOptions);

	const handleSwitchChecked = ({
		name,
		value,
	}: {
		name: "lube" | "film" | "clean" | "spring" | "quickClean";
		value: boolean;
	}) => {
		console.log("checked", name, value);

		const switchServiceOption = serviceOptions?.switch?.[name];
		const { price = 0, unitPrice = 0 } = switchServiceOption || {};

		if (itemId) {
			updateSwitchItem(itemId, {
				services: {
					...props.value.services,
					[name]: {
						isUse: value,
						price: value ? price : 0,
						name,
						unitPrice,
					},
				},
			} as Partial<ISwitchFormItem>);
		}
	};

	const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
	const handleTextChange = ({
		name,
		value,
	}: {
		name: string;
		value: string | number;
	}) => {
		if (debounceRef.current[name]) {
			clearTimeout(debounceRef.current[name]);
		}
		debounceRef.current[name] = setTimeout(() => {
			if (itemId) {
				updateSwitchItem(itemId, {
					[name]: value,
				} as any);
			}
		}, 300);
	};

	const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (itemId) {
			updateSwitchItem(itemId, { note: e.target.value } as any);
		}
	};

	const handleSwitchSelect = useCallback(
		({
			name,
			option,
		}: {
			name: string;
			option: IOptionSelection | null;
		}) => {
			if (!itemId || !name) return;
			const payload: Partial<ISwitchFormItem> = {
				[name]: option?.value || "",
			};
			updateSwitchItem(itemId, payload);
			resetTaskItem(itemId, "switchItems");
		},
		[itemId]
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col">
				<div className="text-lg font-bold">{title}</div>
				<small className="text-sm text-gray-600">{subTitle}</small>
			</div>
			<div className="flex gap-4 justify-between">
				<div className="flex flex-col gap-2 w-full">
					<div className="flex gap-1 items-center">
						<span className="text-base font-bold min-w-max">
							Thông tin
						</span>
						<div className="w-full border-b border-gray-500" />
					</div>
					<div className="flex flex-col gap-4">
						<SearchableSelect
							name="type"
							label="Loại switch"
							options={switchOptions.type}
							onSelect={handleSwitchSelect}
							placeholder="Tìm, chọn hoặc thêm mới"
							value={props.value.type}
						/>
						<SimpleTextField
							name="quantity"
							label="Số lượng"
							placeholder="Nhập tên số lượng switch"
							onChange={(e) =>
								handleTextChange({
									name: "quantity",
									value: parseInt(e.target.value, 10),
								})
							}
							value={props.value.quantity}
							max={360}
							min={10}
							note="Số lượng tối thiểu là 10 và tối đa là 360"
							type="number"
						/>
						<SearchableSelect
							name="status"
							label="Trạng thái"
							options={switchOptions.status}
							onSelect={handleSwitchSelect}
							placeholder="Tìm, chọn hoặc thêm mới"
							value={props.value.status}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2 w-full">
					<div className="flex gap-1 items-center">
						<span className="text-base font-bold min-w-max">
							Dịch vụ
						</span>
						<div className="w-full border-b border-gray-500" />
					</div>
					{props.value.quantity > 0 &&
					props.value.status &&
					props.value.type ? (
						<div className="flex flex-col gap-4">
							<CheckboxWithPrice
								label={serviceOptions?.switch?.lube?.name || ""}
								price={serviceOptions?.switch?.lube?.price || 0}
								value={
									props.value.services.lube?.isUse || false
								}
								onChange={handleSwitchChecked}
								name="lube"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.lube?.description ||
									""
								}
								unit={EnumUnitType.UNIT}
								unitLabel="sw"
								totalPrice={
									props.value.quantity *
									(serviceOptions?.switch?.lube?.price || 0)
								}
							/>
							<CheckboxWithPrice
								label={serviceOptions?.switch?.film?.name || ""}
								price={serviceOptions?.switch?.film?.price || 0}
								value={
									props.value.services.film?.isUse || false
								}
								onChange={handleSwitchChecked}
								name="film"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.film?.description ||
									""
								}
								unit={EnumUnitType.UNIT}
								unitLabel="sw"
								totalPrice={
									props.value.quantity *
									(serviceOptions?.switch?.film?.price || 0)
								}
							/>
							<CheckboxWithPrice
								label={
									serviceOptions?.switch?.spring?.name || ""
								}
								price={
									serviceOptions?.switch?.spring?.price || 0
								}
								value={
									props.value.services.spring?.isUse || false
								}
								onChange={handleSwitchChecked}
								name="spring"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.spring
										?.description || ""
								}
							/>
							<CheckboxWithPrice
								label={
									serviceOptions?.switch?.clean?.name || ""
								}
								price={
									serviceOptions?.switch?.clean?.price || 0
								}
								value={
									props.value.services.clean?.isUse || false
								}
								onChange={handleSwitchChecked}
								name="clean"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.clean
										?.description || ""
								}
								totalPrice={
									props.value.quantity *
									(serviceOptions?.switch?.clean?.price || 0)
								}
							/>
							<CheckboxWithPrice
								label={
									serviceOptions?.switch?.quickClean?.name ||
									""
								}
								price={
									serviceOptions?.switch?.quickClean?.price ||
									0
								}
								value={
									props.value.services.quickClean?.isUse ||
									false
								}
								onChange={handleSwitchChecked}
								name="quickClean"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.quickClean
										?.description || ""
								}
								totalPrice={
									props.value.quantity *
									(serviceOptions?.switch?.quickClean
										?.price || 0)
								}
							/>
						</div>
					) : (
						<WaitOnSelectComp label="Vui lòng lựa chọn loại switch" />
					)}
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex gap-1 items-center">
					<span className="text-base font-bold min-w-max">
						Đính kèm và ghi chú
					</span>
					<div className="w-full border-b border-gray-500" />
				</div>
				<UploadImage
					label="Tải lên hiện trạng của switch"
					subLabel="Bạn có thể tải lên hình ảnh của switch ngay, hoặc shop sẽ liên hệ bạn sau"
					files={props.value.attachments.map((item) => ({
						preview: item.publicUrl || "",
						status: EnumUploadStatus.DONE,
						publicUrl: item.publicUrl || "",
					}))}
					handleSyncData={(
						data: { publicUrl: string; size: number }[]
					) => {
						if (itemId) {
							updateSwitchItem(itemId, {
								attachments: [
									...props.value.attachments,
									...data,
								],
							});
						}
					}}
					max={3}
					isCustomerUpload
					allowMultiple
				/>
				<div className="relative mt-4">
					<label className="absolute -top-3 left-2 bg-white px-2">
						Ghi chú:
					</label>
					<textarea
						name="note"
						id={`${itemId}-note`}
						cols={30}
						rows={5}
						onChange={handleNoteChange}
						value={props.value.note}
						className="border rounded-md p-3 resize-none w-full"
						maxLength={300}
					/>
				</div>
			</div>
		</div>
	);
};

export default ServicesSwitchesForm;

const WaitOnSelectComp = ({ label }: { label: string }) => {
	return (
		<div className="w-full h-60 bg-gray-300 animate-pulse relative flex flex-col items-center justify-center rounded-lg overflow-hidden my-auto">
			<label className="mt-4 mb-2 text-base font-semibold z-10">
				{label}
			</label>
		</div>
	);
};
