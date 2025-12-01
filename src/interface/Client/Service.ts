import {
	EnumPaymentForm,
	EnumPaymentMethod,
	EnumPaymentStatus,
	EnumPcbType,
	EnumServiceStatus,
	EnumShippingMethodCode,
	EnumStabilizerMountType,
	EnumStabilizerSize,
	EnumStabilizerStatus,
	EnumStabilizerType,
	EnumSwitchStatus,
	EnumSwitchType,
	EnumUnitType,
} from "../interface";

enum EnumFeeValue {
	OUT_OF_SERVICE_TIME = "OUT_OF_SERVICE_TIME",
	PLATFORM = "PLATFORM",
}

export enum EnumBackendServiceType {
	KEYBOARD = "KEYBOARD",
	SWITCH = "SWITCH",
	STABILIZER = "STABILIZER",
}

export enum EnumBackendServiceStepType {
	CREATED = "CREATED",
	PAYMENT = "PAYMENT",
	SERVICING = "SERVICING",
	PACKING_AND_DELIVERY = "PACKING_AND_DELIVERY",
	COMPLETED = "COMPLETED",
}

export enum EnumBackendServiceStepStatus {
	PENDING = "PENDING",
	IN_PROGRESS = "IN_PROGRESS",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

export interface IResponseBackendServiceWire {
	id: string;
	name: string;
	type: EnumStabilizerSize;
	value: string;
	quantity: number;
}

export type TResponseBackendServicePack = {
	wireQuantity: number;
} & IResponseBackendServiceWire;

export interface IResponseBackendService {
	serviceTaskId: string;
	name: string;
	description: string;
	price: number;
	unitType: EnumUnitType;
	isActive: boolean;
}

export interface IResponseBackendServiceTask {
	taskId: string;
	keyboardService: {
		keyboard: {
			name: string;
			pcb: EnumPcbType;
			size: string;
		};
		switch: {
			type: EnumSwitchType;
			quantity: number;
			status: EnumSwitchStatus;
		};
		stabilizer: {
			brand: string;
			mountType: EnumStabilizerMountType;
			type: EnumStabilizerType;
			status: EnumStabilizerStatus;
			wires: IResponseBackendServiceWire[];
			packs: TResponseBackendServicePack[];
			totalWire: number;
			totalPack: number;
		};
		services: IResponseBackendService[];
		attachments: string[];
		note: string;
		totalPrice: number;
	};
}

export interface IResponseBackendTask {
	taskId: string;
	serviceType: EnumBackendServiceType;
	keyboardService?: {
		totalPrice: number;
		services: IResponseBackendService[];
		keyboard: {
			name: string;
			pcb: EnumPcbType;
			size: string;
		};
	};
	switchService?: {
		totalPrice: number;
		services: IResponseBackendService[];
		switchType: EnumSwitchType;
		quantity: number;
		status: EnumSwitchStatus;
	};
	stabilizerService?: {
		totalPrice: number;
		services: IResponseBackendService[];
	};
}

export interface IResponseBackendServicePayment {
	paymentMethod: EnumPaymentMethod | null;
	paymentForm: EnumPaymentForm | null;
	paidAmount: number;
	paidPercentage: number;
	remainingAmount: number;
	submittedAt?: string;
	attachments?: {
		url: string;
		name?: string;
	}[];
	transitionId?: string | null;
}

export type TResponseBackendServiceBookingDonation = IRequestServiceDonation;

export interface IResponseBackendServiceBookingTimeline {
	id: number;
	stepType: EnumBackendServiceStepType;
	title: string;
	description: string | null;
	status: EnumBackendServiceStepStatus;
	isCurrent: boolean;
	timestamp: string | null;
	linkRedirect?: string;
	attachments?: {
		alt: string;
		path: string;
	}[];
	metadata: Record<string, any>;
}

export interface IResponseBackendServiceBooking {
	customerId: string;
	serviceBookingId: string;
	servicePlanId: string;
	tasks: {
		taskId: string;
		keyboardService?: {
			totalPrice: number;
			services: unknown[];
		};
		switchService?: {
			totalPrice: number;
			services: unknown[];
		};
		stabilizerService?: {
			totalPrice: number;
			services: unknown[];
		};
		serviceType: EnumBackendServiceType;
	}[];
	shipping: {
		delivery?: {
			date: string;
			address: string;
		};
		pickup?: {
			date: string;
			address: string;
		};
		method: EnumShippingMethodCode;
	};
	note: string;
	status: EnumServiceStatus;
	paymentStatus: EnumPaymentStatus;
	contact: {
		name: string;
		email: string;
		phone: string;
	};
	totalPrice: number;
	subTotalPrice: number;
	fees: {
		feeId: string;
		feeName: string;
		feeDescription: string;
		feeAmount: number;
		feeValue: EnumFeeValue;
	}[];
	discounts?: {
		discountCode: string;
		discountAmount: number;
	}[];
	totalDiscount?: number;
	totalService?: number;
	createdAt: string;
	updatedAt: string;
	payment: IResponseBackendServicePayment;
	donation: TResponseBackendServiceBookingDonation | null;
	timeline: IResponseBackendServiceBookingTimeline[];
}

export interface IRequestServiceDonation {
	donationAmount: number;
	donationPercentage: number;
	donationMessage?: string;
}

export type TRequestServiceSubmitPayment = IResponseBackendServicePayment & {
	serviceBookingId: string;
};
