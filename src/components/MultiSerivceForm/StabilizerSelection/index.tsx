import React, { useState, useMemo } from "react";
import { tempStabilizerOptions } from "@/constants";
import Image from "next/image";
import {
	SERVICE_STABILIZER_2U,
	SERVICE_STABILIZER_625U,
	SERVICE_STABILIZER_7U,
	SERVICE_STABILIZER_STANDARD_PACK,
} from "@/constants/Images";
import { Button } from "@mui/material";

// Option images (replace with your actual images)
const STABILIZER_IMAGES: Record<string, string> = {
	"2U": "/images/stabilizer-2u.png",
	"6.25U": "/images/stabilizer-625u.png",
	"7U": "/images/stabilizer-7u.png",
	"pack-7u": "/images/stabilizer-pack-7u.png",
	"pack-625": "/images/stabilizer-pack-625.png",
};

type StabilizerType = "2U" | "6.25U" | "7U";
type PackType = "pack-7u" | "pack-625" | "other";

interface SelectedStabilizer {
	id: string;
	name: string;
	type: PackType | StabilizerType;
	quantity: number;
	image: string;
	detail?: string;
}

interface IProps {
	selectedPlan: string;
	onChange?: (selected: SelectedStabilizer[]) => void;
}

const PACK_OPTIONS = [
	{
		id: "pack-7u",
		label: "Pack 7U",
		type: "pack-7u" as PackType,
		image: SERVICE_STABILIZER_STANDARD_PACK,
		detail: "4x2U + 1x7U",
		default: [
			{ type: "2U", quantity: 4 },
			{ type: "7U", quantity: 1 },
		],
	},
	{
		id: "pack-625",
		label: "Pack 6.25U",
		type: "pack-625" as PackType,
		image: SERVICE_STABILIZER_STANDARD_PACK,
		detail: "4x2U + 1x6.25U",
		default: [
			{ type: "2U", quantity: 4 },
			{ type: "6.25U", quantity: 1 },
		],
	},
	{
		id: "other",
		label: "Tùy chọn khác",
		type: "other" as PackType,
		image: "",
		detail: "",
	},
];

const INDIVIDUAL_OPTIONS = [
	{
		id: "2U",
		label: "2U Stabilizer",
		type: "2U" as StabilizerType,
		image: SERVICE_STABILIZER_2U,
	},
	{
		id: "6.25U",
		label: "6.25U Stabilizer",
		type: "6.25U" as StabilizerType,
		image: SERVICE_STABILIZER_625U,
	},
	{
		id: "7U",
		label: "7U Stabilizer",
		type: "7U" as StabilizerType,
		image: SERVICE_STABILIZER_7U,
	},
];

function getMaxLimit(selectedPlan: string) {
	if (selectedPlan === "basic") {
		return { maxPack: 2, maxTotal: 10 };
	}
	return { maxPack: 4, maxTotal: 20 };
}

