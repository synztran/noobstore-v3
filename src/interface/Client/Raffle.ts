import { EnumPaymentMethod, EnumRafflePaymentStatus } from "../interface";
import { EnumMakerStatus, IBEResponseMakerMember } from "./Maker";

interface IImage {
	path: string;
	alt: string;
}

export enum EnumRaffleType {
	RAFFLE = "RAFFLE",
	SALE = "SALE",
}

export enum EnumRaffleStatus {
	UPCOMING = "UPCOMING",
	ONGOING = "ONGOING",
	ENDED = "ENDED",
	CANCELLED = "CANCELLED",
}

export enum EnumPlatformPayment {
	BANK_TRANSFER = "BANK_TRANSFER",
	PAYPAL = "PAYPAL",
	MOMO = "MOMO",
	COD = "COD",
}

export interface IBEResponseRaffleProduct {
	id?: string;
	raffleId: string;
	productName: string;
	category?: string;
	totalQuantity: number;
	limitPerEntry: number;
	price: number;
	salePrice?: number;
	description: string;
	images?: IImage[];
	thumbnail?: IImage;
	attributes?: Record<string, unknown>;
	createdAt: Date;
	updatedAt?: Date;
}

export interface IBEResponseProductOption {
	// id: string;
	label: string;
	url?: string; // redirect to product page
	price: number;
	thumbnail?: IImage;
	raffleQuantity: number | null;
	productId: string;
}

export interface IBEResponsePaymentMethod {
	id?: string;
	updatedAt?: Date;
	bankName?: string;
	bankNumber?: string;
	bankBranch?: string;
	isVerified: boolean;
	createdAt: Date;
}

export interface IBEResponseMakerInfo {
	brandName: string;
	makerId: string;
	teamMembers?: IBEResponseMakerMember[];
	email: string;
	isActive: boolean;
	websiteUrl?: string;
	socialLinks?: Record<string, string>;
	bio?: string;
	logo?: IImage;
	verificationStatus: EnumMakerStatus;
	createdAt: Date;
	updatedAt?: Date;
	banners?: IImage[];
	raffleTimes?: number;
	rating?: {
		totalRatings: number;
		averageRating: number;
		comments: {
			content?: string;
			createdAt: string;
			updatedAt?: string;
			customerId?: number;
		}[];
		updatedAt?: string;
	};
}

export interface IBEResponseRaffleInfo {
	raffleId: string;
	title: string;
	description: string;
	makerId: string;

	makerInfo?: IBEResponseMakerInfo;

	raffleProducts: IBEResponseRaffleProduct[];
	productOptions: IBEResponseProductOption[];
	deliveryMethods: {
		id: string;
		name: string;
		price: number;
		estimatedDays: string;
	}[];

	images: IImage[];
	thumbnail?: IImage;
	features: string[];

	totalEntriesMax: number;
	joined: number;
	entriesLimit?: number;
	entryPrice: number;
	maxEntriesPerPerson: number;
	maxWinPerEntries: number; //  number product can win in one raffle

	maxWinners: number;
	secretKey?: string;
	isHaveSecretKey: boolean;
	isHasJoined?: boolean;

	startAt: Date;
	endAt: Date;
	expectedDeliveryAt?: Date;

	raffleType: EnumRaffleType;
	status: EnumRaffleStatus;
	isPublic: boolean;
	featured: boolean;

	isHomepageMain: boolean;
	homepagePriority: number;
	isPaidSlot: boolean;
	paidSlotExpiresAt?: Date;
	carouselPosition?: number;

	paymentMethod?: IBEResponsePaymentMethod;
	requiresPayment: boolean;

	totalEntries: number;
	totalParticipants: number;
	totalRevenue: number;

	winners: string[];
	winnerAnnouncedAt?: Date;

	tags?: string[];
	rules?: string;
	termsAndConditions?: string;

	createdAt: Date;
	updatedAt?: Date;
}

export interface IBEResponseRaffleProductSelection {
	productId: string;
	name: string;
	priority: number | null;
	selected: boolean;
	price: number;
	thumbnail?: IImage;
}

export interface IBEResponseRaffleShipping {
	address: string;
	city: string;
	companyName?: string;
	shippingMethod: {
		name: string;
		price: number | null;
	};
	trackingNumber?: string;
	expectedDelivery?: string;
}

export interface IBEResponseRaffleEntry {
	entryId: string;
	raffleId: string;
	email: string;
	name: string;
	phone: string;
	customerId: number | null;
	shipping: IBEResponseRaffleShipping;
	productSelections: IBEResponseRaffleProductSelection[];
	note?: string;
	status: string;
	payment: {
		paymentMethod: EnumPaymentMethod;
		attachments?: {
			path: string;
			alt: string;
		}[];
		createdAt: string;
		updatedAt: string;
		totalPrice: number;
		shippingFee: number;
		tax: number;
		subPrice: number;
		donation: {
			donationAmount: number;
			message?: string;
		};
	}; // customer payment schema
	paymentStatus: EnumRafflePaymentStatus;
	isWinner: boolean;
	createdAt: string;
	secretKey?: string;
}

export interface IRequestRaffleJoin {
	raffleId: string;
	shipping: {
		address: string;
		// zipCode: string;
		shippingMethod: {
			name: string;
			price: number | null;
		};
		companyName?: string;
		// note: string;
		city: string;
	};
	email: string;
	phone: string;
	customerId: number | null;
	name: string;
	raffleItemSelections: {
		productId: string;
		name: string;
		priority: number | null;
		selected: boolean;
		price: number;
		thumbnail?: IImage;
	}[];
	secretKey?: string;
	note?: string;
}

export interface ISubmitRafflePaymentDonation {
	donationAmount: number;
	message?: string;
}

export interface IPayloadSubmitRafflePayment {
	raffleId: string;
	entryId: string;
	donation: ISubmitRafflePaymentDonation;
	subPrice?: number;
	shippingFee?: number;
	tax?: number;
	totalPrice: number;
	paymentMethod: EnumPaymentMethod;
}

export interface IRequestProductOption {
	label: string;
	thumbnail?: IImage;
	price: number;
	raffleQuantity?: number;
}

export interface IRequestDeliveryMethod {
	name: string;
	price: number;
	estimatedDays: string;
}

export interface IRequestPaymentMethod {
	updatedAt?: Date;
	platform: EnumPlatformPayment;
	name: string;
	accountNumber: string;
	accountName: string;
	bankBranch?: string;
	bankName?: string;
	isVerified: boolean;
	isActive: boolean;
	createdAt: Date;
	qrCode?: IImage;
}

export interface IRequestRaffleCreation {
	title: string;
	description: string;
	makerId: string;

	productOptions: IRequestProductOption[];

	images: IImage[];
	thumbnail?: IImage;
	features: string[];

	totalEntries?: number;
	totalJoined?: number;
	entriesLimit?: number;
	entryPrice?: number;
	maxEntryPerPerson?: number;
	maxWinPerEntries?: number;
	deliveryMethods?: IRequestDeliveryMethod[];
	paymentMethods?: IRequestPaymentMethod[];

	// winner configuration
	maxWinners?: number;
	// special key
	secretKey?: string;

	// timing
	startAt: Date;
	endAt: Date;
	// status and metadata
	raffleType: EnumRaffleType;
	status: EnumRaffleStatus;
	isPublic: boolean;
	rules?: string;
	termsAndConditions?: string;

	// condition pickup winner
	winnerCondition?: { [key: string]: any }[];
}
