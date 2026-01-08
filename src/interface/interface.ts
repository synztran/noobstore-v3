// Enums
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
	BANK_TRANSFER = "BANK_TRANSFER",
	PAYPAL = "PAYPAL",
	NOT_FOUND = "",
}

export enum EnumServiceType {
	KEYBOARD = "KEYBOARD",
	SWITCHES = "SWITCH",
	STABILIZER = "STABILIZER",
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

export enum EnumPaymentStatus {
	SUBMITTED = "SUBMITTED",
	PAID = "PAID",
	PENDING = "PENDING",
	CANCELLED = "CANCELLED",
	REFUNDED = "REFUNDED",
}

export enum EnumOrderStatus {
	ORDERED = "ORDERED",
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

export enum EnumServiceStatus {
	DRAFT = "DRAFT",
	SCHEDULED = "SCHEDULED",
	IN_PROGRESS = "IN_PROGRESS",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

export enum EnumPaymentForm {
	FULL = "FULL",
	PARTIAL_10_PERCENT = "PARTIAL_10_PERCENT",
	PARTIAL_30_PERCENT = "PARTIAL_30_PERCENT",
	NOT_FOUND = "",
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

export enum EnumSwitchStatus {
	NEW = "NEW",
	USED = "USED",
}

export enum EnumUnitType {
	FLAT = "FLAT",
	UNIT = "UNIT",
}

export enum EnumShippingMethodCode {
	SELF_DELIVERY_SELF_PICKUP = "SELF_DELIVERY_SELF_PICKUP",
	STORE_DELIVERY_SELF_PICKUP = "STORE_DELIVERY_SELF_PICKUP",
	STORE_PICKUP_SELF_DELIVERY = "STORE_PICKUP_SELF_DELIVERY",
	STORE_DELIVERY_STORE_PICKUP = "STORE_DELIVERY_STORE_PICKUP",
}

export enum EnumStabilizerStatus {
	NEW = "NEW",
	USED = "USED",
}

export enum EnumPcbType {
	HOTSWAP = "HOTSWAP",
	SOLDER = "SOLDER",
}

export enum EnumStabilizerType {
	SCREW_IN = "SCREW_IN",
	CLIP_IN = "CLIP_IN",
}

export enum EnumStabilizerMountType {
	PCB_MOUNTED = "PCB_MOUNTED",
	PLATE_MOUNTED = "PLATE_MOUNTED",
}

export enum EnumStabilizerSize {
	"2U" = "2U",
	"6.25U" = "6.25U",
	"7U" = "7U",
}

export enum EnumFeeType {
	PLATFORMFEE = "platFormFee",
	SERVICEOUTOFTIMEFEE = "serviceOutOfTimeFee",
	SELECTEDPLAN = "selectedPlan",
	SHIPPING_METHOD = "shipping.method",
	SHIPPING_DELIVERY_METHOD = "shipping.deliveryMethod",
}

export enum EnumRafflePaymentStatus {
	PENDING = "PENDING",
	UNPAID = "UNPAID",
	PAID = "PAID",
	REFUNDED = "REFUNDED",
	CANCELLED = "CANCELLED",
}

// Interfaces & Types
export interface ICartProduct {
	type: string;
	productId: string;
	productName: string;
	sellerName: string;
	quantity: number;
	price: number;
	total: number;
	categoryId: string;
	thumbnail: {
		path: string;
		size: number;
	};
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
	basePrice: number;
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
	salePricePercent: number;
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
	brand?: string;
	rating?: {
		star: number;
		rateMessages: {
			accountId: number;
			star: number;
			message: string;
			createdAt: string;
		}[];
	};
	tags?: ITag[];
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
	// id?: string; // Assuming PyObjectId is a string representation
	name?: string;
	price?: number;
	salePrice?: number;
	description?: string;
	status?: EnumProductOptStatus; // Assuming ENUM_STATUS maps to EnumProductOptStatus
	quantity?: number;
	thumbnail?: {
		path?: string;
		alt?: string;
	};
	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date | null;
	productPart?: EnumProductType;
	productId?: string;
	productOptionId?: string;
	barCode?: string;
	attributes?: {
		[key: string]: string;
	};
}

export interface ITag {
	label: string;
	styles?: {
		[x: string]: string;
	};
	icon?: string;
	iconUrl?: string;
	value: string;
}

// reCAPTCHA related interfaces
export interface IRecaptchaConfig {
	siteKey: string;
	secretKey?: string;
	version?: string;
}

export interface IFormWithRecaptcha {
	recaptchaToken?: string;
}

export interface ICheckoutFormData extends IFormWithRecaptcha {
	email: string;
	firstName: string;
	lastName: string;
	company: string;
	address: string;
	apartment: string;
	city: {
		code: string;
		isDelete: boolean;
		name: string;
		name_with_type: string;
		slug: string;
		type: string;
	};
	province: string;
	postCode: string;
	phoneNumber: string;
	deliveryMethod: string;
	paymentMethod: string;
	billingAddress: string;
	country: string;
}

export interface IServiceBookingData extends IFormWithRecaptcha {
	planId: string | number;
	services: any[];
	shipping: any;
	contact: any;
	totalAmount: number;
}

export interface IProductPostData extends IFormWithRecaptcha {
	name: string;
	description: string;
	og_price: number;
	sale_price: number;
	type: string;
	sale_type: string;
	images: any[];
	service_price: number;
	service_add_on: any[];
	total_price: number;
	condition: string;
	owner: any;
	status: string;
	listings: any[];
	short_description: string;
}
