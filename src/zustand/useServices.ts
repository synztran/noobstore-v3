import { SUGGESTED_DISCOUNT_CODES } from "@/constants";
import {
	EnumPcbType,
	EnumShippingMethodCode,
	EnumStabilizerMountType,
	EnumStabilizerStatus,
	EnumStabilizerType,
	EnumSwitchStatus,
	EnumSwitchType,
} from "@/interface/interface";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Service option interface for dropdowns
export interface IServiceOption {
	value: string | number;
	label: string;
	price?: number;
}

// Service plan interface
export interface IServicePlan {
	planId: "SP-BASIC" | "SP-EXTREME";
	name: string;
	description: string;
	price: number;
	isActive: boolean;
	min: number;
	max: number;
}

export enum EnumServiceFeeType {
	PLATFORM = "PLATFORM",
	OUT_OF_SERVICE_TIME = "OUT_OF_SERVICE_TIME",
}

export interface IServiceFee {
	id: number;
	value: string;
	price: number;
}

export interface IServiceDefaultOption {
	id: number;
	label: string;
	description: string;
	isActive: boolean;
	price: number;
	value: string;
}

export enum UnitType {
	FLAT = "FLAT",
	PER_KEYBOARD = "PER_KEYBOARD",
	PER_SWITCH = "PER_SWITCH",
	PER_STABILIZER = "PER_STABILIZER",
	PER_TRIP = "PER_TRIP",
	PER_MIDMAN = "PER_MIDMAN",
}

export enum SwitchType {
	LINEAR = "LINEAR",
	TACTILE = "TACTILE",
	CLICKY = "CLICKY",
	OTHER = "OTHER",
}

export interface IServiceTask {
	serviceTaskId: string;
	name: string;
	description: string;
	price: number;
	salePrice: number;
	unitType: UnitType;
	isActive: boolean;
	switchType: SwitchType;
	attributes: Record<string, string>;
}

export interface IServiceDefinition {
	serviceId: string;
	serviceCategory: string;
	isActive: boolean;
	basePrice: number;
	tasks: IServiceTask[];
}

// Contact information interface
export interface IContactInfo {
	name: string;
	email: string;
	phone: string;
}

// Shipping information interface
export interface IShippingInfo {
	method: { name: string; code: string; price: number };
	deliveryMethod: { name: string; code: string; price: number };
	pickup: {
		address: string;
		date: string | null;
		name: string;
		phone: string;
		coordinates?: { latitude: number; longitude: number };
	};
	delivery: {
		address: string;
		date: string | null;
		name: string;
		phone: string;
		coordinates?: { latitude: number; longitude: number };
	};
	isDeliverySameAsPickup: boolean;
	addOns: {
		name: string;
		price: number;
		description: string;
		value: string;
	}[];
}

// Enhanced service item interfaces
export interface IKeyboardFormItem {
	id: string;
	keyboard: {
		name: string;
		pcb: EnumPcbType | null;
		size: string;
	};
	switch: {
		type: EnumSwitchType | null;
		quantity: number;
		status: EnumSwitchStatus | null;
	};
	stabilizer: {
		type: EnumStabilizerType | null;
		mountType: EnumStabilizerMountType | null;
		brand: string;
		wires: {
			id: string;
			name: string;
			type: "2U" | "6.25U" | "7U";
			price: number;
			value: string;
			quantity: number;
		}[];
		packs: {
			id: string;
			name: string;
			type: "6.25U" | "7U";
			value: string;
			quantity: number;
			wireQuantity: number;
		}[];
		status: EnumStabilizerStatus | null;
		totalWire: number;
		totalPack: number;
	};
	attachments: { publicUrl: string; size: number }[];
	note?: string;
	services: {
		keyboard: {
			// solder | desolder | clean
			[x: string]: {
				isUse: boolean;
				price?: number;
				name?: string;
				info?: Record<string, any>;
			};
		};
		switch: {
			// lube | film | spring | clean | quickClean
			[x: string]: {
				isUse: boolean;
				price?: number;
				name?: string;
				info?: Record<string, any>;
			};
		};
		stabilizer: {
			// handle | clean
			[x: string]: {
				isUse: boolean;
				price?: number;
				name?: string;
				info?: Record<string, any>;
			};
		};
	};
}

export interface ISwitchFormItem {
	id: string;
	type: string | null;
	name: string;
	quantity: number;
	attachments: { publicUrl: string; size: number }[];
	note?: string;
	status: EnumSwitchStatus | null;
	services: {
		lube: {
			isUse: boolean;
			price?: number;
			info?: Record<string, any>;
			name?: string;
		};
		film: {
			isUse: boolean;
			price?: number;
			info?: Record<string, any>;
			name?: string;
		};
		spring: {
			isUse: boolean;
			price?: number;
			info?: Record<string, any>;
			name?: string;
		};
		clean: { isUse: boolean; price?: number; name?: string };
		quickClean: { isUse: boolean; price?: number; name?: string };
	};
}

