// const DOMAIN_PREFIX = "https://noob-store.thuannc.com";
// const DOMAIN_PREFIX = "https://server-noobstore-v3.onrender.com";
// const DOMAIN_PREFIX = "http://localhost:8000";
const DOMAIN_PREFIX = "http://127.0.0.1:8000"; // when you try fetching data ssr should using this domain, try using local will cat error on connector port

const CATEGORY_PREFIX = `${DOMAIN_PREFIX}/category`;
const PRODUCT_PREFIX = `${DOMAIN_PREFIX}/product`;
const ACCOUNT_PREFIX = `${DOMAIN_PREFIX}/account`;
const UPLOAD_PREFIX = `${DOMAIN_PREFIX}/upload`;
const USED_PRODUCT_PREFIX = `${DOMAIN_PREFIX}/used-product`;
const LUCKY_WHEEL_PREFIX = `${DOMAIN_PREFIX}/lucky-wheel`;

export const CATEGORY_API = {
	ALL_CATEGORY: `${CATEGORY_PREFIX}/get-all`,
	ALL_VALID_CATEGORY: `${CATEGORY_PREFIX}/get-all-valid`,
	DETAIL: `${CATEGORY_PREFIX}`, // {id}
	ALL_CATEGORIES_BY_IDS: `${CATEGORY_PREFIX}/getCategoriesByIds`, // {ids}
	CREATE: `${CATEGORY_PREFIX}/add`,
	UPDATE: `${CATEGORY_PREFIX}/update`,
};

export const PRODUCTS_API = {
	ALL_PRODUCT: `${PRODUCT_PREFIX}/get-all`,
	DETAIL: `${PRODUCT_PREFIX}`, // {product_id}
	ALL_DETAIL: `${PRODUCT_PREFIX}/all-products-by-category-id`, // {category_id}
	PRODUCT_BY_PARAMS: `${PRODUCT_PREFIX}/get-by-params`, // {product_id, option_id}
	PRODUCT_OPTIONS: `${PRODUCT_PREFIX}/product-options`, // {product_id}
	DELETE_PRODUCT: `${PRODUCT_PREFIX}/delete`, // {product_id}
	NEW_PRODUCT_OPTION: `${PRODUCT_PREFIX}/product-option/create`, // {product_id, option_name}
	NEW_PRODUCT: `${PRODUCT_PREFIX}/create`, // {product_id, option_name}
	DELETE_PRODUCT_OPTION: `${PRODUCT_PREFIX}/product-option/delete`, // {product_id, option_id}
	UPDATE_PRODUCT: `${PRODUCT_PREFIX}/update`, // {product_id}
};

export const ACCOUNT_API = {
	ACCOUNT: `${ACCOUNT_PREFIX}`,
	CURRENT_ACCOUNT: `${ACCOUNT_PREFIX}/get-user`,
};

export const AUTH_API = {
	REFRESH: `${DOMAIN_PREFIX}/auth/refresh`,
	LOGOUT: `${DOMAIN_PREFIX}/auth/logout`,
	LOGIN: `${DOMAIN_PREFIX}/auth/login`,
	REGISTER: `${DOMAIN_PREFIX}/auth/register`,
	VERIFY_EMAIL: `${DOMAIN_PREFIX}/auth/verify`,
};

export const CART_API = {
	GET_CART: `${DOMAIN_PREFIX}/cart`,
	ADD_CART: `${DOMAIN_PREFIX}/cart`,
	UPDATE_CART: `${DOMAIN_PREFIX}/cart`,
	REMOVE_ITEM_CART: `${DOMAIN_PREFIX}/cart/remove-item`,
	UPDATE_CART_PRODUCT: `${DOMAIN_PREFIX}/cart/update-cart-product`,
};

export const CHECKOUT_API = {
	CHECKOUT: `${DOMAIN_PREFIX}/order/checkout`,
	ORDER_DETAIL: `${DOMAIN_PREFIX}/order`, // {order_id}
};

export const PROMOTION_API = {
	LUCKY_WHEEL: `${DOMAIN_PREFIX}/promotion/lucky-wheel/get`,
};

export const CONFIG_API = {
	ALL_CONFIG: `${DOMAIN_PREFIX}/config`,
};

export const UPLOAD_API = {
	IMAGE: `${UPLOAD_PREFIX}/image`,
};

export const USED_PRODUCT_API = {
	POSTING: `${USED_PRODUCT_PREFIX}/post`,
	GET_ALL: `${USED_PRODUCT_PREFIX}`,
};

export const LUCKY_WHEEL_API = {
	SPIN: `${LUCKY_WHEEL_PREFIX}/spin`,
	GET: `${LUCKY_WHEEL_PREFIX}`,
};

export const PRODUCT_OPTIONS_API = {
	GET: `${PRODUCT_PREFIX}/product-option/get`,
};
