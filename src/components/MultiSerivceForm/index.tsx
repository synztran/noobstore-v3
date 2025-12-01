import {
	SERVICE_KEYBOARD_ICON,
	SERVICE_NEW_SWITCH_ICON,
	SERVICE_STABILIZER_ICON,
} from "@/constants/Images";
import { EnumServiceType } from "@/interface/interface";
import useServices, { useServiceAction } from "@/zustand/useServices";
import { Button as MUIButton } from "@material-ui/core";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import InputWrapperLegend from "../InputComponents/WrapperLegend";
import ServiceKeyboardForm from "./keyboardForm";
import ServiceStabilizerForm from "./stabilizerForm";
import ServicesSwitchesForm from "./switchesForm";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabInfo = [
	{
		name: "Bàn phím",
		icon: (
			<Image
				src={SERVICE_KEYBOARD_ICON}
				width={32}
				height={26}
				alt="kb icon"
				style={{ maxWidth: "100%", height: "auto" }}
			/>
		),
		id: "keyboard",
	},
	{
		name: "Switches",
		icon: (
			<Image
				src={SERVICE_NEW_SWITCH_ICON}
				width={32}
				height={32}
				alt="switch icon"
				style={{ maxWidth: "100%", height: "auto" }}
			/>
		),
		id: "switches",
	},
	{
		name: "Stabilizer",
		icon: (
			<Image
				src={SERVICE_STABILIZER_ICON}
				width={32}
				height={26}
				alt="stabilizer icon"
				style={{ maxWidth: "100%", height: "auto" }}
			/>
		),
		id: "stabilizer",
	},
];

