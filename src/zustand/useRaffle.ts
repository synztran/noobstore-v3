import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";
import { EnumPaymentMethod } from "@/interface/interface";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Kiểu dữ liệu cho form
export type TRaffleFormProductSelection = {
	productId: string;
	name: string;
	priority: number | null;
	selected: boolean;
	thumbnail: {
		path: string;
		alt: string;
	};
	price: number;
};

export type TRaffleFormShipping = {
	address: string;
	companyName: string;
	// zipCode?: string;
	shippingMethod: {
		name: string;
		price: number | null;
	};
	city?: string;
};

export type TRaffleFormSubmit = {
	productSelections?: TRaffleFormProductSelection[];
	secretKey?: string;
	shipping?: TRaffleFormShipping;
	note?: string;
	raffleId?: string;
	email?: string;
	phone?: string;
	name?: string;
};

export type TRaffleFormPayment = {
	subPrice: number;
	shippingFee: number;
	tax?: number;
	totalPrice: number;
	paymentMethod: EnumPaymentMethod | null;
	attachment?: {
		path: string;
		alt: string;
	}[];
};

export type TRaffleFormDonation = {
	amount?: string;
	message?: string;
};

// Trạng thái chính
interface States {
	raffleSubmitForm: TRaffleFormSubmit | null;
	isRaffleLoading: boolean;
	isScrollToBottom: boolean;
	rafflePaymentForm: TRaffleFormPayment | null;
	raffleDonationForm: TRaffleFormDonation | null;
	// price
	raffleSubTotalPrice: number;
	raffleTotalPrice: number;
	raffleTaxAmount?: number;
}

interface Actions {
	initFromRaffleData: (raffleData: IBEResponseRaffleInfo) => void;
	setRaffleSubmitForm: (form: TRaffleFormSubmit | null) => void;
	updateRaffleSubmitForm: (updates: Partial<TRaffleFormSubmit>) => void;
	handleClearRaffleSubmitForm: () => void;
	setRaffleLoading: (payload: boolean) => void;
	setScrollToBottom: (payload: boolean) => void;
	initRafflePaymentForm: (payload: TRaffleFormPayment) => void;
	// payment & donation
	updateRafflePaymentForm: (updates: Partial<TRaffleFormPayment>) => void;
	updateRaffleDonationForm: (updates: Partial<TRaffleFormDonation>) => void;
	updateRafflePriceForm: (
		subTotal: number,
		total: number,
		taxAmount: number,
	) => void;
}

type RaffleState = States & { actions: Actions };

const InitialState: States = {
	raffleSubmitForm: null,
	isRaffleLoading: false,
	isScrollToBottom: false,
	rafflePaymentForm: null,
	raffleDonationForm: null,
	// prices
	raffleSubTotalPrice: 0,
	raffleTotalPrice: 0,
};

const useRaffle = create<RaffleState>()(
	devtools((set, get) => ({
		...InitialState,
		actions: {
			initFromRaffleData: (raffleData: IBEResponseRaffleInfo) => {
				// Khởi tạo state từ props raffleData
				set((state) => ({
					raffleSubmitForm: {
						productSelections:
							raffleData?.productOptions?.map((option) => ({
								productId: option.id,
								name: option.label,
								price: option.price,
								thumbnail: option.thumbnail || {
									path: "",
									alt: "",
								},
								priority: null,
								selected: false,
							})) || ([] as TRaffleFormProductSelection[]),
						secretKey: state.raffleSubmitForm?.secretKey ?? "",
						shipping: state.raffleSubmitForm?.shipping ?? {
							address: "",
							companyName: "",
							zipCode: "",
							shippingMethod: { name: "", price: null },
						},
						note: state.raffleSubmitForm?.note ?? "",
						raffleId:
							raffleData?.raffleId ||
							state.raffleSubmitForm?.raffleId ||
							"",
						email: "",
						phone: "",
						name: "",
					},
				}));
			},
			setRaffleSubmitForm: (form) => {
				set((state) => ({
					...state,
					raffleSubmitForm: form,
				}));
			},
			updateRaffleSubmitForm: (updates) => {
				const current = get().raffleSubmitForm;
				// Support dot notation update: { __field: 'shipping.address', __value: 'abc' }
				if (
					(updates as any).__field &&
					(updates as any).__value !== undefined
				) {
					const { __field, __value } = updates as any;
					const keys = __field.split(".");
					let updated: any = { ...current };
					let obj = updated;
					for (let i = 0; i < keys.length - 1; i++) {
						const k = keys[i];
						if (!obj[k] || typeof obj[k] !== "object") obj[k] = {};
						obj = obj[k];
					}
					obj[keys[keys.length - 1]] = __value;
					set((state) => ({
						...state,
						raffleSubmitForm: updated,
					}));
					return;
				}
				// Fallback: shallow/deep merge for objects (legacy)
				let updatedPayload = { ...current };
				if (updates.shipping && typeof updates.shipping === "object") {
					updatedPayload.shipping = {
						...current?.shipping,
						...updates.shipping,
					};
				}
				updatedPayload = {
					...updatedPayload,
					...updates,
				};
				set((state) => ({
					...state,
					raffleSubmitForm: {
						...current,
						...updatedPayload,
					},
				}));
			},
			handleClearRaffleSubmitForm: () => {
				set((state) => ({
					...state,
					raffleSubmitForm: {
						...state.raffleSubmitForm,
						productSelections:
							state.raffleSubmitForm?.productSelections?.map(
								(p) => ({
									...p,
									priority: null,
									selected: false,
								}),
							),
						secretKey: "",
						shipping: {
							address: "",
							companyName: "",
							zipCode: "",
							shippingMethod: { name: "", price: null },
						},
						note: "",
					},
				}));
			},
			setRaffleLoading: (status: boolean) => {
				set((state) => ({
					...state,
					isRaffleLoading: status,
				}));
			},
			setScrollToBottom(payload) {
				set((state) => ({
					...state,
					isScrollToBottom: payload,
				}));
			},
			initRafflePaymentForm(payload) {
				set((state) => ({
					...state,
					rafflePaymentForm: payload,
				}));
			},
			updateRafflePaymentForm(updates: Partial<TRaffleFormPayment>) {
				const current = get().rafflePaymentForm;
				set((state) => ({
					...state,
					rafflePaymentForm: current
						? {
								...current,
								...updates,
							}
						: (updates as TRaffleFormPayment),
				}));
			},
			updateRaffleDonationForm(updates: Partial<TRaffleFormDonation>) {
				const current = get().raffleDonationForm;
				set((state) => ({
					...state,
					raffleDonationForm: current
						? {
								...current,
								...updates,
							}
						: (updates as TRaffleFormDonation),
				}));
			},
			updateRafflePriceForm: (
				subTotal: number,
				total: number,
				taxAmount?: number,
			) => {
				set((state) => ({
					...state,
					raffleSubTotalPrice: subTotal,
					raffleTotalPrice: total,
					raffleTaxAmount: taxAmount,
				}));
			},
		},
	})),
);

// Selector hooks
export const useRaffleAction = () => useRaffle((state) => state.actions);

export default useRaffle;
