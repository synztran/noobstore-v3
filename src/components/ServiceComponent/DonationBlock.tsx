import { IResponseBackendServiceBooking } from "@/interface/Client/Service";
import { EnumPaymentStatus } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices, {
	IDonation,
	useServiceAction,
} from "@/zustand/useServices";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Check } from "lucide-react";
import { useMemo } from "react";

const DonationBlock = (props: { service: IResponseBackendServiceBooking }) => {
	const { service } = props;
	const { donation } = useServices();
	const { selectDonation, setDonationNote } = useServiceAction();

	const donationOptions: IDonation[] = [
		{
			value: "1%",
			name: "1%",
			percentage: 0.01,
			totalDonated: service.totalPrice * 0.01,
			id: 1,
		},
		{
			value: "5%",
			name: "5%",
			percentage: 0.05,
			totalDonated: service.totalPrice * 0.05,
			id: 2,
		},
		{
			value: "10%",
			name: "10%",
			percentage: 0.1,
			totalDonated: service.totalPrice * 0.1,
			id: 3,
		},
		{
			value: "15%",
			name: "15%",
			percentage: 0.15,
			totalDonated: service.totalPrice * 0.15,
			id: 4,
		},
	];

	const selectedDonation = useMemo(() => {
		if (donation) {
			return (
				donationOptions.find(
					(option) => option.value === donation?.value,
				) || null
			);
		}

		return null;
	}, [service, donation]);

	const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDonationNote(e.target.value);
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-1">
				<div className="font-bold text-lg border-b border-gray-200">
					Ủng hộ shop (không bắt buộc)
				</div>
				<small className="text-sm">
					(*) Shop sẽ trích 50% tiền ủng hộ để đóng góp vào quỷ hỗ trợ
					trẻ em -{" "}
					<a
						href="#"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline">
						xem thêm ở đây
					</a>
				</small>
			</div>
			<div className={`flex gap-2 flex-wrap`}>
				{donationOptions?.map((option, index) => (
					<div className="relative" key={option.id}>
						<RadioGroup
							key={index}
							aria-labelledby="demo-radio-buttons-group-label"
							name="radio-buttons-group"
							className="max-w-max">
							<WrapperDonation
								service={service}
								option={option}
								selectedDonation={selectedDonation}>
								<FormControlLabel
									checked={
										option.percentage ===
										selectedDonation?.percentage
									}
									value={option.percentage}
									control={<Radio className="sr-only" />}
									label=""
									classes={{ root: "mr-0" }}
									className="sr-only"
									onChange={() => {
										selectDonation(option);
									}}
								/>
							</WrapperDonation>
						</RadioGroup>

						{option.percentage === selectedDonation?.percentage && (
							<div className="absolute -top-1 -right-1 -translate-y-1 translate-x-1">
								<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white shadow">
									<Check
										size={14}
										className="stroke-white"
										style={{ strokeWidth: 4 }}
									/>
								</span>
							</div>
						)}
					</div>
				))}
			</div>
			{selectedDonation ? (
				<div className="relative mt-4">
					<label className="absolute -top-3 left-2 bg-white px-2 text-sm">
						Lời nhắn của bạn (nếu có):
					</label>
					<textarea
						name="note"
						id="note"
						cols={20}
						rows={3}
						onChange={(e) => handleNoteChange(e)}
						className="border rounded-md p-3 resize-none w-full"
						maxLength={300}
						value={service?.donation?.donationMessage}
						disabled={
							service?.paymentStatus === EnumPaymentStatus.PAID
						}
					/>
				</div>
			) : null}
		</div>
	);
};

export default DonationBlock;

const WrapperDonation = ({
	option,
	service,
	selectedDonation,
	children,
}: {
	option: IDonation;
	service: IResponseBackendServiceBooking;
	selectedDonation: IDonation | null;
	children: React.ReactNode;
}) => {
	const { selectDonation } = useServiceAction();

	const handleSelect = () => {
		if (selectedDonation?.percentage === option.percentage) {
			selectDonation(null); // Deselect if already selected
		} else {
			selectDonation(option);
		}
	};

	return (
		<div
			className={`max-w-max rounded-xl p-2 text-center border-2 border-gray-200 shadow-lg bg-gray-300/20 flex flex-col justify-between cursor-pointer hover:border-green-500 hover:shadow-lg ${
				option.percentage === selectedDonation?.percentage
					? "border-green-600"
					: ""
			}`}
			onClick={handleSelect}>
			<span className="text-base font-bold ml-2 select-none">
				{option.name} (
				{formatCurrency(service.totalPrice * (option.percentage || 0))})
			</span>
		</div>
	);
};
