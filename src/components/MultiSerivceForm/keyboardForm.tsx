import {
	serviceFormText,
	tempStabilizerMountTypeOptions,
	tempStabilizerSizeOptions,
	tempStabilizerStatusOptions,
	tempStabilizerTypeOptions,
	tempSwitchStatusOptions,
	tempSwitchTypeOptions,
} from "@/constants";
import useSelectedOption from "@/hook/useSelectedOption";
import {
	EnumServiceType,
	EnumStabilizerStatus,
	EnumUnitType,
	EnumUploadStatus,
} from "@/interface/interface";
import useServiceTaskQuery from "@/react-query/services/useServiceTaskQueries";
import { mapServiceTasksToOptions } from "@/utils/Data";
import NotifyUtils from "@/utils/NotifyUtils";
import useServices, {
	IKeyboardFormItem,
	IStabilizerFormItem,
	useServiceAction,
} from "@/zustand/useServices";
import React, { useEffect, useMemo, useRef } from "react";
import CheckboxWithPrice from "../InputComponents/CheckboxWithPrice";
import SimpleTextField from "../InputComponents/SimpleTextField";
import UploadImage from "../InputComponents/UploadImage";
import InputWrapperLegend from "../InputComponents/WrapperLegend";
import SearchableSelect, { IOptionSelection } from "../SelectComp";
import StabilizerSelection from "./StabilizerSelection";

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

	const stabilizerSelected = useMemo(() => {
		console.log("props stabilizer", props.value.stabilizer);
		const formatedData: IStabilizerFormItem = {
			id: props.itemId,
			type: props.value.stabilizer.type || null,
			mountType: props.value.stabilizer.mountType || null,
			brand: props.value.stabilizer.brand ?? "",
			// services: props.value.services?.stabilizer || {},
			status: props.value.stabilizer.status || null,
			totalPack: props.value.stabilizer.totalPack || 0,
			totalWire: props.value.stabilizer.totalWire || 0,
			wires: props.value.stabilizer.wires || [],
			packs: props.value.stabilizer.packs || [],
		};
		return formatedData;
	}, [props.value.stabilizer]);

	// Use the enhanced useSelectedOption hook for keyboard forms
	const {
		keyboardOptions,
		updateKeyboardOptions,
		updateKeyboardServicePrices,
		switchOptions,
		stabilizerOptions,
		serviceOptions,
		updateServiceOptions,
	} = useSelectedOption({
		initialKeyboardOptions: apiOptions.keyboard,
		initialPcbOptions: apiOptions.pcb,
		initialLayoutOptions: apiOptions.layout,
		initialServicePrices: {
			keyboard: {
				solder: apiOptions.servicePrices["keyboard"]["solder"] || null,
				desolder:
					apiOptions.servicePrices["keyboard"]["desolder"] || null,
				clean: apiOptions.servicePrices["keyboard"]["clean"] || null,
			},
			switch: {
				lube: apiOptions.servicePrices["switch"]["lube"] || null,
				film: apiOptions.servicePrices["switch"]["film"] || null,
				spring: apiOptions.servicePrices["switch"]["spring"] || null,
				clean: apiOptions.servicePrices["switch"]["clean"] || null,
				quickClean:
					apiOptions.servicePrices["switch"]["quickClean"] || null,
			},
			stabilizer: {
				handle:
					apiOptions.servicePrices["stabilizer"]["handle"] || null,
				clean: apiOptions.servicePrices["stabilizer"]["clean"] || null,
			},
		},
		initialSwitchTypeOptions: tempSwitchTypeOptions as IOptionSelection[],
		initialSwitchStatusOptions:
			tempSwitchStatusOptions as IOptionSelection[],
		initialStabilizerSizeOptions: tempStabilizerSizeOptions,
		initialStabilizerMountTypeOptions: tempStabilizerMountTypeOptions,
		initialStabilizerTypeOptions: tempStabilizerTypeOptions,
		initialStabilizerStatusOptions: tempStabilizerStatusOptions,
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
		updateServiceOptions({
			keyboard: apiOptions.servicePrices?.keyboard,
			switch: apiOptions.servicePrices?.switch,
			stabilizer: apiOptions.servicePrices?.stabilizer,
		});
	}, [apiOptions]);

	const handleSelect = ({
		parentName,
		name,
		option,
	}: {
		parentName: "keyboard" | "switch" | "stabilizer";
		name: string;
		option: IOptionSelection | null;
	}) => {
		console.log("handleSelect", parentName, name, option);
		if (!itemId || !name) return;
		const parentValue = props.value[parentName] as Record<string, any>;
		const payload: Partial<IKeyboardFormItem> = {
			[parentName]: {
				...parentValue,
				[name]: option?.value || "",
			} as any,
		};
		updateKeyboardItem(itemId, payload);
		resetTaskItem(itemId, "keyboardItems");
	};

	const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
	const handleTextChange = ({
		parentName,
		name,
		value,
	}: {
		parentName: "keyboard" | "switch" | "stabilizer";
		name: string;
		value: string | number;
	}) => {
		console.log("handleTextChange", parent, name, value);
		if (debounceRef.current[name]) {
			clearTimeout(debounceRef.current[name]);
		}
		debounceRef.current[name] = setTimeout(() => {
			if (itemId) {
				updateKeyboardItem(itemId, {
					[parentName]: {
						...props.value[parentName],
						[name]: value,
					},
				} as any);
			}
		}, 300);
	};

	const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (itemId) {
			updateKeyboardItem(itemId, { note: e.target.value } as any);
		}
	};

	// const handleAddNew = ({
	// 	name = "keyboard",
	// 	newOption,
	// }: {
	// 	name: "keyboard" | "pcb" | "layout";
	// 	newOption: IOptionSelection;
	// }) => {
	// 	handleKeyboardAddNew({ name, newOption });
	// };

	const handleChecked = ({
		name,
		value,
	}: {
		name: {
			keyboard?: "solder" | "desolder" | "clean";
			switch?: "lube" | "film" | "spring" | "clean" | "quickClean";
			stabilizer?: "handle" | "clean";
		};
		value: boolean;
	}) => {
		console.log("handleChecked", name, value, Object.keys(name)?.[0]);
		const parentName = Object.keys(name)?.[0] as
			| "keyboard"
			| "switch"
			| "stabilizer";
		const serviceName = name?.[parentName as keyof typeof name];
		const servicePrice =
			serviceOptions?.[parentName]?.[
				serviceName as keyof (typeof serviceOptions)[typeof parentName]
			]?.price || 0;

		console.log("parentName", parentName);
		console.log("serviceName", serviceName);
		console.log("servicePrice", servicePrice);
		// const serviceName = keyboardFormSelected.services[name].name;

		// handleCheckKeyboardService({ name, value });

		if (itemId) {
			updateKeyboardItem(itemId, {
				services: {
					...props.value.services,
					[parentName]: {
						...props.value.services?.[parentName],
						[serviceName as string]: {
							isUse: value,
							price: servicePrice,
							name: serviceName,
						},
					},
				},
			});
		}
	};

	const handleOnChangeStabSelection = (updater: IStabilizerFormItem) => {
		console.log("id", itemId, updater);
		if (!itemId) {
			NotifyUtils.error("Không tìm thấy mục stabilizer để cập nhật.");
			return;
		}

		updateKeyboardItem(itemId, {
			stabilizer: {
				...props.value.stabilizer,
				...updater,
			},
		});
	};

	console.log("props.value", props.value);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col">
				<div className="text-lg font-bold">{title}</div>
				<small className="text-sm text-gray-600">{subTitle}</small>
			</div>

			<InputWrapperLegend
				label="Thông tin & dịch vụ bàn phím"
				className="flex gap-4">
				<div className="flex flex-col gap-2 w-full">
					<div className="flex gap-1 items-center">
						<span className="text-base font-bold min-w-max">
							Thông tin
						</span>
						<div className="w-full border-b border-gray-500" />
					</div>
					<div className="flex flex-col gap-4">
						<SimpleTextField
							parentName="keyboard"
							name="name"
							label="Tên phím"
							placeholder="Nhập tên bàn phím"
							onChange={handleTextChange}
							value={props.value.keyboard.name}
						/>
						<SearchableSelect
							parentName="keyboard"
							name="pcb"
							label="Loại PCB (mạch)"
							options={keyboardOptions.pcb}
							// onAddNew={handleAddNew}
							onSelect={handleSelect}
							placeholder="Tìm và chọn"
							value={props.value.keyboard.pcb}
							note="Khi thay đổi, cần đăng ký lại dịch vụ"
						/>
						<SearchableSelect
							parentName="keyboard"
							name="size"
							label="Layout phím"
							options={keyboardOptions.size}
							// onAddNew={handleAddNew}
							onSelect={handleSelect}
							placeholder="Tìm, chọn hoặc thêm mới"
							value={props.value.keyboard.size}
							hidePrice
							note="Khi thay đổi, cần đăng ký lại dịch vụ"
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
					{props.value?.keyboard.pcb && props.value.keyboard.size ? (
						<>
							{props.value.keyboard.pcb !== "HOTSWAP" ? (
								<div className="flex flex-col gap-2">
									<CheckboxWithPrice
										label={
											serviceOptions?.keyboard.solder
												?.name || ""
										}
										price={
											serviceOptions?.keyboard.solder
												?.price || 0
										}
										value={
											props.value.services.keyboard
												?.solder?.isUse ?? false
										}
										onChange={() =>
											handleChecked({
												name: { keyboard: "solder" },
												value: !props.value.services
													.keyboard?.solder?.isUse,
											})
										}
										name="solder"
										containerClassName="justify-between gap-12"
										subLabel="Đã bao gồm vệ sinh thiếc hàn"
									/>
									<CheckboxWithPrice
										label={
											serviceOptions?.keyboard?.desolder
												?.name || ""
										}
										price={
											serviceOptions?.keyboard?.desolder
												?.price || 0
										}
										value={
											props.value.services.keyboard
												?.desolder?.isUse ?? false
										}
										onChange={() =>
											handleChecked({
												name: { keyboard: "desolder" },
												value: !props.value.services
													.keyboard?.desolder?.isUse,
											})
										}
										name="desolder"
										containerClassName="justify-between gap-12"
										subLabel="Đã bao gồm vệ sinh thiếc hàn"
									/>
								</div>
							) : null}
							<div className="flex items-center justify-between">
								<CheckboxWithPrice
									label={
										serviceOptions?.keyboard?.clean?.name ||
										""
									}
									price={
										serviceOptions?.keyboard?.clean
											?.price || 0
									}
									value={
										props.value.services?.keyboard?.clean
											?.isUse ?? false
									}
									onChange={() =>
										handleChecked({
											name: { keyboard: "clean" },
											value: !props.value.services
												?.keyboard?.clean?.isUse,
										})
									}
									name="keyboard.clean"
									containerClassName="justify-between gap-12"
									subLabel="Không hỗ trợ tẩy bằng dung dịch và làm trắng"
								/>
							</div>
						</>
					) : (
						<WaitOnSelectComp label="Vui lòng bổ sung thông tin phím" />
					)}
				</div>
			</InputWrapperLegend>

			<InputWrapperLegend
				label="Thông tin và dịch vụ switch"
				className="flex gap-4">
				<div className="flex flex-col gap-2 w-full">
					<div className="flex gap-1 items-center">
						<span className="text-base font-bold min-w-max">
							Thông tin switch
						</span>
						<div className="w-full border-b border-gray-500" />
					</div>
					<div className="flex flex-col gap-4">
						<SearchableSelect
							parentName="switch"
							name="type"
							label="Loại switch"
							options={switchOptions.type}
							onSelect={handleSelect}
							placeholder="Tìm, chọn hoặc thêm mới"
							value={props.value.switch.type}
						/>
						<SimpleTextField
							parentName="switch"
							name="quantity"
							label="Số lượng"
							placeholder="Nhập tên số lượng switch"
							onChange={handleTextChange}
							value={props.value.switch.quantity}
							max={360}
							min={10}
							note="Số lượng tối thiểu là 10 và tối đa là 360"
							type="number"
						/>
						<SearchableSelect
							parentName="switch"
							name="status"
							label="Trạng thái"
							options={switchOptions.status}
							onSelect={handleSelect}
							placeholder="Tìm, chọn hoặc thêm mới"
							value={props.value.switch.status}
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
					{props.value.switch.quantity > 0 &&
					props.value.switch.status &&
					props.value.switch.type ? (
						<div className="flex flex-col gap-4">
							<CheckboxWithPrice
								label={serviceOptions?.switch?.lube?.name ?? ""}
								price={serviceOptions?.switch?.lube?.price ?? 0}
								value={
									props.value.services.switch?.lube?.isUse ||
									false
								}
								onChange={() =>
									handleChecked({
										name: { switch: "lube" },
										value: !props.value.services?.switch
											?.lube?.isUse,
									})
								}
								name="lube"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.lube?.description ??
									""
								}
								unit={EnumUnitType.UNIT}
								unitLabel="sw"
							/>
							<CheckboxWithPrice
								label={serviceOptions?.switch?.film?.name ?? ""}
								price={serviceOptions?.switch?.film?.price ?? 0}
								value={
									props.value.services.switch?.film?.isUse ||
									false
								}
								onChange={() =>
									handleChecked({
										name: { switch: "film" },
										value: !props.value.services?.switch
											?.film?.isUse,
									})
								}
								name="film"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.film?.description ??
									""
								}
								unit={EnumUnitType.UNIT}
								unitLabel="sw"
							/>
							<CheckboxWithPrice
								label={
									serviceOptions?.switch?.spring?.name ?? ""
								}
								price={
									serviceOptions?.switch?.spring?.price ?? 0
								}
								value={
									props.value.services.switch?.spring
										?.isUse || false
								}
								onChange={() =>
									handleChecked({
										name: { switch: "spring" },
										value: !props.value.services?.switch
											?.spring?.isUse,
									})
								}
								name="spring"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.spring
										?.description ?? ""
								}
							/>
							<CheckboxWithPrice
								label={
									serviceOptions?.switch?.clean?.name ?? ""
								}
								price={
									serviceOptions?.switch?.clean?.price ?? 0
								}
								value={
									props.value.services.switch?.clean?.isUse ||
									false
								}
								onChange={() =>
									handleChecked({
										name: { switch: "clean" },
										value: !props.value.services?.switch
											?.clean?.isUse,
									})
								}
								name="switch.clean"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.clean
										?.description ?? ""
								}
								unit={EnumUnitType.UNIT}
								unitLabel="sw"
							/>
							<CheckboxWithPrice
								label={
									serviceOptions?.switch?.quickClean?.name ??
									""
								}
								price={
									serviceOptions?.switch?.quickClean?.price ??
									0
								}
								value={
									props.value.services.switch?.quickClean
										?.isUse || false
								}
								onChange={() =>
									handleChecked({
										name: { switch: "quickClean" },
										value: !props.value.services?.switch
											?.quickClean?.isUse,
									})
								}
								name="quickClean"
								containerClassName="justify-between gap-12"
								subLabel={
									serviceOptions?.switch?.quickClean
										?.description ?? ""
								}
								unit={EnumUnitType.UNIT}
								unitLabel="sw"
							/>
						</div>
					) : (
						<WaitOnSelectComp label="Vui lòng bổ sung thông tin switch" />
					)}
				</div>
			</InputWrapperLegend>

			<InputWrapperLegend
				label="Thông tin và dịch vụ stabilizer"
				className="flex flex-col">
				<div className="flex gap-4">
					<div className="flex flex-col gap-2 w-full">
						<div className="flex gap-1 items-center">
							<span className="text-base font-bold min-w-max">
								Thông tin stabilizer
							</span>
							<div className="w-full border-b border-gray-500" />
						</div>
						<div className="flex flex-col gap-4">
							<SimpleTextField
								parentName="stabilizer"
								name="brand"
								label="Hãng"
								placeholder="Nhập tên hãng stabilizer"
								onChange={handleTextChange}
								value={props.value.stabilizer.brand || ""}
							/>
							<SearchableSelect
								parentName="stabilizer"
								name="type"
								label="Loại stabilizer"
								options={stabilizerOptions.stabilizerType}
								onSelect={handleSelect}
								placeholder="Tìm và chọn"
								value={props.value.stabilizer.type}
							/>
							<SearchableSelect
								parentName="stabilizer"
								name="mountType"
								label="Loại mount"
								options={stabilizerOptions.stabilizerMountType}
								onSelect={handleSelect}
								placeholder="Tìm và chọn"
								value={props.value.stabilizer.mountType}
							/>
							<SearchableSelect
								parentName="stabilizer"
								name="status"
								label="Trạng thái"
								options={stabilizerOptions.status}
								onSelect={handleSelect}
								placeholder="Tìm, chọn hoặc thêm mới"
								value={props.value.stabilizer.status}
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
						{props.value?.stabilizer.type &&
						(props.value.stabilizer.totalPack ||
							props.value.stabilizer.totalWire) ? (
							<div className="flex flex-col gap-4">
								<CheckboxWithPrice
									label={
										serviceOptions?.stabilizer?.handle
											?.name ?? ""
									}
									price={
										serviceOptions?.stabilizer?.handle
											?.price ?? 0
									}
									value={
										props.value.services?.stabilizer?.handle
											?.isUse || false
									}
									onChange={() =>
										handleChecked({
											name: { stabilizer: "handle" },
											value: !props.value.services
												?.stabilizer?.handle?.isUse,
										})
									}
									name="handle"
									containerClassName="justify-between gap-12"
									subLabel={
										serviceOptions?.stabilizer?.handle
											?.description ?? ""
									}
								/>
								<CheckboxWithPrice
									label={
										serviceOptions?.stabilizer?.clean
											?.name ?? ""
									}
									price={
										serviceOptions?.stabilizer?.clean
											?.price ?? 0
									}
									value={
										props.value.services?.stabilizer?.clean
											?.isUse || false
									}
									onChange={() =>
										handleChecked({
											name: { stabilizer: "clean" },
											value: !props.value.services
												?.stabilizer?.clean?.isUse,
										})
									}
									name="clean"
									containerClassName="justify-between gap-12"
									subLabel={
										serviceOptions?.stabilizer?.clean
											?.description ?? ""
									}
									disabled={
										props.value.stabilizer.status !==
										EnumStabilizerStatus.USED
									}
								/>
							</div>
						) : (
							<WaitOnSelectComp label="Vui lòng bổ sung thông tin và lựa chọn gói stabilizer" />
						)}
					</div>
				</div>
				<StabilizerSelection
					itemId={itemId}
					stabilizerSelected={stabilizerSelected}
					onChange={handleOnChangeStabSelection}
					className="mt-4"
				/>
			</InputWrapperLegend>

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
		<div className="w-full bg-gray-300 animate-pulse relative flex flex-col items-center justify-center rounded-lg overflow-hidden text-center h-full px-8">
			<label className="mt-4 mb-2 text-base font-semibold z-10">
				{label}
			</label>
		</div>
	);
};
