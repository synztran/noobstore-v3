import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { formatCurrency } from "@/utils/FormatNumber";
import { Divider } from "@mui/material";
import { useState } from "react";
import PriceInput from "./PriceInput";

interface IProps {
	raffle: TResponseRaffleEntry;
	onDonationChange?: (amount: number) => void;
	onMessageChange?: (message: string) => void;
}

const RafflePaymnetDonation = ({
	raffle,
	onDonationChange,
	onMessageChange,
}: IProps) => {
	const { brandName, verificationStatus } = raffle?.makerInfo || {};
	const [donationAmount, setDonationAmount] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	const quickAmounts = [50000, 100000, 200000, 500000];

	const handleInputChange = (value: string) => {
		// Remove non-numeric characters
		value = value.replace(/\D/g, "");

		// Prevent leading zeros
		if (value.startsWith("0") && value.length > 1) {
			value = value.replace(/^0+/, "");
		}

		setDonationAmount(value);
		onDonationChange?.(value ? parseInt(value, 10) : 0);
	};

	const handleClear = () => {
		setDonationAmount("");
		onDonationChange?.(0);
	};

	const handleQuickAmount = (amount: number) => {
		setDonationAmount(amount.toString());
		onDonationChange?.(amount);
	};

	const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setMessage(value);
		onMessageChange?.(value);
	};

	const displayAmount = donationAmount
		? formatCurrency(parseInt(donationAmount, 10))
		: "0₫";

	return (
		<div className="relative flex flex-col gap-2 pr-2">
			<div className="flex items-center gap-2">
				<div className="font-bold text-purple-800 border-b border-purple-800">
					Ủng hộ cho Maker 🌻
				</div>
			</div>

			{/* Maker Info */}
			{/* <div className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg flex items-center gap-3">
				<div className="relative w-14 h-14 rounded-full overflow-hidden">
					<Image
						src={raffle?.makerInfo?.logo?.path || NEW_MISSING_IMAGE}
						fill
						className="object-cover"
						alt="maker logo"
					/>
				</div>
				<div className="flex-1">
					<div className="flex items-center gap-2 font-semibold">
						{brandName}
						{verificationStatus === "VERIFIED" ? (
							<Image
								src={I3D_VERIFY_SHIELD}
								width={20}
								height={20}
								alt="verified"
								className="scale-110"
							/>
						) : null}
					</div>
					<div className="text-sm text-gray-600">
						100% tiền ủng hộ sẽ được chuyển đến maker
					</div>
				</div>
			</div> */}

			{/* Current Amount Display */}
			<div className="text-sm text-gray-600 font-medium mb-1">
				Số tiền ủng hộ
			</div>

			{/* Input Section */}
			<PriceInput
				price={donationAmount}
				handleUpdatePrice={handleInputChange}
				handleClear={handleClear}
			/>
			<Divider />

			{/* Quick Add-on Buttons */}
			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Hoặc chọn mức ủng hộ nhanh
				</label>
				<div className="grid grid-cols-2 gap-4 p-2">
					{quickAmounts.map((amount) => (
						<button
							key={amount}
							onClick={() => handleQuickAmount(amount)}
							className={`py-2 px-3 rounded-lg font-semibold transition-all duration-300 text-sm ${
								parseInt(donationAmount || "0", 10) === amount
									? "bg-purple-600 text-white shadow-lg scale-105"
									: "bg-gray-100 text-gray-700 hover:bg-purple-100 border-2 border-transparent hover:border-purple-300"
							}`}>
							+{formatCurrency(amount)}
						</button>
					))}
				</div>
			</div>

			{/* Info Message */}
			{donationAmount && parseInt(donationAmount, 10) > 0 && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
					<p className="text-xs text-blue-700">
						💡 Bạn sẽ ủng hộ{" "}
						<span className="font-bold">
							{formatCurrency(parseInt(donationAmount, 10))}
						</span>{" "}
						cho maker ngoài giá sản phẩm
					</p>
				</div>
			)}

			{/* Message to Maker */}
			<div>
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Gửi lời nhắn cho Maker (không bắt buộc)
				</label>
				<textarea
					value={message}
					onChange={handleMessageChange}
					placeholder="Viết lời nhắn cảm ơn hoặc khích lệ cho maker..."
					maxLength={500}
					className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm font-medium resize-none"
					rows={4}
				/>
				<div className="text-xs text-gray-500 mt-1 text-right">
					{message.length}/500 ký tự
				</div>
			</div>
		</div>
	);
};

export default RafflePaymnetDonation;
