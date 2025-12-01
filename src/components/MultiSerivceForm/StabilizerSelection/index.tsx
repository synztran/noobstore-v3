import SimpleTextField from "@/components/InputComponents/SimpleTextField";
import InputWrapperLegend from "@/components/InputComponents/WrapperLegend";
import {
	SERVICE_STABILIZER_2U,
	SERVICE_STABILIZER_625U,
	SERVICE_STABILIZER_7U,
	SERVICE_STABILIZER_PACK_625U,
	SERVICE_STABILIZER_PACK_7U,
} from "@/constants/Images";
import NotifyUtils from "@/utils/NotifyUtils";
import { generateRandomId } from "@/utils/StringUtils";
import useServices, { IStabilizerFormItem } from "@/zustand/useServices";
import { Button } from "@mui/material";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";

type StabilizerSize = "2U" | "6.25U" | "7U";
type PackType = "6.25U" | "7U";
enum StabilizerType {
	PACK = "pack",
	WIRE = "wire",
}

interface SelectedStabilizer {
	id: string;
	name: string;
	type: StabilizerType;
	packType: PackType;
	quantity: number;
	image: string;
	detail?: string;
	value?: string;
	wireQuantity?: number;
}

const PACK_OPTIONS: {
	id: number;
	label: string;
	type?: "pack" | "wire";
	packType?: PackType;
	image: string;
	detail?: string;
	default?: { type: StabilizerSize; quantity: number }[];
	value: string;
	wireQuantity?: number;
}[] = [
	{
		id: 0,
		label: "Pack 7U",
		type: "pack",
		image: SERVICE_STABILIZER_PACK_7U,
		detail: "4x2U + 1x7U",
		default: [
			{ type: "2U", quantity: 4 },
			{ type: "7U", quantity: 1 },
		],
		value: "PACK-7U",
		wireQuantity: 5,
		packType: "7U",
	},
	{
		id: 1,
		label: "Pack 6.25U",
		type: StabilizerType.PACK,
		image: SERVICE_STABILIZER_PACK_625U,
		detail: "4x2U + 1x6.25U",
		default: [
			{ type: "2U", quantity: 4 },
			{ type: "6.25U", quantity: 1 },
		],
		value: "PACK-6.25U",
		wireQuantity: 5,
		packType: "6.25U",
	},
	{
		id: 2,
		label: "Stablizer lẻ",
		type: "wire",
		image: "",
		detail: "",
		value: "",
	},
];

const INDIVIDUAL_OPTIONS: {
	id: number;
	label: string;
	type: StabilizerType;
	packType?: PackType;
	image: string;
	value: StabilizerSize;
}[] = [
	{
		id: 0,
		label: "Thanh Stabilizer 2U",
		type: StabilizerType.WIRE,
		image: SERVICE_STABILIZER_2U,
		value: "2U",
	},
	{
		id: 1,
		label: "Thanh Stabilizer 6.25U",
		type: StabilizerType.WIRE,
		image: SERVICE_STABILIZER_625U,
		value: "6.25U",
	},
	{
		id: 2,
		label: "Thanh Stabilizer 7U",
		type: StabilizerType.WIRE,
		image: SERVICE_STABILIZER_7U,
		value: "7U",
	},
];

const mappingStabilizerImage: Record<string, string> = {
	"2U": SERVICE_STABILIZER_2U,
	"6.25U": SERVICE_STABILIZER_625U,
	"7U": SERVICE_STABILIZER_7U,
	"PACK-7U": SERVICE_STABILIZER_PACK_7U,
	"PACK-6.25U": SERVICE_STABILIZER_PACK_625U,
};

const mappingStabilizerDetail: Record<string, string> = {
	"PACK-7U": "4x2U + 1x7U",
	"PACK-6.25U": "4x2U + 1x6.25U",
};

function getMaxLimit(selectedPlan: "SP-BASIC" | "SP-EXTREME") {
	if (selectedPlan === "SP-BASIC") {
		return { maxPack: 2, maxTotalWire: 10 };
	}
	return { maxPack: 2, maxTotalWire: 20 };
}

interface IProps {
	itemId: string;
	stabilizerSelected: IStabilizerFormItem;
	onChange: (data: IStabilizerFormItem) => void;
	className?: string;
}

