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
	ACTIVE = "ACTIVE",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
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
	id: string;
	label: string;
	url?: string; // redirect to product page
	price: number;
	thumbnail?: IImage;
	raffleQuantity: number | null;
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

export interface IBEResponseSellerInfo {
	id: string;
	name: string;
	avatar?: string;
	rating: number;
	totalSales: number;
	isVerified: boolean;
	raffleTimes: number;
	pastRaffles: unknown;
	social: {
		icon?: string | React.ReactNode;
		label: string;
		url: string;
	}[];
}

export interface IBEResponseRaffleInfo {
	raffleId: string;
	title: string;
	description: string;
	makerId: string;

	seller?: IBEResponseSellerInfo;

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

	startDate: Date;
	endDate: Date;

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
