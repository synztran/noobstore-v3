import { EnumProductType, EnumSaleStatus } from "@/interface";

export const CategoryStatus: Record<EnumSaleStatus, string> = {
	[EnumSaleStatus.GB]: "Group buy",
	[EnumSaleStatus.INSTOCK]: "Sẵn hàng",
	[EnumSaleStatus.OUTSTOCK]: "Hết hàng",
	[EnumSaleStatus.TBD]: "",
	[EnumSaleStatus.ALL]: "",
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
			{ value: EnumSaleStatus.INSTOCK, label: "Còn hàng", checked: false },
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
	USER_DETAIL: '/account/detail',
	USER_NOTIFICATION: '/account/notification',
	USER_ADDRESSES: '/account/addresses',
	USER_ORDERS: '/account/orders',
};


export const VNCity = [
	{
		"name": "An Giang",
		"slug": "an-giang",
		"type": "tinh",
		"name_with_type": "Tỉnh An Giang",
		"code": "89",
		"isDeleted": false
	},
	{
		"name": "Bà Rịa - Vũng Tàu",
		"slug": "ba-ria---vung-tau",
		"type": "tinh",
		"name_with_type": "Tỉnh Bà Rịa - Vũng Tàu",
		"code": "77",
		"isDeleted": false
	},
	{
		"name": "Bạc Liêu",
		"slug": "bac-lieu",
		"type": "tinh",
		"name_with_type": "Tỉnh Bạc Liêu",
		"code": "95",
		"isDeleted": false
	},
	{
		"name": "Bắc Giang",
		"slug": "bac-giang",
		"type": "tinh",
		"name_with_type": "Tỉnh Bắc Giang",
		"code": "24",
		"isDeleted": false
	},
	{
		"name": "Bắc Kạn",
		"slug": "bac-kan",
		"type": "tinh",
		"name_with_type": "Tỉnh Bắc Kạn",
		"code": "06",
		"isDeleted": false
	},
	{
		"name": "Bắc Ninh",
		"slug": "bac-ninh",
		"type": "tinh",
		"name_with_type": "Tỉnh Bắc Ninh",
		"code": "27",
		"isDeleted": false
	},
	{
		"name": "Bến Tre",
		"slug": "ben-tre",
		"type": "tinh",
		"name_with_type": "Tỉnh Bến Tre",
		"code": "83",
		"isDeleted": false
	},
	{
		"name": "Bình Dương",
		"slug": "binh-duong",
		"type": "tinh",
		"name_with_type": "Tỉnh Bình Dương",
		"code": "74",
		"isDeleted": false
	},
	{
		"name": "Bình Định",
		"slug": "binh-dinh",
		"type": "tinh",
		"name_with_type": "Tỉnh Bình Định",
		"code": "52",
		"isDeleted": false
	},
	{
		"name": "Bình Phước",
		"slug": "binh-phuoc",
		"type": "tinh",
		"name_with_type": "Tỉnh Bình Phước",
		"code": "70",
		"isDeleted": false
	},
	{
		"name": "Bình Thuận",
		"slug": "binh-thuan",
		"type": "tinh",
		"name_with_type": "Tỉnh Bình Thuận",
		"code": "60",
		"isDeleted": false
	},
	{
		"name": "Cà Mau",
		"slug": "ca-mau",
		"type": "tinh",
		"name_with_type": "Tỉnh Cà Mau",
		"code": "96",
		"isDeleted": false
	},
	{
		"name": "Cao Bằng",
		"slug": "cao-bang",
		"type": "tinh",
		"name_with_type": "Tỉnh Cao Bằng",
		"code": "04",
		"isDeleted": false
	},
	{
		"name": "Cần Thơ",
		"slug": "can-tho",
		"type": "thanh-pho",
		"name_with_type": "Thành phố Cần Thơ",
		"code": "92",
		"isDeleted": false
	},
	{
		"name": "Đà Nẵng",
		"slug": "da-nang",
		"type": "thanh-pho",
		"name_with_type": "Thành phố Đà Nẵng",
		"code": "48",
		"isDeleted": false
	},
	{
		"name": "Đắk Lắk",
		"slug": "dak-lak",
		"type": "tinh",
		"name_with_type": "Tỉnh Đắk Lắk",
		"code": "66",
		"isDeleted": false
	},
	{
		"name": "Đắk Nông",
		"slug": "dak-nong",
		"type": "tinh",
		"name_with_type": "Tỉnh Đắk Nông",
		"code": "67",
		"isDeleted": false
	},
	{
		"name": "Điện Biên",
		"slug": "dien-bien",
		"type": "tinh",
		"name_with_type": "Tỉnh Điện Biên",
		"code": "11",
		"isDeleted": false
	},
	{
		"name": "Đồng Nai",
		"slug": "dong-nai",
		"type": "tinh",
		"name_with_type": "Tỉnh Đồng Nai",
		"code": "75",
		"isDeleted": false
	},
	{
		"name": "Đồng Tháp",
		"slug": "dong-thap",
		"type": "tinh",
		"name_with_type": "Tỉnh Đồng Tháp",
		"code": "87",
		"isDeleted": false
	},
	{
		"name": "Gia Lai",
		"slug": "gia-lai",
		"type": "tinh",
		"name_with_type": "Tỉnh Gia Lai",
		"code": "64",
		"isDeleted": false
	},
	{
		"name": "Hà Giang",
		"slug": "ha-giang",
		"type": "tinh",
		"name_with_type": "Tỉnh Hà Giang",
		"code": "02",
		"isDeleted": false
	},
	{
		"name": "Hà Nam",
		"slug": "ha-nam",
		"type": "tinh",
		"name_with_type": "Tỉnh Hà Nam",
		"code": "35",
		"isDeleted": false
	},
	{
		"name": "Hà Nội",
		"slug": "ha-noi",
		"type": "thanh-pho",
		"name_with_type": "Thành phố Hà Nội",
		"code": "01",
		"isDeleted": false
	},
	{
		"name": "Hà Tĩnh",
		"slug": "ha-tinh",
		"type": "tinh",
		"name_with_type": "Tỉnh Hà Tĩnh",
		"code": "42",
		"isDeleted": false
	},
	{
		"name": "Hải Dương",
		"slug": "hai-duong",
		"type": "tinh",
		"name_with_type": "Tỉnh Hải Dương",
		"code": "30",
		"isDeleted": false
	},
	{
		"name": "Hải Phòng",
		"slug": "hai-phong",
		"type": "thanh-pho",
		"name_with_type": "Thành phố Hải Phòng",
		"code": "31",
		"isDeleted": false
	},
	{
		"name": "Hậu Giang",
		"slug": "hau-giang",
		"type": "tinh",
		"name_with_type": "Tỉnh Hậu Giang",
		"code": "93",
		"isDeleted": false
	},
	{
		"name": "Hoà Bình",
		"slug": "hoa-binh",
		"type": "tinh",
		"name_with_type": "Tỉnh Hoà Bình",
		"code": "17",
		"isDeleted": false
	},
	{
		"name": "Hồ Chí Minh",
		"slug": "ho-chi-minh",
		"type": "thanh-pho",
		"name_with_type": "Thành phố Hồ Chí Minh",
		"code": "79",
		"isDeleted": false
	},
	{
		"name": "Hưng Yên",
		"slug": "hung-yen",
		"type": "tinh",
		"name_with_type": "Tỉnh Hưng Yên",
		"code": "33",
		"isDeleted": false
	},
	{
		"name": "Khánh Hòa",
		"slug": "khanh-hoa",
		"type": "tinh",
		"name_with_type": "Tỉnh Khánh Hòa",
		"code": "56",
		"isDeleted": false
	},
	{
		"name": "Kiên Giang",
		"slug": "kien-giang",
		"type": "tinh",
		"name_with_type": "Tỉnh Kiên Giang",
		"code": "91",
		"isDeleted": false
	},
	{
		"name": "Kon Tum",
		"slug": "kon-tum",
		"type": "tinh",
		"name_with_type": "Tỉnh Kon Tum",
		"code": "62",
		"isDeleted": false
	},
	{
		"name": "Lai Châu",
		"slug": "lai-chau",
		"type": "tinh",
		"name_with_type": "Tỉnh Lai Châu",
		"code": "12",
		"isDeleted": false
	},
	{
		"name": "Lạng Sơn",
		"slug": "lang-son",
		"type": "tinh",
		"name_with_type": "Tỉnh Lạng Sơn",
		"code": "20",
		"isDeleted": false
	},
	{
		"name": "Lào Cai",
		"slug": "lao-cai",
		"type": "tinh",
		"name_with_type": "Tỉnh Lào Cai",
		"code": "10",
		"isDeleted": false
	},
	{
		"name": "Lâm Đồng",
		"slug": "lam-dong",
		"type": "tinh",
		"name_with_type": "Tỉnh Lâm Đồng",
		"code": "68",
		"isDeleted": false
	},
	{
		"name": "Long An",
		"slug": "long-an",
		"type": "tinh",
		"name_with_type": "Tỉnh Long An",
		"code": "80",
		"isDeleted": false
	},
	{
		"name": "Nam Định",
		"slug": "nam-dinh",
		"type": "tinh",
		"name_with_type": "Tỉnh Nam Định",
		"code": "36",
		"isDeleted": false
	},
	{
		"name": "Nghệ An",
		"slug": "nghe-an",
		"type": "tinh",
		"name_with_type": "Tỉnh Nghệ An",
		"code": "40",
		"isDeleted": false
	},
	{
		"name": "Ninh Bình",
		"slug": "ninh-binh",
		"type": "tinh",
		"name_with_type": "Tỉnh Ninh Bình",
		"code": "37",
		"isDeleted": false
	},
	{
		"name": "Ninh Thuận",
		"slug": "ninh-thuan",
		"type": "tinh",
		"name_with_type": "Tỉnh Ninh Thuận",
		"code": "58",
		"isDeleted": false
	},
	{
		"name": "Phú Thọ",
		"slug": "phu-tho",
		"type": "tinh",
		"name_with_type": "Tỉnh Phú Thọ",
		"code": "25",
		"isDeleted": false
	},
	{
		"name": "Phú Yên",
		"slug": "phu-yen",
		"type": "tinh",
		"name_with_type": "Tỉnh Phú Yên",
		"code": "54",
		"isDeleted": false
	},
	{
		"name": "Quảng Bình",
		"slug": "quang-binh",
		"type": "tinh",
		"name_with_type": "Tỉnh Quảng Bình",
		"code": "44",
		"isDeleted": false
	},
	{
		"name": "Quảng Nam",
		"slug": "quang-nam",
		"type": "tinh",
		"name_with_type": "Tỉnh Quảng Nam",
		"code": "49",
		"isDeleted": false
	},
	{
		"name": "Quảng Ngãi",
		"slug": "quang-ngai",
		"type": "tinh",
		"name_with_type": "Tỉnh Quảng Ngãi",
		"code": "51",
		"isDeleted": false
	},
	{
		"name": "Quảng Ninh",
		"slug": "quang-ninh",
		"type": "tinh",
		"name_with_type": "Tỉnh Quảng Ninh",
		"code": "22",
		"isDeleted": false
	},
	{
		"name": "Quảng Trị",
		"slug": "quang-tri",
		"type": "tinh",
		"name_with_type": "Tỉnh Quảng Trị",
		"code": "45",
		"isDeleted": false
	},
	{
		"name": "Sóc Trăng",
		"slug": "soc-trang",
		"type": "tinh",
		"name_with_type": "Tỉnh Sóc Trăng",
		"code": "94",
		"isDeleted": false
	},
	{
		"name": "Sơn La",
		"slug": "son-la",
		"type": "tinh",
		"name_with_type": "Tỉnh Sơn La",
		"code": "14",
		"isDeleted": false
	},
	{
		"name": "Tây Ninh",
		"slug": "tay-ninh",
		"type": "tinh",
		"name_with_type": "Tỉnh Tây Ninh",
		"code": "72",
		"isDeleted": false
	},
	{
		"name": "Thái Bình",
		"slug": "thai-binh",
		"type": "tinh",
		"name_with_type": "Tỉnh Thái Bình",
		"code": "34",
		"isDeleted": false
	},
	{
		"name": "Thái Nguyên",
		"slug": "thai-nguyen",
		"type": "tinh",
		"name_with_type": "Tỉnh Thái Nguyên",
		"code": "19",
		"isDeleted": false
	},
	{
		"name": "Thanh Hóa",
		"slug": "thanh-hoa",
		"type": "tinh",
		"name_with_type": "Tỉnh Thanh Hóa",
		"code": "38",
		"isDeleted": false
	},
	{
		"name": "Thừa Thiên Huế",
		"slug": "thua-thien-hue",
		"type": "tinh",
		"name_with_type": "Tỉnh Thừa Thiên Huế",
		"code": "46",
		"isDeleted": false
	},
	{
		"name": "Tiền Giang",
		"slug": "tien-giang",
		"type": "tinh",
		"name_with_type": "Tỉnh Tiền Giang",
		"code": "82",
		"isDeleted": false
	},
	{
		"name": "Trà Vinh",
		"slug": "tra-vinh",
		"type": "tinh",
		"name_with_type": "Tỉnh Trà Vinh",
		"code": "84",
		"isDeleted": false
	},
	{
		"name": "Tuyên Quang",
		"slug": "tuyen-quang",
		"type": "tinh",
		"name_with_type": "Tỉnh Tuyên Quang",
		"code": "08",
		"isDeleted": false
	},
	{
		"name": "Vĩnh Long",
		"slug": "vinh-long",
		"type": "tinh",
		"name_with_type": "Tỉnh Vĩnh Long",
		"code": "86",
		"isDeleted": false
	},
	{
		"name": "Vĩnh Phúc",
		"slug": "vinh-phuc",
		"type": "tinh",
		"name_with_type": "Tỉnh Vĩnh Phúc",
		"code": "26",
		"isDeleted": false
	},
	{
		"name": "Yên Bái",
		"slug": "yen-bai",
		"type": "tinh",
		"name_with_type": "Tỉnh Yên Bái",
		"code": "15",
		"isDeleted": false
	}
]

