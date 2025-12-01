import ServiceClient from "@/client/ServiceClient";
import { MAPPING_FEE_LABEL, SUGGESTED_DISCOUNT_CODES } from "@/constants";
import {
	EnumFeeType,
	EnumPaymentForm,
	EnumPaymentMethod,
	EnumPaymentStatus,
	EnumPcbType,
	EnumServiceStatus,
	EnumShippingMethodCode,
	EnumStabilizerMountType,
	EnumStabilizerStatus,
	EnumStabilizerType,
	EnumSwitchStatus,
	EnumSwitchType,
} from "@/interface/interface";
import { keyBy } from "lodash";
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

export enum EnumServiceType {
	KEYBOARD = "KEYBOARD",
	SWITCH = "SWITCH",
	STABILIZER = "STABILIZER",
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
	PER_UNIT = "PER_UNIT",
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

export interface IStabilizerPack {
	id: string;
	name: string;
	type: "6.25U" | "7U";
	value: string;
	quantity: number;
	wireQuantity: number;
}

export interface IStabilizerWire {
	id: string;
	name: string;
	type: "2U" | "6.25U" | "7U";
	value: string;
	quantity: number;
}

export interface IServiceItem {
	isUse: boolean;
	price: number;
	name: string;
	info?: Record<string, any>;
	unitPrice?: Record<string, number>;
	unitType?: UnitType;
}
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
		wires: IStabilizerWire[];
		packs: IStabilizerPack[];
		status: EnumStabilizerStatus | null;
		totalWire: number;
		totalPack: number;
	};
	attachments: { publicUrl: string; size: number }[];
	note?: string;
	services: {
		keyboard: {
			// solder | desolder | clean
			[x: string]: IServiceItem;
		};
		switch: {
			// lube | film | spring | clean | quickClean
			[x: string]: IServiceItem;
		};
		stabilizer: {
			// handle | clean
			[x: string]: IServiceItem;
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
		[x: string]: IServiceItem;
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
			unitPrice?: Record<string, number>;
			unitType?: UnitType;
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
interface IBackendTask {
	id: string;
	serviceType: EnumServiceType;
	keyboard?: IKeyboardFormItem;
	switch?: ISwitchFormItem;
	stabilizer?: IStabilizerFormItem;
	totalPrice: number;
}

interface IBackendFee {
	feeId: string;
	feeName: string;
	feeDescription: string;
	feeAmount: number;
}

interface IBackendBookingData {
	planId: number | string;
	// services: IBackendServiceItem[];
	shipping: { method: string; pickup: any; delivery: any };
	contact: IContactInfo;
	totalPrice: number;
	subTotalPrice: number;
	status: EnumServiceStatus;
	paymentStatus: EnumPaymentStatus;
	paymentMethod?: EnumPaymentMethod; // TODO: need defined enum
	paymentForm?: EnumPaymentForm;
	tasks: IBackendTask[];
	note?: string;
	totalService: number;
}

export interface IPaymentForm {
	id: number;
	name: string;
	description: string;
	discount: number;
	percentage?: number; // 0 - 1
	paid?: number; // totalPrice * percentage
	remaining?: number; // totalPrie - paid
	isActive?: boolean;
	icon?: string;
	value: EnumPaymentForm | null;
}

export interface IPaymentMethod {
	id: number;
	name: string;
	description: string;
	value: EnumPaymentMethod | null;
	icon?: string;
	isOnlyIcon?: boolean;
	attachment?: { publicUrl: string; alt: string };
	iconW?: number;
	iconH?: number;
	isActive?: boolean;
	scale?: number;
	info?: {
		label: string;
		logo: string;
		accountNumber: string;
		accountHolder: string;
		qrCodeImage?: string;
		scale?: number;
	};
}

export interface IDonation {
	id: number;
	percentage?: number; // 0 - 1
	totalDonated?: number;
	note?: string;
	name: string;
	value: string;
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

	// payment
	paymentMethod: IPaymentMethod | null;
	paymentForm: IPaymentForm | null;
	donation:
		| (IDonation & {
				message?: string;
		  })
		| null;

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
	selectPaymentMethod: (method: IPaymentMethod) => void;
	selectPaymentForm: (form: IPaymentForm) => void;
	selectDonation: (donation: IDonation | null) => void;
	setDonationNote: (message: string) => void;

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
		name: "switchItems" | "stabilizerItems"
	) => void;

	resetKeyboardTaskItem: ({
		taskId,
		parentName,
		name,
	}: {
		taskId: string;
		parentName: "keyboard" | "switch" | "stabilizer";
		name: string;
	}) => void;

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
	getPriceKeyboardServiceById: (serviceId: string) => number;
	calculatePriceWireAndPack: ({
		wires,
		packs,
		packPrice,
		unitPrice,
	}: {
		wires: IStabilizerWire[];
		packs: IStabilizerPack[];
		packPrice: number;
		unitPrice: Record<string, number>;
	}) => number;
	getPriceServiceById: (
		serviceId: string,
		type: "switch" | "stabilizer"
	) => number;

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
	// payment
	paymentMethod: null,
	paymentForm: null,
	donation: null,
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

			selectPaymentMethod: (method: IPaymentMethod) => {
				set((state) => ({
					...state,
					paymentMethod: method,
				}));
			},

			selectPaymentForm: (form: IPaymentForm) => {
				set((state) => ({
					...state,
					paymentForm: form,
				}));
			},
			selectDonation: (donation: IDonation) => {
				set((state) => ({
					...state,
					donation: donation,
				}));
			},
			setDonationNote: (message: string) => {
				set((state) => ({
					...state,
					donation: state.donation
						? { ...state.donation, message }
						: null,
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
			resetKeyboardTaskItem: ({ taskId, parentName, name }) => {
				const state = get();
				set((state) => ({
					...state,
					keyboardItems: state.keyboardItems.map((it) => {
						if (it.id === taskId) {
							return {
								...it,
								services: {
									...it.services,
									[parentName]: {},
								},
							};
						}
						return it;
					}),
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
				const { calculateSubTotalPrice } = state.actions;
				const subTotalPrice = calculateSubTotalPrice();
				let total = 0;

				// Add discount
				total -= state.totalDiscount;

				return total + subTotalPrice;
			},
			calculateSubTotalPrice: () => {
				// TODO: without fees and discount
				const state = get();
				const { calculateTotalServicePrice } = state.actions;
				const totalServicePrice = calculateTotalServicePrice();
				let total = 0;

				// Add plan price
				if (state.selectedPlan) {
					total += state.selectedPlan.price;
				}

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

				console.log("totalServicePrice", totalServicePrice);
				return total + totalServicePrice;
			},
			calculateTotalServicePrice: () => {
				const state = get();
				let total = 0;

				// Add keyboard service prices
				state.keyboardItems.forEach((item) => {
					if (!item.services) return;
					Object.entries(item.services || {}).forEach(
						([serviceKey, service]) => {
							switch (serviceKey) {
								case "stabilizer": {
									Object.values(service).forEach(
										(stabService) => {
											if (!stabService.isUse) return;
											if (
												["handle", "clean"].includes(
													stabService.name
												)
											) {
												const unitPrice =
													stabService?.unitPrice ||
													{};
												const packPrice =
													stabService?.price || 0;
												let wireTotalPrice = 0,
													packTotalPrice = 0;

												item.stabilizer.wires.forEach(
													(wire) => {
														const pricePerWire =
															unitPrice[
																wire.type
															] || 0;
														wireTotalPrice +=
															pricePerWire *
															wire.quantity;
													}
												);

												item.stabilizer.packs.forEach(
													(pack) => {
														packTotalPrice +=
															pack.quantity *
															packPrice;
													}
												);

												total +=
													wireTotalPrice +
													packTotalPrice;
											}
										}
									);
									break;
								}
								case "switch": {
									Object.values(service).forEach(
										(switchService) => {
											if (!switchService.isUse) return;
											if (
												[
													"lube",
													"film",
													"clean",
													"quickClean",
												].includes(switchService.name)
											) {
												const servicePrice =
													switchService?.price || 0;
												const quantity =
													item.switch.quantity || 1;
												total +=
													servicePrice * quantity;
											} else {
												total +=
													switchService?.price || 0;
											}
										}
									);
									break;
								}
								default: {
									Object.values(service).forEach(
										(stabService) => {
											if (!stabService.isUse) return;
											total += stabService?.price || 0;
										}
									);
									break;
								}
							}
						}
					);
				});

				// Add switch service prices
				state.switchItems.forEach((switchItem) => {
					console.log("switchItem calc", switchItem);
					if (!Object.values(switchItem.services || {}).length)
						return;
					Object.values(switchItem.services || {}).forEach(
						(service) => {
							if (!service.isUse) return;
							if (
								[
									"lube",
									"film",
									"clean",
									"quickClean",
								].includes(service.name || "")
							) {
								total +=
									(service?.price || 0) * switchItem.quantity;
							} else {
								total += service?.price || 0;
							}
						}
					);
				});

				// Add stabilizer service prices
				state.stabilizerItems.forEach((stabilizer) => {
					if (!stabilizer.services) return;
					Object.values(stabilizer.services).forEach(
						(stabService) => {
							if (!stabService.isUse) return;
							if (
								["handle", "clean"].includes(
									stabService?.name || ""
								)
							) {
								const unitPrice = stabService?.unitPrice || {};
								const packPrice = stabService?.price || 0;
								let wireTotalPrice = 0,
									packTotalPrice = 0;

								stabilizer.wires.forEach((wire) => {
									const pricePerWire =
										unitPrice[wire.type] || 0;
									wireTotalPrice +=
										pricePerWire * wire.quantity;
								});

								stabilizer.packs.forEach((pack) => {
									packTotalPrice += pack.quantity * packPrice;
								});

								total += wireTotalPrice + packTotalPrice;
							}
						}
					);
				});

				console.log("total", total);

				return total;
			},
			calculateTotalService: () => {
				const state = get();
				let total = 0;
				if (state.keyboardItems.length) {
					total += state.keyboardItems.length;
				}

				if (state.switchItems.length) {
					total += state.switchItems.length;
				}
				if (state.stabilizerItems.length) {
					total += state.stabilizerItems.length;
				}

				return total || 0;
			},

			getPriceKeyboardServiceById: (itemId: string) => {
				if (!itemId) return 0;
				const state = get();
				let total = 0;

				console.log("state", state.keyboardItems);

				const found = state.keyboardItems.find(
					(item) => item.id === itemId
				);
				if (!found || !found.services) return 0;

				Object.entries(found.services || {}).forEach(
					([serviceKey, service]) => {
						switch (serviceKey) {
							case "stabilizer": {
								Object.values(service).forEach(
									(stabService) => {
										if (!stabService.isUse) return;
										if (
											["handle", "clean"].includes(
												stabService.name
											)
										) {
											const unitPrice =
												stabService?.unitPrice || {};
											const packPrice =
												stabService?.price || 0;
											let wireTotalPrice = 0,
												packTotalPrice = 0;

											found.stabilizer.wires.forEach(
												(wire) => {
													const pricePerWire =
														unitPrice[wire.type] ||
														0;
													wireTotalPrice +=
														pricePerWire *
														wire.quantity;
												}
											);

											found.stabilizer.packs.forEach(
												(pack) => {
													packTotalPrice +=
														pack.quantity *
														packPrice;
												}
											);

											total +=
												wireTotalPrice + packTotalPrice;
										}
									}
								);
								break;
							}
							case "switch": {
								Object.values(service).forEach(
									(switchService) => {
										if (!switchService.isUse) return;
										if (
											[
												"lube",
												"film",
												"clean",
												"quickClean",
											].includes(switchService.name)
										) {
											const servicePrice =
												switchService?.price || 0;
											const quantity =
												found.switch.quantity || 1;
											total += servicePrice * quantity;
										} else {
											total += switchService?.price || 0;
										}
									}
								);
								break;
							}
							default: {
								Object.values(service).forEach(
									(stabService) => {
										if (!stabService.isUse) return;
										total += stabService?.price || 0;
									}
								);
								break;
							}
						}
					}
				);

				return total;
			},
			calculatePriceWireAndPack({ wires, packs, packPrice, unitPrice }) {
				let total = 0;

				wires.forEach((wire) => {
					const pricePerWire = unitPrice[wire.type] || 0;
					total += pricePerWire * wire.quantity;
				});

				packs.forEach((pack) => {
					total += pack.quantity * packPrice;
				});

				return total;
			},
			getPriceServiceById: (
				serviceId: string,
				type: "switch" | "stabilizer"
			) => {
				if (!serviceId) return 0;
				const state = get();
				let total = 0;

				let findingItems: (ISwitchFormItem | IStabilizerFormItem)[] =
					[];
				if (type === "switch") {
					findingItems = state.switchItems;
				} else if (type === "stabilizer") {
					findingItems = state.stabilizerItems;
				}

				const found = findingItems.find(
					(item) => item.id === serviceId
				);

				if (!found || !found.services) return 0;

				Object.entries(found.services || {}).forEach(([_, service]) => {
					if (!service.isUse) return;
					switch (type) {
						case "stabilizer": {
							if (
								["handle", "clean"].includes(
									service?.name || ""
								)
							) {
								const unitPrice = service?.unitPrice || {};
								const packPrice = service?.price || 0;
								let wireTotalPrice = 0,
									packTotalPrice = 0;

								(found as IStabilizerFormItem).wires.forEach(
									(wire) => {
										const pricePerWire =
											unitPrice[wire.type] || 0;
										wireTotalPrice +=
											pricePerWire * wire.quantity;
									}
								);

								(found as IStabilizerFormItem).packs.forEach(
									(pack) => {
										packTotalPrice +=
											pack.quantity * packPrice;
									}
								);

								total += wireTotalPrice + packTotalPrice;
							} else {
								total += service?.price || 0;
							}
							break;
						}
						case "switch": {
							if (
								[
									"lube",
									"film",
									"clean",
									"quickClean",
								].includes(service?.name || "")
							) {
								const servicePrice = service?.price || 0;
								const quantity =
									(found as ISwitchFormItem)?.quantity || 1;
								total += servicePrice * quantity;
							} else {
								total += service?.price || 0;
							}
							break;
						}
						default:
							break;
					}
				});

				return total;
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

				if (
					!state.keyboardItems.length &&
					!state.switchItems.length &&
					!state.stabilizerItems.length
				) {
					errors.serviceBlock = "Vui lòng thêm ít nhất một dịch vụ";
				}

				if (state.keyboardItems) {
					// const isMissingService = state.keyboardItems.some(
					// 	(keyboard) => {
					// 		return Object.values(keyboard.services).some(
					// 			(service) => {
					// 				return !service.isUse;
					// 			}
					// 		);
					// 	}
					// );
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
					// if (isMissingService) {
					// 	errors.keyboardServices =
					// 		"Vui lòng lựa chọn ít nhất 1 dịch vụ";
					// }
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
							if (!stabilizer.services) return false;
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
				const fees: IBackendFee[] = [];
				const tasks: IBackendTask[] = [];

				// Format keyboard services
				if (state.keyboardItems.length > 0) {
					state.keyboardItems.forEach((item) => {
						tasks.push({
							id: item.id,
							keyboard: item,
							serviceType: EnumServiceType.KEYBOARD,
							totalPrice:
								state.actions.getPriceKeyboardServiceById(
									item.id
								),
						});
					});
				}

				// Format switch services
				if (state.switchItems.length > 0) {
					state.switchItems.forEach((item) => {
						tasks.push({
							id: item.id,
							switch: item,
							serviceType: EnumServiceType.SWITCH,
							totalPrice: state.actions.getPriceServiceById(
								item.id,
								"switch"
							),
						});
					});
				}

				// Format stabilizer services
				if (state.stabilizerItems.length > 0) {
					state.stabilizerItems.forEach((item) => {
						tasks.push({
							id: item.id,
							stabilizer: item,
							serviceType: EnumServiceType.STABILIZER,
							totalPrice: state.actions.getPriceServiceById(
								item.id,
								"stabilizer"
							),
						});
					});
				}

				// format fee field
				Object.entries(state.fees).forEach(([key, value]) => {
					const objFeeAmount =
						typeof value === "object"
							? value?.delivery + value?.pickup
							: value;
					if (objFeeAmount <= 0) return;
					fees.push({
						feeId: generateId(),
						feeName: MAPPING_FEE_LABEL[key as keyof States["fees"]],
						feeAmount: objFeeAmount,
						feeDescription: "",
					});
				});

				if (state.selectedPlan?.price) {
					fees.push({
						feeId: generateId(),
						feeName: MAPPING_FEE_LABEL[EnumFeeType.SELECTEDPLAN],
						feeDescription: "",
						feeAmount: state.selectedPlan?.price || 0,
					});
				}

				if (state.shippingInfo?.method?.price) {
					fees.push({
						feeId: generateId(),
						feeName: MAPPING_FEE_LABEL[EnumFeeType.SHIPPING_METHOD],
						feeDescription: "",
						feeAmount: state.shippingInfo.method.price,
					});
				}

				if (state.shippingInfo?.deliveryMethod?.price) {
					fees.push({
						feeId: generateId(),
						feeName:
							MAPPING_FEE_LABEL[
								EnumFeeType.SHIPPING_DELIVERY_METHOD
							],
						feeDescription: "",
						feeAmount: state.shippingInfo.deliveryMethod.price,
					});
				}

				return {
					planId: state.selectedPlan?.planId || "", // service_plan_id
					shipping: {
						method: state.shippingInfo.method.code,
						pickup: state.shippingInfo.pickup,
						delivery: state.shippingInfo.delivery,
					},
					contact: state.contactInfo, // ServiceCustomerInfo
					discounts: state.discounts, // DiscountInfo[]
					totalDiscount: state.totalDiscount, // number
					subTotalPrice: get().actions.calculateSubTotalPrice(), // number
					totalPrice: get().actions.calculateTotalPrice(), // number
					fees, // FeeInfo[]
					note: "",
					status: EnumServiceStatus.DRAFT,
					paymentStatus: EnumPaymentStatus.PENDING, // default to PENDING
					tasks,
					createdAt: new Date().toISOString(),
					totalService: get().actions.calculateTotalService(),
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

					const response =
						await ServiceClient.postBookingService(formattedData);
					console.log("Booking submitted successfully:", response);

					return response;

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
			wires: [],
			packs: [],
			totalWire: 0,
			totalPack: 0,
		},
		services: {
			keyboard: {},
			switch: {},
			stabilizer: {},
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
		services: {},
	};
}

function createDefaultStabilizerItem(): IStabilizerFormItem {
	return {
		id: generateId(),
		type: null,
		mountType: null,
		brand: "",
		status: null,
		wires: [],
		packs: [],
		totalWire: 0,
		totalPrice: 0,
		services: {},
		attachments: [],
		note: "",
		totalPack: 0,
	};
}

function generateId(): string {
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
