import { PRODUCTS_API } from "@/constants/APIUri";
import { POST } from ".";

const getProductById = async ({ id }) => {
	const url = PRODUCTS_API.DETAIL;
	try {
		const response = await fetch(url + `/${id}`); // Replace with your actual backend endpoint
		const data = await response.json();
		return data;
	} catch (err) {
		// throw new Error(err.message);
		console.log(err.message);
	}
};

const getProductsByCategoryID = async ({ category_id }) => {
	const url = PRODUCTS_API.ALL_DETAIL;
	try {
		const resp = await fetch(url + `/${category_id}`);
		const data = await resp.json();
		return data;
	} catch (err) {
		console.log(err.message);
	}
};

const getProductOptByIds = async (ids) => {
	const url = PRODUCTS_API.PRODUCT_BY_PARAMS;
	const body = {
		ids,
	};
	
	return POST({ url, body, isAuth: true });

}

export default {
	getProductById,
	getProductsByCategoryID,
	getProductOptByIds
};
