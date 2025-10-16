import { useAuth } from "@/context/Auth";
import GoogleLogo from "@/icons/google";
import { IAuthUser } from "@/interface/Context/auth";
import { useDialogLoginAction } from "@/zustand/useDialogLogin";
import { useServiceAction } from "@/zustand/useServices";
import { Divider, FormGroup, FormHelperText } from "@material-ui/core";
import Button from "@mui/material/Button";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import SimpleDivider from "../SimpleDivider";

const ServiceContactInfo: React.FC = () => {
	const { user, isAuthenticated } = useAuth() as unknown as {
		user: IAuthUser | null;
		isAuthenticated: boolean;
	};

	const { toggleDialogLogin } = useDialogLoginAction();
	const { updateContactInfo } = useServiceAction();

	const initialValues = {
		email: user?.email || "",
		fullName:
			user?.firstName && user?.lastName
				? user?.firstName + " " + user?.lastName
				: user?.firstName || user?.lastName || "",
		phoneNumber: user?.phoneNumber || "",
	};

	// On initial mount, update contact info in zustand store
	useEffect(() => {
		updateContactInfo({
			name: initialValues.fullName,
			email: initialValues.email,
			phone: initialValues.phoneNumber,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const ServiceSchema = Yup.object().shape({
		email: user?.email
			? Yup.string()
			: Yup.string()
					.email("Có vẻ sai định dạng rồi ạ")
					.required("Vui lòng nhập địa chỉ email"),
		fullName: Yup.string().required("Vui lòng nhập tên liên hệ"),
		phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
	});

	return (
		<div
			className="border-gray-400 rounded-xl border p-4 bg-white"
			id="customer-information-step">
			<div className="flex flex-col">
				<div className="text-lg font-bold">Thông tin liên lạc</div>
				<div className="text-sm text-gray-600">
					Bổ sung thông tin liên hệ của bạn
				</div>
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
					initialValues={initialValues}
					validationSchema={ServiceSchema}
					onSubmit={(values) => {
						// Update contactInfo in zustand store
						updateContactInfo({
							name: values.fullName,
							email: values.email,
							phone: values.phoneNumber,
						});
					}}
					enableReinitialize>
					{({ errors, values, handleChange, handleBlur }) => (
						<Form className="flex flex-col gap-2">
							<div className="flex gap-2 w-full">
								<FormGroup className="flex-1 min-w-0">
									<label className="text-sm">
										Tên khách hàng
									</label>
									<Field
										name="fullName"
										type="text"
										placeholder="Tên"
										className="h-10 rounded-md border border-gray-400 px-4 py-2 w-full"
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>
										) => {
											handleChange(e);
											updateContactInfo({
												name: e.target.value,
											});
										}}
										onBlur={handleBlur}
									/>
									<FormHelperText className="text-red-500">
										{errors?.fullName}
									</FormHelperText>
								</FormGroup>
							</div>
							<div className="flex flex-col w-full gap-2">
								<FormGroup className="w-full">
									<label className="text-sm">Email</label>
									<Field
										value={user?.email ?? values.email}
										disabled={!!user?.email}
										name="email"
										type="email"
										placeholder="Email"
										className="h-10 rounded-md border border-gray-400 px-4 py-2 disabled:bg-gray-200"
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>
										) => {
											handleChange(e);
											updateContactInfo({
												email: e.target.value,
											});
										}}
										onBlur={handleBlur}
									/>
									<FormHelperText className="text-red-500">
										{errors?.email as string}
									</FormHelperText>
								</FormGroup>
								<FormGroup className="w-full">
									<label className="text-sm">
										Số điện thoại
									</label>
									<Field
										name="phoneNumber"
										type="text"
										placeholder="Số điện thoại"
										className="h-10 rounded-md border border-gray-400 px-4 py-2"
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>
										) => {
											handleChange(e);
											updateContactInfo({
												phone: e.target.value,
											});
										}}
										onBlur={handleBlur}
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
