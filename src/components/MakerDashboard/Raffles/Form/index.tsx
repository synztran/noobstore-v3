import { Button } from "@/components/ReUIComponent/Button";
import {
	EnumRaffleType,
	IBEResponseRaffleInfo,
} from "@/interface/Client/Raffle";
import { makerRaffleFormValidationSchema } from "@/validation/MakerRaffleForm";
import { Modal } from "@mui/material";
import { Form, Formik, FormikErrors, FormikTouched } from "formik";
import { AlertCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import AdvancedSection from "./Advanced";
import DeliverySection from "./Delivery";
import ImagesSection from "./Images";
import BasicInfoSection from "./Info";
import { ProductsSection } from "./Products";
import RaffleSettingsSection from "./RaffleSettings";

interface SectionComponentProps {
	values: IRaffleFormValues;
	errors: FormikErrors<IRaffleFormValues>;
	touched: FormikTouched<IRaffleFormValues>;
	handleChange: (e: React.ChangeEvent<any>) => void;
	handleBlur: (e: React.FocusEvent<any>) => void;
	setFieldValue: (field: string, value: any) => void;
}

interface RaffleFormProps {
	initialData?: Partial<IBEResponseRaffleInfo>;
	onSubmit: (values: IRaffleFormValues) => void | Promise<void>;
	onCancel?: () => void;
	isLoading?: boolean;
	mode?: "create" | "edit";
	isOpen: boolean;
	handleClose: () => void;
}

export interface IRaffleFormValues {
	title: string;
	description: string;

	// Raffle Settings
	raffleType: EnumRaffleType;
	entryPrice: number;
	maxEntriesPerPerson: number;
	maxWinPerEntries: number;
	maxWinners: number;
	totalEntriesMax: number;

	// Dates
	startAt: string;
	endAt: string;
	expectedDeliveryAt?: string;

	// Secret Key
	isHaveSecretKey: boolean;
	secretKey?: string;

	// Visibility & Features
	isPublic: boolean;
	featured: boolean;
	isHomepageMain: boolean;
	homepagePriority: number;
	isPaidSlot: boolean;
	paidSlotExpiresAt?: string;
	carouselPosition?: number;

	// Images
	images: { path: string; alt: string }[];
	thumbnail?: { path: string; alt: string };

	// Products
	productOptions: {
		label: string;
		url?: string;
		price: number;
		thumbnail?: { path: string; alt: string };
		raffleQuantity: number | null;
	}[];

	// Delivery Methods
	deliveryMethods: {
		name: string;
		price: number;
		estimatedDays: string;
	}[];

	// Features & Rules
	features: string[];
	rules?: string;
	termsAndConditions?: string;
	tags?: string[];

	// Payment
	requiresPayment: boolean;
}

// COMPONENT MAP
const COMPONENT_MAP: { [key: string]: React.FC<SectionComponentProps> } = {
	basic: BasicInfoSection,
	settings: RaffleSettingsSection,
	products: ProductsSection,
	delivery: DeliverySection,
	images: ImagesSection,
	advanced: AdvancedSection,
};

// ============= HELPER FUNCTIONS =============

// Check if a section has errors
const getSectionErrors = (
	sectionId: string,
	errors: FormikErrors<IRaffleFormValues>,
): string[] => {
	const sectionErrors: string[] = [];

	if (sectionId === "basic") {
		if (errors.title) sectionErrors.push("Tiêu đề");
		if (errors.description) sectionErrors.push("Mô tả");
		if (errors.raffleType) sectionErrors.push("Loại raffle");
	}

	if (sectionId === "settings") {
		if (errors.entryPrice) sectionErrors.push("Giá vé");
		if (errors.totalEntriesMax) sectionErrors.push("Tổng số vé");
		if (errors.maxEntriesPerPerson)
			sectionErrors.push("Số vé tối đa/người");
		if (errors.maxWinPerEntries) sectionErrors.push("Số giải thắng tối đa");
		if (errors.maxWinners) sectionErrors.push("Số người thắng tối đa");
		if (errors.startAt) sectionErrors.push("Ngày bắt đầu");
		if (errors.endAt) sectionErrors.push("Ngày kết thúc");
		if (errors.secretKey) sectionErrors.push("Mã bí mật");
	}

	if (sectionId === "products") {
		if ((errors.productOptions as any)?.length) {
			sectionErrors.push("Sản phẩm có lỗi");
		}
	}

	if (sectionId === "delivery") {
		if ((errors.deliveryMethods as any)?.length) {
			sectionErrors.push("Phương thức vận chuyển có lỗi");
		}
	}

	return sectionErrors;
};

const RaffleForm: React.FC<RaffleFormProps> = ({
	initialData,
	onSubmit,
	onCancel,
	isLoading = false,
	mode = "create",
	// modal
	isOpen,
	handleClose,
}) => {
	const modalDetailRaffle = useRef<HTMLDivElement | null>(null);
	const [activeSection, setActiveSection] = useState<string>("basic");

	const initialValues: IRaffleFormValues = {
		title: initialData?.title || "",
		description: initialData?.description || "",
		raffleType: initialData?.raffleType || EnumRaffleType.RAFFLE,
		entryPrice: initialData?.entryPrice || 0,
		maxEntriesPerPerson: initialData?.maxEntriesPerPerson || 1,
		maxWinPerEntries: initialData?.maxWinPerEntries || 1,
		maxWinners: initialData?.maxWinners || 1,
		totalEntriesMax: initialData?.totalEntriesMax || 100,
		startAt: initialData?.startAt
			? new Date(initialData.startAt).toISOString().slice(0, 16)
			: "",
		endAt: initialData?.endAt
			? new Date(initialData.endAt).toISOString().slice(0, 16)
			: "",
		expectedDeliveryAt: initialData?.expectedDeliveryAt
			? new Date(initialData.expectedDeliveryAt)
					.toISOString()
					.slice(0, 16)
			: "",
		isHaveSecretKey: initialData?.isHaveSecretKey || false,
		secretKey: initialData?.secretKey || "",
		isPublic: initialData?.isPublic ?? true,
		featured: initialData?.featured || false,
		isHomepageMain: initialData?.isHomepageMain || false,
		homepagePriority: initialData?.homepagePriority || 0,
		isPaidSlot: initialData?.isPaidSlot || false,
		paidSlotExpiresAt: initialData?.paidSlotExpiresAt
			? new Date(initialData.paidSlotExpiresAt).toISOString().slice(0, 16)
			: "",
		carouselPosition: initialData?.carouselPosition,
		images: initialData?.images || [],
		thumbnail: initialData?.thumbnail,
		productOptions: initialData?.productOptions || [
			{ label: "", price: 0, raffleQuantity: null },
		],
		deliveryMethods: initialData?.deliveryMethods || [
			{ name: "", price: 0, estimatedDays: "" },
		],
		features: initialData?.features || [],
		rules: initialData?.rules || "",
		termsAndConditions: initialData?.termsAndConditions || "",
		tags: initialData?.tags || [],
		requiresPayment: initialData?.requiresPayment ?? true,
	};

	const sections = [
		{ id: "basic", label: "Thông tin cơ bản" },
		{ id: "settings", label: "Cài đặt raffle" },
		{ id: "products", label: "Sản phẩm & giải thưởng" },
		{ id: "delivery", label: "Vận chuyển" },
		{ id: "images", label: "Hình ảnh" },
		{ id: "advanced", label: "Nâng cao" },
	];

	return (
		<Modal open={isOpen} onClose={handleClose}>
			<div
				ref={modalDetailRaffle}
				className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-4 animate-fade-in flex flex-col gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh]"
				onMouseDown={(e) => e.stopPropagation()}>
				<div className="text-xl font-semibold">Tạo mới raffle</div>
				<Formik
					initialValues={initialValues}
					validationSchema={makerRaffleFormValidationSchema}
					onSubmit={onSubmit}
					enableReinitialize>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						setFieldValue,
					}) => (
						<>
							{/* Section Navigation */}
							<div className="border-b border-gray-200 bg-gray-50">
								<div className="flex overflow-x-auto">
									{sections.map((section) => {
										const sectionErrors = getSectionErrors(
											section.id,
											errors,
										);
										const hasErrors =
											sectionErrors.length > 0;

										return (
											<button
												key={section.id}
												type="button"
												onClick={() =>
													setActiveSection(section.id)
												}
												className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
													activeSection === section.id
														? "border-primary-500 text-primary-600"
														: hasErrors
															? "border-transparent text-red-500 hover:text-red-600 hover:border-red-300"
															: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
												}`}>
												{section.label}
												{hasErrors && (
													<AlertCircle
														size={16}
														className="text-red-500"
													/>
												)}
											</button>
										);
									})}
								</div>
							</div>

							<Form className="w-full mt-4 flex-1 overflow-y-auto">
								{/* Error Block */}
								{(() => {
									const sectionErrors = getSectionErrors(
										activeSection,
										errors,
									);
									return sectionErrors.length > 0 ? (
										<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
											<AlertCircle
												size={20}
												className="text-red-500 flex-shrink-0 mt-0.5"
											/>
											<div>
												<div className="font-semibold text-red-700 mb-1">
													Còn thiếu các trường bắt
													buộc:
												</div>
												<ul className="text-sm text-red-600 space-y-1">
													{sectionErrors.map(
														(error, idx) => (
															<li key={idx}>
																• {error}
															</li>
														),
													)}
												</ul>
											</div>
										</div>
									) : null;
								})()}

								{/* Section Component */}
								{(() => {
									const SectionComponent =
										COMPONENT_MAP[activeSection];
									return SectionComponent ? (
										<SectionComponent
											values={values}
											errors={errors}
											touched={touched}
											handleChange={handleChange}
											handleBlur={handleBlur}
											setFieldValue={setFieldValue}
										/>
									) : null;
								})()}

								{/* Form Actions */}
								<div className="flex justify-end gap-4 mt-8 pt-6 border-t">
									{onCancel && (
										<Button
											type="button"
											variant="outline"
											onClick={onCancel}
											disabled={isLoading}>
											Hủy
										</Button>
									)}
									<Button
										type="submit"
										variant="primary"
										isLoading={isLoading}>
										{mode === "create"
											? "Tạo raffle"
											: "Cập nhật raffle"}
									</Button>
								</div>
							</Form>
						</>
					)}
				</Formik>
			</div>
		</Modal>
	);
};

export default RaffleForm;
