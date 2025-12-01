import { EnumShippingMethodCode } from "@/interface/interface";
import useServiceDefaultOptionQuery from "@/react-query/services/api/useServiceOptionQueries";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices, { useServiceAction } from "@/zustand/useServices";
import {
	CircularProgress,
	Divider,
	FormControlLabel,
	FormGroup,
	Radio,
	RadioGroup,
} from "@mui/material";
import CheckboxWithPrice from "../InputComponents/CheckboxWithPrice";
import InputWrapperLegend from "../InputComponents/WrapperLegend";
import ServiceLocationTime from "../MultiSerivceForm/locationTime";
import SearchableSelect, { IOptionSelection } from "../SelectComp";

const DELIVERY_PICKUP_OPTIONS = [
	{
		index: 1,
		label: "Tự giao sản phẩm đến store và tự đến nhận khi hoàn thành",
		value: EnumShippingMethodCode.SELF_DELIVERY_SELF_PICKUP,
		description:
			"Bạn tự mang sản phẩm đến NoobStore và tự đến lấy khi đơn hàng hoàn tất.",
		price: 0,
	},
	{
		index: 2,
		label: "Tự giao sản phẩm đến store, NoobStore sẽ giao hàng tận nơi",
		value: EnumShippingMethodCode.STORE_DELIVERY_SELF_PICKUP,
		description:
			"Bạn tự mang sản phẩm đến NoobStore, NoobStore sẽ giao trả tận nơi khi đơn hàng hoàn tất.",
		price: 50000,
	},
	{
		index: 3,
		label: "NoobStore sẽ đến lấy sản phẩm, bạn sẽ đến store lấy sản phẩm khi hoàn thành",
		value: EnumShippingMethodCode.STORE_PICKUP_SELF_DELIVERY,
		description:
			"NoobStore đến lấy sản phẩm tại nhà bạn, bạn tự đến NoobStore lấy khi đơn hàng hoàn tất.",
		price: 50000,
	},
	{
		index: 4,
		label: "NoobStore sẽ đến lấy sản phẩm và giao trả tận nơi khi đơn hàng hoàn tất",
		value: EnumShippingMethodCode.STORE_DELIVERY_STORE_PICKUP,
		description:
			"NoobStore đến lấy sản phẩm tại nhà bạn và giao trả tận nơi khi đơn hàng hoàn tất.",
		price: 90000,
	},
];

const DEFAULT_DELIVERY_METHOD = [
	{
		id: 1,
		label: "Giao/nhận hàng cơ bản",
		value: "STANDARD",
		price: 0,
		description:
			"6-12 giờ sau khi đơn hàng hoàn tất hoặc chuyển trạng thái và dựa vào thời gian giao/nhận hàng đã đăng ký",
	},
	{
		id: 2,
		label: "Giao/nhận hàng nhanh",
		value: "EXPRESS",
		price: 50000,
		description:
			"2-4 giờ sau khi đơn hàng hoàn tất hoặc chuyển trạng thái và dựa vào thời gian giao/nhận hàng đã đăng ký",
	},
];

