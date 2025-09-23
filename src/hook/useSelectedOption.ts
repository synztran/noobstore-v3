import { IOptionSelection } from "@/components/SelectComp";
import { EnumSwitchType } from "@/interface/interface";
import { useState, useCallback } from "react";

type TProps = {
	// Switch form options
	initialSwitchTypeOptions?: IOptionSelection[];
	initialSwitchStatusOptions?: IOptionSelection[];

	// Keyboard form options
	initialKeyboardOptions?: IOptionSelection[];
	initialPcbOptions?: IOptionSelection[];
	initialLayoutOptions?: IOptionSelection[];

	// Service prices for keyboard form
	initialServicePrices?: {
		solder?: { price: number; name: string; description: string };
		desolder?: { price: number; name: string; description: string };
		cleanKeyboard?: { price: number; name: string; description: string };
		lube?: {
			price: number;
			name: string;
			description: string;
			info?: {
				grease: string;
			};
		};
		film?: {
			price: number;
			name: string;
			info?: {
				brand: string;
				type: string;
				color: string;
			};
			description: string;
		};
		spring?: {
			price: number;
			name: string;
			info?: {
				brand: string;
				type: string;
				force: string;
			};
			description: string;
		};
		cleanSwitch?: { price: number; name: string; description: string };
		quickCleanSwitch?: { price: number; name: string; description: string };
		cleanStabilizer?: { price: number; name: string; description: string };
	};

	// Stabilizer form options
	initialStabilizerOptions?: IOptionSelection[];
	initialStabilizerMountTypeOptions?: IOptionSelection[];
	initialStabilizerTypeOptions?: IOptionSelection[];
	initialStabilizerStatusOptions?: IOptionSelection[];
};

