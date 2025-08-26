import {
	serviceFormText,
	tempKeyboardOptions,
	tempLayoutOptions,
	tempPCBOptions,
} from "@/constants";
import { EnumServiceType, EnumUploadStatus } from "@/interface/interface";
import { Divider } from "@material-ui/core";
import React from "react";
import { IKeyboardFormItem, useServiceAction } from "@/zustand/useServices";
import CheckboxWithPrice from "../CheckboxWithPrice";
import MiniUploadImage from "../MiniUploadImage";
import SearchableSelect, { IOptionSelection } from "../SelectComp";
import SimpleTextField from "../InputComponents/SimpleTextField";
import UploadImage from "../InputComponents/UploadImage";

interface IProps {
	serviceType: EnumServiceType;
	itemId?: string;
	value: IKeyboardFormItem;
}

const ServiceKeyboardForm: React.FC<IProps> = (props) => {
	console.log(props.value);
	const { serviceType, itemId } = props;
	const { title, subTitle } = serviceFormText?.[serviceType];
	const { updateKeyboardItem } = useServiceAction();
	const [options, setOptions] = React.useState<{
		keyboard: IOptionSelection[];
		pcb: IOptionSelection[];
		layout: IOptionSelection[];
	}>({
		keyboard: tempKeyboardOptions,
		pcb: tempPCBOptions,
		layout: tempLayoutOptions,
	});
	const [selected, setSelected] = React.useState<{
		keyboard: IOptionSelection | null;
		pcb: IOptionSelection | null;
		solder: {
			value: boolean;
		};
		desolder: {
			value: boolean;
		};
		clean: {
			value: boolean;
		};
	}>({
		keyboard: null,
		pcb: null,
		solder: {
			value: false,
		},
		desolder: {
			value: false,
		},
		clean: {
			value: false,
		},
	});

	const handleSelect = ({
		name = "",
		option,
	}: {
		name: string;
		option: IOptionSelection | null;
	}) => {
		console.log(name, option);
		if (!name) return;
		setSelected({ ...selected, [name]: option });
		if (itemId) {
			const payload: any = {};
			if (name === "pcbType") payload.pcbType = option?.value || "";
			if (name === "keyboardLayout")
				payload.keyboardSize = option?.value || "";
			updateKeyboardItem(itemId, payload);
		}
	};

	const debounceRef = React.useRef<{ [key: string]: NodeJS.Timeout }>({});
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
		setOptions({ ...options, [name]: [...options[name], newOption] });
		setSelected({ ...selected, [name]: newOption });
	};

	const handleChecked = ({
		name,
		value,
	}: {
		name: "solder" | "desolder" | "clean";
		value: boolean;
	}) => {
		setSelected({
			...selected,
			[name]: {
				...selected[name],
				value,
			},
		});
		if (itemId) {
			if (name === "clean") {
				updateKeyboardItem(itemId, { clean: { isUse: value } as any });
			} else {
				updateKeyboardItem(itemId, {
					[name]: {
						isUse: value,
					},
				} as any);
			}
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col">
				<div className="text-lg font-bold">{title}</div>
				<small className="text-sm text-gray-600">{subTitle}</small>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex gap-1 items-center">
					<span className="text-base font-bold min-w-max">
						Thông tin
					</span>
					<div className="w-full border-b border-gray-500" />
				</div>
				<div className="flex flex-col gap-4">
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
						options={options.pcb}
						onAddNew={handleAddNew}
						onSelect={handleSelect}
						placeholder="Tìm và chọn"
						value={props.value.pcbType}
					/>
					<SearchableSelect
						name="keyboardLayout"
						label="Layout phím"
						options={options.layout}
						onAddNew={handleAddNew}
						onSelect={handleSelect}
						placeholder="Tìm, chọn hoặc thêm mới"
						isAddOn
						value={props.value.keyboardSize}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex gap-1 items-center">
					<span className="text-base font-bold min-w-max">
						Dịch vụ
					</span>
					<div className="w-full border-b border-gray-500" />
				</div>
				{props.value.pcbType !== "HOTSWAP" ? (
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<CheckboxWithPrice
								label="Hàn phím"
								price={100}
								value={props.value.solder.isUse}
								onChange={handleChecked}
								name="solder"
								containerClassName="justify-between gap-12"
								subLabel="Đã bao gồm vệ sinh thiếc hàn"
							/>
							<Divider
								orientation="vertical"
								variant="middle"
								flexItem
								className="mx-2 my-0 bg-gray-400"
							/>
							<CheckboxWithPrice
								label="Rã phím"
								price={100}
								value={props.value.desolder.isUse}
								onChange={handleChecked}
								name="desolder"
								containerClassName="justify-between gap-12"
								subLabel="Đã bao gồm vệ sinh thiếc hàn"
							/>
						</div>
					</div>
				) : null}
				<div className="flex items-center justify-between">
					<CheckboxWithPrice
						label="Vệ sinh phím"
						price={100}
						value={props.value.clean.isUse}
						onChange={handleChecked}
						name="clean"
						containerClassName="justify-between gap-12"
						subLabel="Không hỗ trợ tẩy bằng dung dịch và làm trắng"
					/>
				</div>
				<Divider />
				<div>
					{/* <div className="flex flex-col">
						<div>
							<strong className="text-sm">
								Tải lên hiện trạng của phím
							</strong>
							&nbsp;
							<span className="text-xs text-gray-500">
								không bắt buộc
							</span>
						</div>
						<span className="text-xs text-gray-500">
							Bạn có thể tải lên hình ảnh của phím ngay, hoặc shop
							sẽ liên hệ bạn sau
						</span>
					</div> */}
					{/* <MiniUploadImage onUpload={() => console.log(1)} /> */}
					<UploadImage
						label="Tải lên hiện trạng phím"
						subLabel="Bạn có thể tải lên hình ảnh của phím ngay, hoặc shop sẽ liên hệ bạn sau"
						files={props.value.attachments.map((item) => ({
							preview: item.publicUrl || "",
							status: EnumUploadStatus.DONE,
							publicUrl: item.publicUrl || "",
						}))}
						handleSyncData={(data) => {
							console.log(data);
							if (itemId) {
								updateKeyboardItem(itemId, {
									attachments: [
										...props.value.attachments,
										data,
									],
								});
							}
						}}
					/>
					<div className="flex flex-col gap-1 mt-4">
						<label htmlFor="note">Ghi chú (tối đa 300 ký tự)</label>
						<textarea
							name="note"
							id="note"
							cols={30}
							rows={5}
							onChange={(e) => handleNoteChange(e)}
							value={props.value.note}
							className="border rounded-md p-3 resize-none"
							maxLength={300}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ServiceKeyboardForm;
