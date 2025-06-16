import { useAuth } from "@/context/Auth";
import GoogleLogo from "@/icons/google";
import { useDialogLoginAction } from "@/zustand/useDialogLogin";
import { Divider, FormGroup, FormHelperText } from "@material-ui/core";
import Button from "@mui/material/Button";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import SimpleDivider from "../SimpleDivider";

const ServiceContactInfo: React.FC = () => {
	const { user, isAuthenticated } = useAuth() as unknown as {
		user: IAuthUser | null;
		isAuthenticated: boolean;
	};
	const { toggleDialogLogin } = useDialogLoginAction();
	console.log(isAuthenticated);

	const ServiceSchema = Yup.object().shape({
		email: user?.email
			? Yup.string()
			: Yup.string()
					.email("Có vẻ sai định dạng rồi ạ")
					.required("Vui lòng nhập địa chỉ email"),
		firstName: Yup.string().required("Vui lòng nhập họ"),
		lastName: Yup.string().required("Vui lòng nhập tên"),
		phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
	});
	return (
		<div className="border-gray-300 rounded-xl border-2 p-4">
			<div className="flex flex-col">
				<div className="text-lg font-bold">Thông tin liên lạc</div>
				<small>
					Bổ sung thông tin liên hệ của bạn một cách dễ dàng bằng cách
					điền vào các thông tin cần thiết
				</small>
				<Divider className="my-2" />
				{!isAuthenticated ? (
					<>
						<div className="flex gap-2 mt-2">
							<Button
								variant="outlined"
								className="bg-white !border-gray-400 !border-1 rounded-lg font-semibold w-1/2 !normal-case">
								<GoogleLogo width={20} height={20} />
								&nbsp; Tiếp tục bằng Google
							</Button>
							<Button
								variant="outlined"
								className="!normal-case font-semibold bg-[#e7e6e9] rounded-lg py-1 w-1/2 !border-gray-400 !border-1"
								onClick={() => toggleDialogLogin(true)}>
								Đăng nhập
							</Button>
						</div>
						<SimpleDivider text="hoặc" />
					</>
				) : null}
				<Formik
					initialValues={{
						email: user?.email || "",
						firstName: "",
						lastName: "",
						phoneNumber: "",
					}}
					validationSchema={ServiceSchema}
					onSubmit={(values) => {
						console.log("values", values);
						// handleCheckout(values);
					}}
					enableReinitialize>
					{({ errors, touched, setFieldValue, values }) => (
						<Form className="flex flex-col gap-2">
							<div className="flex gap-4">
								<div className="flex flex-col w-1/2">
									<FormGroup>
										<label>Họ</label>
										<Field
											name="firstName"
											type="text"
											placeholder="Họ"
											className="h-10 rounded-md border border-gray-400 px-4 py-2"
										/>
										<FormHelperText className="text-red-500">
											{errors?.firstName}
										</FormHelperText>
									</FormGroup>
								</div>
								<div className="flex flex-col w-1/2">
									<FormGroup>
										<label>Tên</label>
										<Field
											name="lastName"
											type="text"
											placeholder="Tên"
											className="h-10 rounded-md border border-gray-400 px-4 py-2"
										/>
										<FormHelperText className="text-red-500">
											{errors?.lastName}
										</FormHelperText>
									</FormGroup>
								</div>
							</div>
							<div className="flex w-full gap-2">
								<FormGroup className="w-1/2">
									<label>Email</label>
									<Field
										value={user?.email}
										disabled={user?.email}
										name="email"
										type="email"
										placeholder="Email"
										className="h-10 rounded-md border border-gray-400 px-4 py-2 disabled:bg-gray-300"
									/>
									<FormHelperText className="text-red-500">
										{errors?.email as string}
									</FormHelperText>
								</FormGroup>
								<FormGroup className="w-1/2">
									<label>Số điện thoại</label>
									<Field
										name="phoneNumber"
										type="text"
										placeholder="Số điện thoại"
										className="h-10 rounded-md border border-gray-400 px-4 py-2"
									/>
									<FormHelperText className="text-red-500">
										{errors?.phoneNumber}
									</FormHelperText>
								</FormGroup>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default ServiceContactInfo;
