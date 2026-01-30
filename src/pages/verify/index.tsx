import { Button } from "@/components/ReUIComponent/Button";
import { HOME_URL } from "@/constants/path";
import { useVerifyMailMutation } from "@/react-query/verify/api/useVerifyMailMutation";
import { Base } from "@/templates/Base";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	EnumStatusDialog,
	useDialogLoginAction,
} from "@/zustand/useDialogLogin";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const messageVerify: Record<
	"customer" | "maker",
	{ success: string; fail: string }
> = {
	customer: {
		success:
			"Chúc mừng bạn đã xác thực thành công. Vui lòng đăng nhập trước khi khám phá mọi tính năng đến từ Noobstore",
		fail: "Xác thực email thất bại",
	},
	maker: {
		success:
			"Chúc mừng bạn đã xác thực thành công. Vui lòng đăng nhập trước khi khám phá mọi tính năng dành cho Maker đến từ Noobstore",
		fail: "Xác thực email thất bại",
	},
};

const VerifyPage = () => {
	const router = useRouter();
	const { token = "", type = "" } = router.query || {};
	const verifyMailMutation = useVerifyMailMutation({
		onSuccess: () => {
			setContentVerify(
				messageVerify[type as "customer" | "maker"].success,
			);
		},
		onError: () => {
			setContentVerify(messageVerify[type as "customer" | "maker"].fail);
		},
	});
	const { mutate, isPending } = verifyMailMutation;
	const { toggleDialogLogin } = useDialogLoginAction();
	const [contentVerify, setContentVerify] = useState<string>("");

	const handleBackToHome = () => {
		router.push(HOME_URL);
	};

	useEffect(() => {
		if (!type) {
			NotifyUtils.error(
				"Loại xác thực không hợp lệ. Vui lòng liên hệ hỗ trợ",
			);
			return;
		}
		if (token && typeof token === "string") {
			mutate({ token, type: type as "customer" | "maker" });
		}
	}, [token, type]);

	if (isPending) {
		return (
			<Base
				styles={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}>
				<div className="flex flex-col items-center justify-center gap-6">
					<CircularProgress size={60} />
					<Typography variant="h6" className="text-gray-600">
						Đang xác thực email của bạn...
					</Typography>
					<Typography variant="body2" className="text-gray-500">
						Vui lòng đợi, chúng tôi đang xử lý yêu cầu của bạn
					</Typography>
				</div>
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
			<div className="flex flex-col items-center justify-center gap-16">
				<Box maxWidth="60vw" textAlign="center">
					<Typography variant="h6" className="wrap-break-word">
						{contentVerify}
					</Typography>
				</Box>
				<div
					className={`${contentVerify !== "" ? "block" : "hidden"} flex justify-center items-center gap-16`}>
					<Button
						className="bg-gray-400 normal-case hover:bg-gray-500"
						onClick={handleBackToHome}>
						Quay lại trang chủ
					</Button>
					<Button
						className="bg-red-400 normal-case hover:bg-red-500"
						onClick={() =>
							toggleDialogLogin(Boolean(EnumStatusDialog.OPEN))
						}>
						Đăng nhập ngay
					</Button>
				</div>
			</div>
		</Base>
	);
};

export default VerifyPage;
