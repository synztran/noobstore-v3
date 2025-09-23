import { useState, useCallback } from "react";
import { EnumSwitchStatus, EnumSwitchType } from "@/interface/interface";
import ServiceClient from "@/client/ServiceClient";

// Simplified types for the combined hook
export interface IServiceOption {
	value: string | number;
	label: string;
	price?: number;
}

export interface IServicePlan {
	value: number;
	name: string;
	subName: string;
	price: number;
	dateTime: string;
	isActive: boolean;
}

export interface IKeyboardService {
	id: string;
	keyboardName: string;
	pcbType: string;
	keyboardSize: string;
	services: {
		solder: { isSelected: boolean; price: number };
		desolder: { isSelected: boolean; price: number };
		clean: { isSelected: boolean; price: number };
	};
	attachments: { publicUrl: string; size: number }[];
	note: string;
}

export interface ISwitchService {
	id: string;
	type: string;
	name: string;
	quantity: number;
	status: EnumSwitchStatus | null;
	services: {
		lube: { isSelected: boolean; price: number };
		film: { isSelected: boolean; price: number };
		changeSpring: { isSelected: boolean; price: number };
		clean: { isSelected: boolean; price: number };
	};
	attachments: { publicUrl: string; size: number }[];
	note: string;
}

export interface IStabilizerService {
	id: string;
	type: string;
	quantity: number;
	services: { name: string; price: number }[];
	attachments: { publicUrl: string; size: number }[];
	note: string;
}

export interface IShippingInfo {
	method: {
		name: string;
		code: string;
		price: number;
	};
	pickup: {
		address: string;
		date: string;
		name: string;
		phone: string;
		coordinates?: { latitude: number; longitude: number };
	};
	delivery: {
		address: string;
		date: string;
		name: string;
		phone: string;
		coordinates?: { latitude: number; longitude: number };
	};
	isDeliverySameAsPickup: boolean;
	addOns: {
		name: string;
		price: number;
		description: string;
		isUse: boolean;
	}[];
}

export interface IContactInfo {
	name: string;
	email: string;
	phone: string;
}

export interface IServicePageState {
	// Service plan selection
	selectedPlan: IServicePlan | null;

	// Service items
	keyboardServices: IKeyboardService[];
	switchServices: ISwitchService[];
	stabilizerServices: IStabilizerService[];

	// Form state
	activeTab: number;
	shippingInfo: IShippingInfo;
	contactInfo: IContactInfo;

	// Options for dropdowns
	options: {
		switchTypes: IServiceOption[];
		switchStatuses: IServiceOption[];
		keyboardTypes: IServiceOption[];
		pcbTypes: IServiceOption[];
		layouts: IServiceOption[];
	};
}

// Backend data format interfaces
interface IBackendServiceItem {
	serviceType: string;
	items: any[];
	totalPrice: number;
}

interface IBackendBookingData {
	planId: number;
	services: IBackendServiceItem[];
	shipping: {
		method: string;
		pickup: any;
		delivery: any;
		addOns: any[];
	};
	contact: IContactInfo;
	totalAmount: number;
}

