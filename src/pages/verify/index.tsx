import { HOME_URL } from "@/constants/path";
import { useVerifyMailMutation } from "@/react-query/verify/api/useVerifyMailMutation";
import { Base } from "@/templates/Base";
import {
	EnumStatusDialog,
	useDialogLoginAction,
} from "@/zustand/useDialogLogin";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const messageVerify = {
	success:
		"Chúc mừng bạn đã xác thực thành công. Vui lòng đăng nhập trước khi khám phá mọi tính năng đến từ Noobstore",
	fail: "Xác thực email thất bại",
};

const VerifyPage = () => {
	const router = useRouter();
	const { token = "" } = router.query;
	const verifyMailMutation = useVerifyMailMutation({
		onSuccess: () => {
			setContentVerify(messageVerify.success);
		},
		onError: () => {
			setContentVerify(messageVerify.fail);
		},
	});
	const { mutate, isPending } = verifyMailMutation;
	const { toggleDialogLogin } = useDialogLoginAction();
	const [contentVerify, setContentVerify] = useState<string>("");

	const handleBackToHome = () => {
		router.push(HOME_URL);
	};

	useEffect(() => {
		console.log("token", token);
		if (token && typeof token === "string") {
			mutate({ token });
		}
	}, [token]);

	if (isPending) {
		return (
			<Base>
				<Box>
					<CircularProgress size={64} color="primary" />
				</Box>
			</Base>
		);
	}

	return (
		<Base
			styles={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}>
			<Box
				display="flex"
				justifyContent="center"
				flexDirection="column"
				alignItems="center"
				gridGap={16}>
				<Box maxWidth="60vw" textAlign="center">
					<Typography variant="h6" className="break-words">
						{contentVerify}
					</Typography>
				</Box>
				<Box
					visibility={contentVerify !== "" ? "visible" : "hidden"}
					display="flex"
					justifyContent="center"
					alignItems="center"
					gridGap={16}>
					<Button
						className="bg-gray-400 normal-case hover:bg-gray-500"
						onClick={handleBackToHome}>
						Quay lại trang chủ
					</Button>
					<Button
						className="bg-red-400 normal-case hover:bg-red-500"
						classes={{
							label: "text-white",
						}}
						onClick={() =>
							toggleDialogLogin(EnumStatusDialog.OPEN)
						}>
						Đăng nhập ngay
					</Button>
				</Box>
			</Box>
		</Base>
	);
};

export default VerifyPage;
