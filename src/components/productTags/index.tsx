import { ITag } from "@/interface/interface";
import { Tooltip } from "@mui/material";
import NextImage from "next/image";
import { useMemo } from "react";

interface Props {
	tags: ITag[];
}

const ProductTag = ({ tags }: Props) => {
	const isShortDisplay = useMemo(() => tags.length > 2, [tags]);
	return (
		<div className="flex flex-wrap gap-1 min-h-[26px]">
			{tags.map((tag) => (
				<Tooltip
					title={isShortDisplay ? tag.label : ""}
					key={tag.value}>
					<div
						key={tag.value}
						className="px-2 py-1.5 rounded-sm text-sm font-bold flex items-center gap-1"
						style={{
							lineHeight: 1,
							...tag.styles,
						}}>
						{tag?.icon ? (
							<span className="text-sm">{tag?.icon}</span>
						) : null}
						{tag?.iconUrl && !tag?.icon ? (
							<NextImage
								src={tag?.iconUrl}
								alt={tag?.label}
								width={16}
								height={16}
							/>
						) : null}
						{!isShortDisplay ? <>{tag.label}</> : null}
					</div>
				</Tooltip>
			))}
		</div>
	);
};

export default ProductTag;
