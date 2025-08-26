import {
	SERVICE_KEYBOARD_ICON,
	SERVICE_NEW_SWITCH_ICON,
	SERVICE_STABILIZER_ICON,
} from "@/constants/Images";
import { EnumServiceType } from "@/interface/interface";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Image from "next/image";
import useServices, { useServiceAction } from "@/zustand/useServices";
import { Button as MUIButton } from "@material-ui/core";
import ServiceKeyboardForm from "./keyboardForm";
import ServicesSwitchesForm from "./switchesForm";
import { Plus, X } from "lucide-react";

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
				style={{
					maxWidth: "100%",
					height: "auto",
				}}
			/>
		),
		id: 0,
	},
	{
		name: "Switches",
		icon: (
			<Image
				src={SERVICE_NEW_SWITCH_ICON}
				width={32}
				height={32}
				alt="switch icon"
				style={{
					maxWidth: "100%",
					height: "auto",
				}}
			/>
		),
		id: 1,
	},
	{
		name: "Stabilizer",
		icon: (
			<Image
				src={SERVICE_STABILIZER_ICON}
				width={32}
				height={26}
				alt="stabilizer icon"
				style={{
					maxWidth: "100%",
					height: "auto",
				}}
			/>
		),
		id: 3,
	},
	{
		name: "Khác",
		icon: "",
		id: 4,
	},
];

const MultiServiceForm: React.FC = () => {
	const { activeTabIndex, keyboardItems, switchItems } = useServices();
	const {
		setActiveTabIndex,
		addKeyboardItem,
		removeKeyboardItem,
		addSwitchItem,
		removeSwitchItem,
	} = useServiceAction();

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setActiveTabIndex(newValue);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={activeTabIndex}
					onChange={handleChange}
					aria-label="basic tabs example">
					{TabInfo.map((tab, index) => (
						<Tab
							key={index}
							label={
								<div className="flex items-center gap-2">
									{tab.icon} {tab.name}
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
							className="!normal-case !px-3 !py-1 bg-blue-600"
							variant="contained"
							color="default"
							onClick={() => addKeyboardItem()}>
							<span className="text-white flex items-center gap-2">
								<Plus className="stroke-white" /> Thêm mới
							</span>
						</MUIButton>
					</div>
					{keyboardItems.length === 0 ? (
						<div className="text-sm text-gray-500">
							Chưa có mục nào. Nhấn "Thêm mới" để bắt đầu.
						</div>
					) : null}
					{keyboardItems.map((item) => (
						<div
							key={item.id}
							className="border rounded-md p-3 relative border-gray-600">
							<button
								className="absolute -right-2 -top-2 bg-white text-gray-500 hover:text-red-600 border-2 border-red-400 rounded-full p-1"
								onClick={() => removeKeyboardItem(item.id)}
								aria-label="Remove">
								<X className="hover:scale-110 transition-all duration-300 w-4 h-4 stroke-red-500" />
							</button>
							<ServiceKeyboardForm
								itemId={item.id}
								serviceType={EnumServiceType.KEYBOARD}
								value={item}
							/>
						</div>
					))}
				</div>
			</CustomTabPanel>
			<CustomTabPanel value={activeTabIndex} index={1}>
				<div className="flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<strong className="text-base">Danh sách switch</strong>
						<MUIButton
							className="!normal-case !px-3 !py-1 bg-blue-600"
							variant="contained"
							color="default"
							onClick={() => addSwitchItem()}>
							<span className="text-white flex items-center gap-2">
								<Plus className="stroke-white" /> Thêm mới
							</span>
						</MUIButton>
					</div>
					{switchItems.length === 0 ? (
						<div className="text-sm text-gray-500">
							Chưa có mục nào. Nhấn "Thêm switch" để bắt đầu.
						</div>
					) : null}
					{switchItems.map((item) => (
						<div
							key={item.id}
							className="border border-gray-600  rounded-md p-3 relative">
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
				Item Three
			</CustomTabPanel>
			<CustomTabPanel value={activeTabIndex} index={3}>
				Item Four
			</CustomTabPanel>
		</Box>
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
			{value === index && (
				<div className="border-gray-300 border-2 mt-4 rounded-xl p-4">
					{children}
				</div>
			)}
		</div>
	);
}
