import { CATEGORY_API } from "@/constants/APIUri";
import { GET, POST } from ".";

const getAllCategory = async ({params}) => {
	const url = CATEGORY_API.ALL_CATEGORY;
	return GET({url, params, isAuth: false});
};

const getCategoryById = async ({ id }) => {
	const url = CATEGORY_API.DETAIL;
	const params = {
		slug: id
	}
	return GET({ url, params, isAuth: false});
};

const getCategoriesByIds = async (ids) => {
	const url = CATEGORY_API.ALL_CATEGORIES_BY_IDS;
	const body = {
		ids
	}
	return POST({ url, body, isAuth: false});
}

export default {
	getAllCategory,
	getCategoryById,
	getCategoriesByIds,
};
