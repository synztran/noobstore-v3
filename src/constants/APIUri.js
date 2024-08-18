// const DOMAIN_PREFIX = "https://noob-store.thuannc.com";

const DOMAIN_PREFIX = "http://localhost:8000";

const ALL_CATEGORY = `${DOMAIN_PREFIX}/category`;
const ALL_PRODUCT = `${DOMAIN_PREFIX}/product`;
const ALL_ACCOUNT = `${DOMAIN_PREFIX}/account`;

export const CATEGORY_API = {
	ALL_CATEGORY,
	DETAIL: `${DOMAIN_PREFIX}/category`, // {id}
	ALL_CATEGORIES_BY_IDS: `${DOMAIN_PREFIX}/category/getCategoriesByIds`, // {ids}
};

export const PRODUCTS_API = {
	ALL_PRODUCT,
	DETAIL: `${DOMAIN_PREFIX}/product`, // {product_id}
	ALL_DETAIL: `${DOMAIN_PREFIX}/product/all`, // {category_id}
	PRODUCT_BY_PARAMS: `${DOMAIN_PREFIX}/product/get-by-params`, // {product_id, option_id}
};

export const ACCOUNT_API = {
	ACCOUNT: `${DOMAIN_PREFIX}/account`,
	CURRENT_ACCOUNT: `${DOMAIN_PREFIX}/account/get_user`,
}

export const AUTH_API = {
	REFRESH: `${DOMAIN_PREFIX}/auth/refresh`,
	LOGOUT: `${DOMAIN_PREFIX}/auth/logout`,
	LOGIN: `${DOMAIN_PREFIX}/auth/login`,
	REGISTER: `${DOMAIN_PREFIX}/auth/register`,
}

export const CART_API = {
	GET_CART: `${DOMAIN_PREFIX}/cart`,
	ADD_CART: `${DOMAIN_PREFIX}/cart`,
	UPDATE_CART: `${DOMAIN_PREFIX}/cart`,
	REMOVE_ITEM_CART: `${DOMAIN_PREFIX}/cart/remove-item`,
	UPDATE_CART_PRODUCT: `${DOMAIN_PREFIX}/cart/update-cart-product`,
}

export const CHECKOUT_API = {
	CHECKOUT: `${DOMAIN_PREFIX}/order/checkout`,
	ORDER_DETAIL: `${DOMAIN_PREFIX}/order`, // {order_id}
}