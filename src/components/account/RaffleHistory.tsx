import {
	mappingEnumRafflePaymentStatus,
	mappingRaffleStatusLabel,
} from "@/constants";
import { I3D_WINNER_CROWN_LUX } from "@/constants/Images";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { EnumRafflePaymentStatus } from "@/interface/interface";
import useUserRaffleEntryQueries from "@/react-query/user/api/useUserRaffleEntryQueries";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import PaidRaffle from "./PaidRaffle/PaidRaffle";
import RegisterRaffleModal from "./RegisterRaffle/RegisterRaffle";

const RaffleHistory: React.FC = () => {
	const { data: raffleHistory, isPending: isLoading } =
		useUserRaffleEntryQueries();
	const [openReg, setOpenReg] = useState(false);
	const [openPayment, setOpenPayment] = useState(false);
	const [selected, setSelected] = useState<TResponseRaffleEntry | null>(null);

	const mapRaffleProductWin = useMemo(() => {
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
								className={`ml-auto absolute -top-[30px] min-h-[30px] -right-[1.5px] flex items-center gap-1 bg-yellow-400 max-w-max py-1 px-2 overflow-hidden rounded-tl-md rounded-tr-md shadow-lg`}>
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
						<div className="min-w-[144px] h-36 relative">
							<Image
								src={entry.raffleInfo.thumbnail.path}
								alt={entry.raffleInfo.thumbnail.alt}
								fill
								objectFit="cover"
								className="rounded-md"
							/>
						</div>
						<div className="w-full flex flex-col gap-2 justify-between">
							<div className="relative">
								<div className="flex justify-between items-start gap-2">
									<span className="font-bold line-clamp-2">
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
							<div className="text-sm text-gray-800">
								Ngày tham gia:{" "}
								{new Date(entry.joinedAt).toLocaleDateString()}
							</div>
							{entry.isWinner ? (
								<div
									// onClick={(e) => {
									// 	e.stopPropagation();
									// 	handleOpenPayment(entry);
									// }}
									className={`${
										mappingEnumRafflePaymentStatus[
											entry.paymentStatus
										]?.bgColor
									} ${
										mappingEnumRafflePaymentStatus[
											entry.paymentStatus
										]?.color
									} rounded-md max-w-max text-sm font-semibold text-center px-2 py-1 ml-auto ${
										entry.isWinner &&
										entry.paymentStatus !==
											EnumRafflePaymentStatus.PAID
											? "hover:scale-105 cursor-pointer shadow-md transition-all duration-200 z-10"
											: ""
									}`}>
									{
										mappingEnumRafflePaymentStatus[
											entry.paymentStatus
										]?.label
									}
								</div>
							) : (
								<div
									className={`${
										mappingRaffleStatusLabel[
											entry.raffleInfo.status
										]?.color
									} ${
										mappingRaffleStatusLabel[
											entry.raffleInfo.status
										]?.bgColor
									} rounded-md font-semibold px-2 py-1 text-sm max-w-max ml-auto overflow-hidden flex items-center gap-1`}>
									{mappingRaffleStatusLabel[
										entry.raffleInfo.status
									]?.icon ? (
										<Image
											src={
												mappingRaffleStatusLabel[
													entry.raffleInfo.status
												]?.icon!
											}
											alt="Raffle Status Icon"
											width={32}
											height={32}
											className="inline-block scale-[2.25]"
											unoptimized
										/>
									) : null}
									{
										mappingRaffleStatusLabel[
											entry.raffleInfo.status
										]?.label
									}
								</div>
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
			/> */}
			<PaidRaffle
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