const useSelectedOption = (props: TProps) => {
	const [serviceSwitchSelected, setSwitchSelected] = useState<{
		type: EnumSwitchType | string;
		name: string;
		quantity: number;
		lube: {
			value: boolean;
			price: number;
			name: string;
			description: string;
			info: {
				grease?: string;
			};
		};
		clean: {
			value: boolean;
			price: number;
			name: string;
			description: string;
		};
		film: {
			value: boolean;
			price: number;
			name: string;
			info: {
				brand?: string;
				type?: string;
				color?: string;
			};
			description: string;
		};
		spring: {
			value: boolean;
			price: number;
			name: string;
			info: {
				brand?: string;
				type?: string;
				force?: string;
			};
			description: string;
		};
		quickClean: {
			value: boolean;
			price: number;
			name: string;
			description: string;
		};
	}>({
		type: "",
		name: "",
		quantity: 0,
		lube: {
			value: false,
			price: props.initialServicePrices?.lube?.price || 0,
			name: props.initialServicePrices?.lube?.name || "",
			description: props.initialServicePrices?.lube?.description || "",
			info: props.initialServicePrices?.lube?.info || {
				grease: "",
			},
		},
		clean: {
			value: false,
			price: props.initialServicePrices?.cleanSwitch?.price || 0,
			name: props.initialServicePrices?.cleanSwitch?.name || "",
			description:
				props.initialServicePrices?.cleanSwitch?.description || "",
		},
		film: {
			value: false,
			price: props.initialServicePrices?.film?.price || 0,
			name: props.initialServicePrices?.film?.name || "",
			info: props.initialServicePrices?.film?.info || {
				brand: "",
				type: "",
				color: "",
			},
			description: props.initialServicePrices?.film?.description || "",
		},
		spring: {
			value: false,
			price: props.initialServicePrices?.spring?.price || 0,
			name: props.initialServicePrices?.spring?.name || "",
			info: props.initialServicePrices?.spring?.info || {
				brand: "",
				type: "",
				force: "",
			},
			description: props.initialServicePrices?.spring?.description || "",
		},
		quickClean: {
			value: false,
			price: props.initialServicePrices?.quickCleanSwitch?.price || 0,
			name: props.initialServicePrices?.quickCleanSwitch?.name || "",
			description:
				props.initialServicePrices?.quickCleanSwitch?.description || "",
		},
	});
	const [switchOptions, setSwitchOptions] = useState<{
		type: IOptionSelection[];
		status: IOptionSelection[];
	}>({
		type: props.initialSwitchTypeOptions || [],
		status: props.initialSwitchStatusOptions || [],
	});

	// Keyboard form state
	const [keyboardOptions, setKeyboardOptions] = useState<{
		keyboard: IOptionSelection[];
		pcb: IOptionSelection[];
		layout: IOptionSelection[];
	}>({
		keyboard: props.initialKeyboardOptions || [],
		pcb: props.initialPcbOptions || [],
		layout: props.initialLayoutOptions || [],
	});

	const [keyboardFormSelected, setKeyboardFormSelected] = useState<{
		keyboard: IOptionSelection | null;
		pcb: IOptionSelection | null;
		services: {
			solder: {
				value: boolean;
				price: number;
				name: string;
				description: string;
			};
			desolder: {
				value: boolean;
				price: number;
				name: string;
				description: string;
			};
			clean: {
				value: boolean;
				price: number;
				name: string;
				description: string;
			};
		};
	}>({
		keyboard: null,
		pcb: null,
		services: {
			solder: {
				value: false,
				price: props.initialServicePrices?.solder?.price || 0,
				name: props.initialServicePrices?.solder?.name || "",
				description:
					props.initialServicePrices?.solder?.description || "",
			},
			desolder: {
				value: false,
				price: props.initialServicePrices?.desolder?.price || 0,
				name: props.initialServicePrices?.desolder?.name || "",
				description:
					props.initialServicePrices?.desolder?.description || "",
			},
			clean: {
				value: false,
				price: props.initialServicePrices?.cleanKeyboard?.price || 0,
				name: props.initialServicePrices?.cleanKeyboard?.name || "",
				description:
					props.initialServicePrices?.cleanKeyboard?.description ||
					"",
			},
		},
	});

	// Stabilizer form state
	const [stabilizerOptions, setStabilizerOptions] = useState<{
		stabilizer: IOptionSelection[];
		stabilizerMountType: IOptionSelection[];
		stabilizerType: IOptionSelection[];
		status: IOptionSelection[];
	}>({
		stabilizer: props.initialStabilizerOptions || [],
		stabilizerMountType: props.initialStabilizerMountTypeOptions || [],
		stabilizerType: props.initialStabilizerTypeOptions || [],
		status: props.initialStabilizerStatusOptions || [],
	});

	const [stabilizerFormSelected, setStabilizerFormSelected] = useState<{
		stabilizer: IOptionSelection | null;
		stabilizerMountType: IOptionSelection | null;
		stabilizerType: IOptionSelection | null;
		services: {
			handle: {
				value: boolean;
				price: number;
				name: string;
				description: string;
			};
			clean: {
				value: boolean;
				price: number;
				name: string;
				description: string;
			};
		};
	}>({
		stabilizer: null,
		stabilizerMountType: null,
		stabilizerType: null,
		services: {
			handle: {
				value: false,
				price: props.initialServicePrices?.lube?.price || 0,
				name: props.initialServicePrices?.lube?.name || "",
				description:
					props.initialServicePrices?.lube?.description || "",
			},
			clean: {
				value: false,
				price: props.initialServicePrices?.cleanStabilizer?.price || 0,
				name: props.initialServicePrices?.cleanStabilizer?.name || "",
				description:
					props.initialServicePrices?.cleanStabilizer?.description ||
					"",
			},
		},
	});

	const handleChangeOption = ({
		name,
		option,
	}: {
		name: string;
		option: IOptionSelection;
	}) => {
		setSwitchSelected({ ...serviceSwitchSelected, [name]: option });
	};

	const handleAddNewOption = ({
		name,
		newOption,
	}: {
		name: "type" | "name";
		newOption: IOptionSelection;
	}) => {
		setSwitchOptions({ ...switchOptions, [name]: newOption });
		setSwitchSelected({ ...serviceSwitchSelected, [name]: newOption });
	};

	const handleUseService = (
		serviceName: string,
		name: string,
		value: string | number,
		isUse: boolean
	) => {
		setSwitchSelected({
			...serviceSwitchSelected,
			[serviceName]: {
				value,
				name,
				isUse,
			},
		});
	};

	// Switch service handlers (for checkbox services)
	const handleSwitchServiceCheck = ({
		name,
		value,
	}: {
		name: "lube" | "clean" | "film" | "spring" | "quickClean";
		value: boolean;
	}) => {
		setSwitchSelected({
			...serviceSwitchSelected,
			[name]: {
				...serviceSwitchSelected[name],
				value,
			},
		});
	};

	// Update switch service prices
	const updateSwitchServicePrices = useCallback(
		(servicePrices: {
			lube?: {
				price: number;
				name: string;
				description: string;
				info: { grease: string };
			};
			reLube?: { price: number; name: string };
			cleanSwitch?: { price: number; name: string; description: string };
			quickCleanSwitch?: {
				price: number;
				name: string;
				description: string;
			};
			film?: {
				price: number;
				name: string;
				description: string;
				info: { brand: string; type: string; color: string };
			};
			spring?: {
				price: number;
				name: string;
				description: string;
				info: { brand: string; type: string; force: string };
			};
		}) => {
			setSwitchSelected((prev) => ({
				...prev,
				lube: {
					...prev.lube,
					price: servicePrices.lube?.price ?? prev.lube.price,
					name: servicePrices.lube?.name ?? prev.lube.name,
					description:
						servicePrices.lube?.description ??
						prev.lube.description,
					info: servicePrices.lube?.info ?? prev.lube.info,
				},
				clean: {
					...prev.clean,
					price: servicePrices.cleanSwitch?.price ?? prev.clean.price,
					name: servicePrices.cleanSwitch?.name ?? prev.clean.name,
					description:
						servicePrices.cleanSwitch?.description ??
						prev.clean.description,
				},
				film: {
					...prev.film,
					price: servicePrices.film?.price ?? prev.film.price,
					name: servicePrices.film?.name ?? prev.film.name,
					description:
						servicePrices.film?.description ??
						prev.film.description,
					info: servicePrices.film?.info ?? prev.film.info,
				},
				spring: {
					...prev.spring,
					price: servicePrices.spring?.price ?? prev.spring.price,
					name: servicePrices.spring?.name ?? prev.spring.name,
					description:
						servicePrices.spring?.description ??
						prev.spring.description,
					info: servicePrices.spring?.info ?? prev.spring.info,
				},
				quickClean: {
					...prev.quickClean,
					price:
						servicePrices.quickCleanSwitch?.price ??
						prev.quickClean.price,
					name:
						servicePrices.quickCleanSwitch?.name ??
						prev.quickClean.name,
					description:
						servicePrices.quickCleanSwitch?.description ??
						prev.quickClean.description,
				},
			}));
		},
		[]
	);

	// Keyboard form handlers
	const handleKeyboardSelect = ({
		name,
		option,
	}: {
		name: string;
		option: IOptionSelection | null;
	}) => {
		setKeyboardFormSelected({ ...keyboardFormSelected, [name]: option });
	};

	const handleKeyboardAddNew = ({
		name,
		newOption,
	}: {
		name: "keyboard" | "pcb" | "layout";
		newOption: IOptionSelection;
	}) => {
		setKeyboardOptions({
			...keyboardOptions,
			[name]: [...keyboardOptions[name], newOption],
		});
		setKeyboardFormSelected({ ...keyboardFormSelected, [name]: newOption });
	};

	const handleKeyboardServiceCheck = ({
		name,
		value,
	}: {
		name: "solder" | "desolder" | "clean";
		value: boolean;
	}) => {
		setKeyboardFormSelected({
			...keyboardFormSelected,
			[name]: {
				...keyboardFormSelected.services[name],
				value,
			},
		});
	};

	// Update keyboard options (for API data sync)
	const updateKeyboardOptions = useCallback(
		(newOptions: {
			keyboard?: IOptionSelection[];
			pcb?: IOptionSelection[];
			layout?: IOptionSelection[];
		}) => {
			setKeyboardOptions((prev) => ({
				...prev,
				...newOptions,
			}));
		},
		[]
	);

	// Update keyboard service prices
	const updateKeyboardServicePrices = useCallback(
		(servicePrices: {
			solder?: { price: number; name: string; description: string };
			desolder?: { price: number; name: string; description: string };
			clean?: { price: number; name: string; description: string };
		}) => {
			setKeyboardFormSelected((prev) => ({
				...prev,
				services: {
					...prev.services,
					solder: {
						...prev.services.solder,
						price:
							servicePrices.solder?.price ??
							prev.services.solder.price,
						name:
							servicePrices.solder?.name ??
							prev.services.solder.name,
						description:
							servicePrices.solder?.description ??
							prev.services.solder.description,
					},
					desolder: {
						...prev.services.desolder,
						price:
							servicePrices.desolder?.price ??
							prev.services.desolder.price,
						name:
							servicePrices.desolder?.name ??
							prev.services.desolder.name,
						description:
							servicePrices.desolder?.description ??
							prev.services.desolder.description,
					},
					clean: {
						...prev.services.clean,
						price:
							servicePrices.clean?.price ??
							prev.services.clean.price,
						name:
							servicePrices.clean?.name ??
							prev.services.clean.name,
						description:
							servicePrices.clean?.description ??
							prev.services.clean.description,
					},
				},
			}));
		},
		[]
	);

	const resetTaskKeyboardItem = useCallback((id: string) => {
		setKeyboardFormSelected((prev) => ({
			...prev,
			[id]: {
				...prev[id as keyof typeof prev],
				tasks: [],
			},
		}));
	}, []);

	// Stabilizer form handlers
	const handleStabilizerSelect = ({
		name,
		option,
	}: {
		name: string;
		option: IOptionSelection | null;
	}) => {
		setStabilizerFormSelected({
			...stabilizerFormSelected,
			[name]: option,
		});
	};

	const handleStabilizerAddNew = ({
		name,
		newOption,
	}: {
		name: "stabilizer";
		newOption: IOptionSelection;
	}) => {
		setStabilizerOptions({
			...stabilizerOptions,
			[name]: [...stabilizerOptions[name], newOption],
		});
		setStabilizerFormSelected({
			...stabilizerFormSelected,
			[name]: newOption,
		});
	};

	const handleStabilizerServiceCheck = ({
		name,
		value,
	}: {
		name: "handle" | "clean";
		value: boolean;
	}) => {
		setStabilizerFormSelected({
			...stabilizerFormSelected,
			[name]: {
				...stabilizerFormSelected.services[
					name as keyof typeof stabilizerFormSelected.services
				],
				value,
			},
		});
	};

	// Update stabilizer options (for API data sync)
	const updateStabilizerOptions = useCallback(
		(newOptions: { stabilizer?: IOptionSelection[] }) => {
			setStabilizerOptions((prev) => ({
				...prev,
				...newOptions,
			}));
		},
		[]
	);

	// Update stabilizer service prices
	const updateStabilizerServicePrices = useCallback(
		(servicePrices: {
			handle?: { price: number; name: string; description: string };
			clean?: { price: number; name: string; description: string };
		}) => {
			setStabilizerFormSelected((prev) => ({
				...prev,
				services: {
					...prev.services,
					handle: {
						...prev.services.handle,
						price:
							servicePrices.handle?.price ??
							prev.services.handle.price,
						name:
							servicePrices.handle?.name ??
							prev.services.handle.name,
						description:
							servicePrices.handle?.description ??
							prev.services.handle.description,
					},
					clean: {
						...prev.services.clean,
						price:
							servicePrices.clean?.price ??
							prev.services.clean.price,
						name:
							servicePrices.clean?.name ??
							prev.services.clean.name,
						description:
							servicePrices.clean?.description ??
							prev.services.clean.description,
					},
				},
			}));
		},
		[]
	);

	return {
		// Switch form exports
		serviceSwitchSelected,
		switchOptions,
		handleChangeOption,
		handleAddNewOption,
		handleUseService,
		handleSwitchServiceCheck,
		updateSwitchServicePrices,

		// Keyboard form exports
		keyboardOptions,
		keyboardFormSelected,
		handleKeyboardSelect,
		handleKeyboardAddNew,
		handleKeyboardServiceCheck,
		updateKeyboardOptions,
		updateKeyboardServicePrices,
		resetTaskKeyboardItem,

		// Stabilizer form exports
		stabilizerOptions,
		stabilizerFormSelected,
		handleStabilizerSelect,
		handleStabilizerAddNew,
		handleStabilizerServiceCheck,
		updateStabilizerOptions,
		updateStabilizerServicePrices,
	};
};

export default useSelectedOption;
