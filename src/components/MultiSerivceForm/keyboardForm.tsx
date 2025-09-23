import { serviceFormText } from "@/constants";
import { EnumServiceType, EnumUploadStatus } from "@/interface/interface";
import React, { useMemo, useEffect, useRef } from "react";
import useServices, {
	IKeyboardFormItem,
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

interface IProps {
	serviceType: EnumServiceType;
	itemId: string;
	value: IKeyboardFormItem;
}

const ServiceKeyboardForm: React.FC<IProps> = (props) => {
	const { serviceType, itemId } = props;
	const { title, subTitle } = serviceFormText?.[serviceType];
	const { keyboardItems } = useServices();
	const { updateKeyboardItem, resetTaskItem } = useServiceAction();
	const { data: serviceDefaultTasks } = useServiceTaskQuery();

	// Map API data to form options
	const apiOptions = useMemo(() => {
		let currentKeyboardItem: IKeyboardFormItem | undefined = undefined;
		if (itemId && keyboardItems && keyboardItems.length > 0) {
			const item = keyboardItems.find((item) => item.id === itemId);
			currentKeyboardItem = item;
		}
		return mapServiceTasksToOptions({
			serviceTasks: serviceDefaultTasks || [],
			keyboardItem: currentKeyboardItem,
		});
	}, [serviceDefaultTasks, keyboardItems, itemId]);

	// Use the enhanced useSelectedOption hook for keyboard forms
	const {
		keyboardOptions,
		keyboardFormSelected,
		handleKeyboardSelect,
		handleKeyboardAddNew,
		handleKeyboardServiceCheck,
		updateKeyboardOptions,
		updateKeyboardServicePrices,
	} = useSelectedOption({
		initialKeyboardOptions: apiOptions.keyboard,
		initialPcbOptions: apiOptions.pcb,
		initialLayoutOptions: apiOptions.layout,
		initialServicePrices: {
			solder: apiOptions.servicePrices["keyboard"]["solder"] || {
				price: 0,
				name: "",
				description: "",
			},
			desolder: apiOptions.servicePrices["keyboard"]["desolder"] || {
				price: 0,
				name: "",
				description: "",
			},
			cleanKeyboard: apiOptions.servicePrices["keyboard"]["clean"] || {
				price: 0,
				name: "",
				description: "",
			},
		},
	});

	// Update options when API data changes
	useEffect(() => {
		updateKeyboardOptions({
			keyboard: apiOptions.keyboard,
			pcb: apiOptions.pcb,
			layout: apiOptions.layout,
		});
		updateKeyboardServicePrices({
			solder: apiOptions.servicePrices["keyboard"]["solder"] || {
				price: 0,
				name: "",
				description: "",
			},
			desolder: apiOptions.servicePrices["keyboard"]["desolder"] || {
				price: 0,
				name: "",
				description: "",
			},
			clean: apiOptions.servicePrices["keyboard"]["clean"] || {
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

		// Map form field names to hook state names
		let hookStateName = name;
		if (name === "pcbType") hookStateName = "pcb";
		if (name === "keyboardLayout") hookStateName = "layout";

		handleKeyboardSelect({ name: hookStateName, option });

		if (itemId) {
			const payload: any = {
				...props.value,
				[name]: option?.value || "",
			};
			updateKeyboardItem(itemId, payload);
			// when updateKeyboardItem, we will trigger clean tasks
			resetTaskItem(itemId, "keyboardItems");
		}
	};

	const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
	const handleTextChange = ({
		name,
		value,
	}: {
		name: string;
		value: string;
	}) => {
		if (debounceRef.current[name]) {
			clearTimeout(debounceRef.current[name]);
		}
		debounceRef.current[name] = setTimeout(() => {
			if (itemId) {
				updateKeyboardItem(itemId, {
					[name]: value,
				} as any);
			}
		}, 300);
	};

	const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (itemId) {
			updateKeyboardItem(itemId, {
				note: e.target.value,
			} as any);
		}
	};

	const handleAddNew = ({
		name = "keyboard",
		newOption,
	}: {
		name: "keyboard" | "pcb" | "layout";
		newOption: IOptionSelection;
	}) => {
		handleKeyboardAddNew({ name, newOption });
	};

	const handleChecked = ({
		name,
		value,
	}: {
		name: "solder" | "desolder" | "clean";
		value: boolean;
	}) => {
		const servicePrice = keyboardFormSelected.services[name].price;
		const serviceName = keyboardFormSelected.services[name].name;

		handleKeyboardServiceCheck({ name, value });

		if (itemId) {
			updateKeyboardItem(itemId, {
				services: {
					...props.value.services,
					[name as keyof IKeyboardFormItem["services"]]: {
						isUse: value,
						price: value ? servicePrice : 0,
						name: serviceName,
					},
				},
			});
		}
	};

	console.log("keyboardFormSelected", keyboardFormSelected);

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
						name="keyboardName"
						label="Bàn phím"
						placeholder="Nhập tên bàn phím"
						onChange={handleTextChange}
						value={props.value.keyboardName}
					/>
					<SearchableSelect
						name="pcbType"
						label="Loại PCB (mạch)"
						options={keyboardOptions.pcb}
						onAddNew={handleAddNew}
						onSelect={handleSelect}
						placeholder="Tìm và chọn"
						value={props.value.pcbType}
						note="Khi thay đổi, cần đăng ký lại dịch vụ"
					/>
					<SearchableSelect
						name="keyboardLayout"
						label="Layout phím"
						options={keyboardOptions.layout}
						onAddNew={handleAddNew}
						onSelect={handleSelect}
						placeholder="Tìm, chọn hoặc thêm mới"
						value={props.value.keyboardSize}
						hidePrice
						note="Khi thay đổi, cần đăng ký lại dịch vụ"
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
				{props.value?.pcbType && props.value.keyboardSize ? (
					<>
						{props.value.pcbType !== "HOTSWAP" ? (
							<div className="flex flex-col gap-2">
								<CheckboxWithPrice
									label={
										keyboardFormSelected.services.solder
											.name
									}
									price={
										keyboardFormSelected.services.solder
											.price
									}
									value={
										props.value.services.solder?.isUse ??
										false
									}
									onChange={handleChecked}
									name="solder"
									containerClassName="justify-between gap-12"
									subLabel="Đã bao gồm vệ sinh thiếc hàn"
								/>
								<CheckboxWithPrice
									label={
										keyboardFormSelected.services.desolder
											.name
									}
									price={
										keyboardFormSelected.services.desolder
											.price
									}
									value={
										props.value.services.desolder?.isUse ??
										false
									}
									onChange={handleChecked}
									name="desolder"
									containerClassName="justify-between gap-12"
									subLabel="Đã bao gồm vệ sinh thiếc hàn"
								/>
							</div>
						) : null}
						<div className="flex items-center justify-between">
							<CheckboxWithPrice
								label={keyboardFormSelected.services.clean.name}
								price={
									keyboardFormSelected.services.clean.price
								}
								value={
									props.value.services.clean?.isUse ?? false
								}
								onChange={handleChecked}
								name="clean"
								containerClassName="justify-between gap-12"
								subLabel="Không hỗ trợ tẩy bằng dung dịch và làm trắng"
							/>
						</div>
					</>
				) : (
					<WaitOnSelectComp label="Vui lòng lựa chọn loại PCB" />
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
					label="Tải lên hiện trạng phím"
					subLabel="Bạn có thể tải lên hình ảnh của phím ngay, hoặc shop sẽ liên hệ bạn sau"
					files={props.value.attachments.map((item) => ({
						preview: item.publicUrl || "",
						status: EnumUploadStatus.DONE,
						publicUrl: item.publicUrl || "",
					}))}
					handleSyncData={(
						data: { publicUrl: string; size: number }[]
					) => {
						if (itemId) {
							updateKeyboardItem(itemId, {
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
					<textarea
						name="note"
						id="note"
						cols={30}
						rows={5}
						onChange={(e) => handleNoteChange(e)}
						value={props.value.note}
						className="border rounded-md p-3 resize-none w-full"
						maxLength={300}
					/>
				</InputWrapperLegend>
			</div>
		</div>
	);
};

export default ServiceKeyboardForm;

const WaitOnSelectComp = ({ label }: { label: string }) => {
	return (
		<div className="w-full h-60 bg-gray-300 animate-pulse relative flex flex-col items-center justify-center rounded-lg overflow-hidden my-auto">
			<label className="mt-4 mb-2 text-base font-semibold z-10">
				{label}
			</label>
		</div>
	);
};