const MultiServiceForm: React.FC = () => {
	const {
		activeTabIndex,
		keyboardItems,
		switchItems,
		stabilizerItems,
		selectedPlan,
	} = useServices();
	const {
		setActiveTabIndex,
		addKeyboardItem,
		removeKeyboardItem,
		addSwitchItem,
		removeSwitchItem,
		addStabilizerItem,
		removeStabilizerItem,
	} = useServiceAction();

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setActiveTabIndex(newValue);
	};

	const isSwitchLimit = useMemo(() => {
		if (selectedPlan?.price && selectedPlan?.price > 0) {
			return switchItems.length === 5;
		}
		return switchItems.length === 3;
	}, [selectedPlan, switchItems]);

	const isStabilizerLimit = useMemo(() => {
		if (selectedPlan?.price && selectedPlan?.price > 0) {
			return stabilizerItems.length === 5;
		}
		return stabilizerItems.length === 3;
	}, [selectedPlan, stabilizerItems]);

	const isKeyboardLimit = useMemo(() => {
		if (selectedPlan?.price && selectedPlan?.price > 0) {
			return keyboardItems.length === 5;
		}
		return keyboardItems.length === 3;
	}, [selectedPlan, keyboardItems]);

	const mapTabLabel: Record<(typeof TabInfo)[number]["id"], number> = {
		keyboard: keyboardItems.length,
		switches: switchItems.length,
		stabilizer: stabilizerItems.length,
	};

	return (
		<div className="w-full min-h-[300px]" id="multi-service-form-step">
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={activeTabIndex}
					onChange={handleChange}
					aria-label="basic tabs example">
					{TabInfo.map((tab, index) => (
						<Tab
							key={index}
							label={
								<div
									className="flex items-center gap-2"
									id={tab.id}>
									{tab.icon} {tab.name}(
									{mapTabLabel?.[tab.id] || 0})
								</div>
							}
							className="!normal-case"
						/>
					))}
				</Tabs>
			</Box>
			<CustomTabPanel value={activeTabIndex} index={0}>
				<div className="flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<strong className="text-xl">
							Danh sách dịch vụ bàn phím
						</strong>
						<MUIButton
							id="guide-add-new-task-keyboard"
							className="!normal-case !px-3 !py-1 bg-blue-600"
							variant="contained"
							color="default"
							disabled={isKeyboardLimit}
							onClick={() => addKeyboardItem()}>
							<span className="text-white flex items-center gap-2">
								{isKeyboardLimit ? (
									<span className="text-gray-500">
										Đã đạt giới hạn
									</span>
								) : (
									<>
										<Plus className="stroke-white" /> Thêm
										mới
									</>
								)}
							</span>
						</MUIButton>
					</div>
					<Divider />

					{keyboardItems.length === 0 ? (
						<div className="text-base text-gray-800">
							Chưa có mục nào. Nhấn "Thêm mới" để bắt đầu.
						</div>
					) : null}
					{keyboardItems.map((item) => (
						<InputWrapperLegend
							key={item.id}
							className="mt-4 bg-white">
							<button
								className="absolute -right-3 -top-4 bg-white text-gray-500 hover:text-red-600 border-2 border-red-400 rounded-full p-1"
								onClick={() => removeKeyboardItem(item.id)}
								aria-label="Remove">
								<X className="hover:scale-110 transition-all duration-300 w-4 h-4 stroke-red-500" />
							</button>
							<ServiceKeyboardForm
								itemId={item.id}
								serviceType={EnumServiceType.KEYBOARD}
								value={item}
							/>
						</InputWrapperLegend>
					))}
				</div>
			</CustomTabPanel>
			<CustomTabPanel value={activeTabIndex} index={1}>
				<div className="flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<strong className="text-xl">
							Danh sách dịch vụ switch
						</strong>
						<MUIButton
							className="!normal-case !px-3 !py-1 bg-blue-600"
							variant="contained"
							color="default"
							disabled={isSwitchLimit}
							onClick={() => addSwitchItem()}>
							<span className="text-white flex items-center gap-2">
								{isSwitchLimit ? (
									<span className="text-gray-500">
										Đã đạt giới hạn
									</span>
								) : (
									<>
										<Plus className="stroke-white" /> Thêm
										mới
									</>
								)}
							</span>
						</MUIButton>
					</div>
					<Divider />
					{switchItems.length === 0 ? (
						<div className="text-base text-gray-800">
							Chưa có mục nào. Nhấn "Thêm mới" để bắt đầu.
						</div>
					) : null}
					{switchItems.map((item) => (
						<div
							key={item.id}
							className="border border-gray-600 rounded-md p-3 relative mt-2 bg-white">
							<button
								className="absolute -right-2 -top-2 bg-white text-gray-500 hover:text-red-600 border-2 border-red-400 rounded-full p-1"
								onClick={() => removeSwitchItem(item.id)}
								aria-label="Remove">
								<X className="hover:scale-110 transition-all duration-300 w-4 h-4 stroke-red-500" />
							</button>
							<ServicesSwitchesForm
								itemId={item.id}
								serviceType={EnumServiceType.SWITCHES}
								value={item}
							/>
						</div>
					))}
				</div>
			</CustomTabPanel>
			<CustomTabPanel value={activeTabIndex} index={2}>
				<div className="flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<strong className="text-xl">
							Danh sách dịch vụ stabilizer
						</strong>
						<MUIButton
							className="!normal-case !px-3 !py-1 bg-blue-600"
							variant="contained"
							color="default"
							disabled={isStabilizerLimit}
							onClick={() => addStabilizerItem()}>
							<span className="text-white flex items-center gap-2">
								{isStabilizerLimit ? (
									<span className="text-gray-500">
										Đã đạt giới hạn
									</span>
								) : (
									<>
										<Plus className="stroke-white" /> Thêm
										mới
									</>
								)}
							</span>
						</MUIButton>
					</div>
					<Divider />
					{stabilizerItems.length === 0 ? (
						<div className="text-base text-gray-800">
							Chưa có mục nào. Nhấn "Thêm mới" để bắt đầu.
						</div>
					) : null}
					{stabilizerItems.map((item) => (
						<div
							key={item.id}
							className="border border-gray-600 rounded-md p-3 relative mt-2">
							<button
								className="absolute -right-2 -top-2 bg-white text-gray-500 hover:text-red-600 border-2 border-red-400 rounded-full p-1"
								onClick={() => removeStabilizerItem(item.id)}
								aria-label="Remove">
								<X className="hover:scale-110 transition-all duration-300 w-4 h-4 stroke-red-500" />
							</button>
							<ServiceStabilizerForm
								itemId={item.id}
								serviceType={EnumServiceType.STABILIZER}
								value={item}
							/>
						</div>
					))}
				</div>
			</CustomTabPanel>
		</div>
	);
};

export default MultiServiceForm;

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <div className="mt-4">{children}</div>}
		</div>
	);
}
