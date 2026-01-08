import { TResponseRaffleEntry } from "@/interface/Context/auth";
import {
	EnumPaymentForm,
	EnumPaymentMethod,
	EnumRafflePaymentStatus,
} from "@/interface/interface";
import { Divider, Modal } from "@mui/material";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState, useMemo, useEffect } from "react";
import PaymentStatusChecking from "@/components/ServiceComponent/PaymentStatusChecking";
import RafflePaymentBlock from "./Raffle/PaymentBlock";
import RafflePaymentStatusBlock from "./Raffle/PaymentStatusBlock";
import RaffleSubmittedForm from "./Raffle/SubmittedForm";
import RaffleProductWin from "./Raffle/ProductWin";

interface RafflePaymentModalProps {
	open: boolean;
	onClose: () => void;
	selected: TResponseRaffleEntry | null;
}

const RafflePaymentModal: React.FC<RafflePaymentModalProps> = ({
	open,
	onClose,
	selected,
}) => {
	// Get winning product info
	const winningProduct = useMemo(() => {
		if (!selected || !selected.raffleWinInfo) return null;
		const product = selected.productSelections.find(
			(p) => p.productId === selected.raffleWinInfo?.productId
		);
		return product;
	}, [selected]);

	// Transform raffle entry to service booking format for PaymentBlock/PaymentStatusChecking
	const transformedService = useMemo(() => {
		if (!selected) return null;

		return {
			serviceBookingId: selected.raffleId,
			totalPrice: winningProduct?.price || 0,
			paymentStatus: selected.paymentStatus,
			payment: {
				transitionId: `RAFFLE-${selected.raffleId}`,
				submittedAt: new Date().toISOString(),
				paymentMethod: EnumPaymentMethod.BANK_TRANSFER,
				paymentForm: EnumPaymentForm.FULL,
				paidAmount: winningProduct?.price || 0,
				remainingAmount: 0,
			},
		};
	}, [selected, winningProduct]);

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [open]);

	if (!open || !selected) return null;

	if (!open || !selected) return null;

	return (
		<Modal open={open} onClose={onClose}>
			<div
				className="bg-white rounded-lg shadow-lg w-full p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[95vh] flex flex-col"
				style={{ maxWidth: "min(65rem, 80vw)" }}>
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute -top-3 -right-2 bg-gray-400 rounded-full p-1 hover:scale-110 transition-all duration-300 hover:shadow-md z-10"
					aria-label="Đóng">
					<X size={18} />
				</button>

				{/* Header */}
				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-7 flex gap-2">
						<div className="w-36 h-36 relative flex-shrink-0">
							<Image
								src={selected?.raffleInfo.thumbnail.path}
								alt={selected?.raffleInfo.thumbnail.alt}
								fill
								objectFit="cover"
								className="rounded-md"
							/>
						</div>
						<div className="flex flex-col justify-between flex-1">
							<div className="">
								<div className="font-bold text-lg">
									{selected.raffleInfo.title}
								</div>
								<div className="text-gray-600 text-sm">
									{selected.raffleInfo.productOptions
										.map((option) => option.label)
										.join(" | ")}
								</div>
							</div>
							<div className="flex flex-col">
								<span className="text-gray-600 font-semibold">
									Maker: {selected?.makerInfo?.brandName}
								</span>
								<span className="text-gray-600 font-semibold">
									Ngày:{" "}
									{new Date(
										selected.joinedAt
									).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
					{winningProduct &&
					selected?.paymentStatus !== EnumRafflePaymentStatus.PAID ? (
						<div className="col-span-5">
							<RaffleProductWin winningProduct={winningProduct} />
						</div>
					) : null}
				</div>

				<Divider className="!mt-2 !mb-4" />
				<div
					id="main-container"
					className="grid grid-cols-12 gap-4 overflow-hidden flex-1 min-h-0">
					{/* <div className="col-span-2 space-y-4">
						<div className="max-h-max bg-yellow-50 to-white border-2 border-yellow-400 rounded-xl p-2 space-y-4 sticky top-0">
							<div className="text-center space-y-2">
								<div className="font-bold space-x-1">
									<Image
										src={I3D_WINNER_RANK}
										alt="Raffle Wheel"
										width={24}
										height={24}
										className="inline-block scale-125"
									/>
									<span>Trúng thưởng</span>
								</div>
								{winningProduct && (
									<div className="space-y-2">
										<div className="relative w-full h-40">
											<Image
												src={
													winningProduct.thumbnail
														?.path || ""
												}
												alt={
													winningProduct.thumbnail
														?.alt ||
													winningProduct.name
												}
												fill
												className="rounded-lg object-cover hover:scale-105 transition-all duration-300"
											/>
										</div>
										<div>
											<p className="font-bold text-gray-800 text-sm">
												{winningProduct.name}
											</p>
											<div className="bg-yellow-400 text-gray-700 font-bold py-2 px-3 rounded-lg text-sm">
												{formatCurrency(
													winningProduct.price
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div> */}

					{/* Payment Block & Status */}
					<div className="col-span-7 relative flex-1 min-h-0 flex flex-col gap-4">
						{selected?.paymentStatus ===
						EnumRafflePaymentStatus.PAID ? (
							<RafflePaymentStatusBlock
								raffle={selected}
								winningProduct={winningProduct}
							/>
						) : (
							<RafflePaymentBlock
								raffle={selected}
								winningProduct={winningProduct}
							/>
						)}
					</div>
					{/* submitted form */}
					<div className="col-span-5 relative flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto">
						<RaffleSubmittedForm
							raffle={selected}
							winningProduct={winningProduct}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default RafflePaymentModal;
