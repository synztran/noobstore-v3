import {
	serviceFormText,
	tempKeyboardOptions,
	tempLayoutOptions,
	tempPCBOptions,
} from "@/constants";
import { EnumServiceType } from "@/interface/interface";
import { Divider } from "@material-ui/core";
import React from "react";
import CheckboxWithPrice from "../CheckboxWithPrice";
import MiniUploadImage from "../MiniUploadImage";
import SearchableSelect, { IOptionSelection } from "../SelectComp";

interface IProps {
	serviceType: EnumServiceType;
}

const ServiceKeyboardForm: React.FC<IProps> = (props) => {
	const { serviceType } = props;
	const { title, subTitle } = serviceFormText?.[serviceType];
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
			layout: IOptionSelection | null;
		};
		desolder: {
			value: boolean;
			layout: IOptionSelection | null;
		};
		clean: {
			value: boolean;
			layout: IOptionSelection | null;
		};
	}>({
		keyboard: null,
		pcb: null,
		solder: {
			value: false,
			layout: null,
		},
		desolder: {
			value: false,
			layout: null,
		},
		clean: {
			value: false,
			layout: null,
		},
	});

	const handleSelect = ({
		name = "",
		option,
	}: {
		name: string;
		option: IOptionSelection | null;
	}) => {
		if (!name) return;
		setSelected({ ...selected, [name]: option });
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
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col">
				<div className="text-lg font-bold">{title}</div>
				<small className="text-xs">{subTitle}</small>
			</div>
			<div className="flex flex-col gap-4">
				<Divider />
				<div className="flex flex-col gap-4">
					<SearchableSelect
						name="keyboard"
						label="Bàn phím"
						options={options.keyboard}
						onAddNew={handleAddNew}
						onSelect={handleSelect}
						placeholder="Tìm, chọn hoặc thêm mới"
						isAddOn
					/>
					<SearchableSelect
						name="pcb"
						label="Loại PCB (mạch)"
						options={options.pcb}
						onAddNew={handleAddNew}
						onSelect={handleSelect}
						placeholder="Tìm, chọn hoặc thêm mới"
					/>
					<SearchableSelect
						name="layout"
						label="Layout phím"
						options={options.layout}
						onAddNew={handleAddNew}
						onSelect={handleSelect}
						placeholder="Tìm, chọn hoặc thêm mới"
						isAddOn
					/>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<Divider />
				{selected?.pcb?.value !== "HOTSWAP" ? (
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<CheckboxWithPrice
								label="Hàn phím"
								price={100}
								value={selected.solder.value}
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
								value={selected.desolder.value}
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
						value={selected.clean.value}
						onChange={handleChecked}
						name="clean"
						containerClassName="justify-between gap-12"
						subLabel="Không hỗ trợ tẩy bằng dung dịch và làm trắng"
					/>
				</div>
				<Divider />
				<div>
					<div className="flex flex-col">
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
					</div>
					<MiniUploadImage onUpload={() => console.log(1)} />
				</div>
			</div>
		</div>
	);
};

export default ServiceKeyboardForm;
