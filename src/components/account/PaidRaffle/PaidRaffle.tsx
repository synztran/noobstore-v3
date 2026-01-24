import { Button } from "@/components/ReUIComponent";
import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { EnumRafflePaymentStatus } from "@/interface/interface";
import useRaffle, { useRaffleAction } from "@/zustand/useRaffle";
import { Modal } from "@mui/material";
import React, { Activity, useEffect, useMemo } from "react";
import OrderDetailsCard from "../OrderDetailsCard";
import OrderDetailsList from "../OrderDetailsList";
import RafflePaymentBlock from "../Raffle/PaymentBlock";
import RafflePaymentStatusChecking from "../Raffle/PaymentStatusChecking";
import ShopSummaryCard from "../ShopSummaryCard";
import RafflePaidMaker from "./RaffleMaker";

interface PaidRaffleModalProps {
	open: boolean;
	onClose: () => void;
	selected: TResponseRaffleEntry | null;
	mapRaffleProductWin: Record<string, IBEResponseRaffleProductSelection>;
}

const PaidRaffleModal: React.FC<PaidRaffleModalProps> = ({
	open,
	onClose,
	selected,
	mapRaffleProductWin,
}) => {
	const { updateRafflePriceForm, initRafflePaymentForm } = useRaffleAction();
	const { raffleDonationForm, rafflePaymentForm } = useRaffle();
	const winProducts: IBEResponseRaffleProductSelection[] = useMemo(() => {
		if (!selected || !selected.isWinner) return [];
		return (
			selected?.raffleWinInfo
				?.map(({ productId }) => mapRaffleProductWin[productId])
				.filter((p): p is IBEResponseRaffleProductSelection =>
					Boolean(p),
				) || []
		);
	}, [selected, mapRaffleProductWin]);

	useEffect(() => {
		if (!winProducts || winProducts.length === 0) return;
		let total = 0;
		const subTotal = winProducts.reduce(
			(acc, product) => acc + product.price,
			0,
		);
		total = subTotal + (selected?.shipping?.shippingMethod?.price || 0); // Adjust this if you have shipping, tax, etc.
		if (
			raffleDonationForm &&
			raffleDonationForm.amount &&
			parseInt(raffleDonationForm.amount, 10) > 0
		) {
			total += parseInt(raffleDonationForm.amount, 10);
		}
		const tax = (subTotal * (selected?.raffleInfo?.taxPercent || 0)) / 100;
		updateRafflePriceForm(subTotal, total, tax);
	}, [winProducts, raffleDonationForm]);

	useEffect(() => {
		initRafflePaymentForm({
			paymentMethod: null,
			shippingFee: 0,
			subPrice: 0,
			totalPrice: 0,
			tax: 0,
		});
	}, []);

	if (!selected) return null;
	return (
		<Modal open={open} onClose={onClose}>
			<div
				className="bg-white rounded-lg shadow-lg w-full p-4 animate-fade-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[80vh] overflow-hidden flex flex-col"
				onMouseDown={(e) => e.stopPropagation()}
				style={{ maxWidth: "min(1224px, 90vw)" }}>
				<div className="flex justify-between items-center mb-4 shrink-0">
					<h2 className="font-bold text-2xl">Đơn hàng</h2>
				</div>

				<div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
					<div className="col-span-3 space-y-4 overflow-y-auto">
						<OrderDetailsCard
							raffle={selected}
							winningProducts={winProducts}
						/>
						<RafflePaidMaker maker={selected?.makerInfo} />
					</div>
					<div className="col-span-6 flex flex-col flex-1 min-h-0 overflow-hidden">
						<Activity
							mode={
								[
									EnumRafflePaymentStatus.UNPAID,
									EnumRafflePaymentStatus.PENDING,
								].includes(selected?.paymentStatus)
									? "visible"
									: "hidden"
							}>
							<RafflePaymentBlock
								raffle={selected}
								winningProducts={winProducts}
							/>
						</Activity>
						<Activity
							mode={
								[
									EnumRafflePaymentStatus.CHECKING,
									EnumRafflePaymentStatus.PAID,
								].includes(selected?.paymentStatus)
									? "visible"
									: "hidden"
							}>
							<RafflePaymentStatusChecking raffle={selected} />
						</Activity>
					</div>
					<div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">
						<div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
							<OrderDetailsList winProduct={winProducts} />
						</div>
						<div className="flex gap-4 flex-2 min-h-0 overflow-hidden max-h-max">
							<ShopSummaryCard selected={selected} />
						</div>
						{/* <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
							<div className="w-3/5">
								{selected?.paymentStatus ===
								EnumRafflePaymentStatus.PAID ? (
									<RafflePaymentStatusBlock
										raffle={selected}
										winningProducts={winProducts}
									/>
								) : (
									<PaidRafflePayment
										raffle={selected}
										winningProducts={winProducts}
									/>
								)}
							</div>
							<div className="w-2/5"></div>
						</div> */}
					</div>
				</div>
				<div className="flex justify-end mt-4 shrink-0">
					<Button
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 max-w-max"
						onClick={onClose}>
						Đóng
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default PaidRaffleModal;
