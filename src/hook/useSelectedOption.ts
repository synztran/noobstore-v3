import { IOptionSelection } from "@/components/SelectComp";
import { EnumSwitchType } from "@/interface/interface";
import { useState } from "react";

type TProps = {
	initialSwitchTypeOptions: IOptionSelection[];
	initialSwitchBrandOptions: IOptionSelection[];
	initialSwitchStatusOptions: IOptionSelection[];
};

const useSelectedOption = (props: TProps) => {
	const [serviceSwitchSelected, setSwitchSelected] = useState<{
		type: EnumSwitchType | string;
		brand: string;
		name: string;
		quantity: number;
		lubeService: {
			value: string | number;
			name: string;
			isUse: boolean;
		};
		switchFilmService: {
			value: string | number;
			name: string;
			isUse: boolean;
		};
		changeSpringService: {
			value: string | number;
			name: string;
			isUse: boolean;
		};
		cleanSwitchService: {
			value: string | number;
			name: string;
			isUse: boolean;
		};
	}>({
		type: "",
		brand: "",
		name: "",
		quantity: 1,
		changeSpringService: {
			value: "",
			name: "",
			isUse: false,
		},
		cleanSwitchService: {
			value: "",
			name: "",
			isUse: false,
		},
		lubeService: {
			value: "",
			name: "",
			isUse: false,
		},
		switchFilmService: {
			value: "",
			name: "",
			isUse: false,
		},
	});
	const [serviceKeyboardSelected, setKeyboardSelected] = useState<{
		type: EnumKeyboardType | string;
		brand: string;
		name: string;
		quantity: number;
	}>({
		type: "",
		brand: "",
		name: "",
		quantity: 1,
	});
	const [switchOptions, setSwitchOptions] = useState<{
		type: any[];
		brand: any[];
		status: any[];
	}>({
		type: props.initialSwitchTypeOptions,
		brand: props.initialSwitchBrandOptions,
		status: props.initialSwitchStatusOptions,
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

	return {
		serviceSwitchSelected,
		serviceKeyboardSelected,
		switchOptions,
		handleChangeOption,
		handleAddNewOption,
		handleUseService,
	};
};

export default useSelectedOption;
