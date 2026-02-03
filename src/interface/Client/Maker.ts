import { IImage } from "../interface";

export enum EnumMakerStatus {
	NOT_VERIFY = "NOT_VERIFY",
	VERIFIED = "VERIFIED",
	REJECTED = "REJECTED",
}

export interface IPayloadCreateMaker {
	ownerName: string;
	brandName: string;
	makerId?: string;
	teamMembers?: IBEResponseMakerMember[];
	email: string;
	isActive?: boolean;
	websiteUrl?: string;
	socialLinks?: Record<string, string>;
	bio?: string;
	logo?: IImage;
	verificationStatus?: EnumMakerStatus;
	citizenCardNumber: string;
	citizenAttachments: {
		frontImage: IImage;
		backImage: IImage;
	};
	foundingDate: string;
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
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IBEResponseMakerMember {
	id: string;
	name: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt?: Date;
}

export interface IBEResponseMaker {
	ownerName: string;
	brandName: string;
	makerId: string;
	teamMembers: IBEResponseMakerMember[];
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
	raffleTimes: number;
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
	citizenCardNumber: string;
	citizenAttachments: {
		frontImage: IImage;
		backImage: IImage;
	};
}

export interface IPayloadVerifyEmailMaker {
	makerId: string;
	email: string;
	brandName: string;
	ownerName: string;
}

export interface IBEResponseMakerDashboard {
	totalRaffles: number;
	endedRaffles: number;
	runningRaffles: number;
	unpaidCustomers: number;
}
