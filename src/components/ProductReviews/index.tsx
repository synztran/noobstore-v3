import React, { useState } from "react";
import {
	useProductReviews,
	useCreateReview,
	useMarkReviewHelpful,
} from "@/react-query/reviews";
import { ProductReview, CreateReviewRequest } from "@/client/ReviewClient";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ProductReviewsProps {
	productId: string;
	canReview?: boolean; // Whether user can leave a review (verified purchase)
}

const StarRating: React.FC<{ rating: number; readonly?: boolean }> = ({
	rating,
	readonly = true,
}) => {
	return (
		<div className="flex items-center">
			{[1, 2, 3, 4, 5].map((star) => (
				<span
					key={star}
					className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>
					★
				</span>
			))}
			<span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
		</div>
	);
};

const ReviewItem: React.FC<{
	review: ProductReview;
	onMarkHelpful?: (reviewId: string) => void;
}> = ({ review, onMarkHelpful }) => {
	const markHelpfulMutation = useMarkReviewHelpful();

	const handleMarkHelpful = () => {
		if (onMarkHelpful) {
			markHelpfulMutation.mutate({ reviewId: review.id });
		}
	};

	return (
		<div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center">
					{review.userAvatar && (
						<img
							src={review.userAvatar}
							alt={review.userName}
							className="w-10 h-10 rounded-full mr-3"
						/>
					)}
					<div>
						<div className="font-medium text-gray-900">
							{review.userName}
						</div>
						<div className="text-sm text-gray-500">
							{format(new Date(review.createdAt), "dd/MM/yyyy", {
								locale: vi,
							})}
							{review.isVerifiedPurchase && (
								<span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
									Đã mua hàng
								</span>
							)}
						</div>
					</div>
				</div>
				<StarRating rating={review.rating} />
			</div>

			{review.title && (
				<h4 className="font-medium text-gray-900 mb-2">
					{review.title}
				</h4>
			)}

			<p className="text-gray-700 mb-4">{review.comment}</p>

			{review.images && review.images.length > 0 && (
				<div className="flex gap-2 mb-4">
					{review.images.map((image, index) => (
						<img
							key={index}
							src={image}
							alt={`Review image ${index + 1}`}
							className="w-20 h-20 object-cover rounded border"
						/>
					))}
				</div>
			)}

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={handleMarkHelpful}
						disabled={markHelpfulMutation.isPending}
						className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1">
						👍 Hữu ích ({review.helpfulCount})
					</button>
				</div>
				<div className="text-xs text-gray-500">
					Trạng thái:{" "}
					{review.status === "APPROVED"
						? "Đã duyệt"
						: review.status === "PENDING"
							? "Chờ duyệt"
							: "Từ chối"}
				</div>
			</div>
		</div>
	);
};

const ReviewForm: React.FC<{
	productId: string;
	onSubmit: (review: CreateReviewRequest) => void;
	onCancel: () => void;
}> = ({ productId, onSubmit, onCancel }) => {
	const [rating, setRating] = useState(5);
	const [title, setTitle] = useState("");
	const [comment, setComment] = useState("");
	const [images, setImages] = useState<string[]>([]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({
			rating,
			title: title.trim() || undefined,
			comment: comment.trim(),
			images: images.length > 0 ? images : undefined,
		});
	};

	return (
		<div className="border border-gray-200 rounded-lg p-6 mb-6">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Viết đánh giá
			</h3>

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Đánh giá
					</label>
					<div className="flex items-center">
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								type="button"
								onClick={() => setRating(star)}
								className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>
								★
							</button>
						))}
						<span className="ml-2 text-sm text-gray-600">
							({rating}/5)
						</span>
					</div>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Tiêu đề (tùy chọn)
					</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Tóm tắt đánh giá của bạn..."
						maxLength={100}
					/>
				</div>

				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Nội dung đánh giá
					</label>
					<textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows={4}
						placeholder="Chia sẻ trải nghiệm của bạn..."
						maxLength={1000}
						required
					/>
				</div>

				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
						Hủy
					</button>
					<button
						type="submit"
						disabled={!comment.trim()}
						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
						Gửi đánh giá
					</button>
				</div>
			</form>
		</div>
	);
};

const ProductReviews: React.FC<ProductReviewsProps> = ({
	productId,
	canReview = false,
}) => {
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [sortBy, setSortBy] = useState<
		"newest" | "oldest" | "highest" | "lowest" | "helpful"
	>("newest");

	const {
		data: reviewsResponse,
		isLoading,
		error,
	} = useProductReviews(productId, { sort: sortBy });
	const createReviewMutation = useCreateReview();

	const handleCreateReview = (reviewData: CreateReviewRequest) => {
		createReviewMutation.mutate(
			{ productId, reviewData },
			{
				onSuccess: () => {
					setShowReviewForm(false);
				},
			}
		);
	};

	if (isLoading) {
		return (
			<div className="w-full border border-gray-400 bg-white rounded-lg shadow-md">
				<div className="text-center py-8">Đang tải đánh giá...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full border border-gray-400 bg-white rounded-lg shadow-md">
				<div className="text-center py-8 text-red-600">
					Không thể tải đánh giá
				</div>
			</div>
		);
	}

	// Extract data from the response structure
	const reviewsData = reviewsResponse?.data?.[0]; // API returns array with single object
	const {
		reviews = [],
		averageRating = 0,
		totalReviews = 0,
	} = reviewsData || {};

	return (
		<div
			id="product-reviews"
			className="border border-gray-300 bg-white rounded-lg shadow-md p-4">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">
						Đánh giá sản phẩm
					</h2>
					<div className="flex items-center mt-2">
						<StarRating rating={Math.round(averageRating)} />
						<span className="ml-2 text-gray-600">
							Dựa trên {totalReviews} đánh giá
						</span>
					</div>
				</div>

				{canReview && !showReviewForm && (
					<button
						onClick={() => setShowReviewForm(true)}
						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
						Viết đánh giá
					</button>
				)}
			</div>

			{showReviewForm && (
				<ReviewForm
					productId={productId}
					onSubmit={handleCreateReview}
					onCancel={() => setShowReviewForm(false)}
				/>
			)}

			{reviews.length > 0 && (
				<div className="mb-6">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-medium text-gray-900">
							Tất cả đánh giá ({reviews.length})
						</h3>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as any)}
							className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="newest">Mới nhất</option>
							<option value="oldest">Cũ nhất</option>
							<option value="highest">Đánh giá cao</option>
							<option value="lowest">Đánh giá thấp</option>
							<option value="helpful">Hữu ích nhất</option>
						</select>
					</div>
				</div>
			)}

			<div className="reviews-list">
				{reviews.length === 0 ? (
					<div className="text-center py-12 text-gray-500">
						<p>Chưa có đánh giá nào cho sản phẩm này.</p>
						{canReview && (
							<p className="mt-2">
								Hãy là người đầu tiên đánh giá!
							</p>
						)}
					</div>
				) : (
					reviews.map((review: ProductReview) => (
						<ReviewItem
							key={review.id}
							review={review}
							onMarkHelpful={(reviewId) => {
								// This will be handled by the mutation in ReviewItem
							}}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default ProductReviews;
