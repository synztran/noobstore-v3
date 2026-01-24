import { EnumRaffleStatus, IBEResponseRaffleEntry } from "../Client/Raffle";
import {
	EnumPaymentMethod,
	EnumRafflePaymentStepStatus,
	EnumRafflePaymentStepType,
} from "../interface";

export type TShippingAt = IRequestShippingAddress;

export interface IAuthUser {
	accountId: number;
	avatar: string;
	cartId: string;
	createdAt: string; // ISO date string
	customerId: number;
	email: string;
	fbUrl: string;
	firstName: string;
	getNoti: boolean;
	lastName: string;
	paypal: string;
	phoneAreaCode: string;
	phoneNumber: string;
	shippingAt: TShippingAt[]; // Assuming shippingAt is an array of any type
	verified: boolean;
	verifiedAt: string; // Assuming this is also a string
	role?: string; // "admin" | "user"
}

export interface IRequestShippingAddress {
	firstName: string;
	lastName: string;
	companyName: string;
	email: string;
	city: string;
	phoneNumber: string;
	address: string;
	country?: string;
	zipCode?: string;
	isDefault?: boolean;
}

export interface IBEResponseRafflePaymentMethod {
	accountNumber: string;
	accountName: string;
	bankBranch?: string;
	bankCode?: string;
	bankName?: string;
	isActive: boolean;
	isVerified: boolean;
	platform: EnumPaymentMethod;
	qrCode: {
		path: string;
		alt: string;
	};
	name: string;
}

export type TResponseRaffleEntry = IBEResponseRaffleEntry & {
	raffleInfo: {
		title: string;
		images: {
			path: string;
			alt: string;
		}[];
		productOptions: {
			id: string;
			label: string;
			price: number;
			thumbnail: {
				path: string;
				alt: string;
			};
			priority?: number;
		}[];
		raffleId: string;
		status: EnumRaffleStatus;
		thumbnail: {
			path: string;
			alt: string;
		};
		makerId: string;
		paymentMethods: IBEResponseRafflePaymentMethod[];
		createdAt?: string;
		deliveryEstimate?: string;
		taxPercent?: number;
	};
	raffleWinInfo?: {
		productId: string;
		entryId: string;
	}[];
	joinedAt: string;
	isWinner?: boolean;
	makerInfo?: {
		bio: string;
		brandName: string;
		createdAt: string;
		email: string;
		makerId: string;
		socialLinks: Record<string, string>;
		isActive: boolean;
		teamMember: {
			name: string;
			isActive: boolean;
			createdAt: string;
		}[];
		updatedAt: string;
		verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
		websiteUrl: string;
		logo: {
			path: string;
			alt: string;
		};
		banners?: {
			path: string;
			alt: string;
		}[];
		raffleTimes: number;
	};
	timeline?: {
		id: number;
		stepType: EnumRafflePaymentStepType;
		title: string;
		description: string;
		status: EnumRafflePaymentStepStatus;
		isCurrent: boolean;
		timestamp: string;
		linkRedirect?: string;
		attachments?: {
			path: string;
			alt: string;
		}[];
		metadata: Record<string, any>;
	}[];
};