export interface IStabilizerFormItem {
	id: string;
	type: EnumStabilizerType | null;
	mountType: EnumStabilizerMountType | null;
	brand: string;
	services?: {
		[x: string]: {
			isUse: boolean;
			price?: number;
			info?: Record<string, any>;
			name?: string;
		};
	};
	attachments?: { publicUrl: string; size: number }[];
	note?: string;
	status: EnumStabilizerStatus | null;
	totalWire: number;
	totalPack: number;
	totalPrice?: number;
	wires: {
		id: string;
		name: string;
		type: "2U" | "6.25U" | "7U";
		price: number;
		value: string;
		quantity: number;
	}[];
	packs: {
		id: string;
		name: string;
		type: "6.25U" | "7U";
		value: string;
		quantity: number;
		wireQuantity: number;
	}[];
}

// Backend data format interfaces
interface IBackendServiceItem {
	serviceType: string;
	items: any[];
	totalPrice: number;
}

interface IBackendBookingData {
	planId: number | string;
	services: IBackendServiceItem[];
	shipping: { method: string; pickup: any; delivery: any };
	contact: IContactInfo;
	totalPrice: number;
	subTotalPrice: number;
	extraService: {
		name: string;
		price: number;
		value: string;
	}[];
}

// Main state interface
interface States {
	// Service plan selection
	selectedPlan: IServicePlan | null;

	// Discount
	discounts: {
		discountCode: string;
		discountAmount: number;
	}[];

	// Fees
	fees: {
		platFormFee: number;
		serviceOutOfTimeFee: { pickup: number; delivery: number };
	};

	// Prices
	totalPrice: number;
	subTotalPrice: number;
	taxPrice: number;
	shippingPrice: number;
	totalDiscount: number;
	totalWires: number;
	totalPacks: number;

	// Service items
	keyboardItems: IKeyboardFormItem[];
	switchItems: ISwitchFormItem[];
	stabilizerItems: IStabilizerFormItem[];

	// Form state
	activeTabIndex: number;
	contactInfo: IContactInfo;
	shippingInfo: IShippingInfo;
	errorMessages: Record<string, string>;

	// Options for dropdowns
	serviceOptions: {
		switchTypes: IServiceOption[];
		switchStatuses: IServiceOption[];
		keyboardTypes: IServiceOption[];
		pcbTypes: IServiceOption[];
		layouts: IServiceOption[];
	};

	// Legacy support - keep for backward compatibility
	selectedOpt: IServicePlan | null;
	serviceForm: {
		shipping: {
			name?: string;
			code?: string;
			price?: number;
			pickup?: {
				address?: string;
				date?: string;
				name?: string;
				phone?: string;
				coordinates?: { latitude: number; longitude: number };
			};
			delivery?: {
				address?: string;
				date?: string;
				name?: string;
				phone?: string;
				coordinates?: { latitude: number; longitude: number };
			};
			isDeliverySameAsPickup: boolean;
		};
		services: {
			keyboard: IKeyboardFormItem[];
			switches: ISwitchFormItem[];
			stabilizer: IStabilizerFormItem[];
		};

		contact: { mail: string; phone: string; name: string };
	};
}

interface Actions {
	// Service plan actions
	selectPlan: (plan: IServicePlan) => void;

	// Discount actions
	updateDiscount: (codes: string[]) => void;

	// Tab actions
	setActiveTabIndex: (index: number) => void;

	// Keyboard service actions
	addKeyboardItem: () => void;
	removeKeyboardItem: (id: string) => void;
	updateKeyboardItem: (
		id: string,
		updater: Partial<IKeyboardFormItem>
	) => void;
	// resetTaskKeyboardItem: (id: string) => void;
	resetTaskItem: (
		taskId: string,
		name: "keyboardItems" | "switchItems" | "stabilizerItems"
	) => void;

	// Switch service actions
	addSwitchItem: () => void;
	removeSwitchItem: (id: string) => void;
	updateSwitchItem: (id: string, updater: Partial<ISwitchFormItem>) => void;

	// Stabilizer service actions
	addStabilizerItem: () => void;
	removeStabilizerItem: (id: string) => void;
	updateStabilizerItem: (
		id: string,
		updater: Partial<IStabilizerFormItem>
	) => void;

	// Contact and shipping actions
	updateContactInfo: (updates: Partial<IContactInfo>) => void;
	updateShippingInfo: (updates: Partial<IShippingInfo>) => void;
	updateFees: (key: keyof States["fees"], value: number) => void;
	updateServiceOutOfTimeFee: (
		fee: number,
		key: "pickup" | "delivery"
	) => void;

	// Options management
	addServiceOption: (
		category: keyof States["serviceOptions"],
		option: IServiceOption
	) => void;

	// Form utilities
	calculateTotalPrice: () => number;
	calculateSubTotalPrice: () => number;
	calculateTotalServicePrice: () => number;
	calculateTotalService: () => number;

	validateForm: () => Record<string, string>;
	resetForm: () => void;
	formatDataForBackend: () => IBackendBookingData;
	submitServiceBooking: () => Promise<any>;
	setErrorMessages: (errors: Record<string, string>) => void;

