import { IStepProps } from "@/interface/Raffle";
import { formatCurrency } from "@/utils/FormatNumber";
import useRaffle, { useRaffleAction } from "@/zustand/useRaffle";
import { Check } from "lucide-react";
import Image from "next/image";

const StepSelectProduct: React.FC<IStepProps> = ({ raffleData }) => {
	const { raffleSubmitForm } = useRaffle();
	const { updateRaffleSubmitForm } = useRaffleAction();

	const handleProductToggle = (productId: string) => {
		if (!updateRaffleSubmitForm || !raffleSubmitForm) return;
		const prev = raffleSubmitForm;
		const isSelecting = !prev?.productSelections?.find(
			(product) => product.productId === productId,
		)?.selected;

		let newSelections;
		if (isSelecting) {
			// Add to selected, assign next available priority (max + 1)
			const currentPriorities =
				prev?.productSelections
					?.filter((p) => p.selected && p.priority !== null)
					.map((p) => p.priority as number) || [];
			const nextPriority =
				currentPriorities?.length > 0
					? Math.max(...currentPriorities) + 1
					: 1;

			newSelections = prev?.productSelections?.map((product) =>
				product.productId === productId
					? { ...product, selected: true, priority: nextPriority }
					: product,
			);
		} else {
			// Unselect, remove priority, and reassign priorities to keep them contiguous
			newSelections = prev?.productSelections?.map((product) =>
				product.productId === productId
					? { ...product, selected: false, priority: null }
					: product,
			);

			// Reassign priorities based on selection order
			const selected = newSelections
				?.filter((p) => p.selected)
				.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
				.map((p, idx) => ({ ...p, priority: idx + 1 }));

			newSelections = newSelections?.map((product) => {
				const found = selected?.find(
					(p) => p.productId === product.productId,
				);
				return found ? found : { ...product, priority: null };
			});
		}

		updateRaffleSubmitForm({ productSelections: newSelections });
	};

	const selectedProducts =
		raffleSubmitForm?.productSelections?.filter((p) => p.selected) || [];

	return (
		<div className="space-y-4 h-full">
			<div className="text-center">
				<div className="text-xl font-bold">Lựa chọn sản phẩm</div>
				<div className="text-gray-600">
					Chọn sản phẩm và thiết lập thứ tự ưu tiên.
				</div>
			</div>

			{/* Product Selection */}
			<div className="space-y-2">
				<div className="font-semibold text-lg">Sản phẩm raffle:</div>
				<div className="grid grid-cols-2 gap-4">
					{raffleSubmitForm?.productSelections?.map((product) => (
						<div
							key={product.productId}
							className={`p-2 rounded-lg border-2 transition-all relative ${
								product.selected
									? "border-[var(--primary-color)] bg-red-50"
									: "border-gray-300 bg-gray-100"
							}`}>
							{/* Checkbox */}
							<label className="flex items-center cursor-pointer w-full">
								<div className="flex items-center gap-4">
									<div className="flex gap-2">
										<div className="relative w-32 h-28">
											<Image
												src={product.thumbnail.path}
												alt={
													product.thumbnail.alt ||
													product.name
												}
												className="rounded-lg hover:scale-105 transition-all duration-300"
												loading="lazy"
												fill
												objectFit="cover"
												draggable={false}
											/>
										</div>
										<div className="flex flex-col justify-between">
											<div className="mb-auto">
												<div className="font-bold">
													{product.name}
												</div>
												<div className="font-medium text-sm">
													{formatCurrency(
														product.price || 0,
													)}
												</div>
											</div>
											<div className="block min-h-[32px]">
												{raffleSubmitForm?.productSelections?.find(
													(p) =>
														p.productId ===
														product.productId,
												)?.selected && (
													<div className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded inline-block">
														Độ ưu tiên:{" "}
														<strong className="text-red-600 text-sm">
															{product.priority}
														</strong>
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
									className="!w-5 !h-5 text-[var(--primary-color)] border-gray-300 rounded focus:ring-[var(--primary-color)] cursor-pointer ml-auto checked:!bg-[var(--primary-color)] sr-only"
								/>
							</label>
							{product.selected ? (
								<div className="absolute w-6 h-6 -right-3 -top-3 bg-[var(--primary-color)] rounded-full p-1.5 flex items-center justify-center">
									<Check className="stroke-white stroke-[0.25rem]" />
								</div>
							) : null}
						</div>
					))}
				</div>
			</div>

			{/* Selection Summary */}
			{selectedProducts.length > 0 && (
				<div className="p-4 rounded-lg bg-gray-200 mt-auto">
					<div className="font-semibold text-lg mb-3">
						📋 Lựa chọn của bạn:
					</div>
					<div className="space-y-2">
						{selectedProducts
							.sort(
								(a, b) => (a.priority || 0) - (b.priority || 0),
							)
							.map((product) => (
								<div
									key={product.productId}
									className="flex justify-between text-sm">
									<span>
										#{product.priority} - {product.name}
									</span>
									{/* <span className="font-medium text-green-600">
										<CheckCircle className="stroke-green-600 w-6 h-6" />
									</span> */}
								</div>
							))}
					</div>
					{/* <div className="mt-3 p-2 bg-gray-400 rounded text-gray-700 font-semibold">
						💡 Giới hạn số lượng trúng là{" "}
						<span className="bg-green-600 text-white font-bold rounded-lg px-1">
							{raffleData?.maxWinPerEntries}
						</span>{" "}
						và sẽ dựa vào thứ tự ưu tiên đã chọn
					</div> */}
					<div className="mt-3 p-2 bg-gray-400 rounded text-red-500 font-semibold">
						💡 Tỉ lệ lựa chọn sẽ ưu tiên dự vào thứ tự bạn đã chọn
					</div>
				</div>
			)}
		</div>
	);
};

export default StepSelectProduct;
