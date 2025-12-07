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
