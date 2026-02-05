import { EnumRaffleType } from "@/interface/Client/Raffle";
import * as Yup from "yup";

export const makerRaffleFormValidationSchema = Yup.object().shape({
	title: Yup.string()
		.required("Vui lòng nhập tiêu đề raffle")
		.min(10, "Tiêu đề phải có ít nhất 10 ký tự")
		.max(200, "Tiêu đề không được vượt quá 200 ký tự"),

	description: Yup.string()
		.required("Vui lòng nhập mô tả")
		.min(50, "Mô tả phải có ít nhất 50 ký tự"),

	raffleType: Yup.string()
		.oneOf(Object.values(EnumRaffleType), "Loại raffle không hợp lệ")
		.required("Vui lòng chọn loại raffle"),

	entryPrice: Yup.number()
		.required("Vui lòng nhập giá vé")
		.min(0, "Giá vé phải lớn hơn hoặc bằng 0"),

	maxEntriesPerPerson: Yup.number()
		.required("Vui lòng nhập số vé tối đa mỗi người")
		.min(1, "Phải cho phép ít nhất 1 vé mỗi người"),

	maxWinPerEntries: Yup.number()
		.required("Vui lòng nhập số giải thắng tối đa")
		.min(1, "Phải có ít nhất 1 giải"),

	maxWinners: Yup.number()
		.required("Vui lòng nhập số người thắng tối đa")
		.min(1, "Phải có ít nhất 1 người thắng"),

	totalEntriesMax: Yup.number()
		.required("Vui lòng nhập tổng số vé")
		.min(1, "Phải có ít nhất 1 vé"),

	startAt: Yup.date()
		.required("Vui lòng chọn ngày bắt đầu")
		.min(new Date(), "Ngày bắt đầu phải sau thời điểm hiện tại"),

	endAt: Yup.date()
		.required("Vui lòng chọn ngày kết thúc")
		.min(Yup.ref("startAt"), "Ngày kết thúc phải sau ngày bắt đầu"),

	expectedDeliveryAt: Yup.date()
		.nullable()
		.min(Yup.ref("endAt"), "Ngày giao hàng dự kiến phải sau ngày kết thúc"),

	isHaveSecretKey: Yup.boolean(),
	secretKey: Yup.string().when("isHaveSecretKey", {
		is: true,
		then: (schema) => schema.required("Vui lòng nhập mã bí mật"),
		otherwise: (schema) => schema.notRequired(),
	}),

	homepagePriority: Yup.number()
		.min(0, "Độ ưu tiên phải lớn hơn hoặc bằng 0")
		.max(100, "Độ ưu tiên không được vượt quá 100"),

	productOptions: Yup.array()
		.of(
			Yup.object().shape({
				label: Yup.string().required("Vui lòng nhập tên sản phẩm"),
				price: Yup.number()
					.required("Vui lòng nhập giá")
					.min(0, "Giá phải lớn hơn hoặc bằng 0"),
				raffleQuantity: Yup.number()
					.nullable()
					.min(1, "Số lượng phải lớn hơn 0"),
			}),
		)
		.min(1, "Phải có ít nhất 1 sản phẩm"),

	deliveryMethods: Yup.array()
		.of(
			Yup.object().shape({
				name: Yup.string().required("Vui lòng nhập tên phương thức"),
				price: Yup.number()
					.required("Vui lòng nhập phí vận chuyển")
					.min(0, "Phí phải lớn hơn hoặc bằng 0"),
				estimatedDays: Yup.string().required(
					"Vui lòng nhập thời gian dự kiến",
				),
			}),
		)
		.min(1, "Phải có ít nhất 1 phương thức vận chuyển"),

	features: Yup.array().of(Yup.string()),
	tags: Yup.array().of(Yup.string()),
});
