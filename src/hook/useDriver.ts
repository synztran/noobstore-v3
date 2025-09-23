import { useCallback, useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "@/styles/driver-overrides.module.css"; // <-- Import your custom CSS overrides here

export function useGuide(hours: number = 6) {
	const driverRef = useRef<any>(null);

	const steps = [
		{
			popover: {
				title: "Đặt dịch vụ cùng NoobStore!",
				description: `
					Chào mừng đến với trang đặt lịch dịch vụ của NoobStore 🎉.<br/><br/>
					Lần đâu có thể hơi bở ngỡ, hãy cùng chúng tôi trải nghiệm quy trình đặt lịch dịch vụ nhanh chóng và tiện lợi nhé!
					`,
				side: "bottom" as const,
				align: "center" as const,
			},
		},
		{
			element: "#service-plan-selection",
			popover: {
				title: "Lựa chọn gói dịch vụ phù hợp",
				description:
					"Tùy vào nhu cầu của bạn, bạn có thể chọn gói cơ bản hoặc nếu bạn hạn chế về thời gian và muốn đẩy nhanh tiến độ công việc, bạn có thể chọn gói nâng cao.",
				side: "bottom" as const,
				align: "center" as const,
			},
		},
		{
			element: "#delivery-selection-step",
			popover: {
				title: "Lựa chọn phương thức giao/nhận hàng",
				description:
					"Tùy vào nhu cầu di chuyển của bạn, bạn có thể lựa chọn phương thức giao/nhận hàng phù hợp. <br/><br/> Ví dụ như bạn muốn tự giao và nhận hàng, bạn có thể chọn phương thức giao hàng tiêu chuẩn, hoặc bạn muốn NoobStore giao hàng tận nơi, bạn có thể chọn phương thức giao hàng nhanh. Ngoài ra, NoobStore còn cùng cấp những gói bảo hiểm và hỗ trợ giao hàng tận tay.",
				side: "top" as const,
				align: "center" as const,
			},
		},
		{
			element: "#multi-service-form-step",
			popover: {
				title: "Lựa chọn dịch vụ bạn cần NoobStore hỗ trợ",
				description:
					"NoobStore cung cấp nhiều dịch vụ khác nhau để hỗ trợ bạn. Bạn có thể lựa chọn dịch vụ bạn cần NoobStore hỗ trợ.",
				side: "left" as const,
				align: "center" as const,
			},
		},
		{
			element: "#tab-keyboard",
			popover: {
				title: "Lựa chọn dịch vụ bạn cần sử dụng",
				description: "Lựa chọn dịch vụ bạn cần sử dụng ở mỗi tab.",
				side: "right" as const,
				align: "center" as const,
			},
		},
		{
			element: "#guide-add-new-task-keyboard",
			popover: {
				title: "Thêm mới dịch vụ bàn phím",
				description:
					"Bạn có thể thêm mới dịch vụ bằng cách nhấn vào nút thêm mới ở mỗi tab.",
				side: "left" as const,
				align: "center" as const,
			},
		},
		{
			element: "#summary-service-step",
			popover: {
				title: "Xem lại thông tin đơn hàng",
				description:
					"Bạn có thể xem thông tin dịch vụ mình đăng ký ở đây, đồng thời có thể thêm ghi chú vào đơn hàng, mã giảm giá nếu có.",
				side: "left" as const,
				align: "center" as const,
			},
		},

		{
			popover: {
				title: "Hoàn thành hướng dẫn",
				description:
					"Bạn đã hoàn thành hướng dẫn. Tiếp tục đặt dịch vụ nhé!",
			},
		},
	];

	// Initialize driver instance only once
	if (!driverRef.current) {
		driverRef.current = driver({
			animate: true,
			showProgress: true,
			showButtons: ["next", "previous", "close"],
			steps,
			nextBtnText: "Tiếp theo",
			prevBtnText: "Quay lại",
			doneBtnText: "Hoàn tất",
			progressText: `{{current}} / {{total}}`,
		});
	}

	// Check if guide can be shown
	const canGuide = (() => {
		const isGuided =
			typeof window !== "undefined" && window.localStorage
				? window.localStorage.getItem("isGuided")
				: null;
		const expires =
			typeof window !== "undefined" && window.localStorage
				? window.localStorage.getItem("isGuidedExpires")
				: null;
		const now = Date.now();
		return !isGuided || !expires || now > Number(expires);
	})();

	// Action to start the guide and set expiry
	const startGuide = useCallback(() => {
		if (driverRef.current) {
			driverRef.current.drive();
			const now = Date.now();
			localStorage.setItem("isGuided", "true");
			localStorage.setItem(
				"isGuidedExpires",
				String(now + hours * 60 * 60 * 1000)
			);
		}
	}, [hours]);

	return { startGuide, canGuide };
}
