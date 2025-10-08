import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { IStepProps } from "@/interface/Raffle";
import { formatCurrency } from "@/utils/FormatNumber";

const StepSelectProduct: React.FC<IStepProps> = ({ formData, setFormData }) => {
	const handleProductToggle = (productId: string) => {
		if (!setFormData) return;

		setFormData((prev) => {
			const isSelecting = !prev.productSelections.find(
				(product) => product.productId === productId
			)?.selected;

			let newSelections;
			if (isSelecting) {
				// Add to selected, assign next available priority (max + 1)
				const currentPriorities = prev.productSelections
					.filter((p) => p.selected && p.priority !== null)
					.map((p) => p.priority as number);
				const nextPriority =
					currentPriorities.length > 0
						? Math.max(...currentPriorities) + 1
						: 1;

				newSelections = prev.productSelections.map((product) =>
					product.productId === productId
						? { ...product, selected: true, priority: nextPriority }
						: product
				);
			} else {
				// Unselect, remove priority, and reassign priorities to keep them contiguous
				newSelections = prev.productSelections.map((product) =>
					product.productId === productId
						? { ...product, selected: false, priority: null }
						: product
				);

				// Reassign priorities based on selection order
				const selected = newSelections
					.filter((p) => p.selected)
					.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
					.map((p, idx) => ({ ...p, priority: idx + 1 }));

				newSelections = newSelections.map((product) => {
					const found = selected.find(
						(p) => p.productId === product.productId
					);
					return found ? found : { ...product, priority: null };
				});
			}

			return { ...prev, productSelections: newSelections };
		});
	};

	const selectedProducts = formData.productSelections.filter(
		(p) => p.selected
	);

	return (
		<div className="space-y-6">
			<div className="text-center mb-6">
				<div className="text-2xl font-bold">Lựa chọn sản phẩm</div>
				<div className="text-gray-500">
					Chọn sản phẩm và thiết lập thứ tự ưu tiên.
				</div>
			</div>

			{/* Product Selection */}
			<div className="space-y-4">
				<div className="font-semibold text-base mb-3">
					Chọn sản phẩm và thiết lập thứ tự ưu tiên:
				</div>

				{formData.productSelections.map((product, index) => (
					<div
						key={product.productId}
						className={`p-4 rounded-lg border-2 transition-all ${
							product.selected
								? "border-[var(--primary-color)] bg-red-50"
								: "border-gray-300 bg-gray-100"
						}`}>
						<div className="flex items-center gap-4">
							{/* Checkbox */}
							<label className="flex items-center cursor-pointer w-full">
								<div className="flex items-center gap-4">
									<div className="flex gap-4">
										<div className="relative w-28 h-28">
											<Image
												src={product.thumbnail}
												alt={product.name}
												className="w-28 h-28 object-cover rounded-lg"
												loading="lazy"
												fill
												objectFit="cover"
											/>
										</div>
										<div className="flex flex-col justify-between">
											<div className="mb-auto">
												<div className="font-bold text-base">
													{product.name}
												</div>
												<div className="font-medium text-sm">
													{formatCurrency(
														product.price || 0
													)}
												</div>
											</div>
											<div className="block min-h-[32px]">
												{formData.productSelections.find(
													(p) =>
														p.productId ===
														product.productId
												)?.selected && (
													<div className="text-base text-red-600 bg-red-100 px-2 py-1 rounded inline-block">
														Độ ưu tiên:{" "}
														{product.priority}
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
								<input
									type="checkbox"
									checked={product.selected}
									onChange={() =>
										handleProductToggle(product.productId)
									}
									className="!w-5 !h-5 text-[var(--primary-color)] border-gray-300 rounded focus:ring-[var(--primary-color)] cursor-pointer ml-auto checked:!bg-[var(--primary-color)]"
								/>
							</label>

							{/* Priority Selector */}
							{/* {product.selected && (
								<div className="ml-auto flex items-center gap-2">
									<select
										value={product.priority || 1}
										onChange={(e) =>
											handlePriorityChange(
												product.productId,
												parseInt(e.target.value)
											)
										}
										className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
										{Array.from(
											{
												length: formData
													.productSelections.length,
											},
											(_, i) => (
												<option
													key={i + 1}
													value={i + 1}>
													{i + 1}
												</option>
											)
										)}
									</select>
								</div>
							)} */}
						</div>
					</div>
				))}
			</div>

			{/* Selection Summary */}
			{selectedProducts.length > 0 && (
				<div className="p-4 rounded-lg bg-gray-200">
					<div className="font-semibold text-base mb-3">
						📋 Lựa chọn của bạn:
					</div>
					<div className="space-y-2">
						{selectedProducts
							.sort(
								(a, b) => (a.priority || 0) - (b.priority || 0)
							)
							.map((product) => (
								<div
									key={product.productId}
									className="flex justify-between text-sm">
									<span>
										#{product.priority} - {product.name}
									</span>
									<span className="font-medium text-green-600">
										<CheckCircle className="stroke-green-600 w-6 h-6" />
									</span>
								</div>
							))}
					</div>
					<div className="mt-3 p-2 bg-green-200 rounded text-base text-green-800">
						💡 Giới hạn số lượng trúng là x và sẽ dựa vào thứ tự ưu
						tiên đã chọn
					</div>
				</div>
			)}
		</div>
	);
};

export default StepSelectProduct;
