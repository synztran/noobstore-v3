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
	shippingAt: any[]; // Assuming shippingAt is an array of any type
	verified: boolean;
	verifiedAt: string; // Assuming this is also a string
	role?: string; // "admin" | "user"
}
