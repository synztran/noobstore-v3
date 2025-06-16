export interface IReward {
	index: number;
	// createdBy: number;
	// createdTime: string;
	code: string;
	name: string;
	wheelCode: string;
	percentage: number;
	image: string;
	bgColor: string;
	maxQuantity?: number; // quantity of reward
	maxQuantityPerCustomer?: number; // quantity per customer
	maxQuantityPerDay?: number; // quantity per day
	message?: string;
	reward?: {
		[x: string]: string | number;
	}[];
	isActive?: boolean;
	actionName?: string;
	actionLink?: string;
}
