import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface States {
	selectedOpt: IOptionService | null;
	serviceForm: IServiceForm;
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
		},
	}))
);

export const useServiceAction = () => useServices((state) => state.actions);

export default useServices;
