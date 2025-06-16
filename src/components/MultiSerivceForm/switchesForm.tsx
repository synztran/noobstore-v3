import {
	serviceFormText,
	tempSwitchBrandOptions,
	tempSwitchStatusOptions,
	tempSwitchTypeOptions,
} from "@/constants";
import useSelectedOption from "@/hook/useSelectedOption";
import { EnumServiceType } from "@/interface/interface";
import { Divider } from "@material-ui/core";
import React from "react";
import CheckboxWithPrice from "../CheckboxWithPrice";
import MiniUploadImage from "../MiniUploadImage";
import SearchableSelect from "../SelectComp";

interface IProps {
	serviceType: EnumServiceType;
}

const ServicesSwitchesForm: React.FC<IProps> = (props: IProps) => {
	const { serviceType } = props;
	const { title, subTitle } = serviceFormText?.[serviceType];
	const {
		serviceSwitchSelected,
		serviceKeyboardSelected,
		switchOptions,
		handleAddNewOption,
		handleChangeOption,
		handleUseService,
	} = useSelectedOption({
		initialSwitchTypeOptions: tempSwitchTypeOptions,
		initialSwitchBrandOptions: tempSwitchBrandOptions,
		initialSwitchStatusOptions: tempSwitchStatusOptions,
	});

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
						name="type"
						label="Loại switch"
						options={switchOptions.type}
						onAddNew={handleAddNewOption}
						onSelect={handleChangeOption}
						placeholder="Tìm, chọn hoặc thêm mới"
						isAddOn
					/>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<Divider />
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<CheckboxWithPrice
							label="Hàn phím"
							price={100}
							// value={.lubeService.isUse}
							// onChange={handleUseService}
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
							// value={serviceSwitchSelected.desolder.value}
							// onChange={handleChecked}
							name="desolder"
							containerClassName="justify-between gap-12"
							subLabel="Đã bao gồm vệ sinh thiếc hàn"
						/>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<CheckboxWithPrice
						label="Vệ sinh phím"
						price={100}
						// value={selected.clean.value}
						// onChange={handleChecked}
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

export default ServicesSwitchesForm;