const DeliverySelection = () => {
	const { shippingInfo, errorMessages } = useServices();
	const { updateShippingInfo } = useServiceAction();
	const {
		data: serviceDefaultOptions,
		isPending: isServiceDefaultOptionPending,
	} = useServiceDefaultOptionQuery();

	const handleDeliveryPickupChange = (option: IOptionSelection | null) => {
		if (!option) return;
		updateShippingInfo({
			method: {
				name: option.label,
				code: option.value,
				price: option.price || 0,
			},
		});
	};

	const handleDeliveryMethodChange = (option: IOptionSelection | null) => {
		if (!option) return;
		updateShippingInfo({
			deliveryMethod: {
				name: option.label,
				code: option.value,
				price: option.price || 0,
			},
		});
	};

	const handleExtraOptionChange = ({
		name,
		value,
		checked,
	}: {
		name: string;
		value: string;
		checked: boolean;
	}) => {
		const found = serviceDefaultOptions?.["EXTRA_METHOD"]?.find(
			(opt) => opt.value === name
		);
		if (checked && found) {
			updateShippingInfo({
				...shippingInfo,
				addOns: [
					...(shippingInfo.addOns || []),
					{
						name: found.label,
						price: found.price,
						description: found.description,
						value: found.value,
					},
				],
			});
		} else {
			updateShippingInfo({
				...shippingInfo,
				addOns: (shippingInfo.addOns || []).filter(
					(addOn) => addOn.value !== name
				),
			});
		}
	};

	const selectedOption =
		serviceDefaultOptions?.["PACKAGE_METHOD"]?.find(
			(opt) => opt.value === shippingInfo.method?.code
		) || null;

	return (
		<div
			className={`border border-gray-300 rounded-lg p-4 bg-white flex flex-col gap-2 relative`}
			id="delivery-selection-step">
			<div className="flex flex-col">
				<div className="text-xl font-bold">Dịch vụ giao nhận</div>
				<span className="text-sm text-gray-600">
					Lựa chọn phương thức giao nhận, tùy chọn thêm và cung cấp
					thông tin giao hàng
				</span>
			</div>
			<Divider />
			<InputWrapperLegend
				label="Phương thức giao nhận"
				errorMessage={errorMessages?.method}>
				<SearchableSelect
					isLoading={isServiceDefaultOptionPending}
					name="deliveryPickupMethod"
					label=""
					options={
						serviceDefaultOptions?.["PACKAGE_METHOD"]?.map(
							(opt, index) => ({
								...opt,
								id: index,
							})
						) as unknown as IOptionSelection[]
					}
					value={shippingInfo?.method?.code}
					onSelect={({ option }) =>
						handleDeliveryPickupChange(option)
					}
					placeholder="Chọn phương thức giao nhận"
				/>
				<span className="text-xs text-gray-600 mt-0.5">
					{selectedOption?.description}
				</span>
			</InputWrapperLegend>
			{shippingInfo.method.code !== "" &&
			shippingInfo?.method.code !==
				EnumShippingMethodCode.SELF_DELIVERY_SELF_PICKUP ? (
				<>
					<InputWrapperLegend
						label="Phương thức vận chuyển"
						errorMessage={errorMessages?.deliveryMethod}>
						<RadioGroup
							className="!grid grid-cols-2 gap-8"
							aria-label="delivery-method"
							name="deliveryMethod"
							value={shippingInfo?.deliveryMethod.code}
							onChange={(e) => {
								const selected = DEFAULT_DELIVERY_METHOD.find(
									(opt) => opt.value === e.target.value
								);
								handleDeliveryMethodChange(
									selected as unknown as IOptionSelection | null
								);
							}}>
							{serviceDefaultOptions?.["DELIVERY_METHOD"]?.map(
								(opt) => (
									<FormControlLabel
										key={opt.id}
										value={opt?.value}
										control={<Radio className="!py-0" />}
										className="items-start mr-0"
										label={
											<div>
												<div className="font-semibold text-sm">
													{opt?.label}
												</div>
												{opt.description && (
													<div className="text-xs text-gray-600">
														{opt?.description}
													</div>
												)}
												{typeof opt.price ===
												"number" ? (
													<div className="text-sm text-blue-700 font-semibold">
														Phí:{" "}
														{opt?.price > 0
															? formatCurrency(
																	opt.price
															  )
															: "Miễn phí"}
													</div>
												) : null}
											</div>
										}
									/>
								)
							)}
						</RadioGroup>
					</InputWrapperLegend>
					{[
						EnumShippingMethodCode.STORE_DELIVERY_SELF_PICKUP,
						EnumShippingMethodCode.STORE_DELIVERY_STORE_PICKUP,
						EnumShippingMethodCode.STORE_PICKUP_SELF_DELIVERY,
					].includes(
						shippingInfo?.method?.code as EnumShippingMethodCode
					) && (
						<InputWrapperLegend
							label="Thời gian và địa chỉ giao/nhận hàng"
							errorMessage={
								errorMessages?.deliveryLocation ||
								errorMessages?.deliveryDate ||
								errorMessages?.deliveryAddress ||
								errorMessages?.pickupDate ||
								errorMessages?.pickupAddress
							}>
							<ServiceLocationTime />
						</InputWrapperLegend>
					)}
				</>
			) : null}
			{shippingInfo?.method?.code &&
			shippingInfo.method.code !==
				EnumShippingMethodCode.SELF_DELIVERY_SELF_PICKUP ? (
				<InputWrapperLegend label="Tùy chọn thêm (không bắt buộc)">
					{isServiceDefaultOptionPending ? (
						<div className="w-full min-h-[60px] flex items-center justify-center">
							<CircularProgress size={20} thickness={5} />
						</div>
					) : (
						<FormGroup className="grid grid-cols-2 gap-4">
							{serviceDefaultOptions?.["EXTRA_METHOD"]?.map(
								(option) => (
									<CheckboxWithPrice
										disabled={
											shippingInfo.method.code ===
											EnumShippingMethodCode.SELF_DELIVERY_SELF_PICKUP
										}
										name={option.value}
										key={option.value}
										label={option.label}
										price={option.price}
										onChange={({ value: checked }) =>
											handleExtraOptionChange({
												name: option.value,
												value: option.value,
												checked,
											})
										}
										value={
											!!(shippingInfo.addOns || []).find(
												(addOn) =>
													addOn.value === option.value
											)
										}
										subLabel={option.description}
										containerClassName="justify-between"
									/>
								)
							)}
						</FormGroup>
					)}
				</InputWrapperLegend>
			) : null}
			<div className="mt-2 text-sm text-gray-700">
				<b>Lưu ý:</b> Nhân viên NoobStore sẽ đến tận nhà bạn để nhận và
				giao trả gói hàng nếu bạn chọn phương thức có hỗ trợ. Bạn cũng
				có thể tự mang đến hoặc tự nhận lại tại cửa hàng.
			</div>
		</div>
	);
};

export default DeliverySelection;
