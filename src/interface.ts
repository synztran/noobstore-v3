export enum EnumCategoryType {
    TBA = "TBA",
    KEYBOARD = "KEYBOARD",
    SWITCH = "SWITCH",
    KEYCAP = "KEYCAP",
    ACCESSORY = "ACCESSORY"
}

export enum EnumProductType {
    CASE = "CASE",
    PLATE = "PLATE",
    PCB = "PCB",
    ACCESSORIES = "ACCESSORIES",
    KEYCAP = "KEYCAP",
    SWITCH = "SWITCH",
    ARTISAN = "ARTISAN",
    ETC = "ETC"
}

export enum EnumSaleStatus {
    OUTSTOCK = "OUTSTOCK",
    INSTOCK = "INSTOCK",
    GB = "GB",
    TBD = "TBD",
    ALL = ""
}

export enum EnumSaleType {
    NORMAL = 0,
    SALE = 1,
    PRE_ORDER = 2
}

export enum EnumProductOptStatus {
    OUTSTOCK = 0,
    INSTOCK = 1
}

export enum EnumPaymentMethod {
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
    MOMO = "MOMO",
    ZALO_PAY = "ZALO_PAY",
    BANK_TRANSFER = "BANK_TRANSFER"
}

export interface ICollapseContent {
    title: string;
    content: string;
}

export interface Product {
    product_id: string;
    product_name: string;
    replace_product_name: string;
    category_id: string;
    slug: string;
    product_part: EnumProductType;
    outstock: boolean;
    price: number;
    pic_product: {
        path: string;
        size: number
    },
    pic_list: {
        path: string;
        size: number;
    }[],
    quantity: number
    productOpts: {
        ProductOptionID: string,
        ProductOptionName: string,
        ProductOptionPrice: number,
        ImageUrl: {
            path: string,
            size: number
        },
        Status: EnumProductOptStatus,
        Quanlity: number,
        product_id: string
    }[]
}

export interface Category {
    category_id: string;
    slug: string;
    category_name: string;
    author: string;
    manufacturing: string;
    proxy_host: string;
    status_gb: EnumSaleStatus;
    type: EnumCategoryType;
    date_start: string;
    date_end: string;
    date_payment: string;
    min_price: number;
    max_price: number;
    tax: number;
    handle: number;
    specs: string;
    pic_profile: {
        path: string;
        size: number;
    };
    product_belong: string;
    pic_list: {
        url: string
        id: number
    }[];
    sale_type: EnumSaleType
    is_active: boolean;
    description: string;
    collapse_content: ICollapseContent[]
    sale_price: number
}

export interface IOption {
    index: string;
    label: string;
    value: string;
    quantity: number;
    productType: EnumProductType;
    price: number;
    productName: string
    productId: string
    sellerName: string
}

export interface ICartFee {
    shipping: number
    tax: number
    handling: number
    voucherCode: string
    voucherDiscount: number
}

export interface IOrderProduct {
    type: string
    productId: string
    productName: string
    sellerName: string
    quantity: number
    price: number
    categoryId: string
    categoryName: string
    image: string
    slug: string
}

export interface IOrder {
    cartId: string
    customerId: number
    fees: ICartFee
    orderId: string
    orderedAt: string
    products: IOrderProduct[]
    services: any[]
    totalPrice: number
    totalQuantity: number
    orderInfo: {
        paymentMethod: EnumPaymentMethod
        deliverMethod: string
        billingAddress: string
    }
}

