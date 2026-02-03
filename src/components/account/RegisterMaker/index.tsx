import UploadImage from "@/components/InputComponents/UploadImage";
import { Button } from "@/components/ReUIComponent/Button";
import RaffleTermsContent from "@/components/raffle/RaffleTermsContent";
import {
	MAKER_DISCORD_ICON,
	MAKER_FB_ICON,
	MAKER_IG_ICON,
} from "@/constants/Images";
import { IPayloadCreateMaker } from "@/interface/Client/Maker";
import { useCreateMakerMutation } from "@/react-query/makers/api/useCreateMakerMutation";
import NotifyUtils from "@/utils/NotifyUtils";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import {
	Box,
	Checkbox,
	FormControlLabel,
	IconButton,
	MenuItem,
	Modal,
	Select,
} from "@mui/material";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import * as Yup from "yup";

interface SocialNetwork {
	platform: "facebook" | "instagram" | "discord";
	url: string;
}

interface RegisterMakerFormData {
	ownerName: string;
	brandName: string;
	foundingDate: string;
	citizenIdentityCardNumber: string;
	citizenCardFront: string | null;
	citizenCardBack: string | null;
	email: string;
	socialNetworks: SocialNetwork[];
	agreePolicy: boolean;
	logo: string | null;
}

interface RegisterMakerModalProps {
	isOpen: boolean;
	handleClose: () => void;
}

const SOCIAL_PLATFORMS = [
	{
		platform: "facebook",
		icon: MAKER_FB_ICON,
	},
	{
		platform: "instagram",
		icon: MAKER_IG_ICON,
	},
	{
		platform: "discord",
		icon: MAKER_DISCORD_ICON,
	},
] as const;

const validationSchema = Yup.object().shape({
	ownerName: Yup.string().required("Tên chủ sở hữu là bắt buộc"),
	brandName: Yup.string().required("Tên thương hiệu là bắt buộc"),
	foundingDate: Yup.string().required("Ngày thành lập là bắt buộc"),
	citizenIdentityCardNumber: Yup.string()
		.required("Số CMND là bắt buộc")
		.matches(/^\d{9,12}$/, "Số CMND không hợp lệ"),
	citizenCardFront: Yup.mixed().required("Ảnh mặt trước CMND là bắt buộc"),
	citizenCardBack: Yup.mixed().required("Ảnh mặt sau CMND là bắt buộc"),
	email: Yup.string()
		.email("Email không hợp lệ")
		.required("Email là bắt buộc"),
	socialNetworks: Yup.array()
		.of(
			Yup.object().shape({
				platform: Yup.string().required("Nền tảng là bắt buộc"),
				url: Yup.string()
					.url("URL không hợp lệ")
					.required("URL là bắt buộc"),
			}),
		)
		.notRequired(),
	agreePolicy: Yup.boolean().oneOf([true], "Bạn phải chấp thuận chính sách"),
	logo: Yup.mixed().notRequired(),
});

const initialValues: RegisterMakerFormData = {
	ownerName: "",
	brandName: "",
	foundingDate: "",
	citizenIdentityCardNumber: "",
	citizenCardFront: null,
	citizenCardBack: null,
	email: "",
	socialNetworks: [],
	agreePolicy: false,
	logo: null,
};