export const genderOptions = [
	{
		id: 0,
		name: "Nam",
		value: 1
	},
	{
		id: 1,
		name: "Nữ",
		value: 2
	},
	{
		id: 2,
		name: "Khác",
		value: 0
	}
]

export enum ENUM_SWITCH_TYPE {
	"LINEAR"  = 0,
	"TACTILE" = 1,
	"CLICKY"  = 2,
	"UNKNOWN" = 3
}

export const SWITCH_TYPE_LABEL: Record<ENUM_SWITCH_TYPE, string> = {
	[ENUM_SWITCH_TYPE.LINEAR]: "Linear",
	[ENUM_SWITCH_TYPE.TACTILE]: "Tactile",
	[ENUM_SWITCH_TYPE.CLICKY]: "Clicky",
	[ENUM_SWITCH_TYPE.UNKNOWN]: "Chưa định dạng",
}

export enum ENUM_GREASE_TYPE {
	"KRYTOX" = 0,
	"TRIBOSYS" = 1,
	"UNKNOWN" = 2
}

export const GREASE_TYPE_LABEL: Record<ENUM_GREASE_TYPE, string> = {
	[ENUM_GREASE_TYPE.KRYTOX]: "Krytox",
	[ENUM_GREASE_TYPE.TRIBOSYS]: "Tribosys",
	[ENUM_GREASE_TYPE.UNKNOWN]: "Chưa định dạng",
}

