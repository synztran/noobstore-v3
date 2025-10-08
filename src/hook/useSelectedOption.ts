import { IOptionSelection } from "@/components/SelectComp";
import { EnumSwitchType } from "@/interface/interface";
import { useCallback, useState } from "react";

type TProps = {
	// Switch form options
	initialSwitchTypeOptions?: IOptionSelection[];
	initialSwitchStatusOptions?: IOptionSelection[];

	// Keyboard form options
	initialKeyboardOptions?: IOptionSelection[];
	initialPcbOptions?: IOptionSelection[];
	initialLayoutOptions?: IOptionSelection[];

	// Stabilizer form options
	initialStabilizerSizeOptions?: IOptionSelection[];
	initialStabilizerMountTypeOptions?: IOptionSelection[];
	initialStabilizerTypeOptions?: IOptionSelection[];
	initialStabilizerStatusOptions?: IOptionSelection[];

	// Service prices for keyboard form
	initialServicePrices?: {
		keyboard?: {
			solder?: { price: number; name: string; description: string };
			desolder?: { price: number; name: string; description: string };
			clean?: {
				price: number;
				name: string;
				description: string;
			};
		};
		switch?: {
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
			clean?: { price: number; name: string; description: string };
			quickClean?: {
				price: number;
				name: string;
				description: string;
			};
		};
		stabilizer?: {
			handle?: { price: number; name: string; description: string };
			clean?: { price: number; name: string; description: string };
		};
	};
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
			price: props.initialServicePrices?.switch?.lube?.price || 0,
			name: props.initialServicePrices?.switch?.lube?.name || "",
			description:
				props.initialServicePrices?.switch?.lube?.description || "",
			info: props.initialServicePrices?.switch?.lube?.info || {
				grease: "",
			},
		},
		clean: {
			value: false,
			price: props.initialServicePrices?.switch?.clean?.price || 0,
			name: props.initialServicePrices?.switch?.clean?.name || "",
			description:
				props.initialServicePrices?.switch?.clean?.description || "",
		},
		film: {
			value: false,
			price: props.initialServicePrices?.switch?.film?.price || 0,
			name: props.initialServicePrices?.switch?.film?.name || "",
			info: props.initialServicePrices?.switch?.film?.info || {
				brand: "",
				type: "",
				color: "",
			},
			description:
				props.initialServicePrices?.switch?.film?.description || "",
		},
		spring: {
			value: false,
			price: props.initialServicePrices?.switch?.spring?.price || 0,
			name: props.initialServicePrices?.switch?.spring?.name || "",
			info: props.initialServicePrices?.switch?.spring?.info || {
				brand: "",
				type: "",
				force: "",
			},
			description:
				props.initialServicePrices?.switch?.spring?.description || "",
		},
		quickClean: {
			value: false,
			price: props.initialServicePrices?.switch?.quickClean?.price || 0,
			name: props.initialServicePrices?.switch?.quickClean?.name || "",
			description:
				props.initialServicePrices?.switch?.quickClean?.description ||
				"",
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
				price: props.initialServicePrices?.keyboard?.solder?.price || 0,
				name: props.initialServicePrices?.keyboard?.solder?.name || "",
				description:
					props.initialServicePrices?.keyboard?.solder?.description ||
					"",
			},
			desolder: {
				value: false,
				price:
					props.initialServicePrices?.keyboard?.desolder?.price || 0,
				name:
					props.initialServicePrices?.keyboard?.desolder?.name || "",
				description:
					props.initialServicePrices?.keyboard?.desolder
						?.description || "",
			},
			clean: {
				value: false,
				price: props.initialServicePrices?.keyboard?.clean?.price || 0,
				name: props.initialServicePrices?.keyboard?.clean?.name || "",
				description:
					props.initialServicePrices?.keyboard?.clean?.description ||
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
		stabilizer: props.initialStabilizerSizeOptions || [],
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
				price:
					props.initialServicePrices?.stabilizer?.handle?.price || 0,
				name:
					props.initialServicePrices?.stabilizer?.handle?.name || "",
				description:
					props.initialServicePrices?.stabilizer?.handle
						?.description || "",
			},
			clean: {
				value: false,
				price:
					props.initialServicePrices?.stabilizer?.clean?.price || 0,
				name: props.initialServicePrices?.stabilizer?.clean?.name || "",
				description:
					props.initialServicePrices?.stabilizer?.clean
						?.description || "",
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
			clean?: { price: number; name: string; description: string };
			quickClean?: {
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
					price: servicePrices.clean?.price ?? prev.clean.price,
					name: servicePrices.clean?.name ?? prev.clean.name,
					description:
						servicePrices.clean?.description ??
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
						servicePrices.quickClean?.price ??
						prev.quickClean.price,
					name:
						servicePrices.quickClean?.name ?? prev.quickClean.name,
					description:
						servicePrices.quickClean?.description ??
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
		console.log("name, option", name, option);
		setStabilizerFormSelected({
			...stabilizerFormSelected,
			[name]: option,
		});

		// remove mount-type = plate when type is screw-in
		const isRemovePlateMount =
			name === "type" && option?.value === "SCREW_IN";
		console.log("isRemovePlateMount", isRemovePlateMount);
		setStabilizerOptions((prev) => ({
			...prev,
			stabilizerMountType: isRemovePlateMount
				? (props.initialStabilizerMountTypeOptions || []).filter(
						(item) => item.value !== "PLATE_MOUNTED"
					)
				: props.initialStabilizerMountTypeOptions || [],
		}));
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

	const resetTaskStabilizerItem = useCallback((id: string) => {
		setStabilizerFormSelected((prev) => ({
			...prev,
			[id]: {
				...prev[id as keyof typeof prev],
				tasks: [],
			},
		}));
	}, []);

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
		resetTaskStabilizerItem,
	};
};

export default useSelectedOption;
