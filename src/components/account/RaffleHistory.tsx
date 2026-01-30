import {
	mapLabelEnumDeliveryStatus,
	mappingEnumRafflePaymentStatus,
	mappingRaffleStatusLabel,
} from "@/constants";
import { I3D_WINNER_CROWN_LUX } from "@/constants/Images";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import {
	EnumRafflePaymentStatus,
	EnumRafflePaymentStepStatus,
	EnumRafflePaymentStepType,
} from "@/interface/interface";
import useUserRaffleEntryQueries from "@/react-query/user/api/useUserRaffleEntryQueries";
import Image from "next/image";
import React, { memo, useEffect, useMemo, useState } from "react";
import PaidRaffleModal from "./PaidRaffle/PaidRaffle";
import RegisterRaffleModal from "./RegisterRaffle/RegisterRaffle";

const WinnerPaymentStatus: React.FC<{
	paymentStatus: EnumRafflePaymentStatus;
	isWinner: boolean;
	selected: TResponseRaffleEntry | null;
}> = memo(({ paymentStatus, isWinner, selected }) => {
	const isDelivered =
		selected?.timeline?.find(
			(event) => event.stepType === EnumRafflePaymentStepType.COMPLETED,
		)?.status === EnumRafflePaymentStepStatus.COMPLETED;

	if (isDelivered) {
		return (
			<div
				className={`${mapLabelEnumDeliveryStatus.DELIVERED?.bgColor} ${
					mapLabelEnumDeliveryStatus.DELIVERED?.color
				} rounded-md max-w-max text-sm font-semibold text-center px-2 py-1 ml-auto `}>
				{mapLabelEnumDeliveryStatus.DELIVERED?.label}
			</div>
		);
	}

	return (
		<div
			className={`${
				mappingEnumRafflePaymentStatus[paymentStatus]?.bgColor
			} ${
				mappingEnumRafflePaymentStatus[paymentStatus]?.color
			} rounded-md max-w-max text-sm font-semibold text-center px-2 py-1 ml-auto ${
				isWinner && paymentStatus !== EnumRafflePaymentStatus.PAID
					? "hover:scale-105 cursor-pointer shadow-md transition-all duration-200 z-10"
					: ""
			}`}>
			{mappingEnumRafflePaymentStatus[paymentStatus]?.label}
		</div>
	);
});

const RaffleStatusBadge: React.FC<{
	status: TResponseRaffleEntry["raffleInfo"]["status"];
}> = memo(({ status }) => {
	return (
		<div
			className={`${mappingRaffleStatusLabel[status]?.color} ${
				mappingRaffleStatusLabel[status]?.bgColor
			} rounded-md font-semibold px-2 py-1 text-sm max-w-max ml-auto overflow-hidden flex items-center gap-1`}>
			{mappingRaffleStatusLabel[status]?.icon ? (
				<Image
					src={mappingRaffleStatusLabel[status]?.icon!}
					alt="Raffle Status Icon"
					width={32}
					height={32}
					className="inline-block scale-[2.25]"
					unoptimized
				/>
			) : null}
			{mappingRaffleStatusLabel[status]?.label}
		</div>
	);
});