const RegisterMakerModal: React.FC<RegisterMakerModalProps> = ({
	isOpen,
	handleClose,
}) => {
	const [showTermsModal, setShowTermsModal] = useState(false);
	const formikRef = React.useRef<any>(null);
	const { mutateAsync, isPending: isLoading } = useCreateMakerMutation();

	const handleSubmit = async (values: RegisterMakerFormData) => {
		try {
			// TODO: Call API to register maker
			const payload: IPayloadCreateMaker = {
				ownerName: values.ownerName,
				brandName: values.brandName,
				foundingDate: values.foundingDate,
				citizenCardNumber: values.citizenIdentityCardNumber,
				citizenAttachments: {
					frontImage: {
						path: values.citizenCardFront || "",
						alt: "Citizen Card Front",
					},
					backImage: {
						path: values.citizenCardBack || "",
						alt: "Citizen Card Back",
					},
				},
				email: values.email,
				socialLinks: values.socialNetworks.reduce(
					(acc, curr) => {
						acc[curr.platform] = curr.url;
						return acc;
					},
					{} as Record<string, string>,
				),
				logo: {
					path: values.logo || "",
					alt: "Maker Logo",
				},
			};
			const resp = await mutateAsync({ payload });
			if (resp.status === "OK") {
				handleClose();
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			NotifyUtils.error("Có lỗi xảy ra khi gửi biểu mẫu đăng ký maker");
		}
	};

	return (
		<>
			<Modal
				open={isOpen}
				disableEscapeKeyDown={false}
				className="flex items-center justify-center">
				<div className="relative w-[90%] max-w-3xl max-h-[90vh] overflow-auto bg-white rounded-md flex flex-col">
					<div className="flex justify-between items-center sticky top-0 z-10 bg-white border-b px-6 py-4">
						<h2 className="text-lg font-semibold">
							Đăng ký cửa hàng
						</h2>
						<IconButton
							onClick={handleClose}
							size="small"
							sx={{
								color: "gray",
								"&:hover": { backgroundColor: "#f0f0f0" },
							}}>
							<CloseIcon />
						</IconButton>
					</div>

					<div className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-4 relative">
						<Formik
							innerRef={formikRef}
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={handleSubmit}>
							{({ values, setFieldValue, errors, touched }) => (
								<Form
									className={`space-y-6 ${isLoading ? "pointer-events-none opacity-70" : ""}`}>
									<div className="grid grid-cols-2 gap-4">
										<div className="h-full">
											<UploadImage
												max={1}
												label="Logo (Không bắt buộc)"
												handleSyncData={(files) => {
													if (files?.[0]?.publicUrl) {
														setFieldValue(
															"logo",
															files[0].publicUrl,
														);
													}
												}}
												acceptedFileTypes={[
													".jpg",
													".jpeg",
													".png",
												]}
											/>
											<ErrorMessage
												name="logo"
												component="div"
												className="text-red-500 text-sm mt-1"
											/>
										</div>
										{/* Owner Name */}
										<div className="space-y-4">
											<div className="relative">
												<label className="block text-sm font-semibold text-gray-600">
													Tên chủ sở hữu{" "}
													<span className="text-red-500">
														*
													</span>
												</label>
												<Field
													as="input"
													type="text"
													name="ownerName"
													placeholder="Nhập tên chủ sở hữu"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
												/>
												<ErrorMessage
													name="ownerName"
													component="div"
													className="text-red-500 text-sm absolute -bottom-5 left-0"
												/>
											</div>

											{/* Brand Name */}
											<div className="relative">
												<label className="block text-sm font-semibold text-gray-600">
													Tên Team/Công ty{" "}
													<span className="text-red-500">
														*
													</span>
												</label>
												<Field
													as="input"
													type="text"
													name="brandName"
													placeholder="Nhập tên Team/Công ty"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
												/>
												<ErrorMessage
													name="brandName"
													component="div"
													className="text-red-500 text-sm absolute -bottom-5 left-0"
												/>
											</div>

											{/* Email */}
											<div className="relative">
												<label className="block text-sm font-semibold text-gray-600">
													Email{" "}
													<span className="text-red-500">
														*
													</span>
												</label>
												<Field
													as="input"
													type="email"
													name="email"
													placeholder="Nhập email"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
												/>
												<ErrorMessage
													name="email"
													component="div"
													className="text-red-500 text-sm absolute -bottom-5 left-0"
												/>
											</div>

											{/* Founding Date */}
											<div>
												<label className="block text-sm font-semibold text-gray-600">
													Ngày thành lập{" "}
													<span className="text-red-500">
														*
													</span>
												</label>
												<Field
													as="input"
													type="date"
													name="foundingDate"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
												/>
												<ErrorMessage
													name="foundingDate"
													component="div"
													className="text-red-500 text-sm absolute -bottom-5 left-0"
												/>
											</div>

											{/* Citizen Identity Card Number */}
											<div className="relative">
												<label className="block text-sm font-semibold text-gray-600">
													Số CMND/CCCD{" "}
													<span className="text-red-500">
														*
													</span>
												</label>
												<Field
													as="input"
													type="text"
													name="citizenIdentityCardNumber"
													placeholder="Nhập số CMND/CCCD"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
												/>
												<ErrorMessage
													name="citizenIdentityCardNumber"
													component="div"
													className="text-red-500 text-sm absolute -bottom-5 left-0"
												/>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										{/* Citizen Card - Front */}
										<div>
											<UploadImage
												max={1}
												isRequired
												label="CMND/CCCD - Mặt trước"
												handleSyncData={(files) => {
													if (files?.[0]?.publicUrl) {
														setFieldValue(
															"citizenCardFront",
															files[0].publicUrl,
														);
													}
												}}
												acceptedFileTypes={[
													".jpg",
													".jpeg",
													".png",
												]}
												isCustomerUpload
												// files={uploadedFile.front}
												thumbnailUploaded={
													values.citizenCardFront
														? [
																values.citizenCardFront,
															]
														: undefined
												}
											/>
											<ErrorMessage
												name="citizenCardFront"
												component="div"
												className="text-red-500 text-sm mt-1"
											/>
										</div>

										{/* Citizen Card - Back */}
										<div>
											<UploadImage
												max={1}
												isRequired
												label="CMND/CCCD - Mặt sau"
												handleSyncData={(files) => {
													if (files?.[0]?.publicUrl) {
														setFieldValue(
															"citizenCardBack",
															files[0].publicUrl,
														);
													}
												}}
												acceptedFileTypes={[
													".jpg",
													".jpeg",
													".png",
												]}
												isCustomerUpload
												thumbnailUploaded={
													values.citizenCardBack
														? [
																values.citizenCardBack,
															]
														: undefined
												}
												// files={uploadedFile.back}
											/>
											<ErrorMessage
												name="citizenCardBack"
												component="div"
												className="text-red-500 text-sm mt-1"
											/>
										</div>
									</div>

									{/* Social Networks */}
									<div>
										<label className="block text-sm font-semibold text-gray-600">
											Mạng xã hội (Không bắt buộc)
										</label>
										<FieldArray name="socialNetworks">
											{(arrayHelpers) => (
												<div className="space-y-3">
													{values.socialNetworks
														.length === 0 ? (
														<div className="text-sm text-gray-500 italic py-2">
															Chưa có mạng xã hội
															nào được thêm
														</div>
													) : (
														values.socialNetworks.map(
															(_, index) => (
																<div
																	key={index}
																	className="flex gap-2">
																	<div className="flex-1">
																		<Field
																			as={
																				Select
																			}
																			name={`socialNetworks.${index}.platform`}
																			size="small"
																			className="rounded-md"
																			fullWidth>
																			{SOCIAL_PLATFORMS.map(
																				(
																					social,
																				) => (
																					<MenuItem
																						key={
																							social.platform
																						}
																						value={
																							social.platform
																						}>
																						<div className="flex items-center gap-1">
																							<Image
																								src={
																									social.icon
																								}
																								alt={
																									social.platform
																								}
																								width={
																									24
																								}
																								height={
																									24
																								}
																							/>
																							{social.platform
																								.charAt(
																									0,
																								)
																								.toUpperCase() +
																								social.platform.slice(
																									1,
																								)}
																						</div>
																					</MenuItem>
																				),
																			)}
																		</Field>
																	</div>
																	<div className="flex-3">
																		<Field
																			as="input"
																			type="text"
																			name={`socialNetworks.${index}.url`}
																			placeholder="Nhập đường dẫn"
																			className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm h-full"
																		/>
																	</div>

																	<Button
																		type="button"
																		onClick={() =>
																			arrayHelpers.remove(
																				index,
																			)
																		}
																		className="px-2 py-2 text-red-500 hover:bg-red-50 rounded-md transition h-full">
																		<DeleteIcon fontSize="small" />
																	</Button>
																</div>
															),
														)
													)}
													<Button
														type="button"
														onClick={() =>
															arrayHelpers.push({
																platform:
																	"facebook",
																url: "",
															})
														}
														className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-medium">
														<AddIcon fontSize="small" />
														Thêm mạng xã hội
													</Button>
												</div>
											)}
										</FieldArray>
									</div>

									{/* Policy */}
									<div className="bg-gray-100 border border-gray-200 rounded-md p-4">
										<div className="flex justify-between items-center mb-3">
											<h3 className="text-base font-semibold">
												Điều khoản & Điều kiện Raffle
											</h3>
											<IconButton
												size="small"
												onClick={() =>
													setShowTermsModal(true)
												}
												sx={{
													color: "blue",
													"&:hover": {
														backgroundColor:
															"#e3f2fd",
													},
												}}
												title="Xem toàn bộ điều khoản">
												<InfoIcon fontSize="small" />
											</IconButton>
										</div>
										<div className="max-h-max overflow-y-auto">
											<RaffleTermsContent variant="summary" />
										</div>
									</div>

									{/* Policy Checkbox */}
									<div className="relative">
										<FormControlLabel
											control={
												<Checkbox
													name="agreePolicy"
													checked={values.agreePolicy}
													onChange={(e) =>
														setFieldValue(
															"agreePolicy",
															e.target.checked,
														)
													}
												/>
											}
											label={
												<span className="text-sm">
													Tôi đã đọc và đồng ý với{" "}
													<button
														type="button"
														onClick={() =>
															setShowTermsModal(
																true,
															)
														}
														className="text-blue-500 hover:underline">
														điều khoản & điều kiện
														raffle
													</button>{" "}
													<span className="text-red-500">
														*
													</span>
												</span>
											}
										/>
										<ErrorMessage
											name="agreePolicy"
											component="div"
											className="text-red-500 text-sm absolute -bottom-5 left-0"
										/>
									</div>
								</Form>
							)}
						</Formik>
					</div>

					{/* Fixed Footer with Submit Buttons */}
					<div className="sticky bottom-0 z-10 bg-white border-t px-6 py-4 flex gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={isLoading}
							className="w-full">
							Hủy
						</Button>
						<Button
							type="button"
							variant="primary"
							disabled={isLoading}
							isLoading={isLoading}
							onClick={() => {
								if (formikRef.current) {
									formikRef.current.handleSubmit();
								}
							}}
							className="w-full">
							Đăng ký
						</Button>
					</div>
				</div>
			</Modal>

			{/* Terms and Conditions Modal */}
			<Modal
				open={showTermsModal}
				onClose={() => setShowTermsModal(false)}
				disableEscapeKeyDown={false}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<Box
					sx={{
						position: "relative",
						width: "90%",
						maxWidth: "800px",
						maxHeight: "90vh",
						overflow: "auto",
						bgcolor: "background.paper",
						borderRadius: "8px",
						boxShadow: 24,
						display: "flex",
						flexDirection: "column",
					}}>
					<div className="flex justify-between items-center sticky top-0 z-10 bg-white border-b px-6 py-4">
						<h2 className="text-lg font-semibold">
							Điều khoản & Điều kiện - Raffle sản phẩm
						</h2>
						<IconButton
							onClick={() => setShowTermsModal(false)}
							size="small"
							sx={{
								color: "gray",
								"&:hover": { backgroundColor: "#f0f0f0" },
							}}>
							<CloseIcon />
						</IconButton>
					</div>

					<div className="flex-1 overflow-y-auto px-6 py-4">
						<RaffleTermsContent variant="full" />
					</div>

					<div className="sticky bottom-0 z-10 bg-white border-t px-6 py-4">
						<Button
							variant="outline"
							onClick={() => setShowTermsModal(false)}
							className="w-full">
							Đóng
						</Button>
					</div>
				</Box>
			</Modal>
		</>
	);
};

export default RegisterMakerModal;

// TODO: loading effect for all component
