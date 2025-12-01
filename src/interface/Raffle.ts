import {
	IBEResponseProductOption,
	IBEResponseRaffleInfo,
} from "./Client/Raffle";

export interface RaffleData {
	id: string;
	title: string;
	description: string;
	price: number; // Prize value
	ticketPrice: number; // Price per ticket
	totalTickets: number;
	soldTickets: number;
	endDate: string;
	status: "active" | "ended" | "upcoming";
	images: { id: string; url: string; alt: string }[];
	seller: {
		id: string;
		name: string;
		avatar: string;
		rating: number;
		totalSales: number;
	};
	productOptions: { id: string; label: string; url: string; price: number }[];
	features: string[];
	categories: string[];
	tags: string[];
}

export interface RaffleEntryForm {
	ticketQuantity: number;
	fullName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	// paymentMethod: PaymentMethod;
}

export enum PaymentMethod {
	CREDIT_CARD = "credit_card",
	BANK_TRANSFER = "bank_transfer",
	E_WALLET = "e_wallet",
	TBD = "",
}

export interface RaffleEntry {
	id: string;
	raffleId: string;
	userId?: string;
	formData: RaffleSubmitForm;
	ticketNumbers: number[];
	totalPaid: number;
	entryDate: string;
	status: "pending" | "confirmed" | "cancelled";
}

export interface IStepProps {
	// formData: FormData;
	// setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
	raffleFormSubmit?: RaffleSubmitForm;
	setRaffleFormSubmit?: React.Dispatch<
		React.SetStateAction<RaffleSubmitForm>
	>;
	raffleData: IBEResponseRaffleInfo;
	handleInputChange?: (
		field: keyof RaffleSubmitForm
	) => (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleSelectChange?: (
		field: keyof RaffleSubmitForm
	) => (event: React.ChangeEvent<HTMLSelectElement>) => void;
	minPrice?: number;
	maxPrice?: number;
	handleChangeCity?: (value: string) => void;
}

export type ProductSelection = {
	productId: string;
	name: string;
	priority: number | null; // null means not selected
	selected: boolean;
	thumbnail: {
		path: string;
		alt: string;
	};
	price: number;
};

export type RaffleSubmitForm = Omit<RaffleEntryForm, "ticketQuantity"> & {
	companyName: string;
	zipCode: string;
	productSelections: ProductSelection[];
	shippingMethod: { name: string; price: number | null };
	note: string;
	raffleId: string;
};
