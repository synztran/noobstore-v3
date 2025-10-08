import { Box, Typography } from "@mui/material";

interface IProps {
	label?: string;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	errorMessage?: string;
}

const InputWrapperLegend = ({
	children,
	label,
	className,
	style,
	errorMessage,
}: IProps) => {
	return (
		<Box
			component="fieldset"
			className={`border p-4 pt-2 pb-4 rounded-lg w-full relative ${className} ${errorMessage ? "!border-red-600" : ""}`}
			style={style}>
			<Typography component="legend" className="font-bold min-w-max">
				{label}
				{errorMessage ? (
					<small className="text-red-500"> - {errorMessage}</small>
				) : null}
			</Typography>
			{children}
		</Box>
	);
};

export default InputWrapperLegend;
