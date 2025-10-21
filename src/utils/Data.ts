import { IOptionSelection } from "@/components/SelectComp";
import { EnumSwitchType } from "@/interface/interface";
import {
	IKeyboardFormItem,
	IStabilizerFormItem,
	ISwitchFormItem,
} from "@/zustand/useServices";

const mapServiceTasksToOptions = ({
	serviceTasks = [],
	keyboardItem,
	switchItem,
	stabilizerItem,
}: {
	serviceTasks: any[];
	keyboardItem?: IKeyboardFormItem;
	switchItem?: ISwitchFormItem;
	stabilizerItem?: IStabilizerFormItem;
}) => {
	console.log("items", keyboardItem, switchItem, stabilizerItem);
	const defaultOptions = {
		keyboard: [] as IOptionSelection[],
		pcb: [
			{ id: 0, value: "HOTSWAP", label: "Mạch hotswap" },
			{ id: 1, value: "SOLDER", label: "Mạch hàn" },
		] as IOptionSelection[],
		layout: [
			{
				id: 0,
				value: "60",
				label: "60%",
				price: 0,
			},
			{
				id: 1,
				value: "65",
				label: "65%",
				price: 30000,
			},
			{
				id: 2,
				value: "75",
				label: "75%",
				price: 50000,
			},
			{
				id: 3,
				value: "80%",
				label: "Tenkeyless (TKL)",
				price: 70000,
			},
			{
				id: 4,
				value: "100%",
				label: "Fullsize (108)",
				price: 130000,
			},
			{
				id: 5,
				value: "1800",
				label: "Compact 1800",
				price: 180000,
			},
		] as unknown as IOptionSelection[],
		servicePrices: {
			keyboard: {
				solder: { price: 0, name: "", description: "" },
				desolder: { price: 0, name: "", description: "" },
				clean: { price: 0, name: "", description: "" },
			} as {
				[key: string]: {
					price: number;
					name: string;
					description: string;
				};
			},
			switch: {
				lube: {
					price: 0,
					name: "",
					description: "",
					info: { grease: "" },
				},
				clean: { price: 0, name: "", description: "" },
				film: {
					price: 0,
					name: "",
					info: {
						brand: "",
						type: "",
						color: "",
					},
					description: "",
				},
				spring: {
					price: 0,
					name: "",
					info: {
						brand: "",
						type: "",
						force: "",
					},
					description: "",
				},
				quickClean: { price: 0, name: "", description: "" },
			},
			stabilizer: {
				handle: { price: 0, name: "", description: "" },
				clean: { price: 0, name: "", description: "" },
			} as {
				[key: string]: {
					price: number;
					name: string;
					description: string;
				};
			},
		},
	};

	serviceTasks.forEach((service) => {
		if (
			service.serviceCategory === "KEYBOARD" &&
			service.tasks &&
			Array.isArray(service.tasks)
		) {
			const tasks = service.tasks || [];
			const foundLayout = defaultOptions.layout.find(
				(opt) => opt.value === keyboardItem?.keyboardInfo?.size
			);
			tasks.forEach((task: any) => {
				switch (task.serviceTaskId) {
					case "KB-T-01":
						const newSolderPrice =
							task?.salePrice ||
							task.price + (foundLayout?.price || 0);

						defaultOptions.servicePrices["keyboard"]["solder"] = {
							price: newSolderPrice,
							name: task.name || "",
							description: task.description || "",
						};
						break;
					case "KB-T-02":
						const newDesolderPrice =
							task?.salePrice ||
							task.price + (foundLayout?.price || 0);

						defaultOptions.servicePrices["keyboard"]["desolder"] = {
							price: newDesolderPrice,
							name: task.name || "",
							description: task.description || "",
						};
						break;
					case "KB-T-03":
						defaultOptions.servicePrices["keyboard"]["clean"] = {
							price: task.salePrice || task.price || 80000,
							name: task.name || "",
							description: task.description || "",
						};
						break;
					default:
						break;
				}

				// Extract keyboard types from attributes if available
				if (task.attributes?.keyboardType) {
					const existingKeyboard = defaultOptions.keyboard.find(
						(opt) => opt.value === task.attributes?.keyboardType
					);
					if (!existingKeyboard) {
						defaultOptions.keyboard.push({
							id: defaultOptions.keyboard.length,
							value: task.attributes.keyboardType,
							label: task.attributes.keyboardType,
						});
					}
				}
			});
		}

		if (
			service.serviceCategory === "SWITCH" &&
			service.tasks &&
			Array.isArray(service.tasks)
		) {
			const tasks = service.tasks || [];
			const isExtraPrice = switchItem?.type === EnumSwitchType.TACTILE;
			tasks.forEach((task: any) => {
				switch (task.serviceTaskId) {
					case "SW-T-01":
						const newLubePrice =
							task.salePrice ||
							task.price ||
							0 + (isExtraPrice ? 1000 : 0);
						defaultOptions.servicePrices["switch"]["lube"] = {
							price: newLubePrice,
							name: task.name || "",
							description: task.description || "",
							info: task.attributes || {},
						};
						break;
					case "SW-T-02":
						defaultOptions.servicePrices["switch"]["clean"] = {
							price: task.salePrice || task.price || 0,
							name: task.name || "",
							description: task.description || "",
						};
						break;
					case "SW-T-04":
						defaultOptions.servicePrices["switch"]["film"] = {
							price: task.salePrice || task.price || 0,
							name: task.name || "",
							info: task.attributes || {},
							description: task.description || "",
						};
						break;
					case "SW-T-03":
						defaultOptions.servicePrices["switch"]["spring"] = {
							price: task.salePrice || task.price || 0,
							name: task.name || "",
							info: task.attributes || {},
							description: task.description || "",
						};
						break;
					case "SW-T-05":
						defaultOptions.servicePrices["switch"]["quickClean"] = {
							price: task.salePrice || task.price || 0,
							name: task.name || "",
							description: task.description || "",
						};
						break;
					default:
						break;
				}
			});
		}

		if (
			service.serviceCategory === "STABILIZER" &&
			service.tasks &&
			Array.isArray(service.tasks)
		) {
			const tasks = service.tasks || [];
			tasks.forEach((task: any) => {
				switch (task.serviceTaskId) {
					case "ST-T-01":
						defaultOptions.servicePrices["stabilizer"]["handle"] = {
							price: task.salePrice || task.price || -1,
							name: task.name || "",
							description: task.description || "Na",
						};
						break;
					case "ST-T-02":
						defaultOptions.servicePrices["stabilizer"]["clean"] = {
							price: task.salePrice || task.price || -1,
							name: task.name || "Na",
							description: task.description || "Na",
						};
						break;
					default:
						break;
				}
			});
		}
	});

	return defaultOptions;
};

export { mapServiceTasksToOptions };
