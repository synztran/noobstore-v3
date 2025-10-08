import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, User, CheckCircle, Verified, Check, Truck } from "lucide-react";
import { RaffleData, RaffleEntryForm, PaymentMethod } from "@/interface/Raffle";
import Image from "next/image";
import { formatCurrency } from "@/utils/FormatNumber";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import SimpleTextField from "@/components/InputComponents/SimpleTextField";
import { VNCity } from "@/constants";
import SelectWithIcon from "@/components/selectWIcon";
import {
	InvisibleRecaptcha,
	RecaptchaWrapperRef,
} from "@/components/RecaptchaWrapper";
import { getRecaptchaToken } from "@/utils/recaptchaUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { Divider } from "@mui/material";
import StepInformation from "./Information";
import StepSelectProduct from "./Selection";
import StepDeliveryInfo from "./Delivery";
import StepConfirmation from "./Confirm";

// --- Step Components ---

interface StepProps {
	formData: FormData;
	setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
	raffleData: RaffleData;
	handleInputChange?: (
		field: keyof FormData
	) => (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleSelectChange?: (
		field: keyof FormData
	) => (event: React.ChangeEvent<HTMLSelectElement>) => void;
	minPrice?: number;
	maxPrice?: number;
	handleChangeCity?: (value: string) => void;
}

type ProductSelection = {
	productId: string;
	name: string;
	priority: number | null; // null means not selected
	selected: boolean;
	thumbnail: string;
	price: number;
};

type FormData = Omit<RaffleEntryForm, "ticketQuantity"> & {
	companyName: string;
	zipCode: string;
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	cardName: string;
	productSelections: ProductSelection[];
	shippingMethod: { brand: string; price: number };
	note: string;
};

// --- Stepper Component ---
const steps = ["Thông tin", "Lựa chọn", "Thiết lập giao hàng", "Xác nhận"];
const Stepper: React.FC<{ activeStep: number }> = ({ activeStep }) => (
	<div className="flex justify-between items-center">
		{steps.map((label, idx) => (
			<div key={label} className="flex-1 flex flex-col items-center">
				<div
					className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
						activeStep === idx
							? "bg-blue-600 border-blue-600 text-white"
							: activeStep > idx
								? "bg-green-500 border-green-500 text-white"
								: "bg-gray-200 border-gray-300 text-gray-500"
					} font-bold`}>
					{idx + 1}
				</div>

				<div
					className={`mt-2 text-base ${
						activeStep === idx
							? "text-blue-600 font-semibold"
							: "text-gray-500"
					}`}>
					{label}
				</div>
			</div>
		))}
	</div>
);

// --- Main Modal Component ---

interface RaffleEntryModalProps {
	open: boolean;
	onClose: () => void;
	raffleData: RaffleData;
	minPrice: number;
	maxPrice: number;
}

const RaffleEntryModal: React.FC<RaffleEntryModalProps> = ({
	open,
	onClose,
	raffleData,
	minPrice,
	maxPrice,
}) => {
	const [activeStep, setActiveStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const recaptchaRef = useRef<RecaptchaWrapperRef>(null);
	const [formData, setFormData] = useState<FormData>({
		fullName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		paymentMethod: PaymentMethod.CREDIT_CARD,
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardName: "",
		productSelections:
			raffleData.productOptions?.map((option, index) => ({
				productId: option.id,
				name: option.label,
				priority: null,
				selected: false,
				price: option.price,
				thumbnail: option.url, // Add the required thumbnail property
			})) || [],
		companyName: "",
		zipCode: "",
		shippingMethod: { brand: "VNPost", price: 0 },
		note: "",
	});

	const handleNext = () => {
		if (activeStep < steps.length - 1) {
			setActiveStep((prevStep) => prevStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const handleInputChange =
		(field: keyof FormData) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setFormData({ ...formData, [field]: event.target.value });
		};

	const handleSelectChange =
		(field: keyof FormData) =>
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			setFormData({ ...formData, [field]: event.target.value });
		};

	const handleSubmit = async () => {
		try {
			setIsSubmitting(true);

			// Get reCAPTCHA token before submitting
			// const recaptchaToken = await getRecaptchaToken(
			// 	process.env.NEXT_PUBLIC_RECAPCHA_SITE_TO_RECAPCHA_KEY || "",
			// 	"raffle_entry"
			// );

			// if (!recaptchaToken) {
			// 	NotifyUtils.error(
			// 		"Không thể xác thực reCAPTCHA. Vui lòng thử lại."
			// 	);
			// 	return;
			// }

			// console.log("Submitting raffle entry with data:", {
			// 	...formData,
			// 	recaptchaToken,
			// });

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Show success message and proceed to confirmation
			NotifyUtils.success("Đăng ký raffle thành công!");
			handleNext();
		} catch (error) {
			console.error("Raffle entry error:", error);
			NotifyUtils.error(
				"Có lỗi xảy ra khi đăng ký raffle. Vui lòng thử lại."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetAndClose = () => {
		setActiveStep(0);
		setFormData({
			fullName: "",
			email: "",
			phone: "",
			address: "",
			city: "",
			paymentMethod: PaymentMethod.CREDIT_CARD,
			cardNumber: "",
			expiryDate: "",
			cvv: "",
			cardName: "",
			productSelections:
				raffleData.productOptions?.map((option, index) => ({
					productId: option.id,
					name: option.label,
					price: option.price,
					thumbnail: option.url,
					priority: null,
					selected: false,
				})) || [],
			companyName: "",
			zipCode: "",
			shippingMethod: { brand: "VNPost", price: 0 },
			note: "",
		});
		onClose();
	};

	const handleChangeCity = (value: string) => {
		setFormData({ ...formData, city: value });
	};

	// Prevent scroll when modal is open
	useEffect(() => {
		if (open) {
			const originalStyle = window.getComputedStyle(
				document.body
			).overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
		return undefined;
	}, [open]);

	if (!open) return null;

	let stepContent: React.ReactNode = null;
	switch (activeStep) {
		case 0:
			stepContent = (
				<StepInformation
					formData={formData}
					raffleData={raffleData}
					minPrice={minPrice}
					maxPrice={maxPrice}
				/>
			);

			break;
		case 1:
			stepContent = (
				<StepSelectProduct
					formData={formData}
					setFormData={setFormData}
					raffleData={raffleData}
					handleInputChange={handleInputChange}
					handleSelectChange={handleSelectChange}
				/>
			);

			break;
		case 2:
			stepContent = (
				<StepDeliveryInfo
					formData={formData}
					setFormData={setFormData}
					raffleData={raffleData}
					handleInputChange={handleInputChange}
					handleSelectChange={handleSelectChange}
					handleChangeCity={handleChangeCity}
				/>
			);
			break;
		case 3:
			stepContent = <StepConfirmation formData={formData} />;
			break;
		default:
			stepContent = null;
	}

	console.log(activeStep);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/40 backdrop-blur-md"
				aria-hidden="true"
			/>
			<div className="relative bg-white rounded-xl shadow-xl w-[95vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden h-[min(500px,  60vh)]">
				{/* Header */}
				<div className="flex justify-between items-center p-4">
					<div className="text-lg font-semibold">
						Join Raffle - {raffleData.title}
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-2 rounded hover:bg-gray-100 transition"
						aria-label="Close">
						<X />
					</button>
				</div>
				<Divider />
				{/* Stepper */}
				<div className="p-4">
					<Stepper activeStep={activeStep} />
				</div>
				<Divider />
				{/* Content */}
				<div className="p-4 h-full overflow-y-auto">{stepContent}</div>
				<Divider />
				{/* Footer */}
				<div className="flex justify-between items-center p-4 bottom-0">
					{activeStep > 0 && (
						<button
							type="button"
							onClick={
								activeStep === 3 ? resetAndClose : handleBack
							}
							// disabled={activeStep === 0 || activeStep === 3}
							className={`px-6 py-2 rounded border font-medium transition ${
								activeStep === 0
									? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
									: "border-blue-600 text-blue-600 hover:bg-blue-50"
							}`}
							disabled={isSubmitting}>
							{activeStep === 3 ? "Đóng" : "Quay lại"}
						</button>
					)}
					{activeStep < 3 && (
						<>
							{activeStep === 2 && (
								<script src="https://www.google.com/recaptcha/api.js?render=YOUR_RECAPTCHA_SITE_KEY"></script>
							)}
							<button
								type="button"
								onClick={async () => {
									if (activeStep === 2) {
										// reCAPTCHA v4 (invisible) - get token before submit
										if (
											typeof window !== "undefined"
											// &&window.grecaptcha
										) {
											try {
												setIsSubmitting(true);
												// const token =
												// 	await window.grecaptcha.execute(
												// 		"YOUR_RECAPTCHA_SITE_KEY",
												// 		{ action: "submit" }
												// 	);
												handleSubmit();
											} catch (err) {
												alert(
													"Xác thực reCAPTCHA thất bại. Vui lòng thử lại."
												);
												setIsSubmitting(false);
											}
										} else {
											alert(
												"Không thể xác thực reCAPTCHA. Vui lòng thử lại sau."
											);
										}
									} else {
										handleNext();
									}
								}}
								disabled={
									isSubmitting ||
									(activeStep === 1 &&
										(!formData.productSelections ||
											formData.productSelections.filter(
												(p) => p.selected
											).length === 0))
								}
								className={`px-6 py-2 rounded font-medium flex items-center gap-2 transition ml-auto ${
									isSubmitting ||
									(activeStep === 1 &&
										(!formData.productSelections ||
											formData.productSelections.filter(
												(p) => p.selected
											).length === 0))
										? "bg-blue-300 text-white cursor-not-allowed"
										: "bg-blue-600 text-white hover:bg-blue-700"
								}`}>
								{activeStep === 2 && (
									<CheckCircle
										size={16}
										className="stroke-white"
									/>
								)}
								{isSubmitting
									? "Đang xử lý..."
									: activeStep === 2
										? "Hoàn tất đăng ký"
										: "Tiếp theo"}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default RaffleEntryModal;
