import DiscordIcon from "@/icons/discord";
import FacebookIcon from "@/icons/facebook";
import KeyboardIcon from "@/icons/keyboard";
import KeysetIcon from "@/icons/keyset";
import vnmkLogo from "@/icons/vnmk";
import {
	ENUM_FILM_TYPE,
	ENUM_GREASE_TYPE,
	ENUM_SPRING_TYPE,
	ENUM_SWITCH_TYPE,
	EnumCategoryType,
	EnumOrderStatus,
	EnumPaymentMethod,
	EnumPaymentStaus,
	EnumPostPriceType,
	EnumProductType,
	EnumSaleStatus,
	EnumServiceType,
	EnumSwitchType,
	EnumUploadStatus,
	EnumUsedProductStatus,
} from "@/interface/interface";
import { PhoneIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import {
	ArchiveBoxIcon,
	ArrowPathIcon,
	ChartPieIcon,
	ChatBubbleBottomCenterTextIcon,
	CursorArrowRaysIcon,
	FingerPrintIcon,
	FolderPlusIcon,
	UserGroupIcon,
	WrenchIcon,
} from "@heroicons/react/24/outline";
import { CircleCheck, CircleX, DoorOpen, ShieldCheck } from "lucide-react";
import {
	COD_ICON,
	FLAGS_VIETNAM,
	MOMO_VERTICAL_LOGO,
	NEW_MISSING_IMAGE,
} from "./Images";

export const categories = [
	{
		name: "Hàng có sẵn",
		description: "Get a better understanding of your traffic",
		href: "#",
		icon: ArchiveBoxIcon,
	},
	{
		name: "Groupbuy",
		description: "Speak directly to your customers",
		href: "#",
		icon: UserGroupIcon,
	},
	{
		name: "Keyset",
		description: "Your customers’ data will be safe and secure",
		href: "#",
		icon: KeysetIcon,
	},
	{
		name: "Keyboard",
		description: "Connect with third-party tools",
		href: "#",
		icon: KeyboardIcon,
	},
	{
		name: "Phụ kiện",
		description: "Build strategic funnels that will convert",
		href: "#",
		icon: FolderPlusIcon,
	},
];

export const news = [
	{
		name: "Trạng thái Groupbuy",
		description: "Get a better understanding of your traffic",
		href: "#",
		icon: ChartPieIcon,
	},
	{
		name: "Quy định Groupbuy",
		description: "Speak directly to your customers",
		href: "#",
		icon: CursorArrowRaysIcon,
	},
	{
		name: "Keyset",
		description: "Your customers’ data will be safe and secure",
		href: "#",
		icon: FingerPrintIcon,
	},
	{
		name: "Keyboard",
		description: "Connect with third-party tools",
		href: "#",
		icon: FingerPrintIcon,
	},
	{
		name: "Trạng thái đơn hàng",
		description: "Kiểm tra đơn hàng của bạn tại đây",
		href: "#",
		icon: ArrowPathIcon,
	},
];

export const contact = [
	{
		name: "Câu chuyện về chúng tôi",
		description: "Biết thêm về chúng tôi",
		href: "#",
		icon: ChartPieIcon,
	},
	{
		name: "Liên hệ hỗ trợ",
		description: "Bạn cần hỗ trợ, liên hệ ngay",
		href: "/contact",
		icon: CursorArrowRaysIcon,
	},
	{
		name: "Địa chỉ",
		description: "Bạn cần tìm địa chỉ mua hàng",
		href: "/location",
		icon: CursorArrowRaysIcon,
	},
];

export const comunity = [
	{
		name: "VNMK",
		description: "Hội nhóm bàn phím cơ Việt Nam",
		href: "#",
		icon: vnmkLogo,
	},
	{
		name: "Discord",
		description: "Kênh discord của shop",
		href: "#",
		icon: DiscordIcon,
	},
	{
		name: "Facebook",
		description: "Facebook của shop",
		href: "https://facebook.com/noobassembly",
		icon: FacebookIcon,
	},
];

export const callsToAction = [
	{ name: "Watch demo", href: "#", icon: PlayCircleIcon },
	{ name: "Contact sales", href: "#", icon: PhoneIcon },
];

export const services = [
	{
		name: "Assemble",
		href: "/services",
		description: "Dịch vụ lắp ráp bàn phím",
		icon: WrenchIcon,
	},
	{
		name: "Tư vấn",
		href: "https://facebook.com/noobassembly",
		icon: ChatBubbleBottomCenterTextIcon,
		description: "Tư vấn về bàn phím",
		isNewPage: true,
	},
	{
		name: "Shop 2nd",
		href: "/used",
		icon: ArchiveBoxIcon,
		description: "Sản phẩm đã qua sử dụng",
	},
];

export const CountryFlag = [
	{ id: 0, name: "Việt Nam", imageUrl: FLAGS_VIETNAM, value: "vietnam" },
];

export const ShippingMethod = [
	{
		id: 0,
		name: "Giao hàng tiêu chuẩn",
		value: "STANDARD",
		price: 0,
		// textRight: "35.000đ"
	},
	{
		id: 1,
		name: "Hoả tốc nội thành Hồ Chí Minh",
		value: "EXPRESS",
		textRight: "60.000đ",
		price: 60000,
	},
	// {
	//   id: 1,
	//   name: "Giao hàng nhanh",
	//   value: "express",
	// },
	// {
	//   id: 2,
	//   name: "Giao hàng trong ngày",
	//   value: "same_day",
	// }
];

export const PaymentMethod = [
	{ id: 0, name: "Thanh toán khi nhận hàng", value: "CASH_ON_DELIVERY" },
	{
		id: 2,
		name: "Thanh toán qua ví Momo",
		value: "MOMO",
		imagesRight: [MOMO_VERTICAL_LOGO],
	},
	{
		id: 3,
		name: "Thanh toán qua ngân hàng nội địa",
		value: "ATM",
		disabled: true,
	},
];

export const BillingAddress = [
	{ id: 0, name: "Giống như địa chỉ giao hàng", value: "same_address" },
	// {
	//   id: 1,
	//   name: "Sử dụng một địa chỉ khác",
	//   value: "different_address",
	// 	isHaveCollapse: true,
	// 	collapseType: ENUM_CHECKOUT_COLLAPSE_TYPE.NEW_ADDRESS
	// }
];

export const LabelPaymentMethod: Record<EnumPaymentMethod, string> = {
	[EnumPaymentMethod.CASH_ON_DELIVERY]: "Thanh toán khi nhận hàng",
	[EnumPaymentMethod.MOMO]: "Thanh toán qua ví Momo",
	// [EnumPaymentMethod.ZALO_PAY]: "Thanh toán qua ZaloPay",
	[EnumPaymentMethod.BANK_TRANSFER]: "Thanh toán qua ngân hàng",
	[EnumPaymentMethod.NOT_FOUND]: "Không xác định",
};

export const MapPaymentMethod: Record<
	EnumPaymentMethod,
	{ icon: string; label: string }
> = {
	[EnumPaymentMethod.CASH_ON_DELIVERY]: {
		icon: COD_ICON,
		label: "Thanh toán khi nhận hàng",
	},
	[EnumPaymentMethod.MOMO]: { icon: MOMO_VERTICAL_LOGO, label: "Momo" },
	// [EnumPaymentMethod.ZALO_PAY]: "ZaloPay",
	[EnumPaymentMethod.BANK_TRANSFER]: {
		icon: NEW_MISSING_IMAGE,
		label: "Chuyển khoản",
	},
	[EnumPaymentMethod.NOT_FOUND]: {
		icon: NEW_MISSING_IMAGE,
		label: "Không xác định",
	},
};

export const MapShippingMethod: Record<string, string> = {
	STANDARD: "Giao hàng tiêu chuẩn",
	EXPRESS: "Giao hàng nhanh",
	SAME_DAY: "Giao hàng trong ngày",
};

export const MapKeyName = {
	switchQuantity: "Số lượng",
	switchType: "Loại switch",
	isLube: "Lube",
	isFilm: "Film",
	filmType: "Loại film",
	filmColor: "Màu film",
	isProvideFilm: "Mua film",
	isGrease: "Sử dụng grease",
	greaseType: "Loại grease",
	isAddStabilizer: "Thêm stabilizer",
	layout: "Layout",
	isProvideStab: "Mua stabilizer",
	isAddAssemble: "Thêm assemble",
	assebleLayout: "Layout",
	isChangeSpring: "Thay spring",
	springType: "Loại spring",
	springWeight: "Lực nhấn",
	isProvideSpring: "Mua spring",
};

export const serviceFormText: Record<EnumServiceType, any> = {
	[EnumServiceType.KEYBOARD]: {
		title: "Đăng ký dịch vụ bàn phím",
		subTitle:
			"Thêm các thông tin về cái dịch vụ bạn cần sử dụng và tải lên những hình ảnh hiện tại của phím",
	},
	[EnumServiceType.SWITCHES]: {
		title: "Đăng ký dịch vụ switch",
		subTitle:
			"Thêm các thông tin về cái dịch vụ bạn cần sử dụng và tải lên những hình ảnh hiện tại của switch",
	},
	[EnumServiceType.STABILIZER]: {
		title: "Đăng ký dịch vụ stabilizer",
		subTitle:
			"Thêm các thông tin về cái dịch vụ bạn cần sử dụng và tải lên những hình ảnh hiện tại của stabilizer",
	},
	[EnumServiceType.OTHER]: {
		title: "Thông tin dịch vụ khác",
		subTitle:
			"Thêm các thông tin về cái dịch vụ bạn cần sử dụng và tải lên những hình ảnh hiện tại của phím",
	},
};

export const tempKeyboardOptions = [
	{ id: 0, value: "1", label: "Option 1" },
	{ id: 1, value: "2", label: "Option 2" },
];

export const tempPCBOptions = [
	{ id: 0, value: "HOTSWAP", label: "Mạch hotswap" },
	{ id: 1, value: "SOLDER", label: "Mạch hàn" },
];

export const tempLayoutOptions = [
	{ id: 0, value: "60", label: "60%" },
	{ id: 1, value: "65", label: "65%" },
];

export const tempSwitchTypeOptions = [
	{
		id: 0,
		value: EnumSwitchType.LINEAR,
		label: "Linear (Không khấc, không clicky)",
	},
	{
		id: 1,
		value: EnumSwitchType.TACTILE,
		label: "Tactile (Khấc, không clicky)",
	},
	{ id: 2, value: EnumSwitchType.CLICKY, label: "Clicky (Khấc, clicky)" },
	{ id: 3, value: "", label: "Khác" },
];

export const tempSwitchBrandOptions = [
	{ id: 0, value: "1", label: "Option 1" },
	{ id: 1, value: "2", label: "Option 2" },
];

export const tempSwitchStatusOptions = [
	{ id: 0, value: "NEW", label: "Mới" },
	{ id: 1, value: "USED", label: "Đã qua sử dụng hoặc đã được xử lý" },
];

export const tempStabilizerMountTypeOptions = [
	{ id: 0, value: "PCB_MOUNTED", label: "PCB Mounted (Bắt trên mạch)" },
	{ id: 1, value: "PLATE_MOUNTED", label: "Plate Mounted (Bắt trên plate)" },
];

export const tempStabilizerTypeOptions = [
	{ id: 0, value: "SCREW_IN", label: "Screw in (Cố định bằng ốc)" },
	{ id: 1, value: "CLIP-IN", label: "Clip-In (Bắt trên mạch bằng ngàm)" },
];

export const tempStabilizerSizeOptions = [
	{ id: 0, value: "2U", label: "2U Stabilizer" },
	{ id: 1, value: "6.25U", label: "6.25U Stabilizer" },
	{ id: 2, value: "7U", label: "7U Stabilizer" },
];

export const tempStabilizerStatusOptions = [
	{ id: 0, value: "NEW", label: "Mới" },
	{ id: 1, value: "USED", label: "Đã qua sử dụng hoặc đã được xử lý" },
];

export const CategoryStatus: Record<EnumSaleStatus, string> = {
	[EnumSaleStatus.GB]: "Group buy",
	[EnumSaleStatus.INSTOCK]: "Sẵn hàng",
	[EnumSaleStatus.OUTSTOCK]: "Hết hàng",
	[EnumSaleStatus.TBD]: "",
	[EnumSaleStatus.ALL]: "",
};

export const UsedProductStatus: Record<EnumUsedProductStatus, string> = {
	[EnumUsedProductStatus.AVAILABLE]: "Còn hàng",
	[EnumUsedProductStatus.SOLD]: "Đã bán",
};

export const BreadcumbTitle: Record<string, string> = {
	contact: "Liên hệ",
	collection: "Bộ sưu tập",
	products: "Sản phẩm",
	category: "Danh mục",
	login: "Đăng nhập",
	account: "Tài khoản",
	services: "Dịch vụ",
	shop: "Shop",
	cart: "Giỏ hàng",
	used: "Shop 2nd",
};

export const MapCategoryStatus: Record<EnumSaleStatus, any> = {
	[EnumSaleStatus.GB]: { label: "Group buy", color: "bg-blue-500" },
	[EnumSaleStatus.INSTOCK]: { label: "Sẵn hàng", color: "bg-green-500" },
	[EnumSaleStatus.OUTSTOCK]: { label: "Hết hàng", color: "bg-red-500" },
	[EnumSaleStatus.TBD]: { label: "", color: "" },
	[EnumSaleStatus.ALL]: { label: "", color: "" },
};

export const RCategoryType: Record<EnumCategoryType, string> = {
	[EnumCategoryType.ACCESSORY]: "Phụ kiện",
	[EnumCategoryType.KEYCAP]: "Keycap",
	[EnumCategoryType.SWITCH]: "Switch",
	[EnumCategoryType.KEYBOARD]: "Bàn phím",
	[EnumCategoryType.TBA]: "Khác",
};

export const sortOptions = [
	{ name: "Most Popular", href: "#", current: false },
	{ name: "Best Rating", href: "#", current: false },
	{ name: "Newest", href: "#", current: false },
	{ name: "Price: Low to High", href: "#", current: false },
	{ name: "Price: High to Low", href: "#", current: false },
];
export const subCategories = [
	{ name: "Totes", href: "#" },
	{ name: "Backpacks", href: "#" },
	{ name: "Travel Bags", href: "#" },
	{ name: "Hip Bags", href: "#" },
	{ name: "Laptop Sleeves", href: "#" },
];
export const filters = [
	{
		id: "status",
		name: "Trạng thái",
		options: [
			{
				value: EnumSaleStatus.INSTOCK,
				label: "Còn hàng",
				checked: false,
			},
			// { value: EnumSaleStatus.OUTSTOCK, label: "Hết hàng", checked: false },
		],
	},
	// {
	// 	id: "product_type",
	// 	name: "Loại sản phẩm",
	// 	options: [
	// 		{ value: "instock", label: "Còn hàng", checked: false },
	// 		{ value: "outstock", label: "Hết hàng", checked: false },
	// 	],
	// },
	// {
	// 	id: "color",
	// 	name: "Màu sắc",
	// 	options: [
	// 		{ value: "white", label: "White", checked: false },
	// 		{ value: "beige", label: "Beige", checked: false },
	// 		{ value: "blue", label: "Blue", checked: false },
	// 		{ value: "brown", label: "Brown", checked: false },
	// 		{ value: "green", label: "Green", checked: false },
	// 		{ value: "purple", label: "Purple", checked: false },
	// 	],
	// },
	// {
	// 	id: "category",
	// 	name: "Danh mục",
	// 	options: [
	// 		{ value: "new-arrivals", label: "New Arrivals", checked: false },
	// 		{ value: "sale", label: "Sale", checked: false },
	// 		{ value: "travel", label: "Travel", checked: false },
	// 		{ value: "organization", label: "Organization", checked: false },
	// 		{ value: "accessories", label: "Accessories", checked: false },
	// 	],
	// },
	// {
	// 	id: "brand",
	// 	name: "Thương hiệu",
	// 	options: [
	// 		{ value: "new-arrivals", label: "New Arrivals", checked: false },
	// 		{ value: "sale", label: "Sale", checked: false },
	// 		{ value: "travel", label: "Travel", checked: false },
	// 		{ value: "organization", label: "Organization", checked: false },
	// 		{ value: "accessories", label: "Accessories", checked: false },
	// 	],
	// },
];

export const PAGE_LINK = {
	HOME: "/",
	PRODUCTS: "/products",
	COLLECTION: "/collection",
	CONTACT: "/contact",
	LOGIN: "/account/login",
	REGISTER: "/account/register",
	ACCOUNT: "/account/dashboard",
	USER_DETAIL: "/account/detail",
	USER_NOTIFICATION: "/account/notification",
	USER_ADDRESSES: "/account/addresses",
	USER_ORDERS: "/account/orders",
};

export const VNCity = [
	{
		name: "An Giang",
		slug: "an-giang",
		type: "tinh",
		nameWithType: "Tỉnh An Giang",
		code: "89",
		isDeleted: false,
	},
	{
		name: "Bà Rịa - Vũng Tàu",
		slug: "ba-ria---vung-tau",
		type: "tinh",
		nameWithType: "Tỉnh Bà Rịa - Vũng Tàu",
		code: "77",
		isDeleted: false,
	},
	{
		name: "Bạc Liêu",
		slug: "bac-lieu",
		type: "tinh",
		nameWithType: "Tỉnh Bạc Liêu",
		code: "95",
		isDeleted: false,
	},
	{
		name: "Bắc Giang",
		slug: "bac-giang",
		type: "tinh",
		nameWithType: "Tỉnh Bắc Giang",
		code: "24",
		isDeleted: false,
	},
	{
		name: "Bắc Kạn",
		slug: "bac-kan",
		type: "tinh",
		nameWithType: "Tỉnh Bắc Kạn",
		code: "06",
		isDeleted: false,
	},
	{
		name: "Bắc Ninh",
		slug: "bac-ninh",
		type: "tinh",
		nameWithType: "Tỉnh Bắc Ninh",
		code: "27",
		isDeleted: false,
	},
	{
		name: "Bến Tre",
		slug: "ben-tre",
		type: "tinh",
		nameWithType: "Tỉnh Bến Tre",
		code: "83",
		isDeleted: false,
	},
	{
		name: "Bình Dương",
		slug: "binh-duong",
		type: "tinh",
		nameWithType: "Tỉnh Bình Dương",
		code: "74",
		isDeleted: false,
	},
	{
		name: "Bình Định",
		slug: "binh-dinh",
		type: "tinh",
		nameWithType: "Tỉnh Bình Định",
		code: "52",
		isDeleted: false,
	},
	{
		name: "Bình Phước",
		slug: "binh-phuoc",
		type: "tinh",
		nameWithType: "Tỉnh Bình Phước",
		code: "70",
		isDeleted: false,
	},
	{
		name: "Bình Thuận",
		slug: "binh-thuan",
		type: "tinh",
		nameWithType: "Tỉnh Bình Thuận",
		code: "60",
		isDeleted: false,
	},
	{
		name: "Cà Mau",
		slug: "ca-mau",
		type: "tinh",
		nameWithType: "Tỉnh Cà Mau",
		code: "96",
		isDeleted: false,
	},
	{
		name: "Cao Bằng",
		slug: "cao-bang",
		type: "tinh",
		nameWithType: "Tỉnh Cao Bằng",
		code: "04",
		isDeleted: false,
	},
	{
		name: "Cần Thơ",
		slug: "can-tho",
		type: "thanh-pho",
		nameWithType: "Thành phố Cần Thơ",
		code: "92",
		isDeleted: false,
	},
	{
		name: "Đà Nẵng",
		slug: "da-nang",
		type: "thanh-pho",
		nameWithType: "Thành phố Đà Nẵng",
		code: "48",
		isDeleted: false,
	},
	{
		name: "Đắk Lắk",
		slug: "dak-lak",
		type: "tinh",
		nameWithType: "Tỉnh Đắk Lắk",
		code: "66",
		isDeleted: false,
	},
	{
		name: "Đắk Nông",
		slug: "dak-nong",
		type: "tinh",
		nameWithType: "Tỉnh Đắk Nông",
		code: "67",
		isDeleted: false,
	},
	{
		name: "Điện Biên",
		slug: "dien-bien",
		type: "tinh",
		nameWithType: "Tỉnh Điện Biên",
		code: "11",
		isDeleted: false,
	},
	{
		name: "Đồng Nai",
		slug: "dong-nai",
		type: "tinh",
		nameWithType: "Tỉnh Đồng Nai",
		code: "75",
		isDeleted: false,
	},
	{
		name: "Đồng Tháp",
		slug: "dong-thap",
		type: "tinh",
		nameWithType: "Tỉnh Đồng Tháp",
		code: "87",
		isDeleted: false,
	},
	{
		name: "Gia Lai",
		slug: "gia-lai",
		type: "tinh",
		nameWithType: "Tỉnh Gia Lai",
		code: "64",
		isDeleted: false,
	},
	{
		name: "Hà Giang",
		slug: "ha-giang",
		type: "tinh",
		nameWithType: "Tỉnh Hà Giang",
		code: "02",
		isDeleted: false,
	},
	{
		name: "Hà Nam",
		slug: "ha-nam",
		type: "tinh",
		nameWithType: "Tỉnh Hà Nam",
		code: "35",
		isDeleted: false,
	},
	{
		name: "Hà Nội",
		slug: "ha-noi",
		type: "thanh-pho",
		nameWithType: "Thành phố Hà Nội",
		code: "01",
		isDeleted: false,
	},
	{
		name: "Hà Tĩnh",
		slug: "ha-tinh",
		type: "tinh",
		nameWithType: "Tỉnh Hà Tĩnh",
		code: "42",
		isDeleted: false,
	},
	{
		name: "Hải Dương",
		slug: "hai-duong",
		type: "tinh",
		nameWithType: "Tỉnh Hải Dương",
		code: "30",
		isDeleted: false,
	},
	{
		name: "Hải Phòng",
		slug: "hai-phong",
		type: "thanh-pho",
		nameWithType: "Thành phố Hải Phòng",
		code: "31",
		isDeleted: false,
	},
	{
		name: "Hậu Giang",
		slug: "hau-giang",
		type: "tinh",
		nameWithType: "Tỉnh Hậu Giang",
		code: "93",
		isDeleted: false,
	},
	{
		name: "Hoà Bình",
		slug: "hoa-binh",
		type: "tinh",
		nameWithType: "Tỉnh Hoà Bình",
		code: "17",
		isDeleted: false,
	},
	{
		name: "Hồ Chí Minh",
		slug: "ho-chi-minh",
		type: "thanh-pho",
		nameWithType: "Thành phố Hồ Chí Minh",
		code: "79",
		isDeleted: false,
	},
	{
		name: "Hưng Yên",
		slug: "hung-yen",
		type: "tinh",
		nameWithType: "Tỉnh Hưng Yên",
		code: "33",
		isDeleted: false,
	},
	{
		name: "Khánh Hòa",
		slug: "khanh-hoa",
		type: "tinh",
		nameWithType: "Tỉnh Khánh Hòa",
		code: "56",
		isDeleted: false,
	},
	{
		name: "Kiên Giang",
		slug: "kien-giang",
		type: "tinh",
		nameWithType: "Tỉnh Kiên Giang",
		code: "91",
		isDeleted: false,
	},
	{
		name: "Kon Tum",
		slug: "kon-tum",
		type: "tinh",
		nameWithType: "Tỉnh Kon Tum",
		code: "62",
		isDeleted: false,
	},
	{
		name: "Lai Châu",
		slug: "lai-chau",
		type: "tinh",
		nameWithType: "Tỉnh Lai Châu",
		code: "12",
		isDeleted: false,
	},
	{
		name: "Lạng Sơn",
		slug: "lang-son",
		type: "tinh",
		nameWithType: "Tỉnh Lạng Sơn",
		code: "20",
		isDeleted: false,
	},
	{
		name: "Lào Cai",
		slug: "lao-cai",
		type: "tinh",
		nameWithType: "Tỉnh Lào Cai",
		code: "10",
		isDeleted: false,
	},
	{
		name: "Lâm Đồng",
		slug: "lam-dong",
		type: "tinh",
		nameWithType: "Tỉnh Lâm Đồng",
		code: "68",
		isDeleted: false,
	},
	{
		name: "Long An",
		slug: "long-an",
		type: "tinh",
		nameWithType: "Tỉnh Long An",
		code: "80",
		isDeleted: false,
	},
	{
		name: "Nam Định",
		slug: "nam-dinh",
		type: "tinh",
		nameWithType: "Tỉnh Nam Định",
		code: "36",
		isDeleted: false,
	},
	{
		name: "Nghệ An",
		slug: "nghe-an",
		type: "tinh",
		nameWithType: "Tỉnh Nghệ An",
		code: "40",
		isDeleted: false,
	},
	{
		name: "Ninh Bình",
		slug: "ninh-binh",
		type: "tinh",
		nameWithType: "Tỉnh Ninh Bình",
		code: "37",
		isDeleted: false,
	},
	{
		name: "Ninh Thuận",
		slug: "ninh-thuan",
		type: "tinh",
		nameWithType: "Tỉnh Ninh Thuận",
		code: "58",
		isDeleted: false,
	},
	{
		name: "Phú Thọ",
		slug: "phu-tho",
		type: "tinh",
		nameWithType: "Tỉnh Phú Thọ",
		code: "25",
		isDeleted: false,
	},
	{
		name: "Phú Yên",
		slug: "phu-yen",
		type: "tinh",
		nameWithType: "Tỉnh Phú Yên",
		code: "54",
		isDeleted: false,
	},
	{
		name: "Quảng Bình",
		slug: "quang-binh",
		type: "tinh",
		nameWithType: "Tỉnh Quảng Bình",
		code: "44",
		isDeleted: false,
	},
	{
		name: "Quảng Nam",
		slug: "quang-nam",
		type: "tinh",
		nameWithType: "Tỉnh Quảng Nam",
		code: "49",
		isDeleted: false,
	},
	{
		name: "Quảng Ngãi",
		slug: "quang-ngai",
		type: "tinh",
		nameWithType: "Tỉnh Quảng Ngãi",
		code: "51",
		isDeleted: false,
	},
	{
		name: "Quảng Ninh",
		slug: "quang-ninh",
		type: "tinh",
		nameWithType: "Tỉnh Quảng Ninh",
		code: "22",
		isDeleted: false,
	},
	{
		name: "Quảng Trị",
		slug: "quang-tri",
		type: "tinh",
		nameWithType: "Tỉnh Quảng Trị",
		code: "45",
		isDeleted: false,
	},
	{
		name: "Sóc Trăng",
		slug: "soc-trang",
		type: "tinh",
		nameWithType: "Tỉnh Sóc Trăng",
		code: "94",
		isDeleted: false,
	},
	{
		name: "Sơn La",
		slug: "son-la",
		type: "tinh",
		nameWithType: "Tỉnh Sơn La",
		code: "14",
		isDeleted: false,
	},
	{
		name: "Tây Ninh",
		slug: "tay-ninh",
		type: "tinh",
		nameWithType: "Tỉnh Tây Ninh",
		code: "72",
		isDeleted: false,
	},
	{
		name: "Thái Bình",
		slug: "thai-binh",
		type: "tinh",
		nameWithType: "Tỉnh Thái Bình",
		code: "34",
		isDeleted: false,
	},
	{
		name: "Thái Nguyên",
		slug: "thai-nguyen",
		type: "tinh",
		nameWithType: "Tỉnh Thái Nguyên",
		code: "19",
		isDeleted: false,
	},
	{
		name: "Thanh Hóa",
		slug: "thanh-hoa",
		type: "tinh",
		nameWithType: "Tỉnh Thanh Hóa",
		code: "38",
		isDeleted: false,
	},
	{
		name: "Thừa Thiên Huế",
		slug: "thua-thien-hue",
		type: "tinh",
		nameWithType: "Tỉnh Thừa Thiên Huế",
		code: "46",
		isDeleted: false,
	},
	{
		name: "Tiền Giang",
		slug: "tien-giang",
		type: "tinh",
		nameWithType: "Tỉnh Tiền Giang",
		code: "82",
		isDeleted: false,
	},
	{
		name: "Trà Vinh",
		slug: "tra-vinh",
		type: "tinh",
		nameWithType: "Tỉnh Trà Vinh",
		code: "84",
		isDeleted: false,
	},
	{
		name: "Tuyên Quang",
		slug: "tuyen-quang",
		type: "tinh",
		nameWithType: "Tỉnh Tuyên Quang",
		code: "08",
		isDeleted: false,
	},
	{
		name: "Vĩnh Long",
		slug: "vinh-long",
		type: "tinh",
		nameWithType: "Tỉnh Vĩnh Long",
		code: "86",
		isDeleted: false,
	},
	{
		name: "Vĩnh Phúc",
		slug: "vinh-phuc",
		type: "tinh",
		nameWithType: "Tỉnh Vĩnh Phúc",
		code: "26",
		isDeleted: false,
	},
	{
		name: "Yên Bái",
		slug: "yen-bai",
		type: "tinh",
		nameWithType: "Tỉnh Yên Bái",
		code: "15",
		isDeleted: false,
	},
];

export const genderOptions = [
	{ id: 0, name: "Nam", value: 1 },
	{ id: 1, name: "Nữ", value: 2 },
	{ id: 2, name: "Khác", value: 0 },
];

export const SWITCH_TYPE_LABEL: Record<ENUM_SWITCH_TYPE, string> = {
	[ENUM_SWITCH_TYPE.LINEAR]: "Linear",
	[ENUM_SWITCH_TYPE.TACTILE]: "Tactile",
	[ENUM_SWITCH_TYPE.CLICKY]: "Clicky",
	[ENUM_SWITCH_TYPE.UNKNOWN]: "Chưa định dạng",
};

export const GREASE_TYPE_LABEL: Record<ENUM_GREASE_TYPE, string> = {
	[ENUM_GREASE_TYPE.KRYTOX]: "Krytox",
	[ENUM_GREASE_TYPE.TRIBOSYS]: "Tribosys",
	[ENUM_GREASE_TYPE.UNKNOWN]: "Chưa định dạng",
};

export const FILM_TYPE_LABEL: Record<ENUM_FILM_TYPE, string> = {
	[ENUM_FILM_TYPE.TX]: "TX",
	[ENUM_FILM_TYPE.UNKNOWN]: "Chưa định dạng loại",
};

export const FILM_COLOR_LABEL: Record<string, string> = {
	clear: "Trong suốt",
	black: "Đen",
	white: "Trắng",
	UNKNOWN: "Chưa định dạng",
};

export const SPRING_TYPE_LABEL: Record<ENUM_SPRING_TYPE, string> = {
	[ENUM_SPRING_TYPE.TX]: "TX",
	[ENUM_SPRING_TYPE.UNKNOWN]: "Chưa định dạng",
};

export const SPRING_WEIGHT_LABEL: Record<string, string> = {
	"55": "55g",
	"62": "62g",
	"67": "67g",
	"78": "78g",
	UNKNOWN: "Chưa định dạng",
};

export const KEYBOARD_LAYOUT_OPTS = [
	{ value: 0, label: "< 60%" },
	{ value: 1, label: "60% - 75%" },
	{ value: 2, label: "TKL" },
	{ value: 3, label: "Fullsize" },
	{ value: 4, label: "1800" },
];

export const CATEGORY_TYPE: Record<number, string> = {
	0: "",
	1: "Kit bàn phím",
	2: "",
	3: "",
	4: "",
	5: "",
	6: "",
};

export const LabelItemSelectedBlock: Record<EnumProductType, string> = {
	[EnumProductType.CASE]: "Case",
	[EnumProductType.PCB]: "Mạch",
	[EnumProductType.PLATE]: "Plate",
	[EnumProductType.ACCESSORIES]: "Phụ kiện",
	[EnumProductType.KEYCAP]: "Kit",
	[EnumProductType.SWITCH]: "Pack",
	[EnumProductType.ARTISAN]: "Artisan",
	[EnumProductType.ETC]: "Mẫu",
	[EnumProductType.FULL_KIT]: "Full kit",
};

export const UploadStatusProperty: Record<
	EnumUploadStatus,
	{ color: string; text: string; icon?: React.ReactElement }
> = {
	[EnumUploadStatus.UPLOADING]: {
		color: "text-gray-500",
		text: "Đang tải lên...",
	},
	[EnumUploadStatus.DONE]: {
		color: "text-green-500",
		text: "Hoàn thành",
		icon: <CircleCheck className="stroke-green-500" size={18} />,
	},
	[EnumUploadStatus.ERROR]: {
		color: "text-red-500",
		text: "Không thể tải lên",
		icon: <CircleX className="stroke-red-500" size={18} />,
	},
};

export const mapPostSaleType: Record<
	EnumPostPriceType,
	{ label: string; value: string }
> = {
	[EnumPostPriceType.ABSOLUTE]: {
		label: "Giá bán thẳng",
		value: EnumPostPriceType.ABSOLUTE,
	},
	[EnumPostPriceType.OBO]: {
		label: "Giá thương lượng",
		value: EnumPostPriceType.OBO,
	},
};

export const postSaleTypeOptions = [
	{ label: "Giá bán thẳng", value: EnumPostPriceType.ABSOLUTE },
	{ label: "Giá thương lượng", value: EnumPostPriceType.OBO, disabled: true },
];

export const postProductTypeOptions = [
	{ label: "Bàn phím", value: EnumCategoryType.KEYBOARD },
	{ label: "Switch", value: EnumCategoryType.SWITCH },
	{ label: "Key set/Keycap", value: EnumCategoryType.KEYCAP },
	{ label: "Phụ kiện", value: EnumCategoryType.ACCESSORY },
	{ label: "Khác", value: EnumCategoryType.TBA },
];

export const postProductAddonService = [
	{
		name: "Giao nhận tận nơi",
		value: "noobstore_delivery_add_on",
		price: 35000,
		subName: "dịch vụ giao hàng tận nơi, đảm bảo hàng hóa an toàn",
		isPercent: false,
	},
	{
		name: "Gói bảo hiểm hàng hóa",
		value: "noobstore_insurance_add_on",
		isPercent: true,
		price: 1,
		minPrice: 30000,
		subName: "Bảo hiểm hàng hóa, trách nhiệm được trao lại cho noobstore",
	},
	{
		name: "Đóng gói chắc chắn",
		value: "noobstore_packaging_add_on",
		price: 30000,
		subName: "Hỗ trợ đóng gói hàng an toàn, tránh va đập",
		isPercent: false,
	},
	{
		name: "Trung gian uy tín",
		value: "noobstore_trust_intermediary_add_on",
		isPercent: true,
		price: 0.5,
		minPrice: 20000,
		subName:
			"Hỗ trợ làm trung gian giao dịch, đảm bảo an toàn cho cả 2 bên mua và bán",
	},
];

export const RProductPartType: Record<
	EnumProductType,
	{ label: string; value: EnumProductType; disabled?: boolean }
> = {
	[EnumProductType.CASE]: { label: "Case", value: EnumProductType.CASE },
	[EnumProductType.PCB]: { label: "Mạch phím", value: EnumProductType.PCB },
	[EnumProductType.PLATE]: { label: "Plate", value: EnumProductType.PLATE },
	[EnumProductType.ACCESSORIES]: {
		label: "Phụ kiện",
		value: EnumProductType.ACCESSORIES,
	},
	[EnumProductType.KEYCAP]: {
		label: "Keycap",
		value: EnumProductType.KEYCAP,
	},
	[EnumProductType.SWITCH]: {
		label: "Switch",
		value: EnumProductType.SWITCH,
	},
	[EnumProductType.ARTISAN]: {
		label: "Artisan",
		value: EnumProductType.ARTISAN,
	},
	[EnumProductType.ETC]: { label: "Khác", value: EnumProductType.ETC },
	[EnumProductType.FULL_KIT]: {
		label: "Kit full",
		value: EnumProductType.FULL_KIT,
	},
};

export const productPartOptions = [
	{
		label: RProductPartType[EnumProductType.CASE].label,
		value: EnumProductType.CASE,
	},
	{
		label: RProductPartType[EnumProductType.PCB].label,
		value: EnumProductType.PCB,
	},
	{
		label: RProductPartType[EnumProductType.PLATE].label,
		value: EnumProductType.PLATE,
	},
	{
		label: RProductPartType[EnumProductType.ACCESSORIES].label,
		value: EnumProductType.ACCESSORIES,
	},
	{
		label: RProductPartType[EnumProductType.KEYCAP].label,
		value: EnumProductType.KEYCAP,
	},
	{
		label: RProductPartType[EnumProductType.SWITCH].label,
		value: EnumProductType.SWITCH,
	},
	{
		label: RProductPartType[EnumProductType.ARTISAN].label,
		value: EnumProductType.ARTISAN,
	},
	{
		label: RProductPartType[EnumProductType.ETC].label,
		value: EnumProductType.ETC,
	},
];

export const ORDER_STATUS_LABEL: Record<
	EnumOrderStatus,
	{ label: string; color: string }
> = {
	[EnumOrderStatus.ORDERED]: {
		label: "Đã được đặt hàng",
		color: "text-gray-600",
	},
	[EnumOrderStatus.PENDING]: {
		label: "Đang đợi xác nhận",
		color: "text-gray-600",
	},
	[EnumOrderStatus.PROCESSING]: {
		label: "Đang được xử lý",
		color: "text-gray-600",
	},
	[EnumOrderStatus.COMPLETED]: {
		label: "Đã giao hàng",
		color: "text-green-600",
	},
	[EnumOrderStatus.CANCELLED]: { label: "Đã hủy", color: "text-red-600" },
};

export const mapPaymentStatus: Record<
	EnumPaymentStaus,
	{ label: string; color: string; bgColor: string }
> = {
	[EnumPaymentStaus.PAID]: {
		label: "Đã thanh toán",
		color: "text-green-500",
		bgColor: "bg-green-500",
	},
	[EnumPaymentStaus.PENDING]: {
		label: "Đang đợi thanh toán",
		color: "text-red-500",
		bgColor: "bg-red-400",
	},
	[EnumPaymentStaus.CANCELLED]: {
		label: "Đã hủy",
		color: "text-grey-500",
		bgColor: "bg-grey-400",
	},
};

export const DEFAULT_SERVICE_PLAN = [
	{
		id: 1,
		name: "Gói dịch vụ cơ bản",
		price: 0,
		subName: "Thời gian và Thứ tự xử lý theo hàng chờ",
		dateTime: "5-7 ngày",
		min: 5,
		max: 7,
		isActive: true,
		value: "NB-SP-BASIC",
	},
	{
		id: 2,
		name: "Gói dịch vụ nâng cao",
		price: 150000,
		subName: "Thời gian và thứ tự xử lý được ưu tiên",
		dateTime: "2-4 ngày",
		min: 2,
		max: 4,
		isActive: true,
		value: "NB-SP-EXTREME",
	},
];

export const MAPPING_DELIVERY_METHOD: Record<string, string> = {
	SELF_DELIVERY_SELF_PICKUP: "Khách tự giao và nhận",
	STORE_PICKUP_SELF_DELIVERY: "Giao nhận một chiều",
	STORE_DELIVERY_SELF_PICKUP: "Giao nhận một chiều",
	STORE_DELIVERY_STORE_PICKUP: "Giao nhận hai chiều",
};

export const MAPPING_ICON_SUMMARY_SERVICE: Record<
	string,
	{ icon: React.ReactNode; color: string }
> = {
	INSURANCE_PACKAGE: {
		icon: <ShieldCheck size={24} />,
		color: "text-green-500",
	},
	DOOR_TO_DOOR: { icon: <DoorOpen size={24} />, color: "text-green-500" },
};

export const SUGGESTED_DISCOUNT_CODES = [
	{
		code: "NOOB10",
		description: "Giảm 10% cho đơn đầu tiên",
		discountPercent: 10,
	},
	{
		code: "FREESHIP",
		description: "Miễn phí vận chuyển",
		discountAmount: 50000,
	},
	{
		code: "SUMMER50",
		description: "Giảm 50.000đ cho đơn từ 500.000đ",
		discountPercent: 0,
		discountAmount: 50000,
		condition: { minTotalValue: 500000 },
	},
];
