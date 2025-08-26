import { EnumSwitchStatus } from "@/interface/interface";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface States {
	selectedOpt: IOptionService | null;
	serviceForm: IServiceForm;
	activeTabIndex: number;
	keyboardItems: IKeyboardFormItem[];
	switchItems: ISwitchFormItem[];
}

interface IOptionService {
	value: number;
	name: string;
	subName: string;
	price: number;
	dateTime: string;
	isActive: boolean;
}

interface IServiceForm {
	addressInfo: {
		address: string;
		province: string;
		city: string;
		building?: string;
		note?: string;
	};
	delivery?: {
		time: string;
	};
	pickup?: {
		time: string;
	};
	contactInfo: {
		email: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
	};
	isDeliverySameAsPickup: boolean;
}

interface Actions {
	updateSelectedOpt: (payload: IOptionService) => void;
	updatedServiceForm: (payload: IServiceForm) => void;
	setActiveTabIndex: (index: number) => void;
	addKeyboardItem: () => void;
	removeKeyboardItem: (id: string) => void;
	updateKeyboardItem: (
		id: string,
		updater: Partial<IKeyboardFormItem>
	) => void;
	addSwitchItem: () => void;
	removeSwitchItem: (id: string) => void;
	updateSwitchItem: (id: string, updater: Partial<ISwitchFormItem>) => void;
}

type ServiceState = States & { actions: Actions };

const InitialState = {
	selectedOpt: null,
	serviceForm: {
		addressInfo: {
			address: "",
			province: "",
			city: "",
			building: "",
			note: "",
		},
		delivery: {
			time: "",
		},
		pickup: {
			time: "",
		},
		contactInfo: {
			email: "",
			firstName: "",
			lastName: "",
			phoneNumber: "",
		},
		isDeliverySameAsPickup: true,
	},
	activeTabIndex: 0,
	keyboardItems: [],
	switchItems: [],
};

const useServices = create<ServiceState>()(
	devtools((set, _) => ({
		...InitialState,
		actions: {
			updateSelectedOpt: (payload: IOptionService) => {
				set((state) => ({
					...state,
					selectedOpt: payload,
				}));
			},
			updatedServiceForm: (payload: IServiceForm) => {
				set((state) => ({
					...state,
					serviceForm: payload,
				}));
			},
			setActiveTabIndex: (index: number) => {
				set((state) => ({ ...state, activeTabIndex: index }));
			},
			addKeyboardItem: () => {
				set((state) => ({
					...state,
					keyboardItems: [
						...state.keyboardItems,
						createDefaultKeyboardItem(),
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
		},
	}))
);

export const useServiceAction = () => useServices((state) => state.actions);

export default useServices;

// Types aligned for UI; mapping to backend will occur at submission time
export interface IKeyboardFormItem {
	id: string;
	keyboardName: string;
	pcbType: string;
	keyboardSize: string;
	solder: { isUse: boolean; layout?: string | null };
	desolder: { isUse: boolean; layout?: string | null };
	clean: { isUse: boolean };
	attachments: { publicUrl: string; size: number }[];
	note?: string;
}

export interface ISwitchFormItem {
	id: string;
	switchType: string | null;
	brand: string | null;
	name: string;
	quantity: number;
	lube: boolean;
	film: boolean;
	changeSpring: boolean;
	clean: boolean;
	note?: string;
	attachments: { publicUrl: string; size: number }[];
	status: EnumSwitchStatus | null;
}

function createDefaultKeyboardItem(): IKeyboardFormItem {
	return {
		id: generateId(),
		keyboardName: "",
		pcbType: "",
		keyboardSize: "",
		solder: { isUse: false, layout: null },
		desolder: { isUse: false, layout: null },
		clean: { isUse: false },
		attachments: [],
		note: "",
	};
}

function createDefaultSwitchItem(): ISwitchFormItem {
	return {
		id: generateId(),
		switchType: null,
		brand: null,
		name: "",
		quantity: 1,
		lube: false,
		film: false,
		changeSpring: false,
		clean: false,
		note: "",
		attachments: [],
		status: null,
	};
}

function generateId(): string {
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
