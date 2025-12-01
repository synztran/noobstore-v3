import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReviewClient, {
	ProductReview,
	CreateReviewRequest,
	UpdateReviewRequest,
	ReviewListResponse,
} from "@/client/ReviewClient";

// Query Keys
export const reviewKeys = {
	all: ["reviews"] as const,
	product: (productId: string) =>
		[...reviewKeys.all, "product", productId] as const,
	detail: (productId: string, reviewId: string) =>
		[...reviewKeys.product(productId), reviewId] as const,
	pending: () => [...reviewKeys.all, "pending"] as const,
};

// Get product reviews
export const useProductReviews = (
	productId: string,
	params?: {
		page?: number;
		limit?: number;
		sort?: "newest" | "oldest" | "highest" | "lowest" | "helpful";
	}
) => {
	return useQuery({
		queryKey: [...reviewKeys.product(productId), params],
		queryFn: () => ReviewClient.getProductReviews({ productId, ...params }),
		enabled: !!productId,
	});
};

// Create review
export const useCreateReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			reviewData,
		}: {
			productId: string;
			reviewData: CreateReviewRequest;
		}) => ReviewClient.createReview({ productId, reviewData }),
		onSuccess: (data, variables) => {
			// Invalidate and refetch product reviews
			queryClient.invalidateQueries({
				queryKey: reviewKeys.product(variables.productId),
			});
		},
	});
};

// Update review
export const useUpdateReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			reviewId,
			reviewData,
		}: {
			productId: string;
			reviewId: string;
			reviewData: UpdateReviewRequest;
		}) => ReviewClient.updateReview({ productId, reviewId, reviewData }),
		onSuccess: (data, variables) => {
			// Invalidate and refetch product reviews
			queryClient.invalidateQueries({
				queryKey: reviewKeys.product(variables.productId),
			});
		},
	});
};

// Delete review
export const useDeleteReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			reviewId,
		}: {
			productId: string;
			reviewId: string;
		}) => ReviewClient.deleteReview({ productId, reviewId }),
		onSuccess: (data, variables) => {
			// Invalidate and refetch product reviews
			queryClient.invalidateQueries({
				queryKey: reviewKeys.product(variables.productId),
			});
		},
	});
};

// Mark review as helpful
export const useMarkReviewHelpful = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ reviewId }: { reviewId: string }) =>
			ReviewClient.markReviewHelpful({ reviewId }),
		onSuccess: (data, variables) => {
			// Invalidate all product reviews to update helpful counts
			queryClient.invalidateQueries({ queryKey: reviewKeys.all });
		},
	});
};

// Admin: Get pending reviews
export const usePendingReviews = (params?: {
	page?: number;
	limit?: number;
}) => {
	return useQuery({
		queryKey: [...reviewKeys.pending(), params],
		queryFn: () => ReviewClient.getPendingReviews(params || {}),
	});
};

// Admin: Moderate review
export const useModerateReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			reviewId,
			status,
			moderationReason,
		}: {
			reviewId: string;
			status: "APPROVED" | "REJECTED";
			moderationReason?: string;
		}) =>
			ReviewClient.moderateReview({ reviewId, status, moderationReason }),
		onSuccess: () => {
			// Invalidate pending reviews and all product reviews
			queryClient.invalidateQueries({ queryKey: reviewKeys.pending() });
			queryClient.invalidateQueries({ queryKey: reviewKeys.all });
		},
	});
};
