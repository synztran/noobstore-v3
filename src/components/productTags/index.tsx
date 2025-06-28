import { EnumSaleStatus, EnumUsedProductStatus } from "@/interface/interface";
import { useEffect, useState } from "react";

interface Props {
	color?: string;
	text: string;
	bgc?: string;
	status?: EnumSaleStatus | EnumUsedProductStatus;
}

const ColorBoard: Record<
	EnumSaleStatus | EnumUsedProductStatus,
	{ color: string; bgc: string }
> = {
	[EnumSaleStatus.TBD]: {
		color: "#000",
		bgc: "#c4c4c4",
	},
	[EnumSaleStatus.GB]: {
		color: "#fff",
		bgc: "#418fde",
	},
	[EnumSaleStatus.INSTOCK]: {
		color: "#fff",
		bgc: "#3c9342",
	},
	[EnumSaleStatus.OUTSTOCK]: {
		color: "#fff",
		bgc: "#bf262f",
	},
	[EnumSaleStatus.ALL]: {
		color: "",
		bgc: "",
	},
	[EnumUsedProductStatus.AVAILABLE]: {
		color: "#fff",
		bgc: "#3c9342",
	},
	[EnumUsedProductStatus.SOLD]: {
		color: "#fff",
		bgc: "#bf262f",
	},
};

const ProductTag = ({
	color,
	text,
	bgc,
	status = EnumSaleStatus.TBD,
}: Props) => {
	const [tagTextColor, setTagTextColor] = useState("");
	const [tagBackgroundColor, setTagBackgroundColor] = useState("");

	useEffect(() => {
		if (color) {
			if (color.indexOf("#")) {
				setTagTextColor(color);
			} else {
				setTagTextColor("#000");
			}
		} else {
			setTagTextColor(ColorBoard[status]?.color);
		}

		if (bgc) {
			if (bgc.indexOf("#")) {
				setTagBackgroundColor(bgc);
			} else {
				setTagBackgroundColor("#c4c4c4");
			}
		} else {
			setTagBackgroundColor(ColorBoard[status]?.bgc);
		}
	}, [color, bgc, status]);

	return (
		<div
			className="min-w-fit py-1 px-2 font-medium"
			style={{ backgroundColor: tagBackgroundColor }}>
			<div className="text-sm font-bold" style={{ color: tagTextColor }}>
				{text}
			</div>
		</div>
	);
};

export default ProductTag;
