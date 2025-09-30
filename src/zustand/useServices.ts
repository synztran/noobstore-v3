import {
	EnumStabilizerStatus,
	EnumSwitchStatus,
	EnumSwitchType,
} from "@/interface/interface";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import ServiceClient from "@/client/ServiceClient";
import { SUGGESTED_DISCOUNT_CODES } from "@/constants";

// Service option interface for dropdowns
export interface IServiceOption {
	value: string | number;
	label: string;
	price?: number;
}

// Service plan interface
export interface IServicePlan {
	planId: string;
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
	method: {
		name: string;
		code: string;
		price: number;
	};
	deliveryMethod: {
		name: string;
		code: string;
		price: number;
	};
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
	keyboardName: string;
	pcbType: string;
	keyboardSize: string;
	attachments: { publicUrl: string; size: number }[];
	note?: string;
	services: {
		[x: string]: { isUse: boolean; price?: number; name?: string };
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
	type: string | null;
	mountType: string | null;
	name: string | null;
	quantity: number;
	services: {
		[x: string]: {
			isUse: boolean;
			price?: number;
			info?: Record<string, any>;
			name?: string;
		};
	};
	attachments: { publicUrl: string; size: number }[];
	note?: string;
	status: string | null;
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
	shipping: {
		method: string;
		pickup: any;
		delivery: any;
	};
	contact: IContactInfo;
	totalAmount: number;
}

// Main state interface
interface States {
	// Service plan selection
	selectedPlan: IServicePlan | null;

	// Discount
	discount: number;
	discountCodes: string[];

	// Fees
	fees: {
		platFormFee: number;
		serviceOutOfTimeFee: {
			pickup: number;
			delivery: number;
		};
	};

	// Prices
	totalPrice: number;
	subTotalPrice: number;
	taxPrice: number;
	shippingPrice: number;

	// Service items
	keyboardItems: IKeyboardFormItem[];
	switchItems: ISwitchFormItem[];
	stabilizerItems: IStabilizerFormItem[];

	// Form state
	activeTabIndex: number;
	contactInfo: IContactInfo;
	shippingInfo: IShippingInfo;

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
				coordinates?: {
					latitude: number;
					longitude: number;
				};
			};
			delivery?: {
				address?: string;
				date?: string;
				name?: string;
				phone?: string;
				coordinates?: {
					latitude: number;
					longitude: number;
				};
			};
			isDeliverySameAsPickup: boolean;
		};
		services: {
			keyboard: IKeyboardFormItem[];
			switches: ISwitchFormItem[];
			stabilizer: IStabilizerFormItem[];
		};
		contact: {
			mail: string;
			phone: string;
			name: string;
		};
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

	validateForm: () => string[];
	resetForm: () => void;
	formatDataForBackend: () => IBackendBookingData;
	submitServiceBooking: () => Promise<any>;

	// Legacy support - keep for backward compatibility
	updateSelectedOpt: (payload: IServicePlan) => void;
	updatedServiceForm: (payload: any) => void;
}

type ServiceState = States & { actions: Actions };

const InitialState: States = {
	// Service plan selection
	selectedPlan: null,

	// Discount
	discount: 0,
	discountCodes: [],

	// Fees
	fees: {
		platFormFee: 0,
		serviceOutOfTimeFee: {
			pickup: 0,
			delivery: 0,
		},
	},

	// Prices
	totalPrice: 0,
	subTotalPrice: 0,
	taxPrice: 0,
	shippingPrice: 0,

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
		services: {
			keyboard: [],
			switches: [],
			stabilizer: [],
		},
		contact: {
			mail: "",
			phone: "",
			name: "",
		},
	},
};