export enum ENUM_FILM_TYPE {
	"TX" = 0,
	"UNKNOWN" = 1
}

export const FILM_TYPE_LABEL: Record<ENUM_FILM_TYPE, string> = {
	[ENUM_FILM_TYPE.TX]: "TX",
	[ENUM_FILM_TYPE.UNKNOWN]: "Chưa định dạng loại",
}

export const FILM_COLOR_LABEL: Record<string, string> = {
	"clear": "Trong suốt",
	"black": "Đen",
	"white": "Trắng",
	"UNKNOWN": "Chưa định dạng",
}

export enum ENUM_SPRING_TYPE {
	"TX" = 0,
	"UNKNOWN" = 1
}

export const SPRING_TYPE_LABEL: Record<ENUM_SPRING_TYPE, string> = {
	[ENUM_SPRING_TYPE.TX]: "TX",
	[ENUM_SPRING_TYPE.UNKNOWN]: "Chưa định dạng",
}

export const SPRING_WEIGHT_LABEL: Record<string, string> = {
	"55": "55g",
	"62": "62g",
	"67": "67g",
	"78": "78g",
	"UNKNOWN": "Chưa định dạng",
}

export enum ENUM_STABILIZER_LAYOUT {
	"7U" = 1,
	"6.25U" = 2,
}

export const KEYBOARD_LAYOUT_OPTS = [
	{
		value: 0,
		label: "< 60%"
	},
	{
		value: 1,
		label: "60% - 75%"
	},
	{
		value: 2,
		label: "TKL"
	},
	{
		value: 3,
		label: "Fullsize"
	},
	{
		value: 4,
		label: "1800"
	},
]

export const CATEGORY_TYPE: Record<number, string> = {
	0: "",
	1: "Kit bàn phím",
	2: "",
	3: "",
	4: "",
	5: "",
	6: "",
}

export const LabelItemSelectedBlock: Record<EnumProductType, string> = {
	[EnumProductType.CASE]: "Case",
	[EnumProductType.PCB]: "Mạch",
	[EnumProductType.PLATE]: "Plate",
	[EnumProductType.ACCESSORIES]: "Phụ kiện",
	[EnumProductType.KEYCAP]: "Kit",
	[EnumProductType.SWITCH]: "Pack",
	[EnumProductType.ARTISAN]: "Artisan",
	[EnumProductType.ETC]: "Mẫu",
}