	// Legacy support - keep for backward compatibility
	updateSelectedOpt: (payload: IServicePlan) => void;
	updatedServiceForm: (payload: any) => void;
}

type ServiceState = States & { actions: Actions };

const InitialState: States = {
	// Service plan selection
	selectedPlan: null,

	// Discount
	// discount: 0,
	// discountCodes: [],
	discounts: [],

	// Fees
	fees: { platFormFee: 0, serviceOutOfTimeFee: { pickup: 0, delivery: 0 } },

	// Prices
	totalPrice: 0,
	subTotalPrice: 0,
	taxPrice: 0,
	shippingPrice: 0,
	totalDiscount: 0,
	totalWires: 0,
	totalPacks: 0,

	// Service items
	keyboardItems: [],
	switchItems: [],
	stabilizerItems: [],

	// Form state
	activeTabIndex: 0,
	contactInfo: { name: "", email: "", phone: "" },
	shippingInfo: {
		method: { name: "", code: "", price: 0 },
		deliveryMethod: { name: "", code: "", price: 0 },
		pickup: { address: "", date: "", name: "", phone: "" },
		delivery: { address: "", date: "", name: "", phone: "" },
		isDeliverySameAsPickup: true,
		addOns: [],
	},
	errorMessages: {
		selectedPlan: "",
		method: "",
		deliveryMethod: "",
		deliveryAddress: "",
		deliveryDate: "",
		pickupAddress: "",
		pickupDate: "",
		keyboardServices: "",
		switchServices: "",
		stabilizerServices: "",
		contactName: "",
		contactEmail: "",
		contactPhone: "",
		serviceBlock: "",
	},

	// Options for dropdowns
	serviceOptions: {
		switchTypes: [
			{ value: EnumSwitchType.LINEAR, label: "Linear" },
			{ value: EnumSwitchType.TACTILE, label: "Tactile" },
			{ value: EnumSwitchType.CLICKY, label: "Clicky" },
		],
		switchStatuses: [
			{ value: EnumSwitchStatus.NEW, label: "Mới" },
			{ value: EnumSwitchStatus.USED, label: "Đã sử dụng" },
		],
		keyboardTypes: [],
		pcbTypes: [],
		layouts: [],
	},

	// Legacy support - keep for backward compatibility
	selectedOpt: null,
	serviceForm: {
		shipping: {
			name: "",
			code: "",
			price: 0,
			pickup: {
				address: "",
				date: "",
				name: "",
				phone: "",
				coordinates: undefined,
			},
			delivery: {
				address: "",
				date: "",
				name: "",
				phone: "",
				coordinates: undefined,
			},
			isDeliverySameAsPickup: true,
		},
		services: { keyboard: [], switches: [], stabilizer: [] },
		contact: { mail: "", phone: "", name: "" },
	},
};

const workingTime = {
	start: { hour: 8, minute: 30 },
	end: { hour: 19, minute: 0 },
};

