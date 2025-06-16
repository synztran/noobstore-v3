import { ICart } from "./Cart";

export interface IDataPostCheckout {
	// customerId: number;
	orderInfo: {
		email: string;
		firstName: string;
		lastName: string;
		company: string;
		address: string;
		apartment: string;
		city: string;
		province: string;
		postCode: string;
		phoneNumber: string;
		deliveryMethod: string;
		paymentMethod: string;
		billingAddress: string;
		country: string;
	};
	cart: ICart;
}
