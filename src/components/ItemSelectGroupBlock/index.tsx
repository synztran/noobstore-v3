import { LabelItemSelectedBlock } from "@/constants";
import { NEW_MISSING_IMAGE, SOLD_OUT_ICON } from "@/constants/Images";
import {
	EnumProductType,
	IProduct,
	IProductOption,
} from "@/interface/interface";
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
	product: IProduct;
	productOptions: IProductOption[];
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
	product,
	productOptions,
	selectedOpt,
	setSelectedOpt,
	toggleResetQuantity,
	isMultipleSelection = false,
}: Props) => {
	const { productPart, productName } = product || {};
	const { updateOptSelected } = useStoreProductDetailAction();
	const itemSelected = useMemo(() => {
		return selectedOpt?.[productPart as EnumProductType]?.[0];
	}, [selectedOpt]);

	const handelSelectedItem = (
		event: React.MouseEvent<HTMLElement>,
		newValue: IProductOption
	) => {
		if (
			newValue !== null &&
			itemSelected?.productOptionId !== newValue?.productOptionId
		) {
			const selectedOpt = {
				[productPart]: [newValue],
			};
			setSelectedOpt?.((prev) => ({
				...prev,
				...selectedOpt,
			}));
			updateOptSelected(newValue);
		} else {
			setSelectedOpt?.((prev) => {
				const newSelectedOpt = { ...prev };
				delete newSelectedOpt[productPart as EnumProductType];
				return newSelectedOpt;
			});
		}
	};

	useEffect(() => {
		toggleResetQuantity && toggleResetQuantity((prev) => prev + 1);
	}, [itemSelected]);

	return (
		<div className={classNames(styles.container || "", "!mt-0")}>
			<div className={classNames("flex gap-2")}>
				<span className="text-lg uppercase font-bold text-gray-600">
					{productName}
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
				{productOptions?.map((option: IProductOption, idx: number) => (
					<div className="relative font-nunito" key={idx}>
						<ToggleButton
							style={{
								borderLeft: "1px solid rgb(113 128 150)",
							}}
							value={option}
							className={classNames(
								"relative max-w-max border border-gray-600 capitalize disabled:!border-l-gray-400",
								option.thumbnail
									? "p-2 !rounded-10 bg-white"
									: "!rounded-sm min-w-[70px] p-1",
								itemSelected?.productOptionId ===
									option.productOptionId
									? "!border-green-600"
									: "",
								option.quantity === 0
									? "!border-gray-400 !text-gray-400"
									: ""
							)}
							disabled={option.quantity === 0}>
							{option.thumbnail && option.quantity === 0 && (
								<Image
									src={SOLD_OUT_ICON}
									alt="sold out"
									width={100}
									height={100}
									className="absolute aspect-auto top-0 left-1/2 z-1 -translate-x-1/2"
								/>
							)}
							{option.thumbnail ? (
								<Image
									src={
										option.thumbnail?.path ||
										NEW_MISSING_IMAGE
									}
									width={80}
									height={80}
									alt={option.name || ""}
									style={{
										maxWidth: "100%",
										height: "auto",
										minHeight: 80,
									}}
								/>
							) : (
								<span>{option.name}</span>
							)}
						</ToggleButton>
						{itemSelected?.productOptionId ===
						option?.productOptionId ? (
							<Check
								className={classNames(
									"absolute text-green-600 w-5 h-5 border border-green-600 rounded-full bg-white p-0.5",
									option.thumbnail
										? "-top-1.5 -right-1.5"
										: "-top-2.5 -right-2.5"
								)}
							/>
						) : null}
					</div>
				))}
			</ToggleButtonGroup>
		</div>
	);
};

export default ItemSelectGroupBlock;
