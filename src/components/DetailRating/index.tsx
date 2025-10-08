import { STAR_MEDAL_ICON } from "@/constants/Images";
import { classNames } from "@/utils/AppConfig";
import { Info, Star } from "lucide-react";
import { useState } from "react";

interface RatingBreakdown {
	stars: number;
	percentage: number;
	count: number;
}

interface DetailRatingProps {
	averageRating: number;
	totalReviews: number;
	ratingBreakdown: RatingBreakdown[];
	showRatingMethodology?: boolean;
	className?: string;
}

const DetailRating = ({
	averageRating,
	totalReviews,
	ratingBreakdown,
	showRatingMethodology = true,
	className = "",
}: DetailRatingProps) => {
	const [showMethodology, setShowMethodology] = useState(false);

	const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
		const sizeClasses = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-6 h-6" };

		return (
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => {
					const full = i + 1 <= Math.floor(rating);
					const half = !full && i < rating && rating % 1 >= 0.5;
					return (
						<span key={i} className="relative inline-block">
							<Star
								className={classNames(
									sizeClasses[size],
									full
										? "fill-yellow-400 text-yellow-400"
										: half
											? "fill-yellow-400 text-yellow-400"
											: "fill-gray-300 text-gray-300"
								)}
								style={
									half
										? {
												clipPath:
													"polygon(0 0, 50% 0, 50% 100%, 0 100%)",
											}
										: undefined
								}
							/>
							{half && (
								<Star
									className={classNames(
										"absolute top-0 left-0 fill-gray-300 text-gray-300",
										sizeClasses[size]
									)}
									style={{
										clipPath:
											"polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
									}}
								/>
							)}
						</span>
					);
				})}
			</div>
		);
	};

	return (
		<div
			className={classNames(
				"bg-white rounded-lg p-6 shadow-md border border-gray-100",
				className
			)}>
			<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
				{/* Left side - Average rating */}
				<div className="flex-1">
					<h3 className="text-xl font-semibold text-gray-900">
						Đánh giá sản phẩm
					</h3>

					<div className="flex items-center gap-3 mb-3">
						<img
							src={STAR_MEDAL_ICON}
							alt="star"
							className="w-12 h-12"
						/>
						<div className="flex items-baseline gap-2">
							<span className="text-3xl font-bold text-gray-900">
								{averageRating.toFixed(2)}
							</span>
							<span className="text-lg text-gray-600">
								({totalReviews})
							</span>
						</div>
					</div>

					{showRatingMethodology && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Info className="w-4 h-4" />
							<button
								onClick={() =>
									setShowMethodology(!showMethodology)
								}
								className="hover:text-blue-600 transition-colors"
								style={{ lineHeight: 1 }}>
								Tiêu chi và tính hợp lệ của đánh giá?
							</button>
						</div>
					)}

					{showMethodology && showRatingMethodology && (
						<div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
							Our star ratings are calculated based on customer
							reviews and feedback. We use a weighted average
							system that considers the recency and helpfulness of
							each review to provide accurate and reliable
							ratings.
						</div>
					)}
				</div>

				{/* Right side - Rating breakdown */}
				<div className="flex-1 lg:max-w-xs">
					<div className="space-y-3">
						{ratingBreakdown.map((rating) => (
							<div
								key={rating.stars}
								className="flex items-center gap-3">
								<div className="flex items-center gap-1 min-w-max">
									<div className="flex gap-1 items-center font-medium text-gray-700">
										<span>{rating.stars}</span>
										<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
									</div>
								</div>
								<div className="flex-1">
									<div className="relative h-2 bg-gray-200 rounded-60 overflow-hidden">
										<div
											className="absolute top-0 left-0 h-full bg-yellow-400 rounded-60 transition-all duration-300"
											style={{
												width: `${rating.percentage}%`,
											}}
										/>
									</div>
								</div>
								<div className="min-w-[40px] text-right">
									<span className="text-sm font-medium text-gray-700">
										{rating.percentage}%
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailRating;
