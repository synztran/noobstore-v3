import { IOptionSelection } from "@/components/SelectComp";
import { EnumSwitchType } from "@/interface/interface";
import { useCallback, useState } from "react";

type TProps = {
	// Switch's options
	initialSwitchTypeOptions?: IOptionSelection[];
	initialSwitchStatusOptions?: IOptionSelection[];

	// Keyboard's options
	initialKeyboardOptions?: IOptionSelection[];
	initialPcbOptions?: IOptionSelection[];
	initialLayoutOptions?: IOptionSelection[];

	// Stabilizer's options
	initialStabilizerSizeOptions?: IOptionSelection[];
	initialStabilizerMountTypeOptions?: IOptionSelection[];
	initialStabilizerTypeOptions?: IOptionSelection[];
	initialStabilizerStatusOptions?: IOptionSelection[];

	// Service prices for keyboard form
	initialServicePrices?: {
		keyboard?: {
			solder: { price: number; name: string; description: string } | null;
			desolder: {
				price: number;
				name: string;
				description: string;
			} | null;
			clean: { price: number; name: string; description: string } | null;
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
			handle: { price: number; name: string; description: string } | null;
			clean: { price: number; name: string; description: string } | null;
		};
	};

	initialSwitchServicePrice?: {
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

	initialStabilizerServicePrice?: {
		handle?: { price: number; name: string; description: string };
		clean?: { price: number; name: string; description: string };
	};
};

type TService = {
	[x: string]: {
		value?: boolean;
		price?: number;
		name?: string;
		description?: string;
		info?: {
			[x: string]: string;
		};
	};
};

const useSelectedOption = (props: TProps) => {
	const { initialServicePrices } = props;
	const [serviceSwitchSelected, setSwitchSelected] = useState<{
		type: EnumSwitchType | string;
		name: string;
		quantity: number;
		services: TService; // lube | clean | film | spring | quickClean
		// lube: {
		// 	value: boolean;
		// 	price: number;
		// 	name: string;
		// 	description: string;
		// 	info: {
		// 		grease?: string;
		// 	};
		// };
		// clean: {
		// 	value: boolean;
		// 	price: number;
		// 	name: string;
		// 	description: string;
		// };
		// film: {
		// 	value: boolean;
		// 	price: number;
		// 	name: string;
		// 	info: {
		// 		brand?: string;
		// 		type?: string;
		// 		color?: string;
		// 	};
		// 	description: string;
		// };
		// spring: {
		// 	value: boolean;
		// 	price: number;
		// 	name: string;
		// 	info: {
		// 		brand?: string;
		// 		type?: string;
		// 		force?: string;
		// 	};
		// 	description: string;
		// };
		// quickClean: {
		// 	value: boolean;
		// 	price: number;
		// 	name: string;
		// 	description: string;
		// };
	}>({
		type: "",
		name: "",
		quantity: 0,
		services: {
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
					props.initialServicePrices?.switch?.clean?.description ||
					"",
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
					props.initialServicePrices?.switch?.spring?.description ||
					"",
			},
			quickClean: {
				value: false,
				price:
					props.initialServicePrices?.switch?.quickClean?.price || 0,
				name:
					props.initialServicePrices?.switch?.quickClean?.name || "",
				description:
					props.initialServicePrices?.switch?.quickClean
						?.description || "",
			},
		},
		// lube: {
		// 	value: false,
		// 	price: props.initialServicePrices?.switch?.lube?.price || 0,
		// 	name: props.initialServicePrices?.switch?.lube?.name || "",
		// 	description:
		// 		props.initialServicePrices?.switch?.lube?.description || "",
		// 	info: props.initialServicePrices?.switch?.lube?.info || {
		// 		grease: "",
		// 	},
		// },
		// clean: {
		// 	value: false,
		// 	price: props.initialServicePrices?.switch?.clean?.price || 0,
		// 	name: props.initialServicePrices?.switch?.clean?.name || "",
		// 	description:
		// 		props.initialServicePrices?.switch?.clean?.description || "",
		// },
		// film: {
		// 	value: false,
		// 	price: props.initialServicePrices?.switch?.film?.price || 0,
		// 	name: props.initialServicePrices?.switch?.film?.name || "",
		// 	info: props.initialServicePrices?.switch?.film?.info || {
		// 		brand: "",
		// 		type: "",
		// 		color: "",
		// 	},
		// 	description:
		// 		props.initialServicePrices?.switch?.film?.description || "",
		// },
		// spring: {
		// 	value: false,
		// 	price: props.initialServicePrices?.switch?.spring?.price || 0,
		// 	name: props.initialServicePrices?.switch?.spring?.name || "",
		// 	info: props.initialServicePrices?.switch?.spring?.info || {
		// 		brand: "",
		// 		type: "",
		// 		force: "",
		// 	},
		// 	description:
		// 		props.initialServicePrices?.switch?.spring?.description || "",
		// },
		// quickClean: {
		// 	value: false,
		// 	price: props.initialServicePrices?.switch?.quickClean?.price || 0,
		// 	name: props.initialServicePrices?.switch?.quickClean?.name || "",
		// 	description:
		// 		props.initialServicePrices?.switch?.quickClean?.description ||
		// 		"",
		// },
	});

	const [switchOptions, setSwitchOptions] = useState<{
		type: IOptionSelection[]; // LINEAR | TACTILE | CLICKY | OTHER
		status: IOptionSelection[]; // NEW | USED
	}>({
		type: props.initialSwitchTypeOptions || [],
		status: props.initialSwitchStatusOptions || [],
	});

	// Keyboard form state
	const [keyboardOptions, setKeyboardOptions] = useState<{
		keyboard: IOptionSelection[]; //
		pcb: IOptionSelection[]; // SOLDER | HOTSWAP
		size: IOptionSelection[]; // 60% | 65% | TKL | FULLSIZE
		services: {
			[x: string]: {
				price: number;
				name: string;
				description: string;
			} | null;
		};
	}>({
		keyboard: props.initialKeyboardOptions || [],
		pcb: props.initialPcbOptions || [],
		size: props.initialLayoutOptions || [],
		services: {},
	});

	const [keyboardFormSelected, setKeyboardFormSelected] = useState<{
		name: IOptionSelection | null;
		pcb: IOptionSelection | null;
		size: IOptionSelection | null;
		services: {
			keyboard: TService;
			switch: TService;
			stabilizer: TService;
		};
		// {
		// 	solder: {
		// 		value: boolean;
		// 		price: number;
		// 		name: string;
		// 		description: string;
		// 	};
		// 	desolder: {
		// 		value: boolean;
		// 		price: number;
		// 		name: string;
		// 		description: string;
		// 	};
		// 	clean: {
		// 		value: boolean;
		// 		price: number;
		// 		name: string;
		// 		description: string;
		// 	};
		// };
	}>({
		name: null,
		pcb: null,
		size: null,
		services: {
			keyboard: {
				solder: {
					value: false,
					price:
						props.initialServicePrices?.keyboard?.solder?.price ||
						0,
					name:
						props.initialServicePrices?.keyboard?.solder?.name ||
						"",
					description:
						props.initialServicePrices?.keyboard?.solder
							?.description || "",
				},
				desolder: {
					value: false,
					price:
						props.initialServicePrices?.keyboard?.desolder?.price ||
						0,
					name:
						props.initialServicePrices?.keyboard?.desolder?.name ||
						"",
					description:
						props.initialServicePrices?.keyboard?.desolder
							?.description || "",
				},
				clean: {
					value: false,
					price:
						props.initialServicePrices?.keyboard?.clean?.price || 0,
					name:
						props.initialServicePrices?.keyboard?.clean?.name || "",
					description:
						props.initialServicePrices?.keyboard?.clean
							?.description || "",
				},
			},
			switch: {
				lube: {
					value: false,
					price: props.initialServicePrices?.switch?.lube?.price || 0,
					name: props.initialServicePrices?.switch?.lube?.name || "",
					description:
						props.initialServicePrices?.switch?.lube?.description ||
						"",
					info: props.initialServicePrices?.switch?.lube?.info || {
						grease: "",
					},
				},
				clean: {
					value: false,
					price:
						props.initialServicePrices?.switch?.clean?.price || 0,
					name: props.initialServicePrices?.switch?.clean?.name || "",
					description:
						props.initialServicePrices?.switch?.clean
							?.description || "",
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
						props.initialServicePrices?.switch?.film?.description ||
						"",
				},
				spring: {
					value: false,
					price:
						props.initialServicePrices?.switch?.spring?.price || 0,
					name:
						props.initialServicePrices?.switch?.spring?.name || "",
					info: props.initialServicePrices?.switch?.spring?.info || {
						brand: "",
						type: "",
						force: "",
					},
					description:
						props.initialServicePrices?.switch?.spring
							?.description || "",
				},
				quickClean: {
					value: false,
					price:
						props.initialServicePrices?.switch?.quickClean?.price ||
						0,
					name:
						props.initialServicePrices?.switch?.quickClean?.name ||
						"",
					description:
						props.initialServicePrices?.switch?.quickClean
							?.description || "",
				},
			},
			stabilizer: {
				handle: {
					value: false,
					price:
						props.initialServicePrices?.stabilizer?.handle?.price ||
						0,
					name:
						props.initialServicePrices?.stabilizer?.handle?.name ||
						"",
					description:
						props.initialServicePrices?.stabilizer?.handle
							?.description || "",
				},
				clean: {
					value: false,
					price:
						props.initialServicePrices?.stabilizer?.clean?.price ||
						0,
					name:
						props.initialServicePrices?.stabilizer?.clean?.name ||
						"",
					description:
						props.initialServicePrices?.stabilizer?.clean
							?.description || "",
				},
			},
		},
	});

	// Stabilizer form state
	const [stabilizerOptions, setStabilizerOptions] = useState<{
		stabilizer: IOptionSelection[]; //
		stabilizerMountType: IOptionSelection[]; // PCB-MOUNT | PLATE-MOUNT
		stabilizerType: IOptionSelection[]; // SCREW_IN | SNAP_IN
		status: IOptionSelection[]; // NEW | USED
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
		services: TService;
		// {
		// 	handle: {
		// 		value: boolean;
		// 		price: number;
		// 		name: string;
		// 		description: string;
		// 	};
		// 	clean: {
		// 		value: boolean;
		// 		price: number;
		// 		name: string;
		// 		description: string;
		// 	};
		// };
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

	const [serviceOptions, setServiceOptions] = useState<{
		keyboard: {
			[x: string]: {
				price: number;
				name: string;
				description: string;
			} | null;
		};
		switch?: {
			[x: string]: {
				price: number;
				name: string;
				description: string;
			} | null;
		};
		stabilizer?: {
			[x: string]: {
				price: number;
				name: string;
				description: string;
			} | null;
		};
	}>({
		keyboard: {},
		switch: {},
		stabilizer: {},
	});

	const handleChangeSwitchOption = ({
		name,
		option,
	}: {
		name: string;
		option: IOptionSelection;
	}) => {
		setSwitchSelected({ ...serviceSwitchSelected, [name]: option });
	};

	const handleAddNewSwitchOption = ({
		name,
		newOption,
	}: {
		name: "type" | "name";
		newOption: IOptionSelection;
	}) => {
		setSwitchOptions({ ...switchOptions, [name]: newOption });
		setSwitchSelected({ ...serviceSwitchSelected, [name]: newOption });
	};

	// const handleCheckSwitchService = (
	// 	serviceName: string,
	// 	name: string,
	// 	value: string | number,
	// 	isUse: boolean
	// ) => {
	// 	setSwitchSelected({
	// 		...serviceSwitchSelected,
	// 		[serviceName]: {
	// 			value,
	// 			name,
	// 			isUse,
	// 		},
	// 	});
	// };

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
			services: {
				...serviceSwitchSelected.services,
				[name]: {
					...serviceSwitchSelected.services[name],
					value,
				},
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
				services: {
					lube: {
						...prev.services.lube,
						price:
							servicePrices.lube?.price ??
							prev.services.lube?.price,
						name:
							servicePrices.lube?.name ??
							prev.services.lube?.name,
						description:
							servicePrices.lube?.description ??
							prev.services.lube?.description,
						info:
							servicePrices.lube?.info ??
							prev.services.lube?.info,
					},
					clean: {
						...prev.services.clean,
						price:
							servicePrices.clean?.price ??
							prev.services.clean?.price,
						name:
							servicePrices.clean?.name ??
							prev.services.clean?.name,
						description:
							servicePrices.clean?.description ??
							prev.services.clean?.description,
					},
					film: {
						...prev.services.film,
						price:
							servicePrices.film?.price ??
							prev.services.film?.price,
						name:
							servicePrices.film?.name ??
							prev.services.film?.name,
						description:
							servicePrices.film?.description ??
							prev.services.film?.description,
						info:
							servicePrices.film?.info ??
							prev.services.film?.info,
					},
					spring: {
						...prev.services.spring,
						price:
							servicePrices.spring?.price ??
							prev.services.spring?.price,
						name:
							servicePrices.spring?.name ??
							prev.services.spring?.name,
						description:
							servicePrices.spring?.description ??
							prev.services.spring?.description,
						info:
							servicePrices.spring?.info ??
							prev.services.spring?.info,
					},
					quickClean: {
						...prev.services.quickClean,
						price:
							servicePrices.quickClean?.price ??
							prev.services.quickClean?.price,
						name:
							servicePrices.quickClean?.name ??
							prev.services.quickClean?.name,
						description:
							servicePrices.quickClean?.description ??
							prev.services.quickClean?.description,
					},
				},
			}));
		},
		[]
	);

	// handle select keyboard options
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
		name: "keyboard" | "pcb" | "size";
		newOption: IOptionSelection;
	}) => {
		setKeyboardOptions({
			...keyboardOptions,
			[name]: [...keyboardOptions[name], newOption],
		});
		setKeyboardFormSelected({ ...keyboardFormSelected, [name]: newOption });
	};

	// check/unCheck keyboard services
	const handleCheckKeyboardService = ({
		name,
		value,
	}: {
		name: {
			keyboard?: "solder" | "desolder" | "clean";
			switch?: "lube" | "clean" | "film" | "spring" | "quickClean";
			stabilizer?: "handle" | "clean";
		};
		value: boolean;
	}) => {
		console.log(name, value, "<<<<<", Object.keys(name));
		setKeyboardFormSelected((prev) => ({
			...prev,
			// [Object.keys(name) as unknown as string]: {
			//   services: {
			//     ...prev.services,
			//   }
			// }
		}));
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
					keyboard: {
						...prev.services.keyboard,
						solder: {
							...prev.services?.keyboard.solder,
							price:
								servicePrices.solder?.price ??
								prev.services.keyboard.solder?.price,
							name:
								servicePrices.solder?.name ??
								prev.services.keyboard.solder?.name,
							description:
								servicePrices.solder?.description ??
								prev.services.keyboard.solder?.description,
						},
						desolder: {
							...prev.services.keyboard.desolder,
							price:
								servicePrices.desolder?.price ??
								prev.services.keyboard.desolder?.price,
							name:
								servicePrices.desolder?.name ??
								prev.services.keyboard.desolder?.name,
							description:
								servicePrices.desolder?.description ??
								prev.services.keyboard.desolder?.description,
						},
						clean: {
							...prev.services.keyboard.clean,
							price:
								servicePrices.clean?.price ??
								prev.services.keyboard.clean?.price,
							name:
								servicePrices.clean?.name ??
								prev.services.keyboard.clean?.name,
							description:
								servicePrices.clean?.description ??
								prev.services.keyboard.clean?.description,
						},
					},
				},
			}));
		},
		[]
	);

	// TODO: ????
	const resetTaskKeyboardItem = useCallback((id: string) => {
		setKeyboardFormSelected((prev) => ({
			...prev,
			[id]: {
				...prev[id as keyof typeof prev],
				tasks: [],
			},
		}));
	}, []);

	// select stabilizer options
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

		// remove mount-type = plate when type is screw-in
		const isRemovePlateMount =
			name === "type" && option?.value === "SCREW_IN";
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

	const handleCheckStabilizerService = ({
		name,
		value,
	}: {
		name: "handle" | "clean";
		value: boolean;
	}) => {
		setStabilizerFormSelected({
			...stabilizerFormSelected,
			services: {
				...stabilizerFormSelected.services,
				[name]: {
					...stabilizerFormSelected.services[
						name as keyof typeof stabilizerFormSelected.services
					],
					value,
				},
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
							prev.services.handle?.price,
						name:
							servicePrices.handle?.name ??
							prev.services.handle?.name,
						description:
							servicePrices.handle?.description ??
							prev.services.handle?.description,
					},
					clean: {
						...prev.services.clean,
						price:
							servicePrices.clean?.price ??
							prev.services.clean?.price,
						name:
							servicePrices.clean?.name ??
							prev.services.clean?.name,
						description:
							servicePrices.clean?.description ??
							prev.services.clean?.description,
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

	const updateServiceOptions = useCallback(
		(newOptions: { keyboard: any; switch: any; stabilizer: any }) => {
			setServiceOptions((prev) => ({
				...prev,
				keyboard: newOptions.keyboard || {},
				switch: newOptions.switch || {},
				stabilizer: newOptions.stabilizer || {},
			}));
		},
		[]
	);

	return {
		// switch
		serviceSwitchSelected,
		switchOptions,
		handleChangeSwitchOption,
		handleAddNewSwitchOption,
		// handleCheckSwitchService,
		handleSwitchServiceCheck,
		updateSwitchServicePrices,

		// Keyboard form exports
		keyboardOptions,
		keyboardFormSelected,
		handleKeyboardSelect,
		handleKeyboardAddNew,
		handleCheckKeyboardService,
		updateKeyboardOptions,
		updateKeyboardServicePrices,
		resetTaskKeyboardItem,

		// Stabilizer form exports
		stabilizerOptions,
		stabilizerFormSelected,
		handleStabilizerSelect,
		handleStabilizerAddNew,
		handleCheckStabilizerService,
		updateStabilizerOptions,
		updateStabilizerServicePrices,
		resetTaskStabilizerItem,

		// common
		serviceOptions,
		updateServiceOptions,
	};
};

export default useSelectedOption;