const initialState: IServicePageState = {
	selectedPlan: null,
	keyboardServices: [],
	switchServices: [],
	stabilizerServices: [],
	activeTab: 0,
	shippingInfo: {
		method: { name: "", code: "", price: 0 },
		pickup: { address: "", date: "", name: "", phone: "" },
		delivery: { address: "", date: "", name: "", phone: "" },
		isDeliverySameAsPickup: true,
		addOns: [],
	},
	contactInfo: { name: "", email: "", phone: "" },
	options: {
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
};

export const useServicePage = () => {
	const [state, setState] = useState<IServicePageState>(initialState);

	// Helper function to generate unique IDs
	const generateId = useCallback(() => {
		return Math.random().toString(36).slice(2) + Date.now().toString(36);
	}, []);

	// Service Plan Actions
	const selectPlan = useCallback((plan: IServicePlan) => {
		setState((prev) => ({ ...prev, selectedPlan: plan }));
	}, []);

	// Tab Actions
	const setActiveTab = useCallback((tabIndex: number) => {
		setState((prev) => ({ ...prev, activeTab: tabIndex }));
	}, []);

	// Keyboard Service Actions
	const addKeyboardService = useCallback(() => {
		const newService: IKeyboardService = {
			id: generateId(),
			keyboardName: "",
			pcbType: "",
			keyboardSize: "",
			services: {
				solder: { isSelected: false, price: 0 },
				desolder: { isSelected: false, price: 0 },
				clean: { isSelected: false, price: 0 },
			},
			attachments: [],
			note: "",
		};
		setState((prev) => ({
			...prev,
			keyboardServices: [...prev.keyboardServices, newService],
		}));
	}, [generateId]);

	const updateKeyboardService = useCallback(
		(id: string, updates: Partial<IKeyboardService>) => {
			setState((prev) => ({
				...prev,
				keyboardServices: prev.keyboardServices.map((service) =>
					service.id === id ? { ...service, ...updates } : service
				),
			}));
		},
		[]
	);

	const removeKeyboardService = useCallback((id: string) => {
		setState((prev) => ({
			...prev,
			keyboardServices: prev.keyboardServices.filter(
				(service) => service.id !== id
			),
		}));
	}, []);

	// Switch Service Actions
	const addSwitchService = useCallback(() => {
		const newService: ISwitchService = {
			id: generateId(),
			type: "",
			name: "",
			quantity: 1,
			status: null,
			services: {
				lube: { isSelected: false, price: 0 },
				film: { isSelected: false, price: 0 },
				changeSpring: { isSelected: false, price: 0 },
				clean: { isSelected: false, price: 0 },
			},
			attachments: [],
			note: "",
		};
		setState((prev) => ({
			...prev,
			switchServices: [...prev.switchServices, newService],
		}));
	}, [generateId]);

	const updateSwitchService = useCallback(
		(id: string, updates: Partial<ISwitchService>) => {
			setState((prev) => ({
				...prev,
				switchServices: prev.switchServices.map((service) =>
					service.id === id ? { ...service, ...updates } : service
				),
			}));
		},
		[]
	);

	const removeSwitchService = useCallback((id: string) => {
		setState((prev) => ({
			...prev,
			switchServices: prev.switchServices.filter(
				(service) => service.id !== id
			),
		}));
	}, []);

	// Stabilizer Service Actions
	const addStabilizerService = useCallback(() => {
		const newService: IStabilizerService = {
			id: generateId(),
			type: "",
			quantity: 1,
			services: [],
			attachments: [],
			note: "",
		};
		setState((prev) => ({
			...prev,
			stabilizerServices: [...prev.stabilizerServices, newService],
		}));
	}, [generateId]);

	const updateStabilizerService = useCallback(
		(id: string, updates: Partial<IStabilizerService>) => {
			setState((prev) => ({
				...prev,
				stabilizerServices: prev.stabilizerServices.map((service) =>
					service.id === id ? { ...service, ...updates } : service
				),
			}));
		},
		[]
	);

	const removeStabilizerService = useCallback((id: string) => {
		setState((prev) => ({
			...prev,
			stabilizerServices: prev.stabilizerServices.filter(
				(service) => service.id !== id
			),
		}));
	}, []);

	// Shipping and Contact Actions
	const updateShippingInfo = useCallback(
		(updates: Partial<IShippingInfo>) => {
			setState((prev) => ({
				...prev,
				shippingInfo: { ...prev.shippingInfo, ...updates },
			}));
		},
		[]
	);

	const updateContactInfo = useCallback((updates: Partial<IContactInfo>) => {
		setState((prev) => ({
			...prev,
			contactInfo: { ...prev.contactInfo, ...updates },
		}));
	}, []);

	// Options Management
	const addOption = useCallback(
		(
			category: keyof IServicePageState["options"],
			option: IServiceOption
		) => {
			setState((prev) => ({
				...prev,
				options: {
					...prev.options,
					[category]: [...prev.options[category], option],
				},
			}));
		},
		[]
	);

	// Calculate total price
	const calculateTotalPrice = useCallback(() => {
		let total = 0;

		// Add plan price
		if (state.selectedPlan) {
			total += state.selectedPlan.price;
		}

		// Add keyboard service prices
		state.keyboardServices.forEach((keyboard) => {
			Object.values(keyboard.services).forEach((service) => {
				if (service.isSelected) {
					total += service.price;
				}
			});
		});

		// Add switch service prices
		state.switchServices.forEach((switchItem) => {
			Object.values(switchItem.services).forEach((service) => {
				if (service.isSelected) {
					total += service.price * switchItem.quantity;
				}
			});
		});

		// Add stabilizer service prices
		state.stabilizerServices.forEach((stabilizer) => {
			stabilizer.services.forEach((service) => {
				total += service.price * stabilizer.quantity;
			});
		});

		// Add shipping price
		total += state.shippingInfo.method.price;

		return total;
	}, [state]);

	// Format data for backend submission
	const formatDataForBackend = useCallback((): IBackendBookingData => {
		const services: IBackendServiceItem[] = [];

		// Format keyboard services
		if (state.keyboardServices.length > 0) {
			services.push({
				serviceType: "KEYBOARD",
				items: state.keyboardServices.map((keyboard) => ({
					keyboardName: keyboard.keyboardName,
					pcbType: keyboard.pcbType,
					keyboardSize: keyboard.keyboardSize,
					solder: keyboard.services.solder.isSelected
						? { price: keyboard.services.solder.price }
						: null,
					desolder: keyboard.services.desolder.isSelected
						? { price: keyboard.services.desolder.price }
						: null,
					clean: keyboard.services.clean.isSelected
						? { price: keyboard.services.clean.price }
						: null,
					attachments: keyboard.attachments,
					note: keyboard.note,
				})),
				totalPrice: state.keyboardServices.reduce((sum, keyboard) => {
					return (
						sum +
						Object.values(keyboard.services).reduce(
							(serviceSum, service) => {
								return (
									serviceSum +
									(service.isSelected ? service.price : 0)
								);
							},
							0
						)
					);
				}, 0),
			});
		}

		// Format switch services
		if (state.switchServices.length > 0) {
			services.push({
				serviceType: "SWITCHES",
				items: state.switchServices.map((switchItem) => ({
					type: switchItem.type,
					name: switchItem.name,
					quantity: switchItem.quantity,
					status: switchItem.status,
					lube: switchItem.services.lube.isSelected
						? { price: switchItem.services.lube.price }
						: null,
					film: switchItem.services.film.isSelected
						? { price: switchItem.services.film.price }
						: null,
					changeSpring: switchItem.services.changeSpring.isSelected
						? { price: switchItem.services.changeSpring.price }
						: null,
					clean: switchItem.services.clean.isSelected
						? { price: switchItem.services.clean.price }
						: null,
					attachments: switchItem.attachments,
					note: switchItem.note,
				})),
				totalPrice: state.switchServices.reduce((sum, switchItem) => {
					return (
						sum +
						Object.values(switchItem.services).reduce(
							(serviceSum, service) => {
								return (
									serviceSum +
									(service.isSelected
										? service.price * switchItem.quantity
										: 0)
								);
							},
							0
						)
					);
				}, 0),
			});
		}

		// Format stabilizer services
		if (state.stabilizerServices.length > 0) {
			services.push({
				serviceType: "STABILIZER",
				items: state.stabilizerServices.map((stabilizer) => ({
					type: stabilizer.type,
					quantity: stabilizer.quantity,
					services: stabilizer.services,
					attachments: stabilizer.attachments,
					note: stabilizer.note,
				})),
				totalPrice: state.stabilizerServices.reduce(
					(sum, stabilizer) => {
						return (
							sum +
							stabilizer.services.reduce(
								(serviceSum, service) => {
									return (
										serviceSum +
										service.price * stabilizer.quantity
									);
								},
								0
							)
						);
					},
					0
				),
			});
		}

		return {
			planId: state.selectedPlan?.value || 0,
			services,
			shipping: {
				method: state.shippingInfo.method.code,
				pickup: state.shippingInfo.pickup,
				delivery: state.shippingInfo.isDeliverySameAsPickup
					? state.shippingInfo.pickup
					: state.shippingInfo.delivery,
				addOns: state.shippingInfo.addOns,
			},
			contact: state.contactInfo,
			totalAmount: calculateTotalPrice(),
		};
	}, [state, calculateTotalPrice]);

	// Submit service booking
	const submitServiceBooking = useCallback(async () => {
		try {
			const formattedData = formatDataForBackend();
			console.log("Submitting service booking:", formattedData);

			const response = await ServiceClient.upsertBooking(formattedData);
			console.log("Booking submitted successfully:", response);

			return response;
		} catch (error) {
			console.error("Failed to submit service booking:", error);
			throw error;
		}
	}, [formatDataForBackend]);

	// Validation
	const validateForm = useCallback(() => {
		const errors: string[] = [];

		if (!state.selectedPlan) {
			errors.push("Vui lòng chọn gói dịch vụ");
		}

		if (
			state.keyboardServices.length === 0 &&
			state.switchServices.length === 0 &&
			state.stabilizerServices.length === 0
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
	}, [state]);

	// Reset form
	const resetForm = useCallback(() => {
		setState(initialState);
	}, []);

	const calculateExpectedPlan = useCallback(
		(min: number, max: number, services?: any[]) => {
			const currentDate = new Date();
			const minDateObj = new Date(
				currentDate.getTime() + min * 24 * 60 * 60 * 1000
			);
			const maxDateObj = new Date(
				currentDate.getTime() + max * 24 * 60 * 60 * 1000
			);

			const formatDate = (date: Date) => {
				const day = String(date.getDate()).padStart(2, "0");
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const year = date.getFullYear();
				return `${day}/${month}/${year}`;
			};

			const minDate = formatDate(minDateObj);
			const maxDate = formatDate(maxDateObj);
			return {
				minDate,
				maxDate,
			};
		},
		[]
	);

	return {
		// State
		...state,
		totalPrice: calculateTotalPrice(),

		// Actions
		selectPlan,
		setActiveTab,

		// Keyboard actions
		addKeyboardService,
		updateKeyboardService,
		removeKeyboardService,

		// Switch actions
		addSwitchService,
		updateSwitchService,
		removeSwitchService,

		// Stabilizer actions
		addStabilizerService,
		updateStabilizerService,
		removeStabilizerService,

		// Form actions
		updateShippingInfo,
		updateContactInfo,
		addOption,

		// Utilities
		validateForm,
		submitServiceBooking,
		resetForm,
		formatDataForBackend,
		calculateExpectedPlan,
	};
};

export default useServicePage;
