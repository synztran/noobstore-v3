import { useAuth } from "@/context/Auth";
import {
	EnumRaffleStatus,
	IBEResponseProductOption,
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
	const [selectedOption, setSelectedOption] =
		useState<IBEResponseProductOption | null>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const combinedProductImages: {
		id?: string;
		path: string;
		alt: string;
		index: number;
	}[] = useMemo(() => {
		const optionThumbnails =
			raffleData?.productOptions?.map((opt) => {
				return {
					...opt.thumbnail,
					productId: opt.productId,
				};
			}) || [];
		const combinedImages = [
			raffleData?.thumbnail,
			...optionThumbnails,
			...(raffleData?.images || []),
		];

		// Remove duplicates based on image path
		const uniqueImagesMap: Record<string, any> = {};
		combinedImages.forEach((img) => {
			if (img && img.path) {
				uniqueImagesMap[img.path] = img;
			}
		});

		// Add incremental index to each unique image
		return Object.values(uniqueImagesMap).map((img, idx) => ({
			...img,
			index: idx,
		}));
	}, [raffleData]);

	console.log("combinedProductImages", combinedProductImages);

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
	// const selectedOptionObj =
	// 	raffleData?.productOptions?.find(
	// 		(o) => o.productId === selectedOption?.productId,
	// 	) || raffleData?.productOptions?.[0];

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
	// useEffect(() => {
	// 	console.log("selectedOption", selectedOption);
	// 	const foundProduct = raffleData?.productOptions?.find(
	// 		(o) => o.productId === selectedOption,
	//   );
	//   console.log("foundProduct", foundProduct)

	//   if (foundProduct) {

	//   }

	// 	console.log("sync idx", idx);
	// 	if (idx === -1 || idx === undefined) return;
	// 	if (idx !== -1) setCurrentImageIndex(idx);
	// }, [selectedOption, raffleData]);

	useEffect(() => {
		if (raffleData) {
			initFromRaffleData(raffleData);
		}
	}, [raffleData]);

	// Sync option with image
	const handleImageChange = (imageIndex: number, productId?: string) => {
		console.log("idx", imageIndex, productId);
		setCurrentImageIndex(imageIndex);
		const found = raffleData?.productOptions?.find(
			(o) => o.productId === productId,
		);
		setSelectedOption(found || null);
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

	if (!raffleData) return null;

	return (
		<div className="flex rounded-lg bg-gray-50">
			<div className="w-3/5">
				<RaffleBlockV2Image
					productOptions={raffleData?.productOptions || []}
					combinedProductImages={combinedProductImages}
					currentImageIndex={currentImageIndex}
					onChange={handleImageChange}
					status={statusRaffleBasingTime}
				/>
			</div>
			<div className="w-2/5">
				<RaffleBlockV2Information
					raffle={raffleData}
					combinedProductImages={combinedProductImages}
					statusRaffleBasingTime={statusRaffleBasingTime}
					selectedOption={selectedOption}
					// selectedOptionObj={selectedOptionObj}
					setSelectedOption={setSelectedOption}
					setCurrentImageIndex={setCurrentImageIndex}
					handleOpenRaffleForm={handleOpenRaffleForm}
				/>
			</div>
		</div>
	);
};

export default RaffleBlockV2;
