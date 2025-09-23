import { Box, Typography } from "@mui/material";

interface IProps {
	label?: string;
	children?: React.ReactNode;
	className?: string;
}

const InputWrapperLegend = ({ children, label, className }: IProps) => {
	return (
		<Box
			component="fieldset"
			className={`border biborder px-4 pt-2 pb-4 rounded-lg w-full relative ${className}`}>
			<Typography component="legend" className="font-bold min-w-max">
				{label}
			</Typography>
			{children}
		</Box>
	);
};

export default InputWrapperLegend;
