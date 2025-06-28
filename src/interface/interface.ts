export enum EnumCategoryType {
	TBA = "TBA",
	KEYBOARD = "KEYBOARD",
	SWITCH = "SWITCH",
	KEYCAP = "KEYCAP",
	ACCESSORY = "ACCESSORY",
}

export enum EnumProductType {
	CASE = "CASE",
	PLATE = "PLATE",
	PCB = "PCB",
	ACCESSORIES = "ACCESSORIES",
	KEYCAP = "KEYCAP",
	SWITCH = "SWITCH",
	ARTISAN = "ARTISAN",
	FULL_KIT = "FULL_KIT",
	ETC = "",
}

export enum EnumSaleStatus {
	OUTSTOCK = "OUTSTOCK",
	INSTOCK = "INSTOCK",
	GB = "GB",
	TBD = "TBD",
	ALL = "",
}

export enum EnumUsedProductStatus {
	AVAILABLE = "AVAILABLE",
	SOLD = "SOLD",
}

export enum EnumSaleType {
	NORMAL = 0,
	SALE = 1,
	PRE_ORDER = 2,
}

export enum EnumProductOptStatus {
	OUTSTOCK = "OUTSTOCK",
	INSTOCK = "INSTOCK",
}

export enum EnumPostPriceType {
	ABSOLUTE = "ABSOLUTE",
	OBO = "OBO",
}

export enum EnumPaymentMethod {
	CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
	MOMO = "MOMO",
	// ZALO_PAY = "ZALO_PAY",
	BANK_TRANSFER = "BANK_TRANSFER",
	NOT_FOUND = "",
}

export enum EnumServiceType {
	KEYBOARD = "KEYBOARD",
	SWITCHES = "SWITCH",
	OTHER = "OTHER",
}

export enum EnumSwitchType {
	UNKNOWN = "UNKNOWN",
	LINEAR = "LINEAR",
	TACTILE = "TACTILE",
	CLICKY = "CLICKY",
}

export enum EnumCategorySaleType {
	ABSOLUTE = "ABSOLUTE",
	PERCENT = "PERCENT",
	NONE = "NONE",
}

export enum EnumPaymentStaus {
	PAID = "PAID",
	PENDING = "PENDING",
	CANCELLED = "CANCELLED",
}

export enum EnumOrderStatus {
	ORDERED = "ORDERED",
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

export enum ENUM_SWITCH_TYPE {
	"LINEAR" = 0,
	"TACTILE" = 1,
	"CLICKY" = 2,
	"UNKNOWN" = 3,
}

export enum ENUM_STABILIZER_LAYOUT {
	"7U" = 1,
	"6.25U" = 2,
}

export enum ENUM_SPRING_TYPE {
	"TX" = 0,
	"UNKNOWN" = 1,
}

export enum EnumUploadStatus {
	UPLOADING = "Uploading",
	DONE = "Uploaded",
	ERROR = "error",
}

export enum ENUM_GREASE_TYPE {
	"KRYTOX" = 0,
	"TRIBOSYS" = 1,
	"UNKNOWN" = 2,
}

export enum ENUM_FILM_TYPE {
	"TX" = 0,
	"UNKNOWN" = 1,
}

export interface ICartProduct {
	type: string;
	productId: string;
	productName: string;
	sellerName: string;
	quantity: number;
	price: number;
	total: number;
	categoryId: string;
	thumbnail: string;
	categoryName: string;
	slug: string;
	productOptions: IProductOption[];
	totalPrice: number;
}

export interface ICollapseContent {
	title: string;
	content: string;
}

export interface IOptionGroup {
	groupName: string;
	isRequired: boolean;
	isMultiple: boolean;
	optionIds: string[];
}

export interface IProduct {
	productId?: string;
	productName: string;
	replaceProductName: string;
	categoryId: string;
	slug: string;
	productPart: EnumProductType;
	status: EnumSaleStatus;
	price: number;
	salePrice: number;
	thumbnail: {
		path: string;
		size: number;
	};
	images: {
		path: string;
		size: number;
	}[];
	quantity: number;
	isActive: boolean;
	optionGroups: IOptionGroup;
	description?: string;
	isRequired?: boolean;
	isMultiple?: boolean;
	productOpts?: IProductOption[];
}

export interface ICategory {
	categoryId?: string;
	slug?: string;
	categoryName: string;
	author?: string;
	manufacturing?: string;
	proxyHost?: string;
	status: EnumSaleStatus;
	type: EnumCategoryType;
	dateStart?: string;
	dateEnd?: string;
	datePayment?: string;
	minPrice: number;
	maxPrice: number;
	tax: number;
	handle: number;
	// specs?: string;
	thumbnail: {
		path: string;
		size: number;
	};
	productBelong?: string;
	images?: {
		path: string;
		id: number;
	}[];
	saleType: EnumCategorySaleType;
	isActive: boolean;
	description: string;
	collapseContent?: ICollapseContent[];
	salePrice?: number;
	content: string;
}

export interface IOption {
	index: string;
	label: string;
	value: string;
	quantity: number;
	productType: EnumProductType;
	price: number;
	productName: string;
	productId: string;
	sellerName: string;
	categoryId: string;
	categoryName: string;
}

export interface ICartFee {
	shipping: number;
	tax: number;
	handling: number;
	voucherCode: string;
	voucherDiscount: number;
}

export interface IOrderedInfo {
	address: string;
	apartment: string;
	billingAddress: string;
	city: string;
	company: string;
	country: string;
	deliveryMethod: string;
	firstName: string;
	lastName: string;
	orderNote: string;
	paymentMethod: string;
	phoneNumber: string;
	postCode: string;
	province: string;
}

export interface IService {
	switchQuantity: number;
	switchType: ENUM_SWITCH_TYPE;
	isLube: boolean;
	isAddFilm: boolean;
	filmType: ENUM_FILM_TYPE;
	filmColor: string;
	isProvideFilm: boolean;
	isAddGrease: boolean;
	greaseType: ENUM_GREASE_TYPE;
	isAddStabilizer: boolean;
	layout: ENUM_STABILIZER_LAYOUT;
	isProvideStab: boolean;
	isAddAssemble: boolean;
	assebleLayout: number;
	isChangeSpring: boolean;
	springType: ENUM_SPRING_TYPE;
	springWeight: string;
	isProvideSpring: boolean;
	stabilizer2u: number;
	stabilizer7u: number;
	stabilizer625u: number;
}

export interface IUsedProduct {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	salePrice: number;
	type: EnumCategoryType;
	saleType: EnumCategorySaleType;
	images: {
		image_id: string;
		public_url: string;
		size: number;
	}[];
	listings: any[];
	views: number;
	favorites: number;
	owner: {
		customer_id: number;
		rating: number;
		total_sales: number;
		verified: boolean;
		full_name: string;
	};
	shortDescription: string;
	status: EnumUsedProductStatus;
}

export interface IProductOption {
	id?: string; // Assuming PyObjectId is a string representation
	name?: string;
	price?: number;
	salePrice?: number;
	description?: string;
	status?: EnumProductOptStatus; // Assuming ENUM_STATUS maps to EnumProductOptStatus
	quantity?: number;
	thumbnail?: string;
	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date | null;
	productPart?: EnumProductType;
}