const workingTime = {
	start: {
		hour: 8,
		minute: 30,
	},
	end: {
		hour: 19,
		minute: 0,
	},
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
				const totalDiscount = SUGGESTED_DISCOUNT_CODES.reduce(
					(acc, code) => {
						if (codes.includes(code.code)) {
							return acc + (code.discountAmount || 0);
						}
						return acc;
					},
					0
				);

				set((state) => ({
					...state,
					discountCodes: codes,
					discount: totalDiscount,
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
				total -= state.discount;

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
							total += service.price * stabilizer.quantity;
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

			validateForm: () => {
				const state = get();
				const errors: string[] = [];

				if (!state.selectedPlan) {
					errors.push("Vui lòng chọn gói dịch vụ");
				}

				if (
					state.keyboardItems.length === 0 &&
					state.switchItems.length === 0 &&
					state.stabilizerItems.length === 0
				) {
					errors.push("Vui lòng thêm ít nhất một dịch vụ");
				}

				if (!state.contactInfo.name) {
					errors.push("Vui lòng nhập tên liên hệ");
				}

				if (!state.contactInfo.email) {
					errors.push("Vui lòng nhập email");
				}

				if (!state.contactInfo.phone) {
					errors.push("Vui lòng nhập số điện thoại");
				}

				if (!state.shippingInfo.pickup.address) {
					errors.push("Vui lòng nhập địa chỉ lấy hàng");
				}

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
							keyboardName: keyboard.keyboardName,
							pcbType: keyboard.pcbType,
							keyboardSize: keyboard.keyboardSize,
							solder: keyboard.services.solder?.isUse
								? { price: keyboard.services.solder.price }
								: null,
							desolder: keyboard.services.desolder?.isUse
								? { price: keyboard.services.desolder.price }
								: null,
							clean: keyboard.services.clean?.isUse
								? { price: keyboard.services.clean.price }
								: null,
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
							lube: switchItem.services.lube.isUse
								? { price: switchItem.services.lube.price }
								: null,
							film: switchItem.services.film.isUse
								? { price: switchItem.services.film.price }
								: null,
							spring: switchItem.services.spring.isUse
								? { price: switchItem.services.spring.price }
								: null,
							clean: switchItem.services.clean.isUse
								? { price: switchItem.services.clean.price }
								: null,
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
							name: stabilizer.name,
							quantity: stabilizer.quantity,
							services: stabilizer.services,
							attachments: stabilizer.attachments,
							note: stabilizer.note,
						})),
						totalPrice: state.stabilizerItems.reduce(
							(sum, stabilizer) => {
								return sum;
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
						delivery: state.shippingInfo.isDeliverySameAsPickup
							? state.shippingInfo.pickup
							: state.shippingInfo.delivery,
					},
					contact: state.contactInfo,
					totalAmount: get().actions.calculateTotalPrice(),
				};
			},

			submitServiceBooking: async () => {
				try {
					const formattedData = get().actions.formatDataForBackend();
					console.log("Submitting service booking:", formattedData);

					const response =
						await ServiceClient.upsertBooking(formattedData);
					console.log("Booking submitted successfully:", response);

					return response;
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
				set((state) => ({
					...state,
					serviceForm: payload,
				}));
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
		(state) => state.actions.validateForm().length === 0
	),

	// Legacy selectors for backward compatibility
	selectedOpt: useServices((state) => state.selectedOpt),
	serviceForm: useServices((state) => state.serviceForm),
});

export default useServices;

function createDefaultKeyboardItem(): IKeyboardFormItem {
	return {
		id: generateId(),
		keyboardName: "",
		pcbType: "",
		keyboardSize: "",
		services: {
			solder: { isUse: false, price: 0 },
			desolder: { isUse: false, price: 0 },
			clean: { isUse: false, price: 0 },
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
		name: null,
		quantity: 1,
		services: {
			lube: { isUse: false, price: 0, info: {} },
			film: { isUse: false, price: 0, info: {} },
			clean: { isUse: false, price: 0 },
		},
		attachments: [],
		note: "",
		status: null,
	};
}

function generateId(): string {
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
