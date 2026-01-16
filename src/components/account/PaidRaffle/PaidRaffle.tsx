import { Button } from "@/components/ReUIComponent";
import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { Modal } from "@mui/material";
import React, { useMemo } from "react";
import OrderDetailsCard from "../OrderDetailsCard";
import OrderDetailsList from "../OrderDetailsList";
import RafflePaymentBlock from "../Raffle/PaymentBlock";
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
	console.log("selected", selected?.raffleWinInfo, mapRaffleProductWin);
	const winProducts: IBEResponseRaffleProductSelection[] = useMemo(() => {
		if (!selected || !selected.isWinner) return [];
		return (
			selected?.raffleWinInfo
				?.map(({ productId }) => mapRaffleProductWin[productId])
				.filter((p): p is IBEResponseRaffleProductSelection =>
					Boolean(p)
				) || []
		);
	}, [selected, mapRaffleProductWin]);

	console.log("winProducts", winProducts);

	if (!selected) return null;
	return (
		<Modal open={open} onClose={onClose}>
			<div
				className="bg-white rounded-lg shadow-lg w-full p-4 animate-fade-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-hidden flex flex-col"
				onMouseDown={(e) => e.stopPropagation()}
				style={{ maxWidth: "max(1080px, 90vw)" }}>
				<div className="flex justify-between items-center mb-4 shrink-0">
					<h2 className="font-bold text-xl">Đơn hàng raffle</h2>
				</div>

				<div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
					<div className="col-span-3 space-y-4 overflow-y-auto">
						<OrderDetailsCard
							total={0}
							cardType="VISA"
							last4={"1"}
							cardStatus="AUTHORIZED"
							cardStatusColor="bg-green-100 text-green-700"
							cardNote="This card was authorized for any future bookings. This text needs to be on 2 lines."
							servicePrice={0}
							bookingFee={1.99}
							waitlistFee={2.99}
							currency="USD"
							issued="Bank of America"
							type="Online"
							token={selected?.raffleId}
							processor="stripe"
							processorColor="text-indigo-600 font-semibold"
						/>
						<RafflePaidMaker maker={selected?.makerInfo} />
					</div>
					<div className="col-span-6 flex flex-col flex-1 min-h-0 overflow-hidden">
						<RafflePaymentBlock
							raffle={selected}
							winningProducts={winProducts}
						/>
					</div>
					<div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-hidden">
						<div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
							<OrderDetailsList winProduct={winProducts} />
						</div>
						<div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
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
