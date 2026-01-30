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
import RafflePaidPointReward from "./PointReward";

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
			paymentMethod: selected?.payment?.paymentMethod || null,
			shippingFee: selected?.shipping?.shippingMethod?.price || 0,
			subPrice: selected?.payment?.subPrice || 0,
			totalPrice: selected?.payment?.totalPrice || 0,
			tax: selected?.payment?.tax || 0,
		});
	}, [selected]);

	if (!selected) return null;
	return (
		<Modal open={open} onClose={onClose}>
			<div
				className="bg-white rounded-lg shadow-lg w-full p-4 animate-fade-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] overflow-hidden flex flex-col"
				onMouseDown={(e) => e.stopPropagation()}
				style={{ maxWidth: "min(1224px, 90vw)" }}>
				<div
					className="flex justify-between items-center mb-4 shrink-0"
					style={{ flex: "0 0 auto" }}>
					<h2 className="font-bold text-2xl">Đơn hàng</h2>
				</div>

				<div className="flex gap-4 min-h-0 overflow-hidden flex-1">
					<div className="w-[30%] min-h-0 overflow-hidden flex flex-col gap-4 justify-between">
						<div className="flex min-h-0 overflow-hidden">
							<OrderDetailsCard
								raffle={selected}
								winningProducts={winProducts}
							/>
						</div>
						<RafflePaidPointReward
							points={selected?.bonusPointEarned || 0}
							makerName={selected?.makerInfo?.brandName || ""}
						/>
						{/* <div className="flex flex-col min-h-0 overflow-hidden">
							<RafflePaidMaker maker={selected?.makerInfo} />
						</div> */}
					</div>
					<Activity
						mode={
							[
								EnumRafflePaymentStatus.UNPAID,
								EnumRafflePaymentStatus.PENDING,
							].includes(selected?.paymentStatus)
								? "visible"
								: "hidden"
						}>
						<div className="w-[45%] flex flex-col flex-1 min-h-0 overflow-hidden h-full">
							<RafflePaymentBlock
								raffle={selected}
								winningProducts={winProducts}
							/>
						</div>
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
						<div className="w-[45%] flex flex-col min-h-0 overflow-hidden">
							<RafflePaymentStatusChecking raffle={selected} />
						</div>
					</Activity>
					<div className="w-[25%] flex flex-col gap-4 min-h-0 overflow-hidden">
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
				<div
					className="flex justify-end mt-4 shrink-0"
					style={{ flex: "0 0 auto" }}>
					<Button variant={"outline"} onClick={onClose}>
						Đóng
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default PaidRaffleModal;
