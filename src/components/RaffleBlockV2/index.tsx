import { useAuth } from "@/context/Auth";
import {
	EnumRaffleStatus,
	IBEResponseRaffleInfo,
} from "@/interface/Client/Raffle";
import { appQueryKeys } from "@/react-query/root";
import DateUtils from "@/utils/DateUtils";
import useDialogLogin, {
	EnumStatusDialog,
	useDialogLoginAction,
} from "@/zustand/useDialogLogin";
import { useRaffleAction } from "@/zustand/useRaffle";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import RaffleBlockV2Image from "./Image";
import RaffleBlockV2Information from "./Information";

interface IProps {
	raffleData?: IBEResponseRaffleInfo;
	isLoading: boolean;
}

const RaffleBlockV2 = ({ raffleData, isLoading }: IProps) => {
	const auth = useAuth();
	const { user } = auth || {};
	const {
		initFromRaffleData,
		handleClearRaffleSubmitForm,
		updateRaffleSubmitForm,
	} = useRaffleAction();
	const { isOpenDialogLogin } = useDialogLogin();
	const { toggleDialogLogin } = useDialogLoginAction();
	const queryClient = useQueryClient();
	const [showRaffleModal, setShowRaffleModal] = useState(false);
	const [selectedOption, setSelectedOption] = useState("");
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const [minPrice, maxPrice] = useMemo(() => {
		if (!raffleData?.productOptions?.length) {
			return [0, 0];
		}
		return [
			Math.min(...raffleData?.productOptions?.map((o) => o.price)),
			Math.max(...raffleData?.productOptions?.map((o) => o.price)),
		];
	}, [raffleData]);

	// Find the selected option object for price display
	const selectedOptionObj =
		raffleData?.productOptions?.find((o) => o.id === selectedOption) ||
		raffleData?.productOptions?.[0];

	const statusRaffleBasingTime = useMemo(() => {
		const now = new Date();
		const start = DateUtils.parseServerDate(raffleData?.startAt || "");
		const end = DateUtils.parseServerDate(raffleData?.endAt || "");

		if (now < start) return EnumRaffleStatus.UPCOMING;
		if (now >= start && now <= end) return EnumRaffleStatus.ONGOING;
		if (now > end) return EnumRaffleStatus.ENDED;

		return EnumRaffleStatus.CANCELLED;
	}, [raffleData?.startAt, raffleData?.endAt]);

	// Sync image with option
	useEffect(() => {
		const idx = raffleData?.productOptions?.findIndex(
			(o) => o.id === selectedOption,
		);
		if (!idx) return;
		if (idx !== -1) setCurrentImageIndex(idx);
	}, [selectedOption, raffleData]);

	useEffect(() => {
		if (raffleData) {
			initFromRaffleData(raffleData);
		}
	}, [raffleData]);

	// Sync option with image
	const handleImageChange = (idx: number) => {
		setCurrentImageIndex(idx);
		setSelectedOption(raffleData?.productOptions?.[idx]?.id || "");
	};

	// const progressPercentage =
	// 	(raffleData.joined / raffleData.totalEntries) * 100;

	const resetAndClose = () => {
		handleClearRaffleSubmitForm();
		setShowRaffleModal(false);
		queryClient.invalidateQueries(
			appQueryKeys.raffle.getRaffles({
				featuredOnly: true,
			}),
		);
	};

	const handleOpenRaffleForm = () => {
		if (!user && !isOpenDialogLogin) {
			toggleDialogLogin(
				isOpenDialogLogin
					? Boolean(EnumStatusDialog.CLOSE)
					: Boolean(EnumStatusDialog.OPEN),
			);
		} else {
			setShowRaffleModal(true);
		}
	};

	const handleInputChange =
		(field: string) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const value = e.target.value;
			updateRaffleSubmitForm({
				__field: field,
				__value: value,
			} as any);
		};

	const handleSelectChange = (field: string) => (value: string) => {
		updateRaffleSubmitForm({
			__field: field,
			__value: value,
		} as any);
	};
	return (
		<div className="flex rounded-lg bg-gray-50">
			<div className="w-3/5">
				<RaffleBlockV2Image
					productOptions={raffleData?.productOptions || []}
					currentImageIndex={currentImageIndex}
					onChange={handleImageChange}
					status={statusRaffleBasingTime}
				/>
			</div>
			<div className="w-2/5">
				<RaffleBlockV2Information
					raffle={raffleData!}
					statusRaffleBasingTime={statusRaffleBasingTime}
					selectedOption={selectedOption}
					selectedOptionObj={selectedOptionObj}
					setSelectedOption={setSelectedOption}
					setCurrentImageIndex={setCurrentImageIndex}
					handleOpenRaffleForm={handleOpenRaffleForm}
				/>
			</div>
		</div>
	);
};

export default RaffleBlockV2;
