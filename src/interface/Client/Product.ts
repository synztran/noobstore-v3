export interface IPostUsedProductBody {
	name: string;
	description: string;
	og_price: number;
	sale_price: number;
	type: string;
	sale_type: string;
	images: {
		public_id: string;
		url: string;
	}[];
}
