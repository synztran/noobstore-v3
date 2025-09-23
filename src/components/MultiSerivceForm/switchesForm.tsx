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
import { Divider } from "@material-ui/core";
import React, { useCallback, useEffect, useRef } from "react";
import CheckboxWithPrice from "../InputComponents/CheckboxWithPrice";
import SearchableSelect from "../SelectComp";
import type { IOptionSelection } from "../SelectComp";
import useServices, {
	ISwitchFormItem,
	useServiceAction,
} from "@/zustand/useServices";
import UploadImage from "../InputComponents/UploadImage";
import useServiceTaskQuery from "@/react-query/services/useServiceTaskQueries";
import { mapServiceTasksToOptions } from "@/utils/Data";
import SimpleTextField from "../InputComponents/SimpleTextField";
import InputWrapperLegend from "../InputComponents/WrapperLegend";

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
	const { updateSwitchItem } = useServiceAction();

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

	console.log("apiOptions", apiOptions);

	const {
		switchOptions,
		serviceSwitchSelected,
		handleAddNewOption,
		handleChangeOption,
		handleSwitchServiceCheck,
		updateSwitchServicePrices,
	} = useSelectedOption({
		initialSwitchTypeOptions: tempSwitchTypeOptions as IOptionSelection[],
		initialSwitchStatusOptions:
			tempSwitchStatusOptions as IOptionSelection[],
		initialServicePrices: {
			lube: apiOptions.servicePrices["switch"]["lube"] || {
				price: 0,
				name: "",
				description: "",
				info: {
					grease: "",
				},
			},
			cleanSwitch: apiOptions.servicePrices["switch"]["clean"] || {
				price: 0,
				name: "",
				description: "",
			},
			quickCleanSwitch: apiOptions.servicePrices["switch"][
				"quickClean"
			] || {
				price: 0,
				name: "",
				description: "",
			},
			film: apiOptions.servicePrices["switch"]["film"] || {
				price: 0,
				name: "",
				description: "",
				info: {
					brand: "",
					type: "",
					color: "",
				},
			},
		},
	});

	useEffect(() => {
		updateSwitchServicePrices({
			lube: apiOptions.servicePrices["switch"]["lube"],
			cleanSwitch: apiOptions.servicePrices["switch"]["clean"],
			quickCleanSwitch: apiOptions.servicePrices["switch"]["quickClean"],
			film: apiOptions.servicePrices["switch"]["film"],
			spring: apiOptions.servicePrices["switch"]["spring"],
		});
	}, [apiOptions]);

	const handleSwitchChecked = ({
		name,
		value,
	}: {
		name: "lube" | "film" | "clean" | "spring" | "quickClean";
		value: boolean;
	}) => {
		const servicePrice = serviceSwitchSelected[name].price;
		const serviceName = serviceSwitchSelected[name].name;

		handleSwitchServiceCheck({
			name,
			value,
		});

		if (itemId) {
			updateSwitchItem(itemId, {
				services: {
					...props.value.services,
					[name as keyof ISwitchFormItem["services"]]: {
						isUse: value,
						price: value ? servicePrice : 0,
						name: serviceName,
					},
				},
			});
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
					updateSwitchItem(itemId, {
						[name]: value,
					} as any);
				}
			}, 300);
		},
		[itemId]
	);

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
				<div className="flex flex-col gap-4">
					<SearchableSelect
						name="type"
						label="Loại switch"
						options={switchOptions.type}
						onSelect={({
							name,
							option,
						}: {
							name: string;
							option: IOptionSelection;
						}) => {
							handleChangeOption({ name, option });
							if (itemId) {
								updateSwitchItem(itemId, {
									type: option?.value || "",
									name: option?.label || "",
								});
							}
						}}
						placeholder="Tìm, chọn hoặc thêm mới"
						value={props.value.type}
					/>
					<SimpleTextField
						name="quantity"
						label="Số lượng"
						placeholder="Nhập tên số lượng switch"
						onChange={handleTextChange}
						value={props.value.quantity}
						max={360}
						min={10}
						note="Số lượng tối thiểu là 10 và tối đa là 360"
					/>
					<SearchableSelect
						name="status"
						label="Trạng thái"
						options={switchOptions.status}
						onSelect={({
							name,
							option,
						}: {
							name: string;
							option: IOptionSelection;
						}) => {
							handleChangeOption({ name, option });
							if (itemId) {
								updateSwitchItem(itemId, {
									status: option?.value as EnumSwitchStatus,
								});
							}
						}}
						placeholder="Tìm, chọn hoặc thêm mới"
						value={props.value.status}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex gap-1 items-center">
					<span className="text-base font-bold min-w-max">
						Dịch vụ
					</span>
					<div className="w-full border-b border-gray-500" />
				</div>
				{props.value.quantity > 0 &&
				props.value.status &&
				props.value.name ? (
					<div className="flex flex-col gap-4">
						<CheckboxWithPrice
							label={serviceSwitchSelected.lube.name}
							price={serviceSwitchSelected.lube.price}
							value={props.value.services.lube?.isUse || false}
							onChange={handleSwitchChecked}
							name="lube"
							containerClassName="justify-between gap-12"
							subLabel={serviceSwitchSelected.lube.description}
							unit={EnumUnitType.UNIT}
							unitLabel="sw"
						/>
						<CheckboxWithPrice
							label={serviceSwitchSelected.film.name}
							price={serviceSwitchSelected.film.price}
							value={props.value.services.film?.isUse || false}
							onChange={handleSwitchChecked}
							name="film"
							containerClassName="justify-between gap-12"
							subLabel={serviceSwitchSelected.film.description}
							unit={EnumUnitType.UNIT}
							unitLabel="sw"
						/>
						<CheckboxWithPrice
							label={serviceSwitchSelected.spring.name}
							price={serviceSwitchSelected.spring.price}
							value={props.value.services.spring?.isUse || false}
							onChange={handleSwitchChecked}
							name="spring"
							containerClassName="justify-between gap-12"
							subLabel={serviceSwitchSelected.spring.description}
						/>
						<CheckboxWithPrice
							label={serviceSwitchSelected.clean.name}
							price={serviceSwitchSelected.clean.price}
							value={props.value.services.clean?.isUse || false}
							onChange={handleSwitchChecked}
							name="clean"
							containerClassName="justify-between gap-12"
							subLabel={serviceSwitchSelected.clean.description}
						/>
						<CheckboxWithPrice
							label={serviceSwitchSelected.quickClean.name}
							price={serviceSwitchSelected.quickClean.price}
							value={
								props.value.services.quickClean?.isUse || false
							}
							onChange={handleSwitchChecked}
							name="quickClean"
							containerClassName="justify-between gap-12"
							subLabel={
								serviceSwitchSelected.quickClean.description
							}
						/>
					</div>
				) : (
					<WaitOnSelectComp label="Vui lòng lựa chọn loại switch" />
				)}
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
							console.log("data", data);
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
