import GroupRadioButton from "@/GroupRadioButton";
import { getFirst } from "@/client";
import CheckoutClient from "@/client/CheckoutClient";
import BillInformation from "@/components/BillInformation";
import CartItemBlock from "@/components/cartItemBlock";
import SelectWithIcon from "@/components/selectWIcon";
import {
	BillingAddress,
	CountryFlag,
	PaymentMethod,
	ShippingMethod,
	VNCity,
} from "@/constants";
import { useAuth } from "@/context/Auth";
import { IDataPostCheckout } from "@/interface/Client/Checkout";
import { IOrderProduct } from "@/interface/Client/Order";
import useCartQuery from "@/react-query/cart/api/useCartQueries";
import { Base } from "@/templates/Base";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	Box,
	Button,
	FormGroup,
	FormHelperText,
	TextField,
} from "@material-ui/core";
import { Field, Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import { CircularProgress } from "@mui/material";

const deliveryNote =
	"Thời gian giao hàng dưới đây chỉ là ước tính của hãng vận chuyển và không bao gồm thời gian xử lý đơn hàng của chúng tôi (1-3 ngày làm việc).";

const CheckoutPage = () => {
	const router = useRouter();
	const { data: cart, isPending } = useCartQuery();
	const { user } = useAuth() as unknown as {
		user: { customerId: number; email: string };
	};
	const [deliveryMethod, setDeliveryMethod] = useState(ShippingMethod[0]);

	const [inProgress, toggleProgress] = useState(false);
	const validCity = useMemo(() => {
		return VNCity?.filter((item) => item.isDeleted === false).sort(
			(a, b) => {
				if (a.code === "79" || a.code === "01") return -1;
				if (b.code === "79" || b.code === "01") return 1;
				return 0;
			}
		);
	}, [VNCity]);

	const CheckoutSchema = Yup.object().shape({
		email: user?.email
			? Yup.string()
			: Yup.string()
					.email("Có vẻ sai định dạng rồi ạ")
					.required("Vui lòng nhập địa chỉ email"),
		firstName: Yup.string().required("Vui lòng nhập họ"),
		lastName: Yup.string().required("Vui lòng nhập tên"),
		company: Yup.string(),
		address: Yup.string().required("Vui lòng nhập địa chỉ"),
		apartment: Yup.string(),
		province: Yup.string().required("Vui lòng nhập Huyện/Xã"),
		// postCode: Yup.string().required("Vui lòng nhập mã bưu cục"),
		phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
		deliveryMethod: Yup.string(),
		paymentMethod: Yup.string(),
		billingAddress: Yup.string().required(
			"Vui lòng chọn địa chỉ thanh toán"
		),
	});

	const handleCheckout = async (formData: {
		email: string;
		firstName: string;
		lastName: string;
		company: string;
		address: string;
		apartment: string;
		city: {
			code: string;
			isDelete: boolean;
			name: string;
			name_with_type: string;
			slug: string;
			type: string;
		};
		province: string;
		postCode: string;
		phoneNumber: string;
		deliveryMethod: string;
		paymentMethod: string;
		billingAddress: string;
		country: string;
	}) => {
		let formatFormData: IDataPostCheckout = {
			orderInfo: {
				...formData,
				city: formData?.city?.code,
			},
			cart: {
				...cart,
				customerId: user?.customerId,
				cartId: cart?.cartId as string,
				products: cart?.products || [],
				services: cart?.services || [],
				usedProducts: cart?.usedProducts || [],
				fees: cart?.fees || {
					shipping: deliveryMethod?.price || 0,
					tax: 0,
					handling: 0,
					voucherCode: "",
					voucherDiscount: 0,
				},
				totalPrice: cart?.totalPrice || 0,
				updatedAt: cart?.updatedAt || "",
				totalProductQuantity: cart?.totalProductQuantity || 0,
			},
		};

		toggleProgress(true);
		const respCheckout = await CheckoutClient.postCheckout(formatFormData);
		if (respCheckout.status === "OK") {
			const { orderId } = getFirst(respCheckout) || {};
			NotifyUtils.success("Đặt hàng thành công !");
			setTimeout(() => {
				router.push({
					pathname: `/thankyou/${orderId}`,
				});
			}, 1000);
		} else {
			NotifyUtils.error(
				respCheckout.message || "Có lỗi xảy ra, vui lòng thử lại sau"
			);
			toggleProgress(false);
		}
	};

	return (
		<Base isLoading={inProgress}>
			<div className="mx-w-full p-6 sm:py-6 relative z-1">
				<div className="grid grid-cols-5 divide-x-2">
					<div className="px-4 py-12 col-span-3">
						<Formik
							initialValues={{
								email: user?.email || "",
								firstName: "",
								lastName: "",
								company: "",
								address: "",
								apartment: "",
								city: {
									code: validCity[0]?.code || "",
									isDelete: validCity[0]?.isDeleted || false,
									name: validCity[0]?.name || "",
									name_with_type:
										validCity[0]?.nameWithType || "",
									slug: validCity[0]?.slug || "",
									type: validCity[0]?.type || "",
								},
								province: "",
								postCode: "",
								phoneNumber: "",
								deliveryMethod: ShippingMethod[0]?.value || "",
								paymentMethod: PaymentMethod[0]?.value || "",
								billingAddress: BillingAddress[0]?.value || "",
								country: CountryFlag[0]?.value || "",
							}}
							validationSchema={CheckoutSchema}
							onSubmit={(values) => {
								console.log("values", values);
								handleCheckout(values);
							}}
							enableReinitialize>
							{({ errors, touched, setFieldValue, values }) => (
								<Form className="mx-auto flex flex-col max-w-3xl gap-2">
									<div className="flex justify-between items-center">
										<h2 className="text-2xl font-bold">
											Thông tin liên hệ
										</h2>
										{!user ? (
											<span className="text-gray-600">
												Đã có tài khoản?{" "}
												<a
													href="/account/login"
													className="underline text-black">
													Đăng nhập
												</a>
											</span>
										) : null}
									</div>
									<FormGroup>
										<Field
											value={user?.email}
											disabled={user?.email}
											name="email"
											type="email"
											placeholder="Email"
											className="h-12 rounded-sm border border-gray-400 px-4 py-2 disabled:bg-gray-300"
										/>
										<FormHelperText className="text-red-500">
											{errors?.email as string}
										</FormHelperText>
									</FormGroup>
									{/* <SampleCheckbox label="Nhận thông tin khuyến mãi vào email này" /> */}
									<h2 className="text-2xl font-bold">
										Địa chỉ giao hàng
									</h2>
									<div>
										<label>Quốc gia</label>
										<SelectWithIcon
											selectList={CountryFlag}
											name="country"
											setFieldValue={setFieldValue}
										/>
									</div>
									<div className="flex gap-4">
										<div className="flex flex-col w-1/2">
											<FormGroup>
												<label>
													Họ
													<strong className="text-red-600">
														*
													</strong>
												</label>
												<Field
													name="firstName"
													type="text"
													placeholder="Họ"
													className="h-12 rounded-sm border border-gray-400 px-4 py-2"
												/>
												<FormHelperText className="text-red-500">
													{errors?.firstName}
												</FormHelperText>
											</FormGroup>
										</div>
										<div className="flex flex-col w-1/2">
											<FormGroup>
												<label>
													Tên
													<strong className="text-red-600">
														*
													</strong>
												</label>
												<Field
													name="lastName"
													type="text"
													placeholder="Tên"
													className="h-12 rounded-sm border border-gray-400 px-4 py-2"
												/>
												<FormHelperText className="text-red-500">
													{errors?.lastName}
												</FormHelperText>
											</FormGroup>
										</div>
									</div>
									<div className="flex flex-col w-full">
										<FormGroup>
											<label>Công ty</label>
											<Field
												name="company"
												type="text"
												placeholder="Công ty (không bắt buộc)"
												className="h-12 rounded-sm border border-gray-400 px-4 py-2"
											/>
										</FormGroup>
									</div>
									<div className="flex flex-col w-full">
										<FormGroup>
											<label>
												Địa chỉ
												<strong className="text-red-600">
													*
												</strong>
											</label>
											<Field
												name="address"
												type="text"
												placeholder="Địa chỉ"
												className="h-12 rounded-sm border border-gray-400 px-4 py-2"
											/>
											<FormHelperText className="text-red-500">
												{errors?.address}
											</FormHelperText>
										</FormGroup>
									</div>
									<div className="flex flex-col w-full">
										<FormGroup>
											<label>
												Chung cư, căn hộ, etc.{" "}
											</label>
											<Field
												name="apartment"
												type="text"
												placeholder="Chung cư, căn hộ, etc. (không bắt buộc)"
												className="h-12 rounded-sm border border-gray-400 px-4 py-2"
											/>
										</FormGroup>
									</div>
									<div className="flex gap-4">
										<div className="flex flex-col w-1/3">
											<label>Thành phố</label>
											<SelectWithIcon
												selectList={validCity}
												isIcon={false}
												name="city"
												setFieldValue={setFieldValue}
											/>
										</div>
										<div className="flex flex-col w-1/3">
											<FormGroup>
												<label>
													Quận/Huyện
													<strong className="text-red-600">
														*
													</strong>
												</label>
												<Field
													name="province"
													type="text"
													placeholder="Quận/Huyện"
													className="h-12 rounded-sm border border-gray-400 px-4 py-2 w-full"
												/>
												<FormHelperText className="text-red-500">
													{errors?.province}
												</FormHelperText>
											</FormGroup>
										</div>
										<div className="flex flex-col w-1/3">
											<FormGroup>
												<label>Mã bưu cục</label>
												<Field
													name="postCode"
													type="text"
													placeholder="Mã bưu cục"
													className="h-12 rounded-sm border border-gray-400 px-4 py-2 w-full"
												/>
												<FormHelperText className="text-red-500">
													{errors?.postCode}
												</FormHelperText>
											</FormGroup>
										</div>
									</div>
									<div className="flex flex-col w-full">
										<FormGroup>
											<label>
												Số điện thoại
												<strong className="text-red-600">
													*
												</strong>
											</label>
											<Field
												name="phoneNumber"
												type="text"
												placeholder="Số điện thoại"
												className="h-12 rounded-sm border border-gray-400 px-4 py-2"
											/>
											<FormHelperText className="text-red-500">
												{errors?.phoneNumber}
											</FormHelperText>
										</FormGroup>
									</div>
									<div className="h-6" />
									<GroupRadioButton
										options={ShippingMethod}
										title="Hình thức vận chuyển"
										value={values.deliveryMethod}
										handleChangeValue={(e) => {
											setFieldValue(
												"deliveryMethod",
												e.target.value
											);
											setDeliveryMethod(
												ShippingMethod.find(
													(item) =>
														item.value ===
														e.target.value
												)
											);
										}}
										name="deliveryMethod"
										isBorder
										subTitle={deliveryNote}
									/>
									<GroupRadioButton
										options={PaymentMethod}
										title="Phương thức thanh toán"
										value={values.paymentMethod}
										handleChangeValue={(e) =>
											setFieldValue(
												"paymentMethod",
												e.target.value
											)
										}
										isBorder
										name="paymentMethod"
									/>
									<GroupRadioButton
										options={BillingAddress}
										title="Địa chỉ thanh toán"
										value={values.billingAddress}
										handleChangeValue={(e) =>
											setFieldValue(
												"billingAddress",
												e.target.value
											)
										}
										isBorder
										name="billingAddress"
									/>
									<button className="w-full bg-red-500 p-4 rounded-md text-white text-xl font-bold mt-6">
										Đặt hàng
									</button>
								</Form>
							)}
						</Formik>
					</div>
					<div className="h-full px-4 py-12 col-span-2">
						<Box position="sticky" top="10rem">
							{isPending ? (
								<div className="flex justify-center items-center py-8">
									<CircularProgress />
								</div>
							) : (
								cart?.products.map((item: IOrderProduct) => (
									<CartItemBlock
										cartItem={item}
										key={item.productId}
									/>
								))
							)}
							<ApplyPromoBlock />
							<BillInformation
								orderInfo={{
									totalPrice: cart?.totalPrice || 0,
									fees: {
										shipping:
											deliveryMethod?.price ||
											0 ||
											cart?.fees.shipping ||
											0,
									},
								}}
							/>
						</Box>
					</div>
				</div>
			</div>
		</Base>
	);
};

export default CheckoutPage;

const ApplyPromoBlock = () => {
	const [code, setCode] = useState("");
	const [error, setError] = useState({
		status: true,
		message: "",
	});
	const handleApplyPromo = () => {
		if (code && code !== "") {
			setError({
				status: false,
				message: "Mã giảm giá hoặc thẻ quả tặng không tồn tại",
			});
		} else {
			setError({
				status: true,
				message: "",
			});
		}
	};
	return (
		<div className="flex gap-2 max-lg:flex-col">
			<TextField
				variant="outlined"
				size="small"
				fullWidth
				className="border border-black"
				onChange={(e) => setCode(e.target.value)}
				error={!error.status}
				helperText={error.message}
				InputProps={{
					inputRef: (ref) => {
						if (ref) {
							ref.style.backgroundColor = "transparent";
						}
					},
					placeholder: "Mã giảm giá hoặc thẻ quà tặng",
					classes: {
						input: "line-clamp-1",
					},
				}}
			/>
			<Button
				className="rounded-md !min-w-[100px] h-[inherit] bg-red-500 hover:bg-red-400 disabled:bg-gray-400"
				onClick={handleApplyPromo}
				disabled={!code || code === ""}>
				<span className="normal-case text-white"> Áp dụng</span>
			</Button>
		</div>
	);
};