const StabilizerSelection: React.FC<IProps> = ({ selectedPlan, onChange }) => {
	const [selectedPack, setSelectedPack] = useState<PackType | "">("");
	const [otherSelection, setOtherSelection] = useState<{
		type: StabilizerType | "";
		quantity: number;
	}>({ type: "", quantity: 1 });
	const [selectedList, setSelectedList] = useState<SelectedStabilizer[]>([]);

	const { maxPack, maxTotal } = getMaxLimit(selectedPlan);

	// Calculate total packs and total quantity
	const totalPackCount = selectedList.filter(
		(item) => item.type === "pack-7u" || item.type === "pack-625"
	).length;
	const totalQuantity = selectedList.reduce(
		(acc, item) => acc + item.quantity,
		0
	);

	// Add pack to list
	const handleAddPack = () => {
		if (!selectedPack) return;
		if (
			(selectedPack === "pack-7u" || selectedPack === "pack-625") &&
			totalPackCount >= maxPack
		)
			return;
		if (selectedPack === "pack-7u") {
			const exists = selectedList.find((item) => item.type === "pack-7u");
			if (exists) return;
			setSelectedList((prev) => [
				...prev,
				{
					id: "pack-7u",
					name: "Pack 7U",
					type: "pack-7u",
					quantity: 5, // 4x2U + 1x7U
					image: SERVICE_STABILIZER_STANDARD_PACK,
					detail: "4x2U + 1x7U",
				} as SelectedStabilizer,
			]);
		} else if (selectedPack === "pack-625") {
			const exists = selectedList.find(
				(item) => item.type === "pack-625"
			);
			if (exists) return;
			setSelectedList((prev) => [
				...prev,
				{
					id: "pack-625",
					name: "Pack 6.25U",
					type: "pack-625",
					quantity: 5, // 4x2U + 1x6.25U
					image: SERVICE_STABILIZER_STANDARD_PACK,
					detail: "4x2U + 1x6.25U",
				},
			]);
		}
		setSelectedPack("");
		if (onChange) {
			setTimeout(() => onChange([...selectedList]), 0);
		}
	};

	// Add individual stabilizer to list
	const handleAddOther = () => {
		if (!otherSelection.type) return;
		if (totalQuantity + otherSelection.quantity > maxTotal) return;
		const exists = selectedList.find(
			(item) => item.type === otherSelection.type
		);
		if (exists) {
			setSelectedList((prev) =>
				prev.map((item) =>
					item.type === otherSelection.type
						? {
								...item,
								quantity:
									item.quantity + otherSelection.quantity,
						  }
						: item
				)
			);
		} else {
			const found = INDIVIDUAL_OPTIONS.find(
				(opt) => opt.type === otherSelection.type
			);
			if (!found) return;
			setSelectedList((prev) => [
				...prev,
				{
					id: found.id,
					name: found.label,
					type: found.type,
					quantity: otherSelection.quantity,
					image: found.image ?? "",
				} as SelectedStabilizer,
			]);
		}
		setOtherSelection({ type: "", quantity: 1 });
		if (onChange) {
			setTimeout(() => onChange([...selectedList]), 0);
		}
	};

	// Remove from list
	const handleRemove = (id: string) => {
		setSelectedList((prev) => prev.filter((item) => item.id !== id));
		if (onChange) {
			setTimeout(
				() => onChange(selectedList.filter((item) => item.id !== id)),
				0
			);
		}
	};

	// Change quantity in list
	const handleChangeQuantity = (id: string, quantity: number) => {
		if (quantity < 1) return;
		const newList = selectedList.map((item) =>
			item.id === id ? { ...item, quantity } : item
		);
		// Check total quantity limit
		const newTotal = newList.reduce((acc, item) => acc + item.quantity, 0);
		if (newTotal > maxTotal) return;
		setSelectedList(newList);
		if (onChange) {
			setTimeout(() => onChange(newList), 0);
		}
	};

	// UI
	return (
		<div className="flex flex-col gap-4">
			<div>
				<label className="font-semibold mb-2 block">
					Chọn gói stabilizer:
				</label>
				<div className="flex gap-3">
					{PACK_OPTIONS.map((pack) => (
						<button
							key={pack.id}
							className={`border rounded-md p-4 flex flex-col items-center gap-1 min-w-[260px] ${
								selectedPack === pack.type
									? "!border-red-600"
									: "!border-gray-600"
							}`}
							disabled={
								(pack.type === "pack-7u" ||
									pack.type === "pack-625") &&
								selectedList.some(
									(item) => item.type === pack.type
								)
							}
							onClick={() => setSelectedPack(pack.type)}
							type="button">
							{pack.image ? (
								<div className="relative w-[200px] h-[240px] !border !border-red-400 rounded-md hover:scale-105 transition duration-300">
									<Image
										src={pack.image ?? ""}
										alt={pack.label}
										objectFit="contain"
										fill
										className="cursor-pointer scale-125"
									/>
								</div>
							) : null}
							<span className="text-base font-bold">
								{pack.label}
							</span>
							{pack.detail && (
								<span className="text-sm text-gray-900">
									{pack.detail}
								</span>
							)}
						</button>
					))}
				</div>
				{selectedPack && selectedPack !== "other" && (
					<button
						className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
						onClick={handleAddPack}
						disabled={
							(selectedPack === "pack-7u" &&
								(totalPackCount >= maxPack ||
									selectedList.some(
										(item) => item.type === "pack-7u"
									))) ||
							(selectedPack === "pack-625" &&
								(totalPackCount >= maxPack ||
									selectedList.some(
										(item) => item.type === "pack-625"
									)))
						}
						type="button">
						Thêm gói này
					</button>
				)}
			</div>
			{selectedPack === "other" && (
				<div className="flex flex-col gap-2">
					<div className="flex gap-2 items-end">
						<div>
							<label className="block text-sm">
								Loại stabilizer
							</label>
							<select
								className="border rounded px-2 py-1"
								value={otherSelection.type}
								onChange={(e) =>
									setOtherSelection((prev) => ({
										...prev,
										type: e.target.value as StabilizerType,
									}))
								}>
								<option value="">Chọn loại</option>
								{INDIVIDUAL_OPTIONS.map((opt) => (
									<option key={opt.id} value={opt.type}>
										{opt.label}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm">Số lượng</label>
							<input
								type="number"
								min={1}
								max={maxTotal - totalQuantity}
								className="border rounded px-2 py-1 w-20"
								value={otherSelection.quantity}
								onChange={(e) =>
									setOtherSelection((prev) => ({
										...prev,
										quantity: Math.max(
											1,
											Number(e.target.value)
										),
									}))
								}
							/>
						</div>
						<button
							className="bg-blue-600 text-white px-4 py-1 rounded"
							onClick={handleAddOther}
							disabled={
								!otherSelection.type ||
								otherSelection.quantity < 1 ||
								totalQuantity + otherSelection.quantity >
									maxTotal
							}
							type="button">
							Thêm
						</button>
					</div>
				</div>
			)}
			<div>
				<label className="font-semibold mb-2 block">Đã chọn:</label>
				{selectedList.length === 0 ? (
					<div className="text-gray-500">
						Chưa chọn stabilizer nào.
					</div>
				) : (
					<div className="flex flex-wrap gap-3">
						{selectedList.map((item) => (
							<div
								key={item.id}
								className="border rounded-md p-3 flex items-center gap-3 relative min-w-[220px] bg-gray-50">
								{item.image && (
									<Image
										src={item.image}
										alt={item.name}
										width={48}
										height={32}
										style={{ objectFit: "contain" }}
									/>
								)}
								<div className="flex-1">
									<div className="font-semibold">
										{item.name}
									</div>
									{item.detail && (
										<div className="text-xs text-gray-500">
											{item.detail}
										</div>
									)}
									<div className="flex items-center gap-2 mt-1">
										<span>Số lượng:</span>
										<input
											type="number"
											min={1}
											max={maxTotal}
											className="border rounded px-2 py-1 w-16"
											value={item.quantity}
											onChange={(e) =>
												handleChangeQuantity(
													item.id,
													Math.max(
														1,
														Number(e.target.value)
													)
												)
											}
										/>
									</div>
								</div>
								<button
									className="absolute top-1 right-1 text-red-500 hover:text-red-700"
									onClick={() => handleRemove(item.id)}
									type="button"
									aria-label="Xóa">
									&times;
								</button>
							</div>
						))}
					</div>
				)}
				<div className="mt-2 text-sm text-gray-600">
					Giới hạn: Tối đa {maxPack} gói hoặc tổng số stabilizer ≤{" "}
					{maxTotal}
				</div>
			</div>
		</div>
	);
};

export default StabilizerSelection;
