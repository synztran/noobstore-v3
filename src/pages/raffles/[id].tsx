import { getFirst } from "@/client";
import RaffleClient from "@/client/RaffleClient";
import { RaffleHero } from "@/components/RaffleDetail/RaffleHero";
import { RaffleMaker } from "@/components/RaffleDetail/RaffleMaker";
import { RafflePricingSidebar } from "@/components/RaffleDetail/RafflePricingSidebar";
import { RaffleProcess } from "@/components/RaffleDetail/RaffleProcess";
import { RaffleShipping } from "@/components/RaffleDetail/RaffleShipping";
import { RaffleSpecifications } from "@/components/RaffleDetail/RaffleSpecifications";
import { useAuth } from "@/context/Auth";
import { EnumResponseStatus } from "@/interface/Client/interface";
import {
	EnumRaffleStatus,
	IBEResponseRaffleInfo,
} from "@/interface/Client/Raffle";
import { Base } from "@/templates/Base";
import DateUtils from "@/utils/DateUtils";
import { useEffect, useMemo, useState } from "react";

interface RaffleDetailPageProps {
	raffle?: IBEResponseRaffleInfo;
	isLoading: boolean;
}

export async function getServerSideProps({
	params,
}: {
	params: { id: string };
}) {
	try {
		if (!params.id) {
			return {
				props: {
					raffle: null,
					isLoading: false,
				},
			};
		}

		const response = await RaffleClient.getSingleRaffle({
			raffleId: params.id,
		});

		if (response?.status === EnumResponseStatus.OK && response?.data) {
			return {
				props: {
					raffle: getFirst(response),
					isLoading: false,
				},
			};
		}

		console.warn(`Raffle not found for ID: ${params.id}`, response);
		return {
			props: {
				raffle: null,
				isLoading: false,
			},
		};
	} catch (error) {
		console.error(
			`Error fetching raffle detail for ID ${params.id}:`,
			error,
		);
		return {
			props: {
				raffle: null,
				isLoading: false,
			},
		};
	}
}

const RaffleDetailPage = (props: RaffleDetailPageProps) => {
	const { raffle, isLoading } = props;
	const auth = useAuth();
	const { user } = auth || {};
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [selectedProductId, setSelectedProductId] = useState("");

	// Initialize selectedProductId once raffle data is loaded
	useEffect(() => {
		if (raffle?.productOptions?.[0]?.productId) {
			setSelectedProductId(raffle.productOptions[0].productId);
		}
	}, [raffle?.productOptions]);

	// Combine all images for hero and process sections
	const allImages = useMemo(() => {
		const images: { path: string; alt: string; index: number }[] = [];

		// Add thumbnail
		if (raffle?.thumbnail?.path) {
			images.push({
				...raffle.thumbnail,
				index: images.length,
			});
		}

		// Add product thumbnails
		if (raffle?.productOptions) {
			raffle.productOptions.forEach((opt) => {
				if (opt.thumbnail?.path) {
					images.push({
						...opt.thumbnail,
						index: images.length,
					});
				}
			});
		}

		// Add gallery images
		if (raffle?.images) {
			raffle.images.forEach((img) => {
				images.push({
					...img,
					index: images.length,
				});
			});
		}

		// Remove duplicates
		const seen = new Set<string>();
		console.log("images", images);
		return images.filter((img) => {
			if (seen.has(img.path)) return false;
			seen.add(img.path);
			return true;
		});
	}, [raffle]);

	// Process images for process section (first 4 images)
	const processImages = useMemo(() => {
		return allImages.slice(0, 4);
	}, [allImages]);

	const selectedProduct = useMemo(() => {
		return (
			raffle?.productOptions?.find(
				(p) => p.productId === selectedProductId,
			) || raffle?.productOptions?.[0]
		);
	}, [raffle, selectedProductId]);

	const statusRaffleBasingTime = useMemo(() => {
		const now = new Date();
		const start = DateUtils.parseServerDate(raffle?.startAt || "");
		const end = DateUtils.parseServerDate(raffle?.endAt || "");

		if (now < start) return EnumRaffleStatus.UPCOMING;
		if (now >= start && now <= end) return EnumRaffleStatus.ONGOING;
		if (now > end) return EnumRaffleStatus.ENDED;

		return EnumRaffleStatus.CANCELLED;
	}, [raffle?.startAt, raffle?.endAt]);

	const statusColor = {
		[EnumRaffleStatus.ONGOING]:
			"bg-green-500/20 text-green-400 border-green-500/30",
		[EnumRaffleStatus.UPCOMING]:
			"bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
		[EnumRaffleStatus.ENDED]:
			"bg-gray-500/20 text-gray-400 border-gray-500/30",
		[EnumRaffleStatus.CANCELLED]:
			"bg-red-500/20 text-red-400 border-red-500/30",
	};

	const statusText = {
		[EnumRaffleStatus.ONGOING]: "Đang diễn ra",
		[EnumRaffleStatus.UPCOMING]: "Sắp diễn ra",
		[EnumRaffleStatus.ENDED]: "Đã kết thúc",
		[EnumRaffleStatus.CANCELLED]: "Bị hủy",
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<div className="text-slate-600">Đang tải...</div>
			</div>
		);
	}

	if (!raffle) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<div className="text-slate-600">Không tìm thấy raffle</div>
			</div>
		);
	}

	return (
		<Base>
			<main className="min-h-screen bg-slate-50">
				{/* Hero Section */}
				<RaffleHero
					raffle={raffle}
					thumbnailImages={allImages.slice(0, 4)}
					selectedImageIndex={currentImageIndex}
					onThumbnailClick={setCurrentImageIndex}
				/>

				{/* Main Content */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
						{/* Left Column */}
						<div className="lg:col-span-7 space-y-16">
							{/* Maker Info */}
							<RaffleMaker raffle={raffle} />

							{/* The Process */}
							<RaffleProcess
								raffle={raffle}
								galleryImages={processImages}
							/>

							{/* Specifications */}
							<RaffleSpecifications raffle={raffle} />
						</div>

						{/* Right Sidebar */}
						<div className="lg:col-span-5">
							<div className="sticky top-24 space-y-4">
								{/* Pricing Sidebar */}
								<RafflePricingSidebar
									raffle={raffle}
									selectedProductId={selectedProductId}
									setSelectedProductId={setSelectedProductId}
								/>

								{/* Shipping Info */}
								<RaffleShipping raffle={raffle} />

								{/* Terms */}
								{raffle.termsAndConditions && (
									<div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
										<h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
											Điều Khoản
										</h4>
										<p className="text-xs text-slate-500 line-clamp-3">
											{raffle.termsAndConditions}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>
		</Base>
	);
};

// Placeholder export for Next.js
export default RaffleDetailPage;
