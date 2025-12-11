import { TResponseRaffleEntry } from "@/interface/Context/auth";
import useUserRaffleEntryQueries from "@/react-query/user/api/useUserRaffleEntryQueries";
import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";
import React, { useState } from "react";

const RaffleHistory: React.FC = () => {
	const { data: raffleHistory, isPending: isLoading } =
		useUserRaffleEntryQueries();
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<TResponseRaffleEntry | null>(null);

	const handleOpen = (entry: TResponseRaffleEntry) => {
		setSelected(entry);
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		setSelected(null);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (raffleHistory && raffleHistory?.length === 0) {
		return <div className="p-4">Bạn chưa tham gia raffle nào.</div>;
	}

	return (
		<div className="p-4">
			<h2 className="font-bold text-xl mb-2">Lịch sử tham gia raffle</h2>
			<div className="grid grid-cols-2 gap-2">
				{raffleHistory?.map((entry) => (
					<div
						key={entry.raffleId}
						className="border rounded-lg p-2 bg-white shadow flex gap-2 hover:shadow-lg transition-all duration-200 cursor-pointer"
						onClick={() => handleOpen(entry)}>
						<div className="min-w-32 h-32 relative">
							<Image
								src={entry.raffleInfo.thumbnail.url}
								alt={entry.raffleInfo.thumbnail.alt}
								fill
								objectFit="cover"
								className="rounded-md"
							/>
						</div>
						<div className="flex flex-col justify-between">
							<div className="space-y-2">
								<div className="flex justify-between items-start gap-2">
									<span className="font-bold line-clamp-2">
										{entry.raffleInfo.title ||
											"Raffle không xác định"}
									</span>
									<span className="bg-gray-200 rounded-md px-4 py-1 text-xs">
										{entry.raffleInfo.status}
									</span>
								</div>
								<span className="text-xs text-gray-600 font-semibold">
									{entry.raffleInfo.productOptions
										.map((option) => option.label)
										.join(" | ")}
								</span>
							</div>
							<span className="text-sm text-gray-800">
								Ngày tham gia:{" "}
								{new Date(entry.joinedAt).toLocaleDateString()}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Modal Dialog */}
			{open && selected && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)] backdrop-blur-sm">
					<div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-4 relative animate-fade-in">
						<button
							className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
							onClick={handleClose}
							aria-label="Đóng">
							×
						</button>
						<div className="flex gap-4 mb-4">
							<div className="w-32 h-32 relative flex-shrink-0">
								<Image
									src={selected?.raffleInfo.thumbnail.url}
									alt={selected?.raffleInfo.thumbnail.alt}
									fill
									objectFit="cover"
									className="rounded-md"
								/>
							</div>
							<div className="flex flex-col justify-between flex-1">
								<div>
									<div className="font-bold text-lg mb-1">
										{selected.raffleInfo.title}
									</div>
									<div className="text-xs text-gray-600 mb-2">
										{selected.raffleInfo.productOptions
											.map((option) => option.label)
											.join(" | ")}
									</div>
								</div>
								<div className="text-sm text-gray-800">
									Ngày tham gia:{" "}
									{new Date(
										selected.joinedAt
									).toLocaleString()}
								</div>
							</div>
						</div>
						<div className="border-t pt-4 mt-2">
							<div className="mb-2">
								<span className="font-semibold">
									Sản phẩm đã chọn:
								</span>
							</div>
							<div className="grid grid-cols-2 gap-3">
								{selected.productSelections.map((option) => (
									<div
										key={option?.productId ?? option.name}
										className="flex items-start gap-3 border rounded-md p-2 bg-gray-50 w-full">
										<div className="min-w-20 h-20 relative">
											<Image
												src={
													option.thumbnail?.path ?? ""
												}
												alt={
													option.thumbnail?.alt ??
													option.name ??
													"Hình ảnh tùy chọn"
												}
												fill
												className="rounded object-cover"
											/>
										</div>
										<div className="flex flex-col w-full">
											<div className="flex justify-between items-center gap-2">
												<div className="text-sm font-medium">
													{option.name}
												</div>
												{/* <span className="px-1 text-sm py-0.5 rounded-md bg-red-400 text-white">
													{option.priority}
												</span> */}
											</div>
											<div className="text-xs text-gray-600">
												{formatCurrency(option.price)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default RaffleHistory;