const useServices = create<ServiceState>()(
	devtools((set, get) => ({
		...InitialState,
		actions: {
			// Service plan actions
			selectPlan: (plan: IServicePlan) => {
				set((state) => ({
					...state,
					selectedPlan: plan,
					selectedOpt: plan, // Legacy support
				}));
			},

			// Tab actions
			setActiveTabIndex: (index: number) => {
				set((state) => ({ ...state, activeTabIndex: index }));
			},

			// Keyboard service actions
			addKeyboardItem: () => {
				set((state) => ({
					...state,
					keyboardItems: [
						createDefaultKeyboardItem(),
						...state.keyboardItems,
					],
				}));
			},
			removeKeyboardItem: (id: string) => {
				set((state) => ({
					...state,
					keyboardItems: state.keyboardItems.filter(
						(it) => it.id !== id
					),
				}));
			},
			updateKeyboardItem: (
				id: string,
				updater: Partial<IKeyboardFormItem>
			) => {
				const state = get();
				console.log("sstate", state.keyboardItems);
				set((state) => ({
					...state,
					keyboardItems: state.keyboardItems.map((it) =>
						it.id === id ? { ...it, ...updater } : it
					),
				}));
			},
			resetTaskItem: (
				taskId: string,
				name: "keyboardItems" | "switchItems" | "stabilizerItems"
			) => {
				set((state) => ({
					...state,
					[name]: state[name].map((it) =>
						it.id === taskId ? { ...it, services: {} } : it
					),
				}));
			},

			// Switch service actions
			addSwitchItem: () => {
				set((state) => ({
					...state,
					switchItems: [
						...state.switchItems,
						createDefaultSwitchItem(),
					],
				}));
			},
			removeSwitchItem: (id: string) => {
				set((state) => ({
					...state,
					switchItems: state.switchItems.filter((it) => it.id !== id),
				}));
			},
			updateSwitchItem: (
				id: string,
				updater: Partial<ISwitchFormItem>
			) => {
				set((state) => ({
					...state,
					switchItems: state.switchItems.map((it) =>
						it.id === id ? { ...it, ...updater } : it
					),
				}));
			},

			// Stabilizer service actions
			addStabilizerItem: () => {
				set((state) => ({
					...state,
					stabilizerItems: [
						...state.stabilizerItems,
						createDefaultStabilizerItem(),
					],
				}));
			},
			removeStabilizerItem: (id: string) => {
				set((state) => ({
					...state,
					stabilizerItems: state.stabilizerItems.filter(
						(it) => it.id !== id
					),
				}));
			},
			updateStabilizerItem: (
				id: string,
				updater: Partial<IStabilizerFormItem>
			) => {
				set((state) => ({
					...state,
					stabilizerItems: state.stabilizerItems.map((it) =>
						it.id === id ? { ...it, ...updater } : it
					),
				}));
			},

			// Contact and shipping actions
			updateContactInfo: (updates: Partial<IContactInfo>) => {
				set((state) => ({
					...state,
					contactInfo: { ...state.contactInfo, ...updates },
				}));
			},
			updateShippingInfo: (updates: Partial<IShippingInfo>) => {
				set((state) => ({
					...state,
					shippingInfo: { ...state.shippingInfo, ...updates },
				}));
			},
			updateDiscount: (codes: string[]) => {
				const discounts = codes.map((code) => {
					const found = SUGGESTED_DISCOUNT_CODES.find(
						(d) => d.code === code
					);
					return {
						discountCode: code,
						discountAmount: found?.discountAmount || 0,
					};
				});
				const totalDiscount = discounts.reduce(
					(acc, curr) => acc + (curr.discountAmount || 0),
					0
				);

				set((state) => ({
					...state,
					discounts,
					totalDiscount,
				}));
			},
			updateFees: (key: keyof States["fees"], value: number) => {
				set((state) => ({
					...state,
					fees: { ...state.fees, [key]: value },
				}));
			},
			updateServiceOutOfTimeFee: (
				fee: number,
				key: "pickup" | "delivery"
			) => {
				set((state) => ({
					...state,
					fees: {
						...state.fees,
						serviceOutOfTimeFee: {
							...state.fees.serviceOutOfTimeFee,
							[key]: fee,
						},
					},
				}));
			},

			// Options management
			addServiceOption: (
				category: keyof States["serviceOptions"],
				option: IServiceOption
			) => {
				set((state) => ({
					...state,
					serviceOptions: {
						...state.serviceOptions,
						[category]: [...state.serviceOptions[category], option],
					},
				}));
			},

			// Form utilities
			calculateTotalPrice: () => {
				const state = get();
				let total = 0;

				// Add plan price
				if (state.selectedPlan) {
					total += state.selectedPlan.price;
				}

				// Add keyboard service prices
				state.keyboardItems.forEach((keyboard) => {
					if (
						keyboard.services.solder?.isUse &&
						keyboard.services.solder?.price
					) {
						total += keyboard.services.solder.price;
					}
					if (
						keyboard.services.desolder?.isUse &&
						keyboard.services.desolder?.price
					) {
						total += keyboard.services.desolder.price;
					}
					if (
						keyboard.services.clean?.isUse &&
						keyboard.services.clean?.price
					) {
						total += keyboard.services.clean.price;
					}
				});

				// Add switch service prices
				state.switchItems.forEach((switchItem) => {
					if (
						switchItem.services.lube.isUse &&
						switchItem.services.lube.price
					) {
						total +=
							switchItem.services.lube.price *
							switchItem.quantity;
					}
					if (
						switchItem.services.film.isUse &&
						switchItem.services.film.price
					) {
						total +=
							switchItem.services.film.price *
							switchItem.quantity;
					}
					if (
						switchItem.services.spring.isUse &&
						switchItem.services.spring.price
					) {
						total += switchItem.services.spring.price;
					}
					if (
						switchItem.services.clean.isUse &&
						switchItem.services.clean.price
					) {
						total +=
							switchItem.services.clean.price *
							switchItem.quantity;
					}
					if (
						switchItem.services.quickClean.isUse &&
						switchItem.services.quickClean.price
					) {
						total +=
							switchItem.services.quickClean.price *
							switchItem.quantity;
					}
				});

				// Add stabilizer service prices
				state.stabilizerItems.forEach((stabilizer) => {
					Object.values(stabilizer.services).forEach((service) => {
						if (service.isUse && service.price) {
							total += service.price;
						}
					});
				});

				// Add shipping price
				total += state.shippingInfo.method.price;
				total += state.shippingInfo.deliveryMethod.price;
				total += state.shippingInfo.addOns.reduce(
					(acc, addOn) => acc + addOn.price,
					0
				);

				// Add fees
				total += state.fees.serviceOutOfTimeFee.pickup;
				total += state.fees.serviceOutOfTimeFee.delivery;
				total += state.fees.platFormFee;

				// Add discount
				total -= state.totalDiscount;

				return total;
			},
			calculateSubTotalPrice: () => {
				const state = get();
				let total = 0;

				// Add plan price
				if (state.selectedPlan) {
					total += state.selectedPlan.price;
				}

				// Add keyboard service prices
				state.keyboardItems.forEach((keyboard) => {
					if (
						keyboard.services.solder?.isUse &&
						keyboard.services.solder?.price
					) {
						total += keyboard.services.solder.price;
					}
					if (
						keyboard.services.desolder?.isUse &&
						keyboard.services.desolder?.price
					) {
						total += keyboard.services.desolder.price;
					}
					if (
						keyboard.services.clean?.isUse &&
						keyboard.services.clean?.price
					) {
						total += keyboard.services.clean.price;
					}
				});

				// Add switch service prices
				state.switchItems.forEach((switchItem) => {
					if (
						switchItem.services.lube.isUse &&
						switchItem.services.lube.price
					) {
						total +=
							switchItem.services.lube.price *
							switchItem.quantity;
					}
					if (
						switchItem.services.film.isUse &&
						switchItem.services.film.price
					) {
						total +=
							switchItem.services.film.price *
							switchItem.quantity;
					}
					if (
						switchItem.services.spring.isUse &&
						switchItem.services.spring.price
					) {
						total += switchItem.services.spring.price;
					}
					if (
						switchItem.services.clean.isUse &&
						switchItem.services.clean.price
					) {
						total +=
							switchItem.services.clean.price *
							switchItem.quantity;
					}
					if (
						switchItem.services.quickClean.isUse &&
						switchItem.services.quickClean.price
					) {
						total +=
							switchItem.services.quickClean.price *
							switchItem.quantity;
					}
				});

				// Add stabilizer service prices
				state.stabilizerItems.forEach((stabilizer) => {
					Object.values(stabilizer.services).forEach((service) => {
						if (service.isUse && service.price) {
							total += service.price;
						}
					});
				});

				// Add shipping price
				total += state.shippingInfo.method.price;
				total += state.shippingInfo.deliveryMethod.price;
				total += state.shippingInfo.addOns.reduce(
					(acc, addOn) => acc + addOn.price,
					0
				);

				// Add fees
				total += state.fees.serviceOutOfTimeFee.pickup;
				total += state.fees.serviceOutOfTimeFee.delivery;
				total += state.fees.platFormFee;

				return total || 0;
			},
			calculateTotalServicePrice: () => {
				const state = get();
				let total = 0;

				// Add keyboard service prices
				state.keyboardItems.forEach((keyboard) => {
					if (
						keyboard.services.solder?.isUse &&
						keyboard.services.solder?.price &&
						keyboard.services.solder.price > 0
					) {
						total += keyboard.services.solder.price;
					}
					if (
						keyboard.services.desolder?.isUse &&
						keyboard.services.desolder?.price &&
						keyboard.services.desolder.price > 0
					) {
						total += keyboard.services.desolder.price;
					}
					if (
						keyboard.services.clean?.isUse &&
						keyboard.services.clean?.price &&
						keyboard.services.clean.price > 0
					) {
						total += keyboard.services.clean.price;
					}
				});

				// Add switch service prices
				state.switchItems.forEach((switchItem) => {
					if (
						switchItem.services.lube.isUse &&
						switchItem.services.lube.price
					) {
						total +=
							switchItem.services.lube.price *
							switchItem.quantity;
					}
					if (
						switchItem.services.film.isUse &&
						switchItem.services.film.price
					) {
						total +=
							switchItem.services.film.price *
							switchItem.quantity;
					}
					if (
						switchItem.services.spring.isUse &&
						switchItem.services.spring.price
					) {
						total += switchItem.services.spring.price;
					}
					if (
						switchItem.services.clean.isUse &&
						switchItem.services.clean.price
					) {
						total +=
							switchItem.services.clean.price *
							switchItem.quantity;
					}
					if (
						switchItem.services.quickClean.isUse &&
						switchItem.services.quickClean.price
					) {
						total +=
							switchItem.services.quickClean.price *
							switchItem.quantity;
					}
				});

				// Add stabilizer service prices
				state.stabilizerItems.forEach((stabilizer) => {
					Object.values(stabilizer.services).forEach((service) => {
						if (
							service.isUse &&
							service.price &&
							service.price > 0
						) {
							// total += service.price * stabilizer.quantity;
						}
					});
				});

				return total || 0;
			},
			calculateTotalService: () => {
				const state = get();
				let total = 0;
				if (state.keyboardItems.length > 0) {
					total += state.keyboardItems.length;
				}
				if (state.switchItems.length > 0) {
					total += state.switchItems.length;
				}
				if (state.stabilizerItems.length > 0) {
					total += state.stabilizerItems.length;
				}

				return total || 0;
			},

			setErrorMessages: (errors: Record<string, string>) => {
				set((state) => ({
					...state,
					errorMessages: errors,
				}));
			},

			validateForm: () => {
				const state = get();
				const errors: Record<string, string> = {};

				if (!state.selectedPlan) {
					errors.selectedPlan = "Vui lòng chọn gói dịch vụ";
				}

				if (!state.shippingInfo.method.code) {
					errors.method = "Vui lòng chọn phương thức giao hàng";
				} else if (
					state.shippingInfo.method.code &&
					state.shippingInfo.method.code !==
						EnumShippingMethodCode.SELF_DELIVERY_SELF_PICKUP
				) {
					if (!state.shippingInfo?.deliveryMethod?.code) {
						errors.deliveryMethod =
							"Vui lòng chọn phương thức vận chuyển";
					}

					switch (state.shippingInfo.method.code) {
						case EnumShippingMethodCode.STORE_DELIVERY_SELF_PICKUP:
							if (!state.shippingInfo.delivery.address) {
								errors.deliveryAddress =
									"Vui lòng nhập địa chỉ giao hàng";
							}
							if (!state.shippingInfo.delivery.date) {
								errors.deliveryDate =
									"Vui lòng chọn thời gian giao hàng";
							}
							break;
						case EnumShippingMethodCode.STORE_PICKUP_SELF_DELIVERY:
							if (!state.shippingInfo.pickup.address) {
								errors.pickupAddress =
									"Vui lòng nhập địa chỉ lấy hàng";
							}
							if (!state.shippingInfo.pickup.date) {
								errors.pickupDate =
									"Vui lòng chọn thời gian lấy hàng";
							}
							break;
						case EnumShippingMethodCode.STORE_DELIVERY_STORE_PICKUP:
							if (!state.shippingInfo.delivery.address) {
								errors.deliveryAddress =
									"Vui lòng nhập địa chỉ giao hàng";
							}
							if (!state.shippingInfo.delivery.date) {
								errors.deliveryDate =
									"Vui lòng chọn thời gian giao hàng";
							}
							if (!state.shippingInfo.pickup.address) {
								errors.pickupAddress =
									"Vui lòng nhập địa chỉ lấy hàng";
							}
							if (!state.shippingInfo.pickup.date) {
								errors.pickupDate =
									"Vui lòng chọn thời gian lấy hàng";
							}
							break;
						default:
							break;
					}
				}

				console.log(
					state.keyboardItems,
					state.switchItems,
					state.stabilizerItems,
					!state.keyboardItems.length &&
						!state.switchItems.length &&
						!state.stabilizerItems.length
				);

				if (
					state.keyboardItems.length === 0 &&
					state.switchItems.length === 0 &&
					state.stabilizerItems.length === 0
				) {
					errors.serviceBlock = "Vui lòng thêm ít nhất một dịch vụ";
				}

				if (state.keyboardItems) {
					console.log("state.keyboardItems", state.keyboardItems);
					const isMissingService = state.keyboardItems.some(
						(keyboard) => {
							console.log(Object.values(keyboard.services));
							return Object.values(keyboard.services).some(
								(service) => {
									return !service.isUse;
								}
							);
						}
					);
					const isMissingInformation = state.keyboardItems.some(
						(keyboard) => {
							return (
								!keyboard.keyboard ||
								!keyboard.keyboard.pcb ||
								!keyboard.keyboard.size
							);
						}
					);
					if (isMissingInformation) {
						errors.keyboardServices =
							"Vui lòng cung cấp đầy đủ thông tin";
					}
					if (isMissingService) {
						errors.keyboardServices =
							"Vui lòng lựa chọn ít nhất 1 dịch vụ";
					}
				}
				if (state.switchItems) {
					const isMissingService = state.switchItems.some(
						(switchItem) => {
							return Object.values(switchItem.services).some(
								(service) => {
									return service.isUse;
								}
							);
						}
					);
					const isMissingInformation = state.switchItems.some(
						(switchItem) => {
							return (
								!switchItem.type ||
								!switchItem.name ||
								!switchItem.quantity ||
								!switchItem.status
							);
						}
					);
					if (isMissingInformation) {
						errors.switchServices =
							"Vui lòng cung cấp đầy đủ thông tin";
					}
					if (isMissingService) {
						errors.switchServices =
							"Vui lòng lựa chọn ít nhất 1 dịch vụ";
					}
				}
				if (state.stabilizerItems) {
					const isMissingService = state.stabilizerItems.some(
						(stabilizer) => {
							return Object.values(stabilizer.services).some(
								(service) => {
									return service.isUse;
								}
							);
						}
					);
					const isMissingInformation = state.stabilizerItems.some(
						(stabilizer) => {
							return (
								!stabilizer.type ||
								!stabilizer.mountType ||
								!stabilizer.brand ||
								!stabilizer.status
							);
						}
					);
					if (isMissingInformation) {
						errors.stabilizerServices =
							"Vui lòng cung cấp đầy đủ thông tin";
					}
					if (isMissingService) {
						errors.stabilizerServices =
							"Vui lòng lựa chọn ít nhất 1 dịch vụ";
					}
				}

				if (!state.contactInfo.name) {
					errors.contactName = "Vui lòng nhập tên liên hệ";
				}

				if (!state.contactInfo.email) {
					errors.contactEmail = "Vui lòng nhập email";
				}

				if (!state.contactInfo.phone) {
					errors.contactPhone = "Vui lòng nhập số điện thoại";
				}

				const { setErrorMessages } = get().actions;
				setErrorMessages(errors);

				return errors;
			},

			resetForm: () => {
				set(InitialState);
			},

			formatDataForBackend: () => {
				const state = get();
				const services: IBackendServiceItem[] = [];

				// Format keyboard services
				if (state.keyboardItems.length > 0) {
					services.push({
						serviceType: "KEYBOARD",
						items: state.keyboardItems.map((keyboard) => ({
							keyboardName: keyboard.keyboard.name,
							pcb: keyboard.keyboard.pcb,
							keyboardSize: keyboard.keyboard.size,
							services: {
								solder: keyboard.services.solder?.isUse
									? { price: keyboard.services.solder.price }
									: null,
								desolder: keyboard.services.desolder?.isUse
									? {
											price: keyboard.services.desolder
												.price,
										}
									: null,
								clean: keyboard.services.clean?.isUse
									? { price: keyboard.services.clean.price }
									: null,
							},
							attachments: keyboard.attachments,
							note: keyboard.note,
						})),
						totalPrice: state.keyboardItems.reduce(
							(sum, keyboard) => {
								let itemTotal = 0;
								if (
									keyboard.services.solder?.isUse &&
									keyboard.services.solder.price
								) {
									itemTotal += keyboard.services.solder.price;
								}
								if (
									keyboard.services.desolder?.isUse &&
									keyboard.services.desolder.price
								) {
									itemTotal +=
										keyboard.services.desolder.price;
								}
								if (
									keyboard.services.clean?.isUse &&
									keyboard.services.clean.price
								) {
									itemTotal += keyboard.services.clean.price;
								}
								return sum + itemTotal;
							},
							0
						),
					});
				}

				// Format switch services
				if (state.switchItems.length > 0) {
					services.push({
						serviceType: "SWITCHES",
						items: state.switchItems.map((switchItem) => ({
							type: switchItem.type,
							name: switchItem.name,
							quantity: switchItem.quantity,
							status: switchItem.status,
							services: {
								lube: switchItem.services.lube.isUse
									? { price: switchItem.services.lube.price }
									: null,
								film: switchItem.services.film.isUse
									? { price: switchItem.services.film.price }
									: null,
								spring: switchItem.services.spring.isUse
									? {
											price: switchItem.services.spring
												.price,
										}
									: null,
								clean: switchItem.services.clean.isUse
									? { price: switchItem.services.clean.price }
									: null,
							},
							attachments: switchItem.attachments,
							note: switchItem.note,
						})),
						totalPrice: state.switchItems.reduce(
							(sum, switchItem) => {
								let itemTotal = 0;
								if (
									switchItem.services.lube.isUse &&
									switchItem.services.lube.price
								) {
									itemTotal +=
										switchItem.services.lube.price *
										switchItem.quantity;
								}
								if (
									switchItem.services.film.isUse &&
									switchItem.services.film.price
								) {
									itemTotal +=
										switchItem.services.film.price *
										switchItem.quantity;
								}
								if (
									switchItem.services.spring.isUse &&
									switchItem.services.spring.price
								) {
									itemTotal +=
										switchItem.services.spring.price *
										switchItem.quantity;
								}
								if (
									switchItem.services.clean.isUse &&
									switchItem.services.clean.price
								) {
									itemTotal +=
										switchItem.services.clean.price *
										switchItem.quantity;
								}
								return sum + itemTotal;
							},
							0
						),
					});
				}

				// Format stabilizer services
				if (state.stabilizerItems.length > 0) {
					services.push({
						serviceType: "STABILIZER",
						items: state.stabilizerItems.map((stabilizer) => ({
							type: stabilizer.type,
							mountType: stabilizer.mountType,
							brand: stabilizer.brand,
							status: stabilizer.status,
							wires: stabilizer.wires,
							packs: stabilizer.packs,
							totalPrice: stabilizer.totalPrice,
							totalWire: stabilizer.totalWire,
							services: {
								lube: stabilizer.services.lube?.isUse
									? { price: stabilizer.services.lube.price }
									: null,
								clean: stabilizer.services.clean?.isUse
									? { price: stabilizer.services.clean.price }
									: null,
							},
							attachments: stabilizer.attachments,
							note: stabilizer.note,
						})),
						totalPrice: state.stabilizerItems.reduce(
							(sum, stabilizer) => {
								let itemTotal = 0;
								return sum + itemTotal;
							},
							0
						),
					});
				}

				return {
					planId: state.selectedPlan?.planId || "",
					services,
					shipping: {
						method: state.shippingInfo.method.code,
						pickup: state.shippingInfo.pickup,
						delivery: state.shippingInfo.delivery,
					},
					contact: state.contactInfo,
					discounts: state.discounts,
					totalDiscount: state.totalDiscount,
					subTotalPrice: get().actions.calculateSubTotalPrice(),
					totalPrice: get().actions.calculateTotalPrice(),
					fees: [
						state.fees.platFormFee
							? {
									platFormFee: state.fees.platFormFee,
									feeId: generateId(),
									feeName: "Phí nền tảng",
									feeDescription: "",
									feeAmount: state.fees.platFormFee,
								}
							: null,
						state.fees.serviceOutOfTimeFee
							? {
									feeId: generateId(),
									feeName: "Phí hỗ trợ ngoài giờ",
									feeDescription: "",
									feeAmount:
										state.fees.serviceOutOfTimeFee
											.delivery +
										state.fees.serviceOutOfTimeFee.pickup,
								}
							: null,
						state.selectedPlan?.price
							? {
									feeId: generateId(),
									feeName: "Phí nâng cấp gói dịch vụ",
									feeDescription: "",
									feeAmount: state.selectedPlan?.price || 0,
								}
							: null,
						state.shippingInfo?.method?.price
							? {
									feeId: generateId(),
									feeName: "Phí hỗ trợ giao/nhận tận nơi",
									feeDescription: "",
									feeAmount: state.shippingInfo.method.price,
								}
							: null,
						state.shippingInfo?.deliveryMethod?.price
							? {
									feeId: generateId(),
									feeName: "Phí giao/nhận ưu tiên",
									feeDescription: "",
									feeAmount:
										state.shippingInfo.deliveryMethod.price,
								}
							: null,
					],
					extraService:
						state.shippingInfo?.addOns?.map((addOn) => ({
							name: addOn.name,
							price: addOn.price,
							value: addOn.value,
						})) || [],
				};
			},

			submitServiceBooking: async () => {
				try {
					const formattedData = get().actions.formatDataForBackend();
					console.log("Submitting service booking:", formattedData);
					const isValidSubmitData = get().actions.validateForm();

					console.log("isValidSubmitData", isValidSubmitData);

					if (Object.values(isValidSubmitData).length) {
						return isValidSubmitData;
					}

					// const response =
					// 	await ServiceClient.upsertBooking(formattedData);
					// console.log("Booking submitted successfully:", response);

					// return response;
				} catch (error) {
					console.error("Failed to submit service booking:", error);
					throw error;
				}
			},

			// Legacy support - keep for backward compatibility
			updateSelectedOpt: (payload: IServicePlan) => {
				set((state) => ({
					...state,
					selectedOpt: payload,
					selectedPlan: payload, // Sync with new structure
				}));
			},
			updatedServiceForm: (payload: any) => {
				set((state) => ({ ...state, serviceForm: payload }));
			},
		},
	}))
);

