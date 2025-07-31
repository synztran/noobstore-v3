import { LabelItemSelectedBlock } from "@/constants";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { EnumProductType, IProductOption } from "@/interface/interface";
import { classNames } from "@/utils/AppConfig";
import { formatCurrency } from "@/utils/FormatNumber";
import { useStoreProductDetailAction } from "@/zustand/useProductDetail";
import { Tooltip } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/styles";
import { Check, Info } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import styles from "./styles.module.css";

interface Props {
	options: [string, IProductOption[]];
	selectedOpt?: Record<EnumProductType, IProductOption[]>;
	setSelectedOpt?: Dispatch<
		SetStateAction<Record<EnumProductType, IProductOption[]>>
	>;
	toggleResetQuantity?: Dispatch<SetStateAction<number>>;
	isMultipleSelection?: boolean;
}

const CustomToggleButton = styled(ToggleButton)({
	"&.Mui-disabled": {
		borderLeft: "none", // Remove the border-left for disabled buttons
	},
});

const ItemSelectGroupBlock = ({
	options,
	selectedOpt,
	setSelectedOpt,
	toggleResetQuantity,
	isMultipleSelection = false,
}: Props) => {
	const productOptionName = options?.[0] || "";
	const productOptionValues = options?.[1] || [];
	const { updateOptSelected } = useStoreProductDetailAction();
	const itemSelected = useMemo(() => {
		return selectedOpt?.[productOptionName as EnumProductType]?.[0];
	}, [selectedOpt]);

	const productType =
		options?.map((option: any) => option.productType)?.[0] || "";

	const handelSelectedItem = (
		event: React.MouseEvent<HTMLElement>,
		newValue: IProductOption
	) => {
		if (newValue !== null && itemSelected?.id !== newValue?.id) {
			const selectedOpt = {
				[productOptionName]: [newValue],
			};
			setSelectedOpt?.((prev) => ({
				...prev,
				...selectedOpt,
			}));
			updateOptSelected(newValue);
		} else {
			setSelectedOpt?.((prev) => {
				const newSelectedOpt = { ...prev };
				delete newSelectedOpt[productOptionName as EnumProductType];
				return newSelectedOpt;
			});
		}
	};

	useEffect(() => {
		toggleResetQuantity && toggleResetQuantity((prev) => prev + 1);
	}, [itemSelected]);

	return (
		<div className={styles.container}>
			<div className={classNames("flex gap-2")}>
				<span className="text-lg uppercase font-bold text-gray-600">
					{
						LabelItemSelectedBlock[
							productOptionName as EnumProductType
						]
					}
				</span>
				{itemSelected ? (
					<>
						|
						<div className="flex gap-1 items-center">
							{itemSelected?.name}
							&nbsp; (+
							{formatCurrency(
								itemSelected?.salePrice ||
									itemSelected?.price ||
									0
							)}
							)
							<Tooltip
								title={
									<div
										dangerouslySetInnerHTML={{
											__html:
												itemSelected?.description || "",
										}}
									/>
								}
								placement="top">
								<Info className="w-4 h-4" />
							</Tooltip>
						</div>
					</>
				) : null}
			</div>
			<ToggleButtonGroup
				value={itemSelected}
				exclusive
				onChange={handelSelectedItem}
				className={classNames("flex items-center gap-2")}>
				{productOptionValues?.map(
					(option: IProductOption, idx: number) => (
						<div className="relative font-nunito" key={idx}>
							<ToggleButton
								style={{
									borderLeft: "1px solid rgb(113 128 150)",
								}}
								value={option}
								className={classNames(
									"relative max-w-max border border-gray-600 overflow-hidden capitalize disabled:!border-l-gray-400",
									option.thumbnail
										? "p-0 !rounded-full disabled:before:content-[''] disabled:before:bg-black disabled:before:rotate-45 disabled:before:w-12 disabled:before:h-[3px] disabled:before:absolute disabled:before:top-1/2 disabled:before:left-0 disabled:opacity-80 bg-white"
										: "!rounded-sm min-w-[70px] p-1",
									itemSelected?.id === option.id
										? "!border-green-600"
										: ""
								)}
								disabled={option.quantity === 0}>
								{option.thumbnail ? (
									<Image
										src={
											option.thumbnail ||
											NEW_MISSING_IMAGE
										}
										width={40}
										height={40}
										alt={option.name || ""}
										style={{
											maxWidth: "100%",
											height: "auto",
										}}
									/>
								) : (
									<span>{option.name}</span>
								)}
							</ToggleButton>
							{itemSelected?.id === option?.id ? (
								<Check
									className={classNames(
										"absolute text-green-600 w-4 h-4 border border-green-600 rounded-full bg-white p-0.5",
										option.thumbnail
											? "-top-1 -right-1"
											: "-top-2 -right-2"
									)}
								/>
							) : null}
						</div>
					)
				)}
			</ToggleButtonGroup>
		</div>
	);
};

export default ItemSelectGroupBlock;
