import {
	SERVICE_KEYBOARD_ICON,
	SERVICE_NEW_SWITCH_ICON,
} from "@/constants/Images";
import { EnumServiceType } from "@/interface/interface";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Image from "next/image";
import { useState } from "react";
import ServiceKeyboardForm from "./keyboardForm";
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
                width={24}
                height={22}
                alt="kb icon"
                style={{
                    maxWidth: "100%",
                    height: "auto"
                }} />
		),
		id: 0,
	},
	{
		name: "Switches",
		icon: (
			<Image
                src={SERVICE_NEW_SWITCH_ICON}
                width={24}
                height={24}
                alt="switch icon"
                style={{
                    maxWidth: "100%",
                    height: "auto"
                }} />
		),
		id: 1,
	},
	{
		name: "Khác",
		icon: "",
		id: 2,
	},
];

const MultiServiceForm: React.FC = () => {
	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
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
			<CustomTabPanel value={value} index={0}>
				<ServiceKeyboardForm serviceType={EnumServiceType.KEYBOARD} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<ServicesSwitchesForm serviceType={EnumServiceType.SWITCHES} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				{/* <ServiceForm serviceType={EnumServiceType.OTHER} /> */}
				Item Three
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