// Selector hooks for easy access to computed values
export const useServiceAction = () => useServices((state) => state.actions);
export const useServiceSelectors = () => ({
	selectedPlan: useServices((state) => state.selectedPlan),
	keyboardItems: useServices((state) => state.keyboardItems),
	switchItems: useServices((state) => state.switchItems),
	stabilizerItems: useServices((state) => state.stabilizerItems),
	activeTabIndex: useServices((state) => state.activeTabIndex),
	contactInfo: useServices((state) => state.contactInfo),
	shippingInfo: useServices((state) => state.shippingInfo),
	serviceOptions: useServices((state) => state.serviceOptions),
	totalPrice: useServices((state) => state.actions.calculateTotalPrice()),
	isFormValid: useServices(
		(state) => Object.values(state.actions.validateForm()).length === 0
	),

	// Legacy selectors for backward compatibility
	selectedOpt: useServices((state) => state.selectedOpt),
	serviceForm: useServices((state) => state.serviceForm),
});

export default useServices;

function createDefaultKeyboardItem(): IKeyboardFormItem {
	return {
		id: generateId(),
		keyboard: {
			name: "",
			pcb: null,
			size: "",
		},
		switch: {
			type: null,
			quantity: 0,
			status: null,
		},
		stabilizer: {
			type: null,
			mountType: null,
			brand: "",
			status: EnumStabilizerStatus.NEW,
			wires: null,
			packs: null,
			totalWire: 0,
			totalPack: 0,
		},
		services: {
			keyboard: {
				solder: { isUse: false, price: 0 },
				desolder: { isUse: false, price: 0 },
				clean: { isUse: false, price: 0 },
			},
			switch: {
				lube: { isUse: false, price: 0, info: {} },
				film: { isUse: false, price: 0, info: {} },
				spring: { isUse: false, price: 0, info: {} },
				clean: { isUse: false, price: 0 },
				quickClean: { isUse: false, price: 0 },
			},
			stabilizer: {
				handle: { isUse: false, price: 0, info: {} },
				clean: { isUse: false, price: 0 },
			},
		},
		attachments: [],
		note: "",
	};
}

function createDefaultSwitchItem(): ISwitchFormItem {
	return {
		id: generateId(),
		type: null,
		name: "",
		quantity: 0,
		status: null,
		note: "",
		attachments: [],
		services: {
			lube: { isUse: false, price: 0, info: {} },
			film: { isUse: false, price: 0, info: {} },
			spring: { isUse: false, price: 0, info: {} },
			clean: { isUse: false, price: 0 },
			quickClean: { isUse: false, price: 0 },
		},
	};
}

function createDefaultStabilizerItem(): IStabilizerFormItem {
	return {
		id: generateId(),
		type: null,
		mountType: null,
		brand: null,
		status: null,
		wires: [],
		packs: [],
		totalWire: 0,
		totalPrice: 0,
		services: {
			handle: { isUse: false, price: 0, info: {} },
			clean: { isUse: false, price: 0 },
		},
		attachments: [],
		note: "",
		totalPack: 0,
	};
}

function generateId(): string {
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
