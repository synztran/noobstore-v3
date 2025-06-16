import Breadcumb from "@/components/breadcumb";
import UserSideMenu from "@/components/userSideMenu";
import { BreadcumbTitle } from "@/constants";
import { useAuth } from "@/context/Auth";
import { Base } from "@/templates/Base";
import {
	Box,
	Button,
	Divider,
	makeStyles,
	Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BlockIcon from "@mui/icons-material/Block";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import * as Yup from "yup";

const verifyIconStyle = makeStyles(() => ({
	root: {
		"& path": {
			fill: "#fff",
		},
	},
}));

const UserDetailPage: React.FC = () => {
	const router = useRouter();
	const auth = useAuth();
	if (!auth) {
		throw new Error("Auth context is undefined");
	}
	const { user } = auth;
	const iconVerifyStyle = verifyIconStyle();
	const PersonalSchema = Yup.object().shape({
		firstName: Yup.string().required("Vui lòng nhập tên"),
		lastName: Yup.string().required("Vui lòng nhập họ"),
		phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
		dob: Yup.string().required("Vui lòng nhập ngày sinh"),
	});

	const redirectAdmin = () => {
		router.push("/admin/dashboard");
	};

	return (
		<Base>
			<div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1">
				<Breadcumb
					mainRoot={BreadcumbTitle["account.detail"] as string}
					subRoot="Thông tin tài khoản"
				/>
				<article className="flex mt-4">
					<div className="flex-initial w-1/4">
						<UserSideMenu />
					</div>
					<Divider orientation="vertical" flexItem />
					<div className="flex-initial w-3/4 pl-4 pt-5">
						<Formik
							initialValues={{
								firstName: user?.firstName || "",
								lastName: user?.lastName || "",
								phoneNumber: user?.phoneNumber || "",
								dob: "",
								gender: 0,
								email: user?.email || "",
							}}
							validationSchema={PersonalSchema}
							onSubmit={(values) => {
								console.log("values", values);
							}}
							enableReinitialize>
							{({ errors, touched }) => (
								<Form className="flex flex-col max-w-3xl gap-4">
									<UserAvatar avatar={user?.avatar || ""} />
									<div className="flex gap-4">
										<div className="flex flex-col gap-1 w-1/2">
											<label htmlFor="lastName">Họ</label>
											<Field
												name="lastName"
												type="text"
												placeholder="Họ"
												className="h-12 rounded-sm border border-gray-400 px-4 py-2 disabled:bg-gray-300"
												disabled
											/>
											{errors.lastName &&
											touched.lastName ? (
												<div className="text-red-400">
													{errors?.lastName as string}
												</div>
											) : null}
										</div>
										<div className="flex flex-col gap-1 w-1/2">
											<label htmlFor="firstName">
												Tên
											</label>
											<Field
												name="firstName"
												type="text"
												placeholder="Tên"
												className="h-12 rounded-sm border border-gray-400 px-4 py-2 disabled:bg-gray-300"
												disabled
											/>
											{errors.firstName &&
											touched.firstName ? (
												<div className="text-red-400">
													{errors.firstName as string}
												</div>
											) : null}
										</div>
									</div>
									<div className="flex flex-col gap-1">
										<label htmlFor="email">Email</label>
										<Field
											name="email"
											type="text"
											placeholder="Địa chỉ email"
											className="h-12 rounded-sm border border-gray-400 px-4 py-2 disabled:bg-gray-300"
											disabled
										/>
										{errors.phoneNumber &&
										touched.phoneNumber ? (
											<div className="text-red-400">
												{errors.email as string}
											</div>
										) : null}
									</div>
									<div className="flex flex-col gap-1">
										<label htmlFor="phoneNumber">
											Số điện thoại
										</label>
										<Field
											name="phoneNumber"
											type="text"
											placeholder="Số điện thoại"
											className="h-12 rounded-sm border border-gray-400 px-4 py-2"
										/>
										{errors.phoneNumber &&
										touched.phoneNumber ? (
											<div className="text-red-400">
												{errors.phoneNumber as string}
											</div>
										) : null}
									</div>
									<div className="flex flex-col gap-1">
										<label htmlFor="phoneNumber">
											Trạng thái
										</label>
										<Box
											display="flex"
											alignItems="center"
											gridGap={8}>
											<Box
												className={`rounded-sm ${
													user?.verified
														? "bg-green-400"
														: "bg-red-400"
												} px-2 py-1 text-white flex items-center gap-2 font-bold`}>
												{user?.verified ? (
													<VerifiedIcon
														className={
															iconVerifyStyle.root
														}
													/>
												) : null}
												{user?.verified ? (
													"Tài khoản đã xác thực"
												) : (
													<BlockIcon className="!fill-white" />
												)}
												&nbsp;
												{/* {user?.verified
													? "Đã xác thực"
													: "Chưa xác thực"} */}
											</Box>
											<Divider
												orientation="vertical"
												flexItem
											/>
											{user?.role === "admin" ? (
												<Button onClick={redirectAdmin}>
													Special
												</Button>
											) : null}
											{!user?.verified ? (
												<Button className="normal-case bg-blue-400 px-6 hover:bg-blue-500">
													<span className="text-white font-bold">
														Xác thực
													</span>
												</Button>
											) : null}
										</Box>
										<Box
											display="flex"
											justifyContent="space-between"
											alignItems="center"></Box>
									</div>
									{/* <div className="flex flex-col gap-1">
                    <label htmlFor="dob">Ngày sinh</label>
                    <RadioButton options={genderOptions} isSpacing={false} />
                  </div> */}
								</Form>
							)}
						</Formik>
					</div>
				</article>
			</div>
		</Base>
	);
};

const UserAvatar = ({ avatar }: { avatar: string }) => {
	return (
        <Box className="w-full">
            <Typography variant="h6">Ảnh đại diện</Typography>
            <Box display="flex" gridGap={18} alignItems="center">
				<Box
					width={100}
					height={100}
					borderRadius="50%"
					position="relative">
					{avatar && avatar !== "" ? (
						<Image src={avatar} alt="avatar" className="object-contain" fill sizes="100vw" />
					) : (
						<AccountCircleIcon
							className="group text-gray-600 cursor-pointer transition-all m-auto"
							aria-hidden="true"
							style={{ width: 100, height: 100 }}
						/>
					)}
				</Box>
				{/* <Box display="flex" gridGap={12}>
					<Button className="normal-case bg-blue-400 px-6 hover:bg-blue-500">
						<span className="text-white font-bold">Đổi ảnh</span>
					</Button>
					<Button
						style={{ backgroundColor: "#f7f8f9" }}
						className="px-6 normal-case border border-gray-500 border-solid">
						<span className="text-red-400 font-bold">Xóa ảnh</span>
					</Button>
				</Box> */}
			</Box>
        </Box>
    );
};

export default UserDetailPage;