const StabilizerSelection: React.FC<IProps> = ({
	itemId,
	stabilizerSelected,
	onChange,
	className,
}) => {
	// services zustand and react query
	const { selectedPlan } = useServices();

	// States
	const [selectedPack, setSelectedPack] = useState<{
		type: "pack" | "wire";
		packType: PackType;
		value: string;
		name: string;
	} | null>(null);
	const [otherSelection, setOtherSelection] = useState<{
		value: StabilizerSize | "";
		quantity: number;
	}>({ value: "", quantity: 1 });

	// memoized values
	const { maxPack, maxTotalWire } = useMemo(() => {
		if (!selectedPlan?.planId) {
			return { maxPack: 0, maxTotalWire: 0 };
		}
		return getMaxLimit(selectedPlan.planId);
	}, [selectedPlan]);

	// Add pack to list
	const handleAddPack = () => {
		if (!selectedPack) return;
		if (
			selectedPack.type === "pack" &&
			stabilizerSelected.totalPack >= maxPack
		)
			return;
		const exists = stabilizerSelected.packs.find(
			(item) => item.value === selectedPack.value
		);
		const updater = {
			id: `pack_${generateRandomId()}`,
			name: selectedPack.name,
			type: selectedPack.packType,
			value: selectedPack.value,
			quantity: exists ? exists.quantity + 1 : 1,
			wireQuantity:
				PACK_OPTIONS.find((item) => item.value === selectedPack.value)
					?.wireQuantity ?? 0,
		};
		onChange({
			...stabilizerSelected,
			packs: [...stabilizerSelected.packs, updater],
			totalPack: stabilizerSelected.totalPack + 1,
			totalWire: stabilizerSelected.totalWire + updater.wireQuantity,
		});
		setSelectedPack(null);
	};

	// Add individual stabilizer to list
	const handleAddOther = () => {
		if (!otherSelection?.value) return;
		if (
			stabilizerSelected.totalWire + otherSelection.quantity >
			maxTotalWire
		)
			return;
		const exists = stabilizerSelected.wires.find(
			(item) => item.value === otherSelection.value
		);

		const updater = exists
			? {
					...exists,
					quantity: exists.quantity + otherSelection.quantity,
				}
			: {
					id: `wire_${generateRandomId()}`,
					name:
						INDIVIDUAL_OPTIONS.find(
							(opt) => opt.value === otherSelection.value
						)?.label || otherSelection.value,
					type: otherSelection.value,
					value: otherSelection.value,
					quantity: otherSelection.quantity,
					price: 0,
				};
		onChange({
			...stabilizerSelected,
			wires: [
				...stabilizerSelected.wires.filter(
					(item) => item.value !== otherSelection.value
				),
				updater,
			],
			totalWire: stabilizerSelected.totalWire + otherSelection.quantity,
		});
		setOtherSelection({
			value: "",
			quantity: 1,
		});
	};

	// Remove from list
	const handleRemove = (id: string) => {
		const stabilizerType = id.split("_")[0];

		if (stabilizerType === "pack") {
			const removedPack = stabilizerSelected.packs.filter(
				(item) => item.id !== id
			);

			const updater = {
				...stabilizerSelected,
				packs: removedPack,
				totalPack: removedPack.length,
				totalWire:
					removedPack?.reduce(
						(acc, item) => acc + (item.wireQuantity || 0),
						0
					) ||
					0 +
						stabilizerSelected.wires?.reduce(
							(acc, item) => acc + (item.quantity || 0),
							0
						) ||
					0,
			};
			if (removedPack) {
				onChange({
					...stabilizerSelected,
					...updater,
				});
				return;
			}
		} else if (stabilizerType === "wire") {
			const removedWires = stabilizerSelected.wires.filter(
				(item) => item.id !== id
			);
			if (removedWires) {
				onChange({
					...stabilizerSelected,
					wires: removedWires,
					totalWire:
						stabilizerSelected.packs?.reduce(
							(acc, item) => acc + (item.wireQuantity || 0),
							0
						) ||
						0 +
							removedWires?.reduce(
								(acc, item) => acc + (item.quantity || 0),
								0
							) ||
						0,
				});
				return;
			}
		}
	};

	// Change quantity in list
	const handleChangeQuantity = (
		id: string,
		quantity: number,
		type: "wires" | "packs"
	) => {
		console.log("id", id, "quantity", quantity, "type", type);
		if (quantity < 1) return;
		let newList = [];
		let totalWire = 0;

		if (type === "packs") {
			newList = stabilizerSelected.packs.map((item) =>
				item.id === id ? { ...item, quantity } : item
			);
			totalWire = stabilizerSelected.packs.reduce(
				(acc, item) => acc + (item.wireQuantity || 0),
				0
			);
		} else {
			newList = stabilizerSelected.wires.map((item) =>
				item.id === id ? { ...item, quantity } : item
			);
			totalWire = stabilizerSelected.wires.reduce(
				(acc, item) => acc + (item.quantity || 0),
				0
			);
		}
		// Check total quantity limit
		const newTotalWire =
			newList.reduce((acc, item) => acc + item.quantity, 0) + totalWire;
		if (newTotalWire > maxTotalWire) {
			NotifyUtils.error(
				`Đã vượt quá giới hạn stabilizer của gói ${maxTotalWire}`
			);
			return;
		}

		console.log("newTotal", newTotalWire);

		onChange({
			...stabilizerSelected,
			[type]: newList,
			totalWire: newTotalWire,
		});
	};

	// UI
	return (
		<div className={`flex flex-col gap-4 ${className || ""}`}>
			<>
				<label className="font-semibold block">
					Lựa chọn stabilizer: <br />
					<span className="text-sm font-normal text-gray-600">
						Tối đa {maxPack} set hoặc tổng số stabilizer ≤{" "}
						{maxTotalWire}
					</span>
				</label>
				<div className="flex gap-2 items-end flex-nowrap">
					{PACK_OPTIONS.map((pack) => (
						<button
							key={pack.id}
							className={`border-2 bg-[#fbfbfb] rounded-md p-3 flex flex-col items-center gap-1 min-w-[220px]  ${
								selectedPack?.value === pack.value
									? "!border-red-600"
									: "!border-gray-600"
							}`}
							onClick={() =>
								setSelectedPack({
									type: pack.type as "pack" | "wire",
									value: pack.value,
									name: pack.label,
									packType: pack.packType as PackType,
								})
							}
							type="button">
							{pack.image ? (
								<div className="relative w-[200px] h-[220px] !border !border-gray-400 rounded-md overflow-hidden hover:scale-105 transition duration-300">
									<Image
										src={pack.image ?? ""}
										alt={pack.label}
										objectFit="contain"
										fill
										className="cursor-pointer scale-110"
									/>
								</div>
							) : null}
							<span className="text-sm font-bold">
								{pack.label} &nbsp;
								{pack.detail ? (
									<span className="text-xs text-gray-900">
										({pack.detail})
									</span>
								) : null}
							</span>
						</button>
					))}
				</div>
				{selectedPack && selectedPack.type !== "wire" ? (
					<Button
						variant="contained"
						className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
						onClick={handleAddPack}
						disabled={
							selectedPack.type === "pack" &&
							stabilizerSelected.totalPack >= maxPack
						}
						type="button">
						{selectedPack.type === "pack" &&
						stabilizerSelected.totalPack >= maxPack
							? "Đạt giới hạn của gói dịch vụ"
							: "Thêm gói này"}
					</Button>
				) : null}
			</>
			{selectedPack?.type === "wire" ? (
				<div className="flex gap-2 items-end">
					<div className="w-full">
						<label className="block text-sm">Loại stabilizer</label>
						<select
							className="border rounded px-2 py-1 w-full"
							value={otherSelection?.value}
							onChange={(e) =>
								setOtherSelection((prev) => ({
									...prev,
									value: e.target.value as StabilizerSize,
								}))
							}>
							<option value="">Chọn loại</option>
							{INDIVIDUAL_OPTIONS.map((opt) => (
								<option
									key={opt.id}
									value={opt.value}
									disabled={stabilizerSelected.wires.some(
										(item) => item.value === opt.value
									)}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
					<Button
						variant="contained"
						className={`bg-blue-600 text-white px-4 py-1 rounded h-[34px] w-full `}
						onClick={handleAddOther}
						disabled={
							!otherSelection?.value ||
							otherSelection?.quantity < 1 ||
							stabilizerSelected.totalWire +
								otherSelection?.quantity >
								maxTotalWire
						}
						type="button">
						{labelButtonAddOther({
							otherSection: otherSelection,
							maxTotalWire: maxTotalWire,
							stabilizerSelected: stabilizerSelected,
						})}
					</Button>
				</div>
      ) : null}
			<InputWrapperLegend label="Stabilizer đã chọn">
				{!stabilizerSelected.packs.length &&
				!stabilizerSelected.wires.length ? (
					<div className="text-gray-500">
						Chưa chọn stabilizer nào.
					</div>
				) : (
					<div className="flex flex-wrap gap-3">
						{stabilizerSelected?.packs.map((item) => (
							<div
								className={`relative border border-gray-400 rounded-md p-3 flex gap-2 bg-gray-50 items-start max-w-80 `}>
								<div
									className={`relative flex-shrink-0 overflow-hidden border border-gray-300 bg-white rounded-md w-40 h-56`}>
									<Image
										src={
											mappingStabilizerImage?.[
												item.value
											] || ""
										}
										alt={item.name}
										objectFit="contain"
										fill
										className={`scale-110`}
									/>
								</div>
								<div className="text-left flex flex-col gap-2">
									<div className="font-semibold text-sm">
										{item.name}
										{mappingStabilizerDetail?.[
											item.value
										] ? (
											<div className="text-xs text-gray-600">
												{
													mappingStabilizerDetail[
														item.value
													]
												}
											</div>
										) : null}
									</div>

									<div className="flex flex-col gap-4">
										<span className="text-sm">
											Tổng wire: {item.wireQuantity}
										</span>
									</div>
								</div>
								<button
									className="absolute -top-2 -right-2 text-red-500 hover:text-red-700"
									onClick={() => handleRemove(item.id)}
									type="button"
									aria-label="Xóa">
									<X className="stroke-red-400 border border-red-600 rounded-full p-1 bg-white" />
								</button>
							</div>
						))}
						{stabilizerSelected?.wires.map((item) => (
							<div
								className={`relative border border-gray-400 rounded-md p-3 flex flex-col gap-2 bg-gray-50 items-start ${item.value !== "2U" ? "w-80" : "w-52"}`}>
								<div
									className={`relative flex-shrink-0 overflow-hidden border border-gray-300 bg-white rounded-md w-full h-24`}>
									<Image
										src={
											mappingStabilizerImage?.[
												item.value
											] || ""
										}
										alt={item.name}
										objectFit={
											item.value !== "2U"
												? "contain"
												: "cover"
										}
										fill
										className={`${item.value !== "2U" ? "scale-[1.125]" : "scale-105"}`}
									/>
								</div>
								<div className="text-left flex flex-col gap-2">
									<div className="font-semibold">
										{item.name}
										{mappingStabilizerDetail?.[
											item.value
										] ? (
											<div className="text-xs text-gray-600">
												{
													mappingStabilizerDetail[
														item.value
													]
												}
											</div>
										) : null}
									</div>

									<div className="flex flex-col gap-4">
										<SimpleTextField
											type="number"
											label="Số lượng"
											name={`quantity_${item.id}`}
											min={1}
											max={maxTotalWire}
											value={item.quantity}
											onChange={(
												e: React.ChangeEvent<HTMLInputElement>
											) =>
												handleChangeQuantity(
													item.id,
													Number(e.target.value),
													"wires"
												)
											}
											currentAmount={
												stabilizerSelected.totalWire
											}
										/>
									</div>
								</div>
								<button
									className="absolute -top-2 -right-2 text-red-500 hover:text-red-700"
									onClick={() => handleRemove(item.id)}
									type="button"
									aria-label="Xóa">
									<X className="stroke-red-400 border border-red-600 rounded-full p-1 bg-white" />
								</button>
							</div>
						))}
					</div>
				)}
			</InputWrapperLegend>
		</div>
	);
};

export default StabilizerSelection;

const labelButtonAddOther = ({
	otherSection,
	maxTotalWire,
	stabilizerSelected,
}: {
	otherSection: {
		value: StabilizerSize | "";
		quantity: number;
	};
	maxTotalWire: number;
	stabilizerSelected: IStabilizerFormItem;
}) => {
	if (!otherSection?.value || otherSection?.quantity < 1) {
		return "Chọn loại stabilizer";
	}

	if (stabilizerSelected.totalWire + otherSection?.quantity > maxTotalWire) {
		return "Đạt giới hạn";
	}
	return "Thêm";
};