const RaffleHistory: React.FC = () => {
	const { data: raffleHistory, isPending: isLoading } =
		useUserRaffleEntryQueries();
	const [openReg, setOpenReg] = useState(false);
	const [openPayment, setOpenPayment] = useState(false);
	const [selected, setSelected] = useState<TResponseRaffleEntry | null>(null);

	const mapRaffleProductWin = useMemo(() => {
		// Update selected state when raffleHistory data changes
		if (selected && raffleHistory && raffleHistory.length > 0) {
			const updatedSelected = raffleHistory.find(
				(raffle) => raffle.raffleId === selected?.raffleId,
			);
			if (updatedSelected && updatedSelected !== selected) {
				setSelected(updatedSelected);
			}
		}

		return (
			raffleHistory?.find(
				(raffle) => raffle.raffleId === selected?.raffleId,
			)?.productSelections || []
		).reduce(
			(acc, product) => {
				acc[product.productId] = product;
				return acc;
			},
			{} as Record<string, TResponseRaffleEntry["productSelections"][0]>,
		);
	}, [raffleHistory, selected]);

	useEffect(() => {
		if (openReg || openPayment) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [openReg, openPayment]);

	const handleClose = () => {
		setOpenReg(false);
		setOpenPayment;
		setSelected(null);
	};

	const handleOpenModal = (entry: TResponseRaffleEntry) => {
		if (entry?.isWinner) {
			setSelected(entry);
			setOpenPayment(true);
		} else {
			setSelected(entry);
			setOpenReg(true);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (raffleHistory && raffleHistory?.length === 0) {
		return <div className="">Bạn chưa tham gia raffle nào.</div>;
	}

	return (
		<div className="relative">
			<h2 className="font-bold text-2xl mb-2">Lịch sử tham gia raffle</h2>
			<div className="grid grid-cols-2 gap-2 mt-8">
				{raffleHistory?.map((entry) => (
					<div
						key={entry.raffleId}
						className={`flex h-fit p-2 bg-white shadow gap-2 hover:shadow-lg transition-all duration-200 cursor-pointer relative ${
							entry.isWinner
								? "border-2 border-yellow-400 rounded-tl-md rounded-b-md"
								: "border-2 border-gray-300 rounded-md"
						}`}
						onClick={() => handleOpenModal(entry)}>
						{/* badge */}
						{entry?.isWinner ? (
							<div
								className={`ml-auto absolute -top-7.5 min-h-7.5 -right-[1.5px] flex items-center gap-1 bg-yellow-400 max-w-max py-1 px-2 overflow-hidden rounded-tl-md rounded-tr-md shadow-lg`}>
								<Image
									src={I3D_WINNER_CROWN_LUX}
									alt="Winner Rank"
									width={20}
									height={20}
									className=""
								/>
								<span className="text-sm text-yellow-700 font-bold">
									Chiến thắng
								</span>
							</div>
						) : null}
						<div className="min-w-34 h-34 relative">
							<Image
								src={entry.raffleInfo.thumbnail.path}
								alt={entry.raffleInfo.thumbnail.alt}
								fill
								objectFit="cover"
								className="rounded-md hover:scale-105 transition-all duration-300"
							/>
						</div>
						<div className="w-full flex flex-col gap-2 justify-between">
							<div className="relative">
								<div className="flex justify-between items-start gap-2">
									<span className="font-bold line-clamp-1">
										{entry.raffleInfo.title ||
											"Raffle không xác định"}
									</span>
								</div>
								<div className="text-xs text-gray-600 font-semibold line-clamp-1 ">
									{entry.raffleInfo.productOptions
										.map((option) => option.label)
										.join(" | ")}
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-800">
									Ngày tham gia:{" "}
									<span className="font-semibold">
										{new Date(
											entry.joinedAt,
										).toLocaleDateString()}
									</span>
								</div>
								<div className="text-sm text-gray-800">
									Maker:{" "}
									<span className="font-semibold">
										{entry.makerInfo?.brandName ||
											"Không xác định"}
									</span>
								</div>
							</div>

							{entry.isWinner ? (
								<WinnerPaymentStatus
									paymentStatus={entry.paymentStatus}
									isWinner={entry.isWinner}
									selected={entry}
								/>
							) : (
								<RaffleStatusBadge
									status={entry.raffleInfo.status}
								/>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Modal Dialog */}
			{/* <RaffleDetailModal
				open={openReg}
				onClose={handleClose}
				selected={selected}
				mapRaffleProductWin={mapRaffleProductWin}
			/> */}
			<RegisterRaffleModal
				open={openReg}
				onClose={handleClose}
				selected={selected}
			/>

			{/* Raffle Payment Modal */}
			{/* <RafflePaymentModal
				open={openPayment}
				onClose={() => {
					setOpenPayment(false);
					setSelected(null);
				}}
				selected={selected}
				mapRaffleProductWin={mapRaffleProductWin}
			/> */}
			<PaidRaffleModal
				open={openPayment}
				onClose={() => {
					setOpenPayment(false);
					setSelected(null);
				}}
				selected={selected}
				mapRaffleProductWin={mapRaffleProductWin}
			/>
		</div>
	);
};

export default RaffleHistory;
