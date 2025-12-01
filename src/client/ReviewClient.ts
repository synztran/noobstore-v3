import { GET, POST, PUT, DELETE } from "./index";
import { IResponse } from "@/interface/Client/interface";

export interface ProductReview {
	id: string;
	productId: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	rating: number;
	title?: string;
	comment: string;
	images?: string[];
	status: "PENDING" | "APPROVED" | "REJECTED";
	isVerifiedPurchase: boolean;
	helpfulCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateReviewRequest {
	rating: number;
	title?: string;
	comment: string;
	images?: string[];
}

export interface UpdateReviewRequest {
	rating?: number;
	title?: string;
	comment?: string;
	images?: string[];
}

export interface ReviewListResponse {
	reviews: ProductReview[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	averageRating: number;
	totalReviews: number;
}

const getProductReviews = async ({
	productId,
	page = 1,
	limit = 10,
	sort = "newest",
}: {
	productId: string;
	page?: number;
	limit?: number;
	sort?: "newest" | "oldest" | "highest" | "lowest" | "helpful";
}): Promise<IResponse<ReviewListResponse>> => {
	const url = `/products/${productId}/reviews`;
	return GET({
		url,
		isAuth: false,
		params: { page, limit, sort },
	});
};

const createReview = async ({
	productId,
	reviewData,
}: {
	productId: string;
	reviewData: CreateReviewRequest;
}): Promise<IResponse<ProductReview>> => {
	const url = `/products/${productId}/reviews`;
	return POST({
		url,
		body: reviewData,
		isAuth: true,
	});
};

const updateReview = async ({
	productId,
	reviewId,
	reviewData,
}: {
	productId: string;
	reviewId: string;
	reviewData: UpdateReviewRequest;
}): Promise<IResponse<ProductReview>> => {
	const url = `/products/${productId}/reviews/${reviewId}`;
	return PUT({
		url,
		body: reviewData,
		isAuth: true,
	});
};

const deleteReview = async ({
	productId,
	reviewId,
}: {
	productId: string;
	reviewId: string;
}): Promise<IResponse<void>> => {
	const url = `/products/${productId}/reviews/${reviewId}`;
	return DELETE({
		url,
		isAuth: true,
	});
};

const markReviewHelpful = async ({
	reviewId,
}: {
	reviewId: string;
}): Promise<IResponse<{ helpfulCount: number }>> => {
	const url = `/reviews/${reviewId}/helpful`;
	return POST({
		url,
		isAuth: true,
	});
};

// Admin methods
const getPendingReviews = async ({
	page = 1,
	limit = 20,
}: {
	page?: number;
	limit?: number;
}): Promise<IResponse<ReviewListResponse>> => {
	const url = "/admin/reviews";
	return GET({
		url,
		isAuth: true,
		params: { status: "PENDING", page, limit },
	});
};

const moderateReview = async ({
	reviewId,
	status,
	moderationReason,
}: {
	reviewId: string;
	status: "APPROVED" | "REJECTED";
	moderationReason?: string;
}): Promise<IResponse<ProductReview>> => {
	const url = `/admin/reviews/${reviewId}/moderate`;
	return PUT({
		url,
		body: { status, moderationReason },
		isAuth: true,
	});
};

export default {
	getProductReviews,
	createReview,
	updateReview,
	deleteReview,
	markReviewHelpful,
	getPendingReviews,
	moderateReview,
};
