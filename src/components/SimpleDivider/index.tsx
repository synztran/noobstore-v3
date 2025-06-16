import { classNames } from "@/utils/AppConfig";

type TProps = {
	textPosition?: "left" | "center" | "right";
	text?: string;
	color?: string;
};

const SimpleDivider = (props: TProps) => {
	const {
		text = "",
		textPosition = "center",
		color = "rgba(212, 212, 216, 1)",
	} = props;

	if (!text) {
		return (
			<div
				className={classNames(`border-[${color}] border-b-2 relative`)}
			/>
		);
	}

	return (
		<div className={classNames(`relative flex items-center my-2`)}>
			<span className="w-1/2 h-1 border-gray-200 border-b-2" />
			<span className="relative z-10 px-4">{text}</span>
			<span className="w-1/2 h-1 border-gray-200 border-b-2" />
		</div>
	);
};

export default SimpleDivider;